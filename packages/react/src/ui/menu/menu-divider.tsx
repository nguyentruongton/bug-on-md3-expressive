// ─── MD3 Expressive Menu — MenuDivider ───────────────────────────────────────
// Spec: HorizontalDividerPadding = PaddingValues(horizontal = 12.dp, vertical = 2.dp)
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "../../lib/utils";
import type { MenuDividerProps } from "./menu-types";

/**
 * A horizontal divider for use between MenuItems or MenuGroups.
 *
 * Uses traditional line-based separation (as opposed to the gap-based
 * separation in MenuGroup, which is the Expressive default).
 *
 * Spec: horizontal=12dp padding, vertical=2dp padding, `outline-variant` color.
 *
 * @example
 * <MenuContent>
 *   <MenuItem>Cut</MenuItem>
 *   <MenuDivider />
 *   <MenuItem>Paste</MenuItem>
 * </MenuContent>
 */
export const MenuDivider = React.forwardRef<HTMLHRElement, MenuDividerProps>(
	({ className, ...props }, ref) => (
		<DropdownMenu.Separator asChild>
			<hr
				ref={ref}
				className={cn(
					// HorizontalDividerPadding: horizontal=12dp, vertical=2dp
					"mx-3 my-0.5",
					// 1px height line
					"h-px border-0",
					// outline-variant color
					"bg-m3-outline-variant",
					className,
				)}
				{...props}
			/>
		</DropdownMenu.Separator>
	),
);
MenuDivider.displayName = "MenuDivider";
