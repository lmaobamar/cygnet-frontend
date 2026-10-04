import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import { useEffect, useState } from "react";
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
	const navigate = useNavigate();
	useEffect(() => {
		fetch("/api/me", { credentials: "include" })
			.then((res) => {
				if (res.ok) navigate({ to: "/feed" });
			})
			.catch(() => {});
	}, [navigate]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setLoading(true);

		const form = new FormData(e.currentTarget);
		const body = isSignup
			? {
					handle: form.get("username"),
					email: form.get("email"),
					password: form.get("password"),
				}
			: {
					email: form.get("email"),
					password: form.get("password"),
				};

		try {
			const res = await fetch(isSignup ? "/api/signup" : "/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				const fieldMessages = Array.isArray(data?.fields)
					? data.fields
							.map(
								(f: { field?: string; message?: string }) =>
									`${f.field}: ${f.message}`,
							)
							.join(", ")
					: "";
				const message = [
					fieldMessages,
					data?.message,
					typeof data?.error === "string" ? data.error : data?.error?.message,
				].find((m) => typeof m === "string" && m);

				setError(message ?? `Something went wrong (${res.status})`);
				return;
			}
			navigate({ to: "/feed" });
		} catch {
			setError("could not reach server");
		} finally {
			setLoading(false);
		}
	}

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
								<Input
									name="email"
									// type="email"
									// autoComplete="email"
									placeholder="email"
									aria-label={isSignup ? "Email" : "Username or email"}
									className={field}
								/>
								<Input
									name="password"
									type="password"
									autoComplete={isSignup ? "new-password" : "current-password"}
									placeholder="password"
									aria-label="Password"
									className={field}
								/>
								{error && <p className="text-sm text-red-400">{error}</p>}
								<Button
									type="submit"
									disabled={loading}
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
