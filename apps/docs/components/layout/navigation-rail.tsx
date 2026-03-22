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
import { cn } from "@/lib/utils";

interface NavItemProps {
	icon: React.ElementType;
	label: string;
	href: string;
	active?: boolean;
}

function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
	return (
		<Link href={href}>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className={cn(
					"flex flex-col items-center gap-1 group cursor-pointer",
					active && "active",
				)}
			>
				{active ? (
					<div className="bg-m3-secondary-container px-4 py-1 rounded-full mb-1">
						<Icon className="text-m3-on-secondary-container w-6 h-6" />
					</div>
				) : (
					<Icon className="text-m3-on-surface-variant w-6 h-6" />
				)}
				<span
					className={cn(
						"text-[10px] text-m3-on-surface",
						active ? "font-bold" : "font-medium",
					)}
				>
					{label}
				</span>
			</motion.div>
		</Link>
	);
}

export function NavigationRail() {
	const pathname = usePathname();

	return (
		<aside className="w-24 bg-m3-surface-container-high flex flex-col items-center py-8 gap-8 shrink-0 overflow-y-auto rounded-full h-fit">
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className="w-12 h-12 bg-m3-on-surface-variant/10 rounded-m3-xl flex items-center justify-center cursor-pointer mb-2"
			>
				<Search className="text-m3-on-surface-variant w-6 h-6" />
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
				href="/components"
				active={pathname.startsWith("/components")}
			/>

			<div className="mt-auto flex flex-col items-center gap-6">
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					<Settings className="text-m3-on-surface-variant w-6 h-6 cursor-pointer" />
				</motion.div>
			</div>
		</aside>
	);
}
