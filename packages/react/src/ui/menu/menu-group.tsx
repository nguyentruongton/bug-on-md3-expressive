// ─── MD3 Expressive Menu — MenuGroup ────────────────────────────────────────
// Gap-based grouping with shape morphing on hover (core Expressive feature)
import { m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { FAST_SPATIAL_SPRING } from "./menu-animations";

import { useMenuContext } from "./menu-context";
import {
	BASELINE_COLORS,
	GROUP_SHAPES,
	MENU_GROUP_PADDING_Y,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";
import type {
	MenuGroupPosition,
	MenuGroupProps,
	MenuItemPosition,
	MenuItemProps,
} from "./menu-types";

// Extend MenuGroupProps with data-* attributes for testing and aria- attributes
type MenuGroupDivProps = MenuGroupProps & {
	[key: `data-${string}`]: string | undefined;
	id?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
};

// ─── Position helper ──────────────────────────────────────────────────────────

function getGroupPosition(index: number, count: number): MenuGroupPosition {
	if (count === 1) return "standalone";
	if (index === 0) return "leading";
	if (index === count - 1) return "trailing";
	return "middle";
}

function getGroupActiveShape(position: MenuGroupPosition): string {
	return GROUP_SHAPES[
		`${position}Active` as keyof typeof GROUP_SHAPES
	] as string;
}

// ─── MenuGroup ────────────────────────────────────────────────────────────────

/**
 * A container that groups MenuItem elements with gap-based visual separation —
 * the defining feature of MD3 Expressive menus.
 *
 * Shape morphing: on hover, the container's border-radius transitions from the
 * "inactive" small shape to the "active" large shape via a FastSpatial spring.
 * The shape depends on the group's position (leading/middle/trailing/standalone).
 *
 * MenuItem children automatically receive `itemPosition` props based on their
 * index within the group.
 *
 * @example
 * <MenuContent>
 *   <MenuGroup>
 *     <MenuItem>Cut</MenuItem>
 *     <MenuItem>Copy</MenuItem>
 *     <MenuItem>Paste</MenuItem>
 *   </MenuGroup>
 *   <MenuGroup>
 *     <MenuItem>Select All</MenuItem>
 *   </MenuGroup>
 * </MenuContent>
 */
export const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupDivProps>(
	(
		{
			children,
			label,
			index = 0,
			count = 1,
			colorVariant: propColorVariant,
			isGapVariant,
			itemPosition,
			className,
			...rest
		},
		ref,
	) => {
		const {
			menuVariant,
			colorVariant: contextColorVariant,
			isStatic,
		} = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;
		const colors =
			menuVariant === "baseline"
				? BASELINE_COLORS
				: colorVariant === "vibrant"
					? VIBRANT_COLORS
					: STANDARD_COLORS;

		const position = getGroupPosition(index, count);
		const activeShape = getGroupActiveShape(position);

		const [isHovered, setIsHovered] = React.useState(false);
		const currentShape =
			isStatic || isHovered ? activeShape : GROUP_SHAPES.inactive;

		const handlePointerEnter = React.useCallback(() => setIsHovered(true), []);
		const handlePointerLeave = React.useCallback(() => setIsHovered(false), []);

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

		const validChildren = flattenChildren(children);
		const itemCount = validChildren.length;

		const enhancedChildren = validChildren.map((child, i) => {
			const itemPosition: MenuItemPosition =
				itemCount === 1
					? "standalone"
					: i === 0
						? "leading"
						: i === itemCount - 1
							? "trailing"
							: "middle";

			return React.cloneElement(child as React.ReactElement<MenuItemProps>, {
				itemPosition,
				colorVariant,
			});
		});

		return (
			<m.div
				ref={ref}
				role="group"
				aria-label={label}
				className={cn(
					"relative",
					// In baseline variant, MenuGroup is transparent so it shouldn't clip.
					// In expressive variant, it needs overflow-hidden to clip hover states to its morphing shape.
					menuVariant === "baseline" ? "" : "overflow-hidden",
					// Vertical padding: 2dp for gap variant (to match Figma), 4dp for baseline
					isGapVariant ? "py-0.5" : MENU_GROUP_PADDING_Y,
					// Horizontal padding: 4dp for expressive menus (both static and popup), 0 for baseline
					menuVariant === "expressive" ? "px-1" : "",
					// Gap variant has floating segments, so each group manages its own shadow
					isGapVariant ? "elevation-2" : "",
					// Background based on color variant (transparent for baseline to avoid double-layering)
					menuVariant === "baseline" ? "bg-transparent" : colors.containerBg,
					className,
				)}
				animate={{ borderRadius: currentShape }}
				transition={FAST_SPATIAL_SPRING}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				{...rest}
			>
				{/* Optional group label: labelSmall typography, 12dp horizontal padding */}
				{label && (
					<span
						className={cn(
							// Padding: 12dp top, 12dp horizontal, 8dp bottom (MD3 spec)
							"block pt-3 px-3 pb-2",
							"text-label-small",
							menuVariant === "baseline"
								? "text-m3-on-surface-variant"
								: colorVariant === "vibrant"
									? "text-m3-on-tertiary-container"
									: "text-m3-on-surface-variant",
						)}
					>
						{label}
					</span>
				)}
				{enhancedChildren}
			</m.div>
		);
	},
);
MenuGroup.displayName = "MenuGroup";
