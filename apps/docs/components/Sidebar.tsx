"use client";

import {
	Box,
	ChevronDown,
	ChevronRight,
	Code2,
	FileText,
	Home,
	LayoutTemplate,
	Palette,
	PlayCircle,
	Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { componentCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const pathname = usePathname();
	const [componentsExpanded, setComponentsExpanded] = React.useState(true);

	const mainNav = [
		{ name: "Home", icon: Home, href: "/" },
		{ name: "Get started", icon: PlayCircle, href: "/get-started" },
		{ name: "Develop", icon: Code2, href: "/develop" },
		{ name: "Foundations", icon: LayoutTemplate, href: "/foundations" },
		{ name: "Styles", icon: Palette, href: "/styles" },
	];

	// Flatten components for the sidebar list
	const allComponents = componentCategories
		.flatMap((cat) => cat.items)
		.sort((a, b) => a.name.localeCompare(b.name));

	const isComponentsActive = pathname.startsWith("/components");

	return (
		<aside className="w-72 h-screen fixed left-0 top-0 bg-[#F8F9FA] border-r border-m3-outline-variant/30 flex flex-col overflow-hidden z-40">
			{/* Search Header */}
			<div className="p-4 flex items-center gap-3">
				<button
					type="button"
					className="w-10 h-10 rounded-full bg-m3-surface-container hover:bg-m3-surface-container-high flex items-center justify-center text-m3-on-surface transition-colors"
				>
					<Search className="w-5 h-5" />
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1 custom-scrollbar">
				{mainNav.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-colors",
								isActive
									? "bg-[#E8DEF8] text-[#1D192B]"
									: "text-m3-on-surface-variant hover:bg-m3-surface-container hover:text-m3-on-surface",
							)}
						>
							<item.icon className="w-5 h-5" />
							{item.name}
						</Link>
					);
				})}

				{/* Components Section */}
				<div className="mt-1">
					<button
						type="button"
						onClick={() => setComponentsExpanded(!componentsExpanded)}
						className={cn(
							"w-full flex items-center justify-between px-3 py-2.5 rounded-full text-sm font-medium transition-colors",
							isComponentsActive && !componentsExpanded
								? "bg-[#E8DEF8] text-[#1D192B]"
								: "text-m3-on-surface-variant hover:bg-m3-surface-container hover:text-m3-on-surface",
						)}
					>
						<div className="flex items-center gap-3">
							<Box className="w-5 h-5" />
							Components
						</div>
						{componentsExpanded ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</button>

					{componentsExpanded && (
						<div className="mt-1 flex flex-col gap-0.5">
							<Link
								href="/components"
								className={cn(
									"pl-11 pr-3 py-2 rounded-full text-sm font-medium transition-colors",
									pathname === "/components"
										? "bg-[#E8DEF8] text-[#1D192B]"
										: "text-m3-on-surface-variant hover:bg-m3-surface-container hover:text-m3-on-surface",
								)}
							>
								Components overview
							</Link>
							{allComponents.map((comp) => {
								const href = `/components/${comp.name.toLowerCase().replace(/\s+/g, "-")}`;
								const isActive = pathname === href;
								return (
									<Link
										key={comp.name}
										href={href}
										className={cn(
											"pl-11 pr-3 py-2 rounded-full text-sm transition-colors",
											isActive
												? "bg-[#E8DEF8] text-[#1D192B] font-medium"
												: "text-m3-on-surface-variant hover:bg-m3-surface-container hover:text-m3-on-surface",
										)}
									>
										{comp.name}
									</Link>
								);
							})}
						</div>
					)}
				</div>

				<Link
					href="/blog"
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-colors mt-1",
						pathname === "/blog"
							? "bg-[#E8DEF8] text-[#1D192B]"
							: "text-m3-on-surface-variant hover:bg-m3-surface-container hover:text-m3-on-surface",
					)}
				>
					<FileText className="w-5 h-5" />
					Blog
				</Link>
			</nav>
		</aside>
	);
}
