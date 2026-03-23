"use client";

import { NavigationDrawer } from "@/components/layout/navigation-drawer";
import { NavigationRail } from "@/components/layout/navigation-rail";

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

			<main className="flex-1 overflow-y-auto overflow-x-hidden mb-22 lg:mb-0 lg:rounded-[2.5rem] bg-m3-surface z-0 relative flex flex-col">
				{children}
			</main>
		</div>
	);
}
