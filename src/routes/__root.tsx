import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "#/components/ThemeProvider";
// import { AuthProvider } from "#/context/AuthContext";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		// <AuthProvider>
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<Outlet />
			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</ThemeProvider>
		// </AuthProvider>
	);
}
