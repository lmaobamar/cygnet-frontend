import { createFileRoute } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import { useState } from "react";
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
import indexCss from "#/css/index.css?url";
import { loginSchema, signupSchema } from "#/lib/authSchemas";

export const Route = createFileRoute("/")({
	head: () => ({
		links: [{ rel: "stylesheet", href: indexCss }],
	}),
	loader: async () => ({ userCount: 50 }),
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

function App() {
	const { userCount } = Route.useLoaderData();
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

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

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
		console.log("validated", result.data);
	}

	const idKey = isSignup ? "email" : "handleOrEmail";

	return (
		<div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
			<div className="absolute inset-0 z-0 filter blur-md transform scale-105 pointer-events-none">
				<LiquidChrome
					baseColor={[
						0.050980392156862744, 0.07058823529411765, 0.09411764705882353,
					]}
					speed={0.3}
					amplitude={0.3}
					interactive={false}
				/>
			</div>

			<main className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-8 px-4 text-center">
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
							{isSignup
								? `and join ${userCount.toLocaleString()} others posting on cygnet`
								: "welcome back!"}
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={onSubmit} noValidate className="flex flex-col">
							<div
								className={`grid transition-[grid-template-rows] duration-300 ease-out ${
									isSignup ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
								}`}
							>
								<div className="overflow-hidden">
									<div className="pb-3">
										<Input
											name="handle"
											autoComplete="handle"
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

								<Button
									type="submit"
									size="lg"
									className="mt-1 h-11 cursor-pointer rounded-lg !bg-slate-300 text-slate-950 transition-all duration-200 hover:!bg-white hover:-translate-y-0.5 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.14)] active:translate-y-0 active:scale-[0.98]"
								>
									{isSignup ? "Create account" : "Log in"}
								</Button>
							</div>
						</form>
					</CardContent>

					<CardFooter className="justify-center">
						<p className="hero text-sm text-slate-400">
							{isSignup ? "Already have an account?" : "New here?"}{" "}
							<button
								type="button"
								onClick={() => {
									setMode(isSignup ? "login" : "signup");
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
