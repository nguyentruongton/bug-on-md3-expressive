"use client";

import {
	Icon,
	IconButton,
	NavigationRail,
	NavigationRailItem,
	ScrollArea,
	TableOfContents,
} from "@bug-on/md3-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { NavigationDrawer } from "@/components/layout/navigation-drawer";
import { useLayout } from "@/lib/layout-context";
import { useToc } from "@/lib/toc-context";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Desktop sticky TOC sidebar — visible only on xl+ */
function TocDesktopSidebar() {
	const { items } = useToc();

	if (items.length === 0) return null;

	return (
		<aside
			aria-label="Table of Contents"
			className="hidden xl:flex flex-col w-56 shrink-0 pt-8 pb-8 pr-4 rounded-[2.5rem] bg-m3-surface"
		>
			<TableOfContents items={items} className="w-full" />
		</aside>
	);
}

/** Mobile TOC drawer — slides in from the right */
function TocMobileDrawer() {
	const { items, isTocDrawerOpen, closeTocDrawer } = useToc();

	return (
		<AnimatePresence>
			{isTocDrawerOpen && items.length > 0 && (
				<>
					{/* Backdrop */}
					<motion.div
						key="toc-backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closeTocDrawer}
						className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm xl:hidden"
						aria-hidden="true"
					/>

					{/* Drawer panel */}
					<motion.aside
						key="toc-drawer"
						role="dialog"
						aria-label="Table of Contents"
						aria-modal="true"
						initial={{ x: "100%", opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: "100%", opacity: 0 }}
						transition={{ type: "spring", damping: 28, stiffness: 220 }}
						className="fixed inset-y-4 right-4 z-50 flex flex-col rounded-[2.5rem] bg-m3-surface elevation-3 shadow-xl xl:hidden"
						style={{ width: "min(280px, calc(100vw - 2rem))" }}
					>
						{/* Drawer header */}
						<div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
							<h2 className="text-xs font-bold uppercase tracking-widest text-m3-on-surface-variant">
								On this page
							</h2>
							<button
								type="button"
								onClick={closeTocDrawer}
								aria-label="Close table of contents"
								className="p-2 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-variant/50 transition-colors"
							>
								<Icon name="close" size={16} aria-hidden="true" />
							</button>
						</div>

						{/* TOC content */}
						<TableOfContents
							items={items}
							className="flex-1 min-h-0 w-full border-l-0 pl-0"
							scrollAreaProps={{
								viewportClassName: "px-6 pb-6",
								type: "hover",
							}}
						/>
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	);
}

/** Mobile FAB-style trigger — only visible when page has TOC items, hidden on xl+ */
function TocMobileTrigger() {
	const { items, toggleTocDrawer, isTocDrawerOpen } = useToc();

	if (items.length === 0) return null;

	return (
		<motion.button
			type="button"
			onClick={toggleTocDrawer}
			aria-label={
				isTocDrawerOpen ? "Close table of contents" : "Open table of contents"
			}
			aria-expanded={isTocDrawerOpen}
			aria-controls="toc-drawer"
			className="fixed bottom-24 right-4 z-30 xl:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-m3-surface-container-high text-m3-on-surface elevation-2 shadow-md transition-shadow hover:elevation-3"
			whileTap={{ scale: 0.92 }}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
		>
			<Icon name="menu_book" size={20} aria-hidden="true" />
		</motion.button>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// App Navigation
// ─────────────────────────────────────────────────────────────────────────────

function AppNavigation() {
	const pathname = usePathname();
	const router = useRouter();
	const { toggleDrawer, isDrawerOpen } = useLayout();
	const items = [
		{ icon: "home", label: "Home", href: "/", active: pathname === "/" },
		{
			icon: "explore",
			label: "Get started",
			href: "/get-started",
			active: pathname.startsWith("/get-started"),
		},
		{
			icon: "grid_view",
			label: "Components",
			href: "/components",
			active: pathname.startsWith("/components"),
		},
		{
			icon: "settings",
			label: "Settings",
			href: "/settings",
			active: pathname.startsWith("/settings"),
		},
	];

	return (
		<>
			{/* Desktop Rail */}
			<NavigationRail
				className="hidden lg:flex shadow-none"
				variant="xr"
				header={
					<IconButton
						onClick={toggleDrawer}
						colorStyle="standard"
						aria-label={
							isDrawerOpen
								? "Close navigation drawer"
								: "Open navigation drawer"
						}
						size="md"
					>
						<Icon name={isDrawerOpen ? "menu_open" : "menu"} size={48} />
					</IconButton>
				}
			>
				{items.map((item) => (
					<NavigationRailItem
						key={item.label}
						icon={<Icon name={item.icon} />}
						label={item.label}
						selected={item.active}
						onClick={() => router.push(item.href)}
					/>
				))}
			</NavigationRail>

			{/* Mobile Bottom Bar */}
			<nav className="fixed bottom-4 left-4 right-4 bg-m3-surface z-50 flex flex-row items-center justify-around py-2 shrink-0 rounded-full elevation-2 lg:hidden shadow-md backdrop-blur-md">
				{items.map((item) => (
					<NavigationRailItem
						key={item.label}
						className="w-16 h-14 bg-transparent outline-none focus-visible:ring-0"
						icon={<Icon name={item.icon} />}
						label={item.label}
						selected={item.active}
						onClick={() => router.push(item.href)}
					/>
				))}
			</nav>
		</>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout Wrapper
// ─────────────────────────────────────────────────────────────────────────────

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
	const { toggleDrawer, isDrawerOpen } = useLayout();

	return (
		<motion.div
			layout
			className="relative flex flex-col lg:flex-row h-dvh w-full max-w-screen-2xl mx-auto lg:p-6 lg:gap-6 overflow-hidden"
		>
			{/* Mobile Header */}
			<header className="lg:hidden flex items-center justify-between px-6 py-4 z-10 sticky top-0">
				<div className="flex items-center gap-3">
					<IconButton
						onClick={toggleDrawer}
						colorStyle="standard"
						className="-ml-2"
						aria-label={
							isDrawerOpen
								? "Close navigation drawer"
								: "Open navigation drawer"
						}
					>
						<Icon name="menu" />
					</IconButton>
					<div className="w-9 h-9 bg-m3-primary rounded-[10px] flex items-center justify-center elevation-1">
						<span className="text-m3-on-primary font-bold text-[10px] leading-tight text-center px-1">
							MD3
						</span>
					</div>
					<span className="font-bold text-m3-on-surface tracking-tight text-lg">
						Expressive
					</span>
				</div>
			</header>

			<AppNavigation />
			<NavigationDrawer />

			{/* Main area: scrollable content */}
			<motion.main
				layout
				transition={{
					type: "spring",
					damping: 30,
					stiffness: 300,
					mass: 0.8,
				}}
				className="flex-1 min-w-0 overflow-hidden mb-22 lg:mb-0 lg:rounded-[2.5rem] bg-m3-surface z-0 relative flex flex-col"
			>
				<ScrollArea className="flex-1 min-w-0 w-full" type="hover">
					{/* CSS Grid constraint to prevent Radix table from horizontally stretching based on child min-content */}
					<div className="grid grid-cols-[minmax(0,1fr)] w-full">
						<div className="min-w-0 w-full">{children}</div>
					</div>
				</ScrollArea>
			</motion.main>

			{/* Desktop TOC — outside main layout, floating right */}
			<TocDesktopSidebar />

			{/* Mobile: right-side TOC drawer + floating trigger */}
			<TocMobileDrawer />
			<TocMobileTrigger />
		</motion.div>
	);
}
