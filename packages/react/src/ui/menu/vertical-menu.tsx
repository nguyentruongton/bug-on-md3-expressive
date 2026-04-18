// ─── MD3 Expressive Menu — Vertical Menu (always-visible static variant) ──────
// Spec: SegmentedMenuTokens + MenuDefaults — two sub-variants:
//   • Gap     → gap-0.5 (2dp) between groups, no divider line
//   • Divider → outline-variant <hr> between groups
//
// Key difference from Menu (baseline):
//   • No portal, no popup animation, no trigger
//   • Always rendered (static)
//   • Shape morphing on hover works identically (reuses MenuGroup)
//   • Still provides MenuContext with isStatic=true so MenuItems know to use Slot
import * as React from "react";
import { cn } from "../../lib/utils";
import { MenuProvider, useMenuContext } from "./menu-context";
import { MenuGroup } from "./menu-group";
import {
	MENU_GROUP_GAP,
	MENU_MAX_WIDTH,
	MENU_MIN_WIDTH,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";
import type {
	MenuGroupProps,
	VerticalMenuContentProps,
	VerticalMenuDividerProps,
	VerticalMenuProps,
} from "./menu-types";

// ─── VerticalMenuDivider ──────────────────────────────────────────────────────

/**
 * A plain horizontal divider for use between groups in a VerticalMenuContent
 * with `separatorStyle="divider"`.
 *
 * Uses the same visual spec as MenuDivider (outline-variant color, 12dp
 * horizontal padding, 2dp vertical padding) but is a plain `<hr>` — no Radix
 * dependency, safe inside static (non-popup) contexts.
 *
 * @example
 * <VerticalMenuContent separatorStyle="divider">
 *   <VerticalMenuGroup>...</VerticalMenuGroup>
 *   <VerticalMenuDivider />
 *   <VerticalMenuGroup>...</VerticalMenuGroup>
 * </VerticalMenuContent>
 */
export const VerticalMenuDivider = React.forwardRef<
	HTMLHRElement,
	VerticalMenuDividerProps & React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
	<hr
		ref={ref}
		className={cn(
			// HorizontalDividerPadding: horizontal=12dp, vertical=2dp
			"mx-3 my-0.5",
			// 1px height, no default border
			"h-px border-0",
			// Source: MenuDefaults.HorizontalDividerPadding / outline-variant
			"bg-m3-outline-variant",
			className,
		)}
		{...props}
	/>
));
VerticalMenuDivider.displayName = "VerticalMenuDivider";

// ─── VerticalMenuGroup ────────────────────────────────────────────────────────

/**
 * A group within a VerticalMenu.
 *
 * Functionally identical to `MenuGroup` — shape morphing on hover, auto-injected
 * `itemPosition` into MenuItem children, `colorVariant` from context.
 *
 * This component is a named re-export of `MenuGroup` so consumers of Vertical
 * Menu have a semantically clear API without any code duplication.
 */
export const VerticalMenuGroup = MenuGroup;

// ─── VerticalMenuContent ──────────────────────────────────────────────────────

/**
 * Renders a vertical list of VerticalMenuGroup children.
 *
 * Handles two separation styles:
 * - `gap`     → 2dp (`gap-0.5`) visual gap between groups (default)
 * - `divider` → auto-inserts a `VerticalMenuDivider` between each pair of groups
 *
 * Auto-injects `index` and `count` props into VerticalMenuGroup children so
 * that position-based shape morphing (leading/middle/trailing) works correctly.
 *
 * @example
 * // Gap variant (default)
 * <VerticalMenuContent separatorStyle="gap">
 *   <VerticalMenuGroup>...</VerticalMenuGroup>
 *   <VerticalMenuGroup>...</VerticalMenuGroup>
 * </VerticalMenuContent>
 *
 * @example
 * // Divider variant
 * <VerticalMenuContent separatorStyle="divider">
 *   <VerticalMenuGroup>...</VerticalMenuGroup>
 *   <VerticalMenuGroup>...</VerticalMenuGroup>
 * </VerticalMenuContent>
 */
export const VerticalMenuContent = React.forwardRef<
	HTMLDivElement,
	VerticalMenuContentProps & React.HTMLAttributes<HTMLDivElement>
>(
	(
		{
			children,
			separatorStyle = "gap",
			colorVariant: propColorVariant,
			className,
			...props
		},
		ref,
	) => {
		const { colorVariant: contextColorVariant } = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;
		const colors =
			colorVariant === "vibrant" ? VIBRANT_COLORS : STANDARD_COLORS;

		// Collect only valid VerticalMenuGroup-like elements for index/count injection
		const validChildren = React.Children.toArray(children).filter(
			React.isValidElement,
		);
		const groupCount = validChildren.length;

		// Auto-inject `index` and `count` into each child (enables leading/middle/trailing shape)
		const enhancedChildren = validChildren.map((child, i) =>
			React.cloneElement(child as React.ReactElement<MenuGroupProps>, {
				index: i,
				count: groupCount,
				isGapVariant: separatorStyle === "gap",
			}),
		);

		// For divider style: interleave VerticalMenuDivider between each group
		const renderedChildren =
			separatorStyle === "divider"
				? enhancedChildren.reduce<React.ReactNode[]>((acc, child, i) => {
						if (i > 0) {
							acc.push(
								<VerticalMenuDivider
									key={`divider-${(child as React.ReactElement).key || i}`}
								/>,
							);
						}
						acc.push(child);
						return acc;
					}, [])
				: enhancedChildren;

		return (
			<div
				ref={ref}
				className={cn(
					"flex flex-col w-full h-full",
					// Gap variant: 2dp gap + transparent background
					// Divider variant: solid background behind all groups
					separatorStyle === "gap" ? MENU_GROUP_GAP : colors.containerBg,
					className,
				)}
				{...props}
			>
				{renderedChildren}
			</div>
		);
	},
);
VerticalMenuContent.displayName = "VerticalMenuContent";

// ─── VerticalMenu (Root) ──────────────────────────────────────────────────────

/**
 * Root of an always-visible vertical menu.
 *
 * Wraps children in `MenuProvider` (always `open={true}`) so MenuItem and
 * MenuGroup components receive the correct `colorVariant` from context.
 *
 * Unlike the popup `Menu` component, there is no Radix DropdownMenu, no portal,
 * and no enter/exit animation — the list is statically rendered at all times.
 *
 * Shape morphing on hover works identically to the popup menu via `VerticalMenuGroup`
 * (which re-exports `MenuGroup`).
 *
 * @example
 * // Vertical Menu with Gap
 * <VerticalMenu colorVariant="standard">
 *   <VerticalMenuContent separatorStyle="gap">
 *     <VerticalMenuGroup>
 *       <MenuItem leadingIcon={<Icon name="visibility" size={20} />}>Item 1</MenuItem>
 *       <MenuItem leadingIcon={<Icon name="content_copy" size={20} />} trailingText="⌘C">Item 2</MenuItem>
 *       <MenuItem selected leadingIcon={<Icon name="edit" size={20} />}>Item 3</MenuItem>
 *     </VerticalMenuGroup>
 *     <VerticalMenuGroup>
 *       <MenuItem trailingIcon={<Icon name="chevron_right" size={20} />}>Item 4</MenuItem>
 *     </VerticalMenuGroup>
 *   </VerticalMenuContent>
 * </VerticalMenu>
 *
 * @example
 * // Vertical Menu with Divider
 * <VerticalMenu colorVariant="standard">
 *   <VerticalMenuContent separatorStyle="divider">
 *     <VerticalMenuGroup>...</VerticalMenuGroup>
 *     <VerticalMenuGroup>...</VerticalMenuGroup>
 *   </VerticalMenuContent>
 * </VerticalMenu>
 */
export const VerticalMenu = React.forwardRef<
	HTMLDivElement,
	VerticalMenuProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, colorVariant = "standard", className, ...props }, ref) => {
	// Vertical menus are always visible — `open` is a permanent true.
	// onOpenChange is a no-op (no controlled/uncontrolled toggle needed).
	const noop = React.useCallback(() => {}, []);

	const colors = colorVariant === "vibrant" ? VIBRANT_COLORS : STANDARD_COLORS;

	return (
		<MenuProvider
			colorVariant={colorVariant}
			open={true}
			onOpenChange={noop}
			isStatic={true}
		>
			<div
				ref={ref}
				className={cn(
					// Width constraints: 112dp min, 280dp max (MenuTokens)
					MENU_MIN_WIDTH,
					MENU_MAX_WIDTH,
					"flex flex-col",
					// Outer card shape: CornerLarge (16px) — matches the leading group's top corners.
					// overflow-hidden is REQUIRED to carve the 16px curve across any inner children.
					"rounded-2xl",
					"overflow-hidden",
					// NO containerBg here!
					// The gap variant must be transparent so the page background shows through the gaps.
					// The divider variant will apply the background inside VerticalMenuContent.
					// MD3 Elevation-2 shadow (cast by this outer boundary)
					"elevation-2",
					// Remove outline
					"outline-none",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</MenuProvider>
	);
});
VerticalMenu.displayName = "VerticalMenu";
