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
 * ### Hover delays
 * `hoverOpenDelay` (default: 200ms) — time before the submenu opens on hover.
 * `hoverCloseDelay` (default: 300ms) — time before the submenu closes after pointer-leave.
 * These delays allow the user to safely move diagonally from trigger to submenu content
 * without accidental close (safe polygon behavior from Radix still applies).
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
	hoverOpenDelay = 200,
	hoverCloseDelay = 300,
}: SubMenuProps) {
	const { colorVariant: contextColorVariant } = useMenuContext();
	const colorVariant = propColorVariant ?? contextColorVariant;

	// Controlled open state for hover delay support.
	// Note: We use Radix's controlled mode carefully — Radix still handles keyboard
	// and the safe polygon logic internally when we pass open/onOpenChange.
	const [open, setOpen] = React.useState(false);
	const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimers = React.useCallback(() => {
		if (openTimerRef.current) clearTimeout(openTimerRef.current);
		if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
	}, []);

	const handleTriggerPointerEnter = React.useCallback(() => {
		clearTimers();
		openTimerRef.current = setTimeout(() => setOpen(true), hoverOpenDelay);
	}, [hoverOpenDelay, clearTimers]);

	const handleTriggerPointerLeave = React.useCallback(() => {
		clearTimers();
		closeTimerRef.current = setTimeout(() => setOpen(false), hoverCloseDelay);
	}, [hoverCloseDelay, clearTimers]);

	const handleContentPointerEnter = React.useCallback(() => {
		// Keep open when pointer moves into the submenu content
		clearTimers();
	}, [clearTimers]);

	const handleContentPointerLeave = React.useCallback(() => {
		clearTimers();
		closeTimerRef.current = setTimeout(() => setOpen(false), hoverCloseDelay);
	}, [hoverCloseDelay, clearTimers]);

	// Cleanup timers on unmount
	React.useEffect(() => () => clearTimers(), [clearTimers]);

	return (
		<DropdownMenu.Sub open={open} onOpenChange={setOpen}>
			{/* Trigger: Radix SubTrigger renders its own element (no asChild)
				 * so it can correctly compute the bounding box for SubContent positioning.
				 * Previously, using asChild with a display:contents wrapper caused
				 * getBoundingClientRect() to return (0,0,0,0), mispositing the submenu. */}
			<DropdownMenu.SubTrigger
				className="w-full outline-none"
				onPointerEnter={handleTriggerPointerEnter}
				onPointerLeave={handleTriggerPointerLeave}
			>
				{React.isValidElement(trigger)
					? React.cloneElement(trigger as React.ReactElement<MenuItemProps>, {
							isSubTrigger: true,
						})
					: trigger}
			</DropdownMenu.SubTrigger>

			{/* SubMenu popup */}
			<AnimatePresence>
				{open && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.SubContent
							sideOffset={4}
							alignOffset={-4}
							forceMount
							className="outline-none"
						>
							<SubMenuContent
								side={side}
								colorVariant={colorVariant}
								onPointerEnter={handleContentPointerEnter}
								onPointerLeave={handleContentPointerLeave}
							>
								{children}
							</SubMenuContent>
						</DropdownMenu.SubContent>
					</DropdownMenu.Portal>
				)}
			</AnimatePresence>
		</DropdownMenu.Sub>
	);
}
SubMenu.displayName = "SubMenu";

/**
 * Inner wrapper to handle animations. 
 */
function SubMenuContent({
	children,
	side,
	colorVariant,
	onPointerEnter,
	onPointerLeave,
}: {
	children: React.ReactNode;
	side: "left" | "right";
	colorVariant: string;
	onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
	onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
}) {
	const colors = colorVariant === "vibrant" ? VIBRANT_COLORS : STANDARD_COLORS;

	return (
		<m.div
			role="menu"
			aria-orientation="vertical"
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
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
				// Overflow clip
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
	);
}
SubMenuContent.displayName = "SubMenuContent";

