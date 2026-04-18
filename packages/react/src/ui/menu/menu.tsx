// ─── MD3 Expressive Menu — Root (Menu, MenuTrigger, MenuContent) ─────────────
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { MENU_CONTAINER_VARIANTS } from "./menu-animations";
import { MenuProvider, useMenuContext } from "./menu-context";
import {
	MENU_CONTAINER_SHAPE,
	MENU_GROUP_GAP,
	MENU_MAX_WIDTH,
	MENU_MIN_WIDTH,
	MENU_POPUP_PADDING_Y,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";
import type {
	MenuContentProps,
	MenuProps,
	MenuTriggerProps,
} from "./menu-types";

// ─── Menu (Root) ──────────────────────────────────────────────────────────────

/**
 * MD3 Expressive Menu root component.
 *
 * Wraps Radix `DropdownMenu.Root` and provides `MenuContext` with `colorVariant`
 * and `open` state to all descendant MenuItem and MenuGroup components.
 *
 * @example
 * <Menu colorVariant="standard">
 *   <MenuTrigger asChild>
 *     <IconButton name="more_vert" />
 *   </MenuTrigger>
 *   <MenuContent>
 *     <MenuGroup index={0} count={2}>
 *       <MenuItem>Cut</MenuItem>
 *       <MenuItem>Copy</MenuItem>
 *     </MenuGroup>
 *     <MenuGroup index={1} count={2}>
 *       <MenuItem>Paste</MenuItem>
 *     </MenuGroup>
 *   </MenuContent>
 * </Menu>
 */
export function Menu({
	children,
	colorVariant = "standard",
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	defaultOpen,
	...props
}: MenuProps &
	Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu.Root>, "children">) {
	// Support both controlled and uncontrolled open state.
	// Initialize internalOpen from defaultOpen so that `defaultOpen={true}` works.
	const [internalOpen, setInternalOpen] = React.useState(
		() => defaultOpen ?? false,
	);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;

	const handleOpenChange = React.useCallback(
		(next: boolean) => {
			if (!isControlled) setInternalOpen(next);
			controlledOnOpenChange?.(next);
		},
		[isControlled, controlledOnOpenChange],
	);

	return (
		<MenuProvider colorVariant={colorVariant} open={open} onOpenChange={handleOpenChange}>
			<DropdownMenu.Root
				{...props}
				defaultOpen={defaultOpen}
				open={isControlled ? open : undefined}
				onOpenChange={handleOpenChange}
			>
				{children}
			</DropdownMenu.Root>
		</MenuProvider>
	);
}
Menu.displayName = "Menu";

// ─── MenuTrigger ──────────────────────────────────────────────────────────────

/**
 * The trigger element that opens/closes the Menu.
 *
 * Use `asChild` to merge trigger behavior with your own element (e.g. a Button or IconButton).
 */
export const MenuTrigger = React.forwardRef<
	React.ComponentRef<typeof DropdownMenu.Trigger>,
	MenuTriggerProps & React.ComponentPropsWithoutRef<typeof DropdownMenu.Trigger>
>(({ children, asChild = true, ...props }, ref) => (
	<DropdownMenu.Trigger ref={ref} asChild={asChild} {...props}>
		{children}
	</DropdownMenu.Trigger>
));
MenuTrigger.displayName = "MenuTrigger";

// ─── MenuContent (popup panel) ────────────────────────────────────────────────

/**
 * The popup container for the menu's contents.
 *
 * Renders into a portal. Uses Radix `forceMount` + Framer Motion `AnimatePresence`
 * so the exit animation (scale + opacity via FastEffects) plays before the portal
 * unmounts. The `open` state is read from `MenuContext`.
 *
 * Transform-origin is automatically set via the Radix CSS variable
 * `--radix-dropdown-menu-content-transform-origin`.
 *
 * @param hasOverflow - Set true when using SubMenu to prevent clipping
 */
export const MenuContent = React.forwardRef<
	React.ComponentRef<typeof DropdownMenu.Content>,
	MenuContentProps &
		Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>, "asChild">
>(
	(
		{
			children,
			sideOffset = 6,
			side = "bottom",
			align = "start",
			hasOverflow = false,
			colorVariant: propColorVariant,
			className,
			...props
		},
		ref,
	) => {
		// Read open state from context to drive AnimatePresence
		const { open, colorVariant: contextColorVariant } = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;
		const colors = colorVariant === "vibrant" ? VIBRANT_COLORS : STANDARD_COLORS;

		return (
			<DropdownMenu.Portal>
				{/* forceMount keeps the portal in the DOM so the exit animation can play */}
				<DropdownMenu.Content
					ref={ref}
					sideOffset={sideOffset}
					side={side}
					align={align}
					asChild
					forceMount
					{...props}
				>
					<AnimatePresence>
						{open && (
							<m.div
								className={cn(
									"z-50 flex flex-col",
									// Width constraints (112dp min, 280dp max)
									MENU_MIN_WIDTH,
									MENU_MAX_WIDTH,
									// Vertical padding: 8dp (MenuTokens.ContainerVerticalPadding)
									MENU_POPUP_PADDING_Y,
									// Gap between MenuGroups: 2dp (SegmentedMenuTokens.SegmentedGap)
									MENU_GROUP_GAP,
									// Container background
									colors.containerBg,
									// Container shape: CornerExtraSmall (4px) — MenuTokens.ContainerShape
									MENU_CONTAINER_SHAPE,
									// MD3 Elevation-2 shadow
									"elevation-2",
									// Overflow clip (disable when hasOverflow=true for SubMenus)
									hasOverflow ? "overflow-visible" : "overflow-hidden",
									// Remove Radix outline
									"outline-none",
									className,
								)}
								variants={MENU_CONTAINER_VARIANTS}
								initial="hidden"
								animate="visible"
								exit="exit"
								style={{
									// Radix sets this CSS variable to the correct anchor-relative origin
									transformOrigin:
										"var(--radix-dropdown-menu-content-transform-origin)",
								}}
							>
								{children}
							</m.div>
						)}
					</AnimatePresence>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		);
	},
);
MenuContent.displayName = "MenuContent";
