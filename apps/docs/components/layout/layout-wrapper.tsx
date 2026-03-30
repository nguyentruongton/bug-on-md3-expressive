"use client";

import { ScrollArea, TableOfContents } from "@bug-on/md3-react";
import { BookOpen, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NavigationDrawer } from "@/components/layout/navigation-drawer";
import { NavigationRail } from "@/components/layout/navigation-rail";
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
			className="hidden xl:flex flex-col w-56 shrink-0 pt-8 pb-8 pr-4 overflow-y-auto rounded-[2.5rem] bg-m3-surface"
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
								<X className="w-4 h-4" aria-hidden="true" />
							</button>
						</div>

						{/* TOC content */}
						<ScrollArea
							className="flex-1 min-h-0"
							viewportClassName="px-6 pb-6"
							type="hover"
						>
							<TableOfContents
								items={items}
								className="w-full border-l-0 pl-0"
							/>
						</ScrollArea>
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
			<BookOpen className="w-5 h-5" aria-hidden="true" />
		</motion.button>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout Wrapper
// ─────────────────────────────────────────────────────────────────────────────

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex flex-col lg:flex-row h-dvh w-full max-w-screen-2xl mx-auto lg:p-6 lg:gap-6 overflow-hidden">
			{/* Mobile Header */}
			<header className="lg:hidden flex items-center justify-between px-6 py-4 z-10 sticky top-0">
				<div className="flex items-center gap-3">
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

			<NavigationRail />
			<NavigationDrawer />

			{/* Main area: scrollable content */}
			<main className="flex-1 min-w-0 overflow-hidden mb-22 lg:mb-0 lg:rounded-[2.5rem] bg-m3-surface z-0 relative flex flex-col">
				<ScrollArea className="flex-1 min-w-0 w-full" type="hover">
					{/* CSS Grid constraint to prevent Radix table from horizontally stretching based on child min-content */}
					<div className="grid grid-cols-[minmax(0,1fr)] w-full">
						<div className="min-w-0 w-full">{children}</div>
					</div>
				</ScrollArea>
			</main>

			{/* Desktop TOC — outside main layout, floating right */}
			<TocDesktopSidebar />

			{/* Mobile: right-side TOC drawer + floating trigger */}
			<TocMobileDrawer />
			<TocMobileTrigger />
		</div>
	);
}
