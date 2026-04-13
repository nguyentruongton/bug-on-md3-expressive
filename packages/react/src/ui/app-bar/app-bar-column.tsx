/**
 * @file app-bar-column.tsx
 * MD3 Expressive App Bar Column DSL.
 *
 * Displays App Bar action items in a vertical column.
 * Overflow items collapse into a dropdown menu.
 *
 * @see docs/m3/app-bars/AppBarColumn.kt
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { AppBarTokens } from "./app-bar.tokens";
import type { AppBarColumnProps } from "./app-bar.types";
import { AppBarItemButton } from "./app-bar-item-button";
import { AppBarOverflowIndicator } from "./app-bar-overflow-indicator";

/**
 * MD3 Expressive App Bar Column.
 *
 * Renders action items in a vertical column. Commonly used in
 * side navigation or rail-style App Bars.
 *
 * @example
 * ```tsx
 * <AppBarColumn
 *   maxItemCount={3}
 *   items={[
 *     { type: 'clickable', icon: <Icon>edit</Icon>, label: 'Edit', onClick: handleEdit },
 *     { type: 'clickable', icon: <Icon>delete</Icon>, label: 'Delete', onClick: handleDelete },
 *   ]}
 * />
 * ```
 */
export function AppBarColumn({
	items,
	maxItemCount,
	className,
}: AppBarColumnProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = React.useState(
		maxItemCount ?? items.length,
	);

	React.useEffect(() => {
		if (maxItemCount !== undefined) {
			setVisibleCount(Math.min(maxItemCount, items.length));
			return;
		}

		const container = containerRef.current;
		if (!container) return;

		let debounceTimer: ReturnType<typeof setTimeout>;

		const observer = new ResizeObserver((entries) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				const entry = entries[0];
				if (!entry) return;

				const available = entry.contentRect.height;
				const itemHeight = AppBarTokens.iconButtonTouchTarget;
				const hasOverflow = items.length > Math.floor(available / itemHeight);
				const reservedHeight = hasOverflow ? itemHeight : 0;
				const count = Math.max(
					0,
					Math.floor((available - reservedHeight) / itemHeight),
				);
				setVisibleCount(Math.min(count, items.length));
			}, 100);
		});

		observer.observe(container);
		return () => {
			clearTimeout(debounceTimer);
			observer.disconnect();
		};
	}, [items.length, maxItemCount]);

	const visibleItems = items.slice(0, visibleCount);
	const overflowItems = items.slice(visibleCount);

	return (
		<div
			ref={containerRef}
			className={cn("flex flex-col items-center", className)}
		>
			{visibleItems.map((item, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static list from props
				<AppBarItemButton key={index} item={item} />
			))}

			{overflowItems.length > 0 && (
				<AppBarOverflowIndicator items={overflowItems} />
			)}
		</div>
	);
}
