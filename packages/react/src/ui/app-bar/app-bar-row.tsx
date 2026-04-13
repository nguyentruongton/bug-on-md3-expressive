/**
 * @file app-bar-row.tsx
 * MD3 Expressive App Bar Row DSL.
 *
 * Displays App Bar action items in a horizontal row.
 * Items that exceed `maxItemCount` or available width collapse into a
 * dropdown menu via <AppBarOverflowIndicator>.
 *
 * Translated from OverflowMeasurePolicy / AppBarRow.kt in Jetpack Compose M3.
 *
 * @see docs/m3/app-bars/AppBarRow.kt
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { AppBarTokens } from "./app-bar.tokens";
import type { AppBarRowProps } from "./app-bar.types";
import { AppBarItemButton } from "./app-bar-item-button";
import { AppBarOverflowIndicator } from "./app-bar-overflow-indicator";

/**
 * MD3 Expressive App Bar Row.
 *
 * Renders action items in a row. Compatible with the `actions` prop of any App Bar.
 *
 * @example
 * ```tsx
 * <SmallAppBar
 *   title="Messages"
 *   actions={
 *     <AppBarRow
 *       maxItemCount={2}
 *       items={[
 *         { type: 'clickable', icon: <Icon>search</Icon>, label: 'Search', onClick: handleSearch },
 *         { type: 'clickable', icon: <Icon>bookmark</Icon>, label: 'Bookmarks', onClick: handleBookmark },
 *         { type: 'clickable', icon: <Icon>settings</Icon>, label: 'Settings', onClick: handleSettings },
 *       ]}
 *     />
 *   }
 * />
 * ```
 */
export function AppBarRow({ items, maxItemCount, className }: AppBarRowProps) {
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

				const available = entry.contentRect.width;
				const itemWidth = AppBarTokens.iconButtonTouchTarget;
				const hasOverflow = items.length > Math.floor(available / itemWidth);
				const reservedWidth = hasOverflow ? itemWidth : 0;
				const count = Math.max(
					0,
					Math.floor((available - reservedWidth) / itemWidth),
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
			className={cn("flex items-center", className)}
			style={{ gap: AppBarTokens.iconButtonSpace }}
		>
			{visibleItems.map((item, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: items are static from props
				<AppBarItemButton key={index} item={item} />
			))}

			{overflowItems.length > 0 && (
				<AppBarOverflowIndicator items={overflowItems} />
			)}
		</div>
	);
}
