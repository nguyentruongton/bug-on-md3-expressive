"use client";

import { Search, Settings } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

	return (
		<nav className="w-64 flex flex-col shrink-0 overflow-y-auto rounded-m3-xl bg-m3-surface">
			<div className="p-6 flex flex-col h-full">
				<div className="relative mb-6">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="text-m3-on-surface-variant w-4 h-4" />
					</div>
					<input
						className="block w-full pl-10 pr-3 py-2 border-none bg-m3-surface-variant/30 text-m3-on-surface text-sm rounded-full focus:ring-2 focus:ring-m3-primary focus:bg-m3-surface transition-all outline-none"
						placeholder="Search components..."
						type="text"
					/>
				</div>

				<h2 className="text-xs font-bold uppercase tracking-widest text-m3-on-surface-variant mb-6">
					Components
				</h2>

				<div className="flex flex-col gap-1 flex-1">
					{COMPONENTS.map((item) => {
						const href = `/components/${item.toLowerCase().replace(/\s+/g, "-")}`;
						const isActive = pathname === href;
						return (
							<MotionLink
								key={item}
								href={isActive ? "#" : href}
								whileHover={{ scale: 1.02, x: 4 }}
								whileTap={{ scale: 0.98 }}
								className={cn(
									"px-4 py-2 rounded-full text-sm transition-colors cursor-pointer block",
									isActive
										? "font-bold text-m3-primary bg-m3-primary-container"
										: "font-medium text-m3-on-surface-variant hover:bg-m3-surface-variant/30",
								)}
							>
								{item}
							</MotionLink>
						);
					})}
				</div>

				<div className="mt-8 pt-6 border-t border-m3-outline-variant">
					<MotionLink
						href="/settings"
						whileHover={{ scale: 1.02, x: 4 }}
						whileTap={{ scale: 0.98 }}
						className={cn(
							"px-4 py-3 rounded-full text-sm transition-colors cursor-pointer flex items-center gap-3",
							pathname === "/settings"
								? "font-bold text-m3-primary bg-m3-primary-container"
								: "font-medium text-m3-on-surface-variant hover:bg-m3-surface-variant/30",
						)}
					>
						<Settings className="w-4 h-4" />
						Settings
					</MotionLink>
				</div>
			</div>
		</nav>
	);
}
