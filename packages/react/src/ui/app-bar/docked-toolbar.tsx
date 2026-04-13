/**
 * @file docked-toolbar.tsx
 * MD3 Expressive Docked Toolbar.
 *
 * Secondary navigation component. NOT an App Bar.
 * Usually appears directly below the main App Bar.
 * Height: 64px | Background: surface-container
 * Typical content: chips, segmented buttons, filter actions.
 *
 * @see docs/m3/app-bars/DockedToolbarTokens.kt
 */

import { cn } from "../../lib/utils";
import { AppBarTokens } from "./app-bar.tokens";
import type { DockedToolbarProps } from "./app-bar.types";

/**
 * MD3 Expressive Docked Toolbar.
 *
 * @example
 * ```tsx
 * <DockedToolbar aria-label="Filter options">
 *   <Chip label="All" selected onClick={() => setFilter('all')} />
 *   <Chip label="Unread" onClick={() => setFilter('unread')} />
 *   <Chip label="Starred" onClick={() => setFilter('starred')} />
 * </DockedToolbar>
 * ```
 */
export function DockedToolbar({
	children,
	"aria-label": ariaLabel,
	className,
}: DockedToolbarProps) {
	return (
		<div
			role="toolbar"
			aria-label={ariaLabel}
			className={cn(
				"flex items-center w-full overflow-x-auto bg-m3-surface-container",
				className,
			)}
			style={{
				height: AppBarTokens.heights.dockedToolbar,
				// DockedToolbarTokens: LeadingSpace = 16dp, TrailingSpace = 16dp
				paddingLeft: AppBarTokens.dockedToolbar.leadingSpace,
				paddingRight: AppBarTokens.dockedToolbar.trailingSpace,
				// MinSpacing = 4dp (gap between items)
				gap: AppBarTokens.dockedToolbar.minSpacing,
			}}
		>
			{children}
		</div>
	);
}
