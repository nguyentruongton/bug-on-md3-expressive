// ─── MD3 Expressive Menu — Root (Menu, MenuTrigger, MenuContent) ─────────────
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { MENU_CONTAINER_VARIANTS } from "./menu-animations";
import { MenuProvider, useMenuContext } from "./menu-context";
import {
	BASELINE_COLORS,
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
	MenuGroupProps,
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
	variant,
	menuVariant,
	colorVariant = "standard",
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	defaultOpen,
	...props
}: MenuProps &
	Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu.Root>, "children">) {
	// Support deprecated menuVariant prop
	const resolvedVariant = variant ?? menuVariant ?? "baseline";

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
		<MenuProvider
			variant={resolvedVariant}
			colorVariant={colorVariant}
			open={open}
			onOpenChange={handleOpenChange}
		>
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
			separatorStyle = "gap",
			className,
			...props
		},
		ref,
	) => {
		const {
			open,
			variant,
			colorVariant: contextColorVariant,
		} = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;

		// Baseline always uses baseline colors; expressive uses colorVariant
		const colors =
			variant === "baseline"
				? BASELINE_COLORS
				: colorVariant === "vibrant"
					? VIBRANT_COLORS
					: STANDARD_COLORS;

		const isExpressiveGap =
			variant === "expressive" && separatorStyle === "gap";

		// Expressive variant: large rounded container with elevation (unless gap variant)
		// Baseline variant: CornerExtraSmall (4px) container
		const containerClassName =
			variant === "expressive"
				? cn(
						"z-50 flex flex-col",
						MENU_MIN_WIDTH,
						MENU_MAX_WIDTH,
						isExpressiveGap ? MENU_GROUP_GAP : "",
						isExpressiveGap ? "bg-transparent" : colors.containerBg,
						isExpressiveGap ? "" : "rounded-2xl",
						isExpressiveGap ? "" : "elevation-2",
						hasOverflow || isExpressiveGap
							? "overflow-visible"
							: "overflow-hidden",
						"outline-none",
						className,
					)
				: cn(
						"z-50 flex flex-col",
						MENU_MIN_WIDTH,
						MENU_MAX_WIDTH,
						MENU_POPUP_PADDING_Y,
						MENU_GROUP_GAP,
						colors.containerBg,
						MENU_CONTAINER_SHAPE,
						"elevation-2",
						hasOverflow ? "overflow-visible" : "overflow-hidden",
						"outline-none",
						className,
					);

		// Helper to recursively flatten fragments
		const flattenChildren = (nodes: React.ReactNode): React.ReactElement[] => {
			return React.Children.toArray(nodes).reduce(
				(acc: React.ReactElement[], child) => {
					if (React.isValidElement(child)) {
						if (child.type === React.Fragment) {
							return acc.concat(
								flattenChildren(
									(child as React.ReactElement<{ children?: React.ReactNode }>)
										.props.children,
								),
							);
						}
						acc.push(child as React.ReactElement);
					}
					return acc;
				},
				[],
			);
		};

		let renderedChildren: React.ReactNode = children;

		if (variant === "expressive") {
			const validChildren = flattenChildren(children);
			const groupCount = validChildren.length;

			const enhancedChildren = validChildren.map((child, i) =>
				React.cloneElement(child as React.ReactElement<MenuGroupProps>, {
					index: i,
					count: groupCount,
					isGapVariant: isExpressiveGap,
				}),
			);

			renderedChildren =
				separatorStyle === "divider"
					? enhancedChildren.reduce<React.ReactNode[]>((acc, child, i) => {
							if (i > 0) {
								acc.push(
									<hr
										key={`divider-${(child as React.ReactElement).key || i}`}
										className={cn(
											"mx-3 my-0.5 h-px border-0 bg-m3-outline-variant",
										)}
									/>,
								);
							}
							acc.push(child);
							return acc;
						}, [])
					: enhancedChildren;
		}

		return (
			<AnimatePresence>
				{open && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.Content
							ref={ref}
							sideOffset={sideOffset}
							side={side}
							align={align}
							asChild
							forceMount
							{...props}
						>
							<m.div
								role="menu"
								aria-orientation="vertical"
								className={containerClassName}
								variants={MENU_CONTAINER_VARIANTS}
								initial="hidden"
								animate="visible"
								exit="exit"
								style={{
									...(props.style as React.CSSProperties),
									transformOrigin:
										"var(--radix-dropdown-menu-content-transform-origin)",
								}}
							>
								{renderedChildren}
							</m.div>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				)}
			</AnimatePresence>
		);
	},
);
MenuContent.displayName = "MenuContent";
