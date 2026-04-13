/**
 * @file app-bar-item-button.tsx
 * Shared icon button renderer for AppBarRow and AppBarColumn items.
 *
 * Extracted from duplicate RowItem/ColumnItem implementations.
 */

import { cn } from "../../lib/utils";
import { APP_BAR_COLORS, AppBarTokens } from "./app-bar.tokens";
import type { AppBarItem } from "./app-bar.types";

interface AppBarItemButtonProps {
	item: AppBarItem;
}

/**
 * Renders a single App Bar action item as an icon button.
 * Handles clickable, toggleable, and custom item types.
 */
export function AppBarItemButton({ item }: AppBarItemButtonProps) {
	const isDisabled = item.enabled === false;

	if (item.type === "custom" && item.appBarContent) {
		return <>{item.appBarContent}</>;
	}

	const buttonClassName = cn(
		"flex items-center justify-center rounded-full",
		"focus-visible:outline-none focus-visible:ring-2",
		isDisabled && "opacity-38 pointer-events-none",
	);

	const buttonStyle = {
		width: AppBarTokens.iconButtonTouchTarget,
		height: AppBarTokens.iconButtonTouchTarget,
	};

	if (item.type === "toggleable") {
		return (
			<button
				type="button"
				className={buttonClassName}
				style={{
					...buttonStyle,
					color: item.checked
						? APP_BAR_COLORS.navigationIcon
						: APP_BAR_COLORS.actionIcon,
				}}
				aria-label={item.label}
				aria-pressed={item.checked}
				disabled={isDisabled}
				onClick={() => item.onCheckedChange?.(!item.checked)}
			>
				{item.icon}
			</button>
		);
	}

	return (
		<button
			type="button"
			className={buttonClassName}
			style={{ ...buttonStyle, color: APP_BAR_COLORS.actionIcon }}
			aria-label={item.label}
			disabled={isDisabled}
			onClick={item.onClick}
		>
			{item.icon}
		</button>
	);
}
