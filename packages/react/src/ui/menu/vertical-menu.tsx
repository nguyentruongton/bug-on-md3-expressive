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
//
// Vertical Menu Gap architecture:
//   • Outer container: NO overflow-hidden (would clip group shape morphing!)
//     Instead, elevation shadow is applied here, bg is transparent.
//   • Each MenuGroup manages its own background + border-radius via Framer Motion.
//   • The 2dp gap between groups is transparent — page background shows through.
//
// Vertical Menu Divider architecture:
//   • Outer container applies containerBg + overflow-hidden + rounded-2xl
//     (groups inside all stay flush, no shape morph needed for divider variant).
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
	VerticalMenuSeparatorStyle,
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
>(({ className, index, count, isGapVariant, ...props }, ref) => (
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

		// Helper to recursively flatten fragments and collect valid elements.
		// This is necessary because cloneElement cannot be used on React.Fragment.
		const flattenChildren = (
			children: React.ReactNode,
		): React.ReactElement[] => {
			return React.Children.toArray(children).reduce(
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

		// Collect only valid VerticalMenuGroup-like elements for index/count injection
		const validChildren = flattenChildren(children);
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
					"flex flex-col w-full",
					// Gap variant: transparent background + 2dp gap — page bg shows through gaps.
					// Divider variant: solid container background behind all groups.
					separatorStyle === "gap"
						? cn("bg-transparent", MENU_GROUP_GAP)
						: colors.containerBg,
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
 * ### Shape morphing
 * For the **gap variant**, the outer container has NO `overflow-hidden` — this is
 * intentional! Each `VerticalMenuGroup` manages its own shape via Framer Motion's
 * `animate.borderRadius`. `overflow-hidden` on the parent would clip these
 * morphing corners. The 2dp transparent gap lets page background show through.
 *
 * For the **divider variant**, the outer container applies `overflow-hidden` +
 * `rounded-2xl` + background — groups sit flush inside without morphing.
 *
 * @example
 * // Vertical Menu with Gap (floating segments)
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

	// Internal ref for keyboard navigation — merged with forwarded ref.
	const containerRef = React.useRef<HTMLDivElement>(null);
	const mergedRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			(containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
				node;
			if (typeof ref === "function") ref(node);
			else if (ref)
				(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
		},
		[ref],
	);

	// Arrow key navigation: WAI-ARIA composite widget pattern.
	// Moves focus among menuitem elements, skipping disabled ones.
	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (!containerRef.current) return;
			const items = Array.from(
				containerRef.current.querySelectorAll<HTMLElement>(
					'[role="menuitem"]:not([aria-disabled="true"]):not([tabindex="-1"]),' +
						'[role="menuitemcheckbox"]:not([aria-disabled="true"]):not([tabindex="-1"]),' +
						'[role="menuitemradio"]:not([aria-disabled="true"]):not([tabindex="-1"])',
				),
			);
			if (!items.length) return;
			const idx = items.indexOf(document.activeElement as HTMLElement);
			let next: number | null = null;
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					next = idx < items.length - 1 ? idx + 1 : 0;
					break;
				case "ArrowUp":
					e.preventDefault();
					next = idx > 0 ? idx - 1 : items.length - 1;
					break;
				case "Home":
					e.preventDefault();
					next = 0;
					break;
				case "End":
					e.preventDefault();
					next = items.length - 1;
					break;
				default:
					return;
			}
			if (next !== null) items[next]?.focus();
		},
		[],
	);

	// Detect separator style from VerticalMenuContent child to decide container styling.
	const separatorStyle = detectSeparatorStyle(children);
	const isGapVariant = separatorStyle !== "divider";

	return (
		<MenuProvider
			variant="expressive"
			colorVariant={colorVariant}
			menuPrimitive="static"
			open={true}
			onOpenChange={noop}
		>
			<div
				ref={mergedRef}
				role="menu"
				aria-orientation="vertical"
				onKeyDown={handleKeyDown}
				className={cn(
					// Width constraints: 112dp min, 280dp max (MenuTokens)
					MENU_MIN_WIDTH,
					MENU_MAX_WIDTH,
					"flex flex-col",
					isGapVariant
						? [
								// GAP VARIANT: NO overflow-hidden — groups must morph freely.
								"outline-none",
								// NO background — transparent between segments.
								// NO rounded corners — each group manages its own shape.
								// Elevation is managed by each individual group.
							]
						: [
								// DIVIDER VARIANT: Container clips the content.
								"rounded-2xl",
								"overflow-hidden",
								colors.containerBg,
								"elevation-2",
								"outline-none",
							],
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

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Inspects the `separatorStyle` prop from the first VerticalMenuContent child.
 * Used by VerticalMenu root to decide container styling.
 */
function detectSeparatorStyle(
	children: React.ReactNode,
): VerticalMenuSeparatorStyle {
	const child = React.Children.toArray(children).find(React.isValidElement);
	if (child) {
		const style = (
			child.props as { separatorStyle?: VerticalMenuSeparatorStyle }
		).separatorStyle;
		if (style) return style;
	}
	return "gap";
}
