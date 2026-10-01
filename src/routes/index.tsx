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

function App() {
	const { userCount } = Route.useLoaderData();
	const [mode, setMode] = useState<"signup" | "login">("signup");
	const isSignup = mode === "signup";

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// TODO:
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
						<form onSubmit={onSubmit} className="flex flex-col">
							<div
								className={`grid transition-[grid-template-rows] duration-300 ease-out ${
									isSignup ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
								}`}
							>
								<div className="overflow-hidden">
									<div className="pb-3">
										<Input
											name="username"
											autoComplete="username"
											placeholder="username"
											aria-label="Username"
											disabled={!isSignup}
											tabIndex={isSignup ? 0 : -1}
											className={field}
										/>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-3">
								<Input
									name="email"
									// type="email"
									// autoComplete="email"
									placeholder={isSignup ? "email" : "username or email"}
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
								onClick={() => setMode(isSignup ? "login" : "signup")}
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
