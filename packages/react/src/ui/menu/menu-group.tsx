// ─── MD3 Expressive Menu — MenuGroup ────────────────────────────────────────
// Gap-based grouping with shape morphing on hover (core Expressive feature)
import { m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { GROUP_SHAPE_SPRING } from "./menu-animations";
import { useMenuContext } from "./menu-context";
import {
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
			className,
			...rest
		},
		ref,
	) => {
		const { colorVariant: contextColorVariant, isStatic } = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;
		const colors =
			colorVariant === "vibrant" ? VIBRANT_COLORS : STANDARD_COLORS;

		const position = getGroupPosition(index, count);
		const activeShape = getGroupActiveShape(position);

		// Track hover state for shape morphing
		const [isHovered, setIsHovered] = React.useState(false);
		// Once the group has been hovered, it stays at the "active" shape until pointer leaves
		const hasBeenHoveredRef = React.useRef(false);

		const currentShape =
			// Static (VerticalMenu): always show position-specific active shape.
			// Popup (Menu): inactive until hovered, then morph to active shape.
			isStatic || isHovered || hasBeenHoveredRef.current
				? activeShape
				: GROUP_SHAPES.inactive;

		function handlePointerEnter() {
			hasBeenHoveredRef.current = true;
			setIsHovered(true);
		}

		function handlePointerLeave() {
			setIsHovered(false);
			hasBeenHoveredRef.current = false;
		}

		// Auto-inject itemPosition and colorVariant into MenuItem children
		const validChildren = React.Children.toArray(children).filter(
			React.isValidElement,
		);
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
					"relative overflow-hidden",
					// Vertical padding: 2dp for gap variant (to match Figma), 4dp for baseline
					isGapVariant ? "py-0.5" : MENU_GROUP_PADDING_Y,
					// Background based on color variant
					colors.containerBg,
					className,
				)}
				animate={{ borderRadius: currentShape }}
				transition={GROUP_SHAPE_SPRING}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				{...rest}
			>
				{/* Optional group label: labelLarge, 12dp horizontal padding */}
				{label && (
					<span
						className={cn(
							"block px-3 py-1.5",
							"text-label-large font-medium",
							colorVariant === "vibrant"
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
