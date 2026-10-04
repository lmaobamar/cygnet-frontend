import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { ThemeProvider } from "#/components/ThemeProvider";
import { AuthProvider } from "#/context/AuthContext";
import appCss from "#/styles.css?url";

export const Route = createRootRoute({
	component: RootComponent,
	shellComponent: RootDocument,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Cygnet" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
});

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider defaultTheme="dark" storageKey="theme">
					{children}
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}

function RootComponent() {
	return (
		<AuthProvider>
			<Outlet />
			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> },
				]}
			/>
		</AuthProvider>
	);
}
