"use client";

import {
	Code2,
	Compass,
	Home,
	LayoutGrid,
	Search,
	Settings,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { useLayout } from "@/lib/layout-context";
import { cn } from "@/lib/utils";

interface NavItemProps {
	icon: React.ElementType;
	label: string;
	href?: string;
	onClick?: () => void;
	active?: boolean;
}

function NavItem({ icon: Icon, label, href, onClick, active }: NavItemProps) {
	const Inner = (
		<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className={cn(
				"flex flex-col items-center gap-1.5 group cursor-pointer",
				active && "active",
			)}
		>
			<div
				className={cn(
					"px-4 py-1.5 rounded-full transition-colors",
					active ? "bg-m3-secondary-container" : "hover:bg-m3-on-surface/5",
				)}
			>
				{active ? (
					<Icon className="text-m3-on-secondary-container w-5.5 h-5.5 filled-icon" />
				) : (
					<Icon className="text-m3-on-surface-variant w-5.5 h-5.5" />
				)}
			</div>
			<span
				className={cn(
					"text-[10px]",
					active
						? "font-bold text-m3-on-surface"
						: "font-medium text-m3-on-surface-variant",
				)}
			>
				{label}
			</span>
		</motion.div>
	);

	if (href) {
		return (
			<Link href={href} onClick={onClick} className="outline-none">
				{Inner}
			</Link>
		);
	}
	return (
		<button type="button" onClick={onClick} className="outline-none">
			{Inner}
		</button>
	);
}

export function NavigationRail() {
	const pathname = usePathname();
	const { toggleDrawer, isDrawerOpen } = useLayout();

	return (
		<aside className="fixed bottom-4 left-4 right-4 lg:static lg:w-22 bg-m3-surface-container z-50 flex flex-row lg:flex-col items-center justify-around lg:justify-start py-3 lg:py-6 lg:gap-8 shrink-0 rounded-full lg:h-fit shadow-lg lg:shadow-none backdrop-blur-md lg:backdrop-blur-none border border-m3-outline-variant/20">
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className="hidden lg:flex w-12 h-12 bg-m3-surface-container rounded-full items-center justify-center cursor-pointer mb-2 elevation-1 hover:elevation-2 transition-all"
			>
				<Search className="text-m3-on-surface-variant w-5 h-5" />
			</motion.div>

			<NavItem icon={Home} label="Home" href="/" active={pathname === "/"} />
			<NavItem
				icon={Compass}
				label="Get started"
				href="/get-started"
				active={pathname === "/get-started"}
			/>
			<NavItem
				icon={Code2}
				label="Develop"
				href="/develop"
				active={pathname === "/develop"}
			/>
			<NavItem
				icon={LayoutGrid}
				label="Components"
				onClick={toggleDrawer}
				active={pathname.startsWith("/components") || isDrawerOpen}
			/>

			<div className="mt-auto lg:mt-auto flex flex-col lg:flex-row items-center justify-center pt-0">
				<NavItem
					icon={Settings}
					label="Settings"
					href="/settings"
					active={pathname === "/settings"}
				/>
			</div>
		</aside>
	);
}
