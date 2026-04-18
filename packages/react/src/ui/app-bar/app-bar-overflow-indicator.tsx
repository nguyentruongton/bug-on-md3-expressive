/**
 * @file app-bar-overflow-indicator.tsx
 * MD3 Expressive App Bar Overflow Indicator.
 *
 * Renders a "More" (more_vert) icon button that opens a Radix UI
 * DropdownMenu containing overflow App Bar items.
 *
 * Used internally by <AppBarRow> and <AppBarColumn> when items exceed
 * the visible count.
 */

import { cn } from "../../lib/utils";
import {
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from "../menu";
import { APP_BAR_COLORS, AppBarTokens } from "./app-bar.tokens";
import type { AppBarItem, AppBarOverflowIndicatorProps } from "./app-bar.types";

/** More vert icon for the overflow trigger button. */
function MoreVertIcon() {
	return (
		<span
			className="material-symbols-rounded text-[24px] leading-none select-none"
			aria-hidden="true"
		>
			more_vert
		</span>
	);
}

/**
 * Renders a single overflow item in the dropdown based on its type.
 */
function OverflowItem({ item }: { item: AppBarItem }) {
	if (item.type === "toggleable") {
		return (
			<MenuItem
				role="menuitemcheckbox"
				selected={item.checked ?? false}
				onClick={() => item.onCheckedChange?.(!item.checked)}
				disabled={item.enabled === false}
			>
				{item.label}
			</MenuItem>
		);
	}

	if (item.type === "custom" && item.menuContent) {
		return (
			<>
				{item.menuContent({
					isOpen: true,
					open: () => {},
					close: () => {},
				})}
			</>
		);
	}

	// Default: clickable
	return (
		<MenuItem onClick={item.onClick} disabled={item.enabled === false}>
			{item.label}
		</MenuItem>
	);
}

/**
 * MD3 App Bar Overflow Indicator.
 *
 * Renders a "more_vert" button that opens a dropdown menu
 * with overflow action items.
 */
export function AppBarOverflowIndicator({
	items,
	className,
}: AppBarOverflowIndicatorProps) {
	if (items.length === 0) return null;

	return (
		<Menu>
			<MenuTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex items-center justify-center rounded-full",
						"focus-visible:outline-none focus-visible:ring-2",
						className,
					)}
					style={{
						width: AppBarTokens.iconButtonTouchTarget,
						height: AppBarTokens.iconButtonTouchTarget,
						color: APP_BAR_COLORS.actionIcon,
					}}
					aria-label="More actions"
					aria-haspopup="menu"
				>
					<MoreVertIcon />
				</button>
			</MenuTrigger>

			<MenuContent align="end" sideOffset={4}>
				{items.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static list from props
					<OverflowItem key={index} item={item} />
				))}
			</MenuContent>
		</Menu>
	);
}
