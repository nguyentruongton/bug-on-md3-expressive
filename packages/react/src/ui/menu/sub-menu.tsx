// ─── MD3 Expressive Menu — SubMenu ───────────────────────────────────────────
// Nested sub-menu triggered by hover/keyboard on a MenuItem
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { SUBMENU_CONTAINER_VARIANTS } from "./menu-animations";
import { useMenuContext } from "./menu-context";
import {
	MENU_MAX_WIDTH,
	MENU_MIN_WIDTH,
	MENU_POPUP_PADDING_Y,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";
import type { MenuItemProps, SubMenuProps } from "./menu-types";

/**
 * A nested SubMenu that opens from a trigger MenuItem.
 *
 * Keyboard: ArrowRight opens, ArrowLeft/Escape closes (handled by Radix).
 * The parent MenuContent should set `hasOverflow={true}` when SubMenus are used.
 *
 * @example
 * <MenuContent hasOverflow>
 *   <SubMenu
 *     trigger={
 *       <MenuItem trailingIcon={<Icon name="chevron_right" size={20} />}>
 *         Share
 *       </MenuItem>
 *     }
 *   >
 *     <MenuItem>Via Email</MenuItem>
 *     <MenuItem>Via Link</MenuItem>
 *   </SubMenu>
 * </MenuContent>
 */
export function SubMenu({
	children,
	trigger,
	side = "right",
	colorVariant: propColorVariant,
}: SubMenuProps) {
	const { colorVariant: contextColorVariant } = useMenuContext();
	const colorVariant = propColorVariant ?? contextColorVariant;

	// Note: We MUST NOT use a controlled `open` state here.
	// If we do, we break Radix's automatic "safe polygon" logic that keeps the
	// submenu open while the mouse travels diagonally from the trigger to the content.
	// To animate exit, we let Radix handle the state and use a custom Presence wrapper.

	return (
		<DropdownMenu.Sub>
			{/* Trigger: the parent MenuItem */}
			{React.isValidElement(trigger) 
				? React.cloneElement(trigger as React.ReactElement<MenuItemProps>, { isSubTrigger: true })
				: <DropdownMenu.SubTrigger asChild><div>{trigger}</div></DropdownMenu.SubTrigger>}

			{/* SubMenu popup */}
			<DropdownMenu.Portal>
				<DropdownMenu.SubContent sideOffset={4} alignOffset={-4} asChild forceMount>
					<SubMenuPresence side={side} colorVariant={colorVariant}>
						{children}
					</SubMenuPresence>
				</DropdownMenu.SubContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Sub>
	);
}
SubMenu.displayName = "SubMenu";

/**
 * Inner wrapper to handle animations. By rendering this *inside* the SubContent,
 * we can read Radix's `data-state` to drive Framer Motion.
 */
const SubMenuPresence = React.forwardRef<
	HTMLDivElement,
	{ children: React.ReactNode; side: "left" | "right"; colorVariant: string; "data-state"?: string }
>(({ children, side, colorVariant, "data-state": dataState, ...props }, ref) => {
	const colors = colorVariant === "vibrant" ? VIBRANT_COLORS : STANDARD_COLORS;
	const open = dataState === "open";

	return (
		<AnimatePresence>
			{open && (
				<m.div
					ref={ref}
					{...props}
					className={cn(
						"z-50 flex flex-col",
						// Width constraints
						MENU_MIN_WIDTH,
						MENU_MAX_WIDTH,
						// Vertical padding: 8dp
						MENU_POPUP_PADDING_Y,
						// Gap between groups: 2dp
						"gap-0.5",
						// Container background
						colors.containerBg,
						// Container shape: CornerExtraSmall (4px)
						"rounded-sm",
						// Elevation-2 shadow
						"elevation-2",
						// No overflow clip so items can morph
						"overflow-hidden",
						"outline-none",
					)}
					variants={SUBMENU_CONTAINER_VARIANTS}
					initial="hidden"
					animate="visible"
					exit="exit"
					style={{
						transformOrigin: side === "right" ? "top left" : "top right",
					}}
				>
					{children}
				</m.div>
			)}
		</AnimatePresence>
	);
});
SubMenuPresence.displayName = "SubMenuPresence";
