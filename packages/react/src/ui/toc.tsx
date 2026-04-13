/**
 * @file toc.tsx
 *
 * Table of Contents component for long-form documentation pages.
 *
 * Uses `IntersectionObserver` to track which section heading is currently in the
 * viewport and highlights the corresponding link. Smooth-scrolls to the target
 * when a link is clicked (respecting the browser's `prefers-reduced-motion`
 * media query via the native `scrollIntoView` API).
 *
 * @remarks
 * - SSR-safe: `IntersectionObserver` usage is guarded by a `typeof` check.
 * - The observer `rootMargin` is tuned for documentation layout with a fixed header
 *   (~100px) and early deactivation (~80% from bottom) so the active item changes
 *   before the section scrolls off-screen.
 */

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../lib/utils";
import { ScrollArea, type ScrollAreaProps } from "./scroll-area";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single entry in the Table of Contents.
 *
 * @example
 * ```ts
 * const items: ToCItem[] = [
 *   { id: "installation", label: "Installation" },
 *   { id: "usage", label: "Usage" },
 * ];
 * ```
 */
export interface ToCItem {
	/** The DOM `id` attribute of the corresponding section heading. */
	id: string;
	/** Human-readable label shown in the ToC. */
	label: string;
}

/**
 * Props for the `TableOfContents` component.
 */
export interface TableOfContentsProps {
	/**
	 * Ordered list of section items to display.
	 * Each item must have a matching DOM element with the same `id`.
	 */
	items: ToCItem[];
	/**
	 * Additional CSS classes applied to the root `<nav>` element.
	 * Use this to control positioning (e.g. sticky, fixed) from the consumer.
	 */
	className?: string;
	/**
	 * Configuration for the internal ScrollArea.
	 * @default { type: "hover" }
	 */
	scrollAreaProps?: Omit<ScrollAreaProps, "children">;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Table of Contents sidebar component.
 *
 * Renders a `<nav>` sidebar with links to page sections. Tracks the active
 * section using `IntersectionObserver` and applies active styles to the
 * current link.
 *
 * @remarks
 * - Visible only on `xl` screens (`hidden xl:block` — sticky sidebar).
 * - The `aria-current` attribute is set on the active link for screen readers.
 * - Click scroll is smooth: `scrollIntoView({ behavior: "smooth" })`.
 *
 * @example
 * ```tsx
 * const toc: ToCItem[] = [
 *   { id: "overview", label: "Overview" },
 *   { id: "props", label: "Props" },
 *   { id: "examples", label: "Examples" },
 * ];
 *
 * <TableOfContents items={toc} />
 * ```
 *
 * @see https://m3.material.io/foundations/content-design/navigation
 */
export function TableOfContents({
	items,
	className,
	scrollAreaProps,
}: TableOfContentsProps) {
	const [activeId, setActiveId] = useState("");

	// Stabilize dependency — re-subscribe only when the item IDs actually change.
	const itemIds = useMemo(() => items.map((i) => i.id), [items]);

	useEffect(() => {
		// SSR guard: IntersectionObserver is not available in Node.js.
		if (typeof IntersectionObserver === "undefined") return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveId(entry.target.id);
				}
			},
			// rootMargin: top offset ~100px (fixed header), bottom -80% (early switch)
			{ rootMargin: "-100px 0% -80% 0%" },
		);

		for (const id of itemIds) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, [itemIds]);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
			e.preventDefault();
			document
				.getElementById(id)
				?.scrollIntoView({ behavior: "smooth", block: "start" });
		},
		[],
	);

	return (
		<nav
			aria-label="On this page"
			className={cn("pl-6 flex flex-col h-full", className)}
		>
			<h4 className="text-xs font-bold text-m3-on-surface-variant uppercase tracking-widest mb-4 sm:hidden lg:block">
				On this page
			</h4>
			<ScrollArea
				type="hover"
				{...scrollAreaProps}
				className={cn("flex-1 min-h-0", scrollAreaProps?.className)}
			>
				<ul className="space-y-4 pr-4">
					{items.map((item) => (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								onClick={(e) => handleClick(e, item.id)}
								aria-current={activeId === item.id ? "true" : undefined}
								className={cn(
									"text-sm transition-colors hover:text-m3-primary block",
									activeId === item.id
										? "text-m3-primary font-bold"
										: "text-m3-on-surface-variant font-medium",
								)}
							>
								{item.label}
							</a>
						</li>
					))}
				</ul>
			</ScrollArea>
		</nav>
	);
}
