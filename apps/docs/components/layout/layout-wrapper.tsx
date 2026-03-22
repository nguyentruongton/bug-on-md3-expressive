"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavigationDrawer } from "@/components/layout/navigation-drawer";
import { NavigationRail } from "@/components/layout/navigation-rail";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isComponentsRoute = pathname.startsWith("/components");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="relative flex h-screen w-full flex-col overflow-hidden bg-m3-surface-container">
			{/* Mobile Header */}
			<header className="lg:hidden flex items-center justify-between px-6 py-4 bg-m3-surface-container-high border-b border-m3-outline-variant/20">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-m3-primary rounded-lg flex items-center justify-center">
						<span className="text-m3-on-primary font-bold text-xs">MD</span>
					</div>
					<span className="font-bold text-m3-on-surface tracking-tight">
						Expressive
					</span>
				</div>
				<button
					type="button"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant/30 rounded-full transition-colors"
				>
					{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</header>

			<div className="flex flex-1 overflow-hidden lg:gap-4 lg:p-4">
				{/* Desktop Navigation Rail */}
				<div className="hidden lg:flex items-center">
					<NavigationRail />
				</div>

				{/* Desktop Navigation Drawer */}
				{isComponentsRoute && (
					<div className="hidden xl:block">
						<NavigationDrawer />
					</div>
				)}

				<main className="flex-1 overflow-y-auto lg:rounded-m3-xl bg-m3-surface-container-low relative">
					{children}
				</main>
			</div>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 bg-black/40 z-40 lg:hidden"
						/>
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed inset-y-0 left-0 w-70 bg-m3-surface-container-high z-50 lg:hidden flex flex-col p-6 shadow-2xl"
						>
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-m3-primary rounded-lg flex items-center justify-center">
										<span className="text-m3-on-primary font-bold text-xs">
											MD
										</span>
									</div>
									<span className="font-bold text-m3-on-surface tracking-tight">
										Expressive
									</span>
								</div>
								<button
									type="button"
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant/30 rounded-full transition-colors"
								>
									<X size={20} />
								</button>
							</div>

							<div className="flex flex-col gap-2 overflow-y-auto">
								<MobileNavItem
									href="/"
									label="Home"
									active={pathname === "/"}
									onClick={() => setIsMobileMenuOpen(false)}
								/>
								<MobileNavItem
									href="/get-started"
									label="Get Started"
									active={pathname === "/get-started"}
									onClick={() => setIsMobileMenuOpen(false)}
								/>
								<MobileNavItem
									href="/develop"
									label="Develop"
									active={pathname === "/develop"}
									onClick={() => setIsMobileMenuOpen(false)}
								/>
								<MobileNavItem
									href="/components"
									label="Components"
									active={pathname.startsWith("/components")}
									onClick={() => setIsMobileMenuOpen(false)}
								/>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

function MobileNavItem({
	href,
	label,
	active,
	onClick,
}: {
	href: string;
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`px-4 py-3 rounded-full text-sm font-medium transition-colors ${
				active
					? "bg-m3-primary-container text-m3-on-primary-container"
					: "text-m3-on-surface-variant hover:bg-m3-surface-variant/30"
			}`}
		>
			{label}
		</Link>
	);
}
