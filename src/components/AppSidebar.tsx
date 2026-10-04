import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
	ChevronDown,
	ChevronsUpDown,
	Feather,
	Home,
	LogOut,
	MessageCircle,
	Plus,
	Search,
	Users,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { type ComponentProps, useState } from "react";
import { useAuth } from "#/context/AuthContext";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "./ui/Sidebar";

const upcomingLinks = [
	{ title: "Search", icon: Search },
	{ title: "People", icon: Users },
	{ title: "Messages", icon: MessageCircle },
];

const menuClassName =
	"z-50 min-w-56 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
	const { user, logout, isLoading } = useAuth();
	const { isMobile, setOpenMobile } = useSidebar();
	const navigate = useNavigate();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [logoutError, setLogoutError] = useState<string | null>(null);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const name = user?.display_name || user?.handle || "Your account";
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

	function closeMobileSidebar() {
		if (isMobile) setOpenMobile(false);
	}

	async function handleLogout() {
		if (isLoggingOut) return;
		setLogoutError(null);
		setIsLoggingOut(true);
		try {
			await logout();
			closeMobileSidebar();
			await navigate({ to: "/", replace: true });
		} catch (cause) {
			setLogoutError(
				cause instanceof Error
					? cause.message
					: "Unable to log out. Try again.",
			);
		} finally {
			setIsLoggingOut(false);
		}
	}

	return (
		<Sidebar variant="inset" collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link
								to="/home"
								onClick={closeMobileSidebar}
								aria-label="Cygnet home"
							>
								<span className="hero inline-flex items-baseline gap-[0.15em] text-2xl font-semibold tracking-tight">
									<Feather
										className="h-[0.75em] w-[0.75em] shrink-0 translate-y-[0.06em] stroke-[2]"
										aria-hidden="true"
									/>
									<span className="group-data-[collapsible=icon]:hidden">
										cygnet
									</span>
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					{/* <SidebarGroupLabel>Explore</SidebarGroupLabel> */}
					<SidebarGroupContent>
						<nav aria-label="Main navigation">
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										tooltip="Home"
										isActive={pathname === "/home"}
									>
										<Link
											to="/home"
											onClick={closeMobileSidebar}
											aria-current={pathname === "/home" ? "page" : undefined}
										>
											<Home aria-hidden="true" />
											<span>Home</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								{upcomingLinks.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											aria-disabled="true"
											aria-label={`${item.title}`}
											tooltip={`${item.title}`}
											className="aria-disabled:pointer-events-auto aria-disabled:cursor-not-allowed"
										>
											<item.icon aria-hidden="true" />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
								<SidebarMenuItem>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger asChild>
											<SidebarMenuButton
												tooltip="Create"
												className="data-[state=open]:bg-sidebar-accent"
											>
												<Plus aria-hidden="true" />
												<span>Create</span>
												<ChevronDown
													aria-hidden="true"
													className="ml-auto group-data-[collapsible=icon]:hidden"
												/>
											</SidebarMenuButton>
										</DropdownMenu.Trigger>
										<DropdownMenu.Portal>
											<DropdownMenu.Content
												className={menuClassName}
												side={isMobile ? "bottom" : "right"}
												align="start"
												sideOffset={8}
												collisionPadding={12}
											>
												<DropdownMenu.Label className="px-2 py-1.5 text-sm font-medium">
													Create
												</DropdownMenu.Label>
												<DropdownMenu.Item
													disabled
													className="px-2 py-1.5 text-sm text-muted-foreground"
												></DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Portal>
									</DropdownMenu.Root>
								</SidebarMenuItem>
							</SidebarMenu>
						</nav>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{logoutError && (
					<p role="alert" className="px-2 text-xs text-destructive">
						{logoutError}
					</p>
				)}
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild>
								<SidebarMenuButton
									size="lg"
									tooltip={name}
									aria-label={`Account menu for ${name}`}
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-semibold">
										{initials}
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
										<span className="truncate font-medium">{name}</span>
										<span className="truncate text-xs text-muted-foreground">
											{user?.email}
										</span>
									</div>
									<ChevronsUpDown
										aria-hidden="true"
										className="ml-auto size-4 group-data-[collapsible=icon]:hidden"
									/>
								</SidebarMenuButton>
							</DropdownMenu.Trigger>
							<DropdownMenu.Portal>
								<DropdownMenu.Content
									className={`${menuClassName} w-(--radix-dropdown-menu-trigger-width)`}
									side={isMobile ? "bottom" : "right"}
									align="end"
									sideOffset={8}
									collisionPadding={12}
								>
									<DropdownMenu.Label className="grid gap-0.5 px-2 py-1.5 text-sm">
										<span className="truncate font-medium">{name}</span>
										<span className="truncate text-xs font-normal text-muted-foreground">
											@{user?.handle}
										</span>
									</DropdownMenu.Label>
									<DropdownMenu.Separator className="-mx-1 my-1 h-px bg-border" />
									<DropdownMenu.Item
										disabled={isLoading || isLoggingOut}
										onSelect={() => void handleLogout()}
										className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										<LogOut className="size-4" aria-hidden="true" />
										{isLoggingOut ? "Logging out…" : "Log out"}
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
