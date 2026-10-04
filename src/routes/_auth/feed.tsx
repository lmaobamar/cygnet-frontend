import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/Button";
import { useAuth } from "#/context/AuthContext";

export const Route = createFileRoute("/_auth/feed")({ component: Feed });

function Feed() {
	const navigate = useNavigate();
	const { user, isLoading, error, logout, refetchUser } = useAuth();
	const [logoutError, setLogoutError] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoading && !user && !error)
			void navigate({ to: "/", replace: true });
	}, [isLoading, user, error, navigate]);

	async function handleLogout() {
		setLogoutError(null);
		try {
			await logout();
			await navigate({ to: "/", replace: true });
		} catch (cause) {
			setLogoutError(
				cause instanceof Error
					? cause.message
					: "Unable to log out. Please try again.",
			);
		}
	}

	return (
		<section className="flex-1 bg-background px-4 py-8 text-foreground sm:px-8">
			<div className="mx-auto max-w-3xl">
				{error && (
					<div role="alert" className="mb-6 text-destructive">
						<p>{error}</p>
						<Button
							className="mt-3"
							variant="outline"
							onClick={() => void refetchUser()}
							disabled={isLoading}
						>
							Retry session check
						</Button>
					</div>
				)}
				{user ? (
					<>
						<h1 className="break-words text-3xl font-semibold">
							Hello, {user.display_name}
						</h1>
						<p className="mt-2 text-muted-foreground">Feed here</p>
						{logoutError && (
							<p role="alert" className="mt-4 text-destructive">
								{logoutError}
							</p>
						)}
						<Button
							type="button"
							variant="outline"
							onClick={handleLogout}
							disabled={isLoading}
							className="mt-6"
						>
							{isLoading ? "Please wait…" : "Log out"}
						</Button>
					</>
				) : (
					!error && (
						<output>
							{isLoading ? "Loading your session…" : "Returning to login…"}
						</output>
					)
				)}
			</div>
		</section>
	);
}
