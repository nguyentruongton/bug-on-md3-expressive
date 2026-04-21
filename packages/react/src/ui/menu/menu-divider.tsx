// ─── MD3 Expressive Menu — MenuDivider ───────────────────────────────────────
// Spec: HorizontalDividerPadding = PaddingValues(horizontal = 12.dp, vertical = 2.dp)
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "../../lib/utils";
import { useMenuContext } from "./menu-context";
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
	({ className, ...props }, ref) => {
		const { menuVariant } = useMenuContext();

		return (
			<DropdownMenu.Separator asChild>
				<hr
					ref={ref}
					className={cn(
						// Baseline: 8dp vertical margin, 0 horizontal. Expressive: 12dp horizontal, 2dp vertical
						menuVariant === "baseline" ? "my-2 mx-0" : "mx-3 my-0.5",
						// 1px height line
						"h-px border-0",
						// outline-variant color
						"bg-m3-outline-variant",
						className,
					)}
					{...props}
				/>
			</DropdownMenu.Separator>
		);
	},
);
MenuDivider.displayName = "MenuDivider";
