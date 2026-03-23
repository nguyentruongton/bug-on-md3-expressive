"use client";

import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "@/lib/layout-context";
import { cn } from "@/lib/utils";

const COMPONENTS = [
	"Button Groups",
	"Buttons",
	"Cards",
	"Chips",
	"Dialogs",
	"Navigation Bar",
	"Extended FAB",
	"Navigation Drawer",
	"Progress Indicators",
	"Sliders",
	"Switch",
	"Tabs",
	"TextFields",
];

const MotionLink = motion.create(Link);

export function NavigationDrawer() {
	const pathname = usePathname();
	const { isDrawerOpen, setIsDrawerOpen } = useLayout();

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

					{/* Drawer */}
					<motion.nav
						initial={{ width: 0, opacity: 0, x: -50 }}
						animate={{ width: "auto", opacity: 1, x: 0 }}
						exit={{ width: 0, opacity: 0, x: -50 }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed lg:static inset-y-4 left-4 z-50 flex shrink-0 rounded-[2.5rem] bg-m3-surface-container-low elevation-3 lg:elevation-0 h-[calc(100dvh-2rem)] lg:h-auto overflow-hidden shadow-xl lg:shadow-none"
					>
						<div className="w-72 lg:w-65 p-4 lg:p-6 flex flex-col h-full overflow-y-auto">
							<div className="flex items-center justify-between mb-4 lg:hidden px-2 pt-2">
								<h2 className="text-sm font-bold uppercase tracking-widest text-m3-on-surface-variant">
									Components
								</h2>
							</div>

							<div className="relative mb-6 hidden lg:block">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<Search className="text-m3-on-surface-variant w-4 h-4" />
								</div>
								<input
									className="block w-full pl-11 pr-4 py-3 border-none bg-m3-surface-container-highest/50 text-m3-on-surface text-sm rounded-full focus:ring-2 focus:ring-m3-primary focus:bg-m3-surface-container-highest transition-all outline-none"
									placeholder="Search components"
									type="text"
								/>
							</div>

							<h2 className="hidden lg:block text-xs font-bold uppercase tracking-widest text-m3-on-surface-variant mb-4 px-3">
								Components
							</h2>

							<div className="flex flex-col gap-1 flex-1">
								{COMPONENTS.map((item) => {
									const href = `/components/${item.toLowerCase().replace(/\s+/g, "-")}`;
									const isActive = pathname === href;
									return (
										<MotionLink
											key={item}
											href={href}
											onClick={() => {
												if (window.innerWidth < 1024) setIsDrawerOpen(false);
											}}
											whileHover={{ scale: 1.02, x: 4 }}
											whileTap={{ scale: 0.98 }}
											className={cn(
												"px-5 py-3 lg:py-2.5 rounded-full text-[15px] lg:text-sm transition-colors cursor-pointer block",
												isActive
													? "font-bold text-m3-primary bg-m3-primary-container"
													: "font-medium text-m3-on-surface hover:bg-m3-surface-variant/50",
											)}
										>
											{item}
										</MotionLink>
									);
								})}
							</div>
						</div>
					</motion.nav>
				</>
			)}
		</AnimatePresence>
	);
}
