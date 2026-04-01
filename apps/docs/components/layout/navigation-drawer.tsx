"use client";

import { Icon, ScrollArea } from "@bug-on/md3-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { componentCategories } from "@/lib/data";
import { useLayout } from "@/lib/layout-context";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

function NavItem({
	href,
	children,
	onClick,
	isActive,
}: {
	href: string;
	children: React.ReactNode;
	onClick: () => void;
	isActive: boolean;
}) {
	return (
		<MotionLink
			href={href}
			onClick={onClick}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"px-5 py-3 lg:py-2.5 rounded-full text-[15px] lg:text-sm transition-colors cursor-pointer block",
				isActive
					? "font-bold text-m3-primary bg-m3-primary-container"
					: "font-medium text-m3-on-surface hover:bg-m3-surface-variant/50",
			)}
		>
			{children}
		</MotionLink>
	);
}

export function NavigationDrawer() {
	const pathname = usePathname();
	const { isDrawerOpen, setIsDrawerOpen } = useLayout();

	const handleNavClick = useCallback(() => {
		if (window.innerWidth < 1024) setIsDrawerOpen(false);
	}, [setIsDrawerOpen]);

	// Close drawer automatically when resizing to mobile
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1024 && isDrawerOpen) {
				setIsDrawerOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isDrawerOpen, setIsDrawerOpen]);

	const innerContent = (
		<div className="w-72 lg:w-65 flex flex-col h-full pt-4">
			<div className="flex items-center justify-between mb-4 lg:hidden px-6">
				<h2 className="text-sm font-bold uppercase tracking-widest text-m3-on-surface-variant">
					Menu
				</h2>
			</div>

			<div className="relative mb-4 px-4 shrink-0">
				<div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
					<Icon
						name="search"
						size={16}
						className="text-m3-on-surface-variant "
					/>
				</div>
				<input
					className="block w-full pl-11 pr-4 py-3 border-none bg-m3-surface-container-highest/50 text-m3-on-surface text-sm rounded-full focus:ring-2 focus:ring-m3-primary focus:bg-m3-surface-container-highest transition-all outline-none"
					placeholder="Search"
					type="text"
				/>
			</div>

			<ScrollArea
				className="flex-1 min-h-0"
				viewportClassName="px-4 pb-4"
				type="hover"
				aria-label="Navigation menu"
			>
				{componentCategories.map((category) => {
					const itemsWithHref = category.items.filter((item) => item.href);
					if (itemsWithHref.length === 0) return null;

					return (
						<div key={category.title} className="mb-6">
							<h2 className="text-xs font-bold uppercase tracking-widest text-m3-on-surface-variant mb-4 px-3">
								{category.title}
							</h2>
							<nav
								aria-label={`${category.title} navigation`}
								className="flex flex-col gap-1"
							>
								{itemsWithHref.map((item) => (
									<NavItem
										key={item.href}
										href={item.href as string}
										onClick={handleNavClick}
										isActive={pathname === item.href}
									>
										{item.name}
									</NavItem>
								))}
							</nav>
						</div>
					);
				})}
			</ScrollArea>
		</div>
	);

	return (
		<AnimatePresence>
			{isDrawerOpen && (
				<>
					{/* Mobile Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsDrawerOpen(false)}
						className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
					/>

					{/* Mobile Drawer */}
					<motion.nav
						initial={{ width: 0, opacity: 0, x: -50 }}
						animate={{ width: "auto", opacity: 1, x: 0 }}
						exit={{ width: 0, opacity: 0, x: -50 }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed inset-y-4 left-4 z-50 flex shrink-0 rounded-[2.5rem] bg-m3-surface elevation-3 lg:hidden overflow-hidden shadow-xl"
					>
						{innerContent}
					</motion.nav>

					{/* Desktop Drawer Wrapper */}
					<motion.div
						initial={{ width: 0, opacity: 0 }}
						animate={{ width: "16.25rem", opacity: 1 }}
						exit={{ width: 0, opacity: 0 }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="hidden lg:flex shrink-0 h-[calc(100dvh-3rem)]"
					>
						<motion.nav
							initial={{ x: -20 }}
							animate={{ x: 0 }}
							exit={{ x: -20 }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="flex w-full rounded-[2.5rem] bg-m3-surface overflow-hidden"
						>
							{innerContent}
						</motion.nav>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
