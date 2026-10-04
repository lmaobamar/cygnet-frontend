import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "#/context/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/Sidebar";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isLoading } = useAuth();
	if (isLoading && !user) return null;
	if (!user) return <Navigate to="/" replace />;
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-w-0">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
