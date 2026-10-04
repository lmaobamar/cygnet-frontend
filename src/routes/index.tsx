import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LiquidChrome from "#/components/LiquidChrome";
import { Button } from "#/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/Card";
import { Input } from "#/components/ui/Input";
import { useAuth } from "#/context/AuthContext";
import indexCss from "#/css/index.css?url";
import { AuthError } from "#/lib/api";
import { loginSchema, signupSchema } from "#/lib/authSchemas";

export const Route = createFileRoute("/")({
	head: () => ({
		links: [{ rel: "stylesheet", href: indexCss }],
	}),
	component: App,
});

const field =
	"h-11 !border-white/10 !bg-white/[0.06] text-slate-100 placeholder:text-slate-500 " +
	"transition-colors duration-200 hover:!border-white/25 hover:!bg-white/[0.09] " +
	"focus-visible:!border-white/50 focus-visible:!bg-white/[0.10] focus-visible:!ring-0";

const fieldClass = (hasError: boolean) =>
	hasError
		? `${field} !border-red-400/60 focus-visible:!border-red-400`
		: field;

function FieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p id={id} role="alert" className="mt-1.5 text-xs text-red-400">
			{message}
		</p>
	);
}

const chromeColor = [
	0.050980392156862744, 0.07058823529411765, 0.09411764705882353,
];

function App() {
	const { user, isLoading, error, login, signup, refetchUser } = useAuth();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const submitting = useRef(false);

	useEffect(() => {
		if (user && !isLoading) void navigate({ to: "/feed", replace: true });
	}, [user, isLoading, navigate]);
	const [mode, setMode] = useState<"signup" | "login">("signup");
	const isSignup = mode === "signup";

	const [errors, setErrors] = useState<Record<string, string>>({});

	function clearError(key: string) {
		setErrors((prev) => {
			if (!prev[key]) return prev;
			const { [key]: _removed, ...rest } = prev;
			return rest;
		});
	}

	function handleInput(e: React.ChangeEvent<HTMLInputElement>, key: string) {
		e.target.value = e.target.value.toLowerCase();
		clearError(key);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (isLoading || submitting.current) return;
		setSubmitError(null);

		const data = Object.fromEntries(new FormData(e.currentTarget));
		const result = isSignup
			? signupSchema.safeParse(data)
			: loginSchema.safeParse(data);

		if (!result.success) {
			const next: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const key = String(issue.path[0] ?? "");
				if (key && !(key in next)) next[key] = issue.message;
			}
			setErrors(next);
			return;
		}

		setErrors({});
		submitting.current = true;
		setIsSubmitting(true);
		try {
			if (isSignup) {
				const credentials = signupSchema.parse(data);
				await signup({
					handle: credentials.handle,
					email: credentials.email,
					password: credentials.password,
					display_name: credentials.displayName || undefined,
				});
			} else {
				const credentials = loginSchema.parse(data);
				await login({
					handle_or_email: credentials.handleOrEmail,
					password: credentials.password,
				});
			}
			await navigate({ to: "/feed", replace: true });
		} catch (cause) {
			setSubmitError(
				cause instanceof Error
					? cause.message
					: "Unable to sign in. Please try again.",
			);
			if (cause instanceof AuthError) {
				const keys: Record<string, string> = {
					display_name: "displayName",
					handle_or_email: "handleOrEmail",
				};
				setErrors(
					Object.fromEntries(
						Object.entries(cause.fields).map(([key, value]) => [
							keys[key] ?? key,
							value,
						]),
					),
				);
			}
		} finally {
			submitting.current = false;
			setIsSubmitting(false);
		}
	}

	const idKey = isSignup ? "email" : "handleOrEmail";

	return (
		<div className="relative isolate min-h-svh w-full overflow-x-clip bg-slate-950 text-slate-100">
			<div className="fixed inset-0 z-0 pointer-events-none blur-md scale-105">
				<LiquidChrome
					baseColor={chromeColor}
					speed={0.3}
					amplitude={0.3}
					interactive={false}
				/>
			</div>

			<main className="relative z-10 flex min-h-svh w-full flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:gap-8">
				<h1 className="hero hero-shadow inline-flex items-baseline justify-center gap-[0.15em] text-6xl md:text-8xl font-semibold tracking-tight select-none">
					<Feather
						className="h-[0.75em] w-[0.75em] translate-y-[0.06em] stroke-[2] text-slate-100 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
						aria-hidden
					/>
					cygnet
				</h1>

				<Card className="w-full max-w-sm gap-5 !border-white/10 !bg-slate-950/60 text-left text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-lg">
					<CardHeader>
						<CardTitle className="hero text-2xl">
							{isSignup ? "Create your account" : "Log in"}
						</CardTitle>
						<CardDescription className="hero italic text-slate-400">
							{isSignup ? "and start posting on cygnet" : "welcome back!"}
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form
							onSubmit={onSubmit}
							noValidate
							aria-busy={isLoading || isSubmitting}
							className="flex flex-col"
						>
							{(submitError || error) && (
								<div role="alert" className="mb-4 text-sm text-red-300">
									<p>{submitError || error}</p>
									{error && (
										<button
											type="button"
											onClick={() => void refetchUser()}
											disabled={isLoading}
											className="mt-2 underline"
										>
											Retry session check
										</button>
									)}
								</div>
							)}
							<fieldset
								disabled={isLoading || isSubmitting}
								className="min-w-0 border-0 p-0"
							>
								<div
									className={`grid transition-[grid-template-rows] duration-300 ease-out ${
										isSignup ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
									}`}
								>
									<div className="overflow-hidden">
										<div className="pb-3">
											<Input
												name="handle"
												autoComplete="username"
												placeholder="handle"
												aria-label="Handle"
												aria-invalid={!!errors.handle}
												aria-describedby={
													errors.handle ? "handle-error" : undefined
												}
												disabled={!isSignup}
												tabIndex={isSignup ? 0 : -1}
												onChange={(e) => handleInput(e, "handle")}
												className={fieldClass(!!errors.handle)}
											/>
											<FieldError id="handle-error" message={errors.handle} />
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-3">
									<div>
										<Input
											name={idKey}
											type={isSignup ? "email" : "text"}
											autoComplete={isSignup ? "email" : "username"}
											autoCapitalize="none"
											spellCheck={false}
											placeholder={isSignup ? "email" : "handle or email"}
											aria-label={isSignup ? "Email" : "handle or email"}
											aria-invalid={!!errors[idKey]}
											aria-describedby={errors[idKey] ? "id-error" : undefined}
											onChange={(e) => handleInput(e, idKey)}
											className={fieldClass(!!errors[idKey])}
										/>
										<FieldError id="id-error" message={errors[idKey]} />
									</div>

									<div>
										<Input
											name="password"
											type="password"
											autoComplete={
												isSignup ? "new-password" : "current-password"
											}
											placeholder="password"
											aria-label="Password"
											aria-invalid={!!errors.password}
											aria-describedby={
												errors.password ? "password-error" : undefined
											}
											onChange={() => clearError("password")}
											className={fieldClass(!!errors.password)}
										/>
										<FieldError id="password-error" message={errors.password} />
									</div>

									{isSignup && (
										<div>
											<Input
												name={"displayName"}
												placeholder={"display name (optional)"}
												aria-label={"display name (optional)"}
												aria-invalid={!!errors.displayName}
												aria-describedby={
													errors.displayName ? "display-name-error" : undefined
												}
												onChange={() => clearError("displayName")}
												className={fieldClass(!!errors.displayName)}
											/>
											<FieldError
												id="display-name-error"
												message={errors.displayName}
											/>
										</div>
									)}

									<Button
										type="submit"
										size="lg"
										className="mt-1 h-11 cursor-pointer rounded-lg !bg-slate-300 text-slate-950 transition-all duration-200 hover:!bg-white hover:-translate-y-0.5 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.14)] active:translate-y-0 active:scale-[0.98]"
									>
										{isSubmitting
											? "Please wait…"
											: isLoading
												? "Checking session…"
												: isSignup
													? "Create account"
													: "Log in"}
									</Button>
								</div>
							</fieldset>
						</form>
					</CardContent>

					<CardFooter className="justify-center">
						<p className="hero text-sm text-slate-400">
							{isSignup ? "Already have an account?" : "New here?"}{" "}
							<button
								type="button"
								disabled={isLoading || isSubmitting}
								onClick={() => {
									setMode(isSignup ? "login" : "signup");
									setSubmitError(null);
									setErrors({});
								}}
								className="cursor-pointer text-slate-300 underline decoration-slate-500 underline-offset-4 transition-all duration-200 hover:text-white hover:decoration-white hover:decoration-2"
							>
								{isSignup ? "Log in" : "Sign up"}
							</button>
						</p>
					</CardFooter>
				</Card>
			</main>
		</div>
	);
}
