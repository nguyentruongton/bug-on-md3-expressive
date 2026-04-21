// ─── MD3 Expressive Menu — MenuItem ─────────────────────────────────────────
// Shape morphing + Standard/Vibrant color variants + selection state
// Animation: only selectable items animate the leading icon slot
import * as ContextMenu from "@radix-ui/react-context-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../icon";
import { CHECK_ICON_VARIANTS, MENU_CHECK_ICON_SIZE } from "./menu-animations";
import { useMenuContext } from "./menu-context";
import {
	BASELINE_COLORS,
	BASELINE_ITEM_SHAPE,
	ITEM_SHAPE_CLASSES,
	MENU_BASELINE_ITEM_HORIZONTAL_PADDING,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";
import type {
	MenuItemPosition,
	MenuItemProps,
	MenuVariant,
} from "./menu-types";

// ─── Shape helper ─────────────────────────────────────────────────────────────

function getItemShapeClass(
	position: MenuItemPosition,
	selected: boolean,
	isStatic: boolean = false,
	menuVariant: MenuVariant = "expressive",
): string {
	if (menuVariant === "baseline") return BASELINE_ITEM_SHAPE;
	if (selected) return ITEM_SHAPE_CLASSES.selected;
	// Vertical Menu standalone items have 12px border radius
	if (isStatic && position === "standalone") return "rounded-[12px]";
	return ITEM_SHAPE_CLASSES[position];
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

/**
 * An interactive item within a Menu or MenuGroup.
 *
 * ### Shape morphing
 * `itemPosition` (auto-set by MenuGroup) controls border-radius. When `selected=true`,
 * shape overrides to `CornerMedium (12px)` with a CSS transition.
 *
 * ### Leading icon animation
 * - **Selectable items** (`selected` prop defined): `AnimatePresence` swaps between
 *   a check icon and the user `leadingIcon` using FastSpatial expand + FastEffects fade.
 * - **Static items** (`selected` prop undefined): `leadingIcon` renders at fixed width
 *   with no enter/exit animation (matches Android's static rendering).
 *
 * ### Selected state
 * Container color transitions with `transition-colors duration-150` (maps to
 * Android's `animateColorAsState` with `FastEffects` spec).
 */
export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
	(
		{
			children,
			onClick,
			leadingIcon,
			trailingIcon,
			supportingText,
			trailingText,
			selected,
			disabled = false,
			itemPosition = "standalone",
			colorVariant: propColorVariant,
			keepOpen = false,
			className,
			isSubTrigger,
			value,
			role,
			...rest
		},
		ref,
	) => {
		const {
			menuVariant,
			colorVariant: contextColorVariant,
			menuPrimitive,
		} = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;
		const colors =
			menuVariant === "baseline"
				? BASELINE_COLORS
				: colorVariant === "vibrant"
					? VIBRANT_COLORS
					: STANDARD_COLORS;

		const isStaticMenu = menuPrimitive === "static";
		const shapeClass = getItemShapeClass(
			itemPosition,
			!!selected,
			isStaticMenu,
			menuVariant,
		);

		// A selectable item is one where `selected` prop is explicitly passed
		// (even if false). Non-selectable items do not animate the leading slot.
		const isSelectable = selected !== undefined && !isSubTrigger;

		// Determine which Radix primitive to use based on selection state and role
		const isCheckbox =
			role === "menuitemcheckbox" ||
			(selected !== undefined && !role && !isSubTrigger);
		const isRadio = role === "menuitemradio";

		// Select the correct Radix primitive based on which menu family is active.
		// static  → Slot (plain HTML, manages own ARIA)
		// context → @radix-ui/react-context-menu primitives
		// dropdown (default) → @radix-ui/react-dropdown-menu primitives
		const ItemPrimitive =
			isStaticMenu || isSubTrigger
				? Slot
				: menuPrimitive === "context"
					? ((isCheckbox
							? ContextMenu.CheckboxItem
							: isRadio
								? ContextMenu.RadioItem
								: ContextMenu.Item) as React.ElementType)
					: ((isCheckbox
							? DropdownMenu.CheckboxItem
							: isRadio
								? DropdownMenu.RadioItem
								: DropdownMenu.Item) as React.ElementType);

		return (
			<ItemPrimitive
				ref={ref}
				{...(isStaticMenu || isSubTrigger
					? {
							role:
								role ||
								(isCheckbox
									? "menuitemcheckbox"
									: isRadio
										? "menuitemradio"
										: "menuitem"),
							"aria-checked": isCheckbox || isRadio ? !!selected : undefined,
							"aria-disabled": disabled ? true : undefined,
							tabIndex: disabled ? -1 : 0,
							onKeyDown: (e: React.KeyboardEvent) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
								}
							},
							onClick,
						}
					: {
							disabled,
							onSelect: keepOpen ? (e: Event) => e.preventDefault() : undefined,
							onClick,
							...(isCheckbox || isRadio ? { checked: !!selected } : {}),
							...(isRadio ? { value: value ?? "" } : {}),
							asChild: true,
						})}
			>
				<div
					// Role provided by Radix primitives via asChild, or manually set when static
					className={cn(
						// Layout
						"relative flex w-full cursor-pointer select-none items-center outline-none",
						// Sizing: min-h 48dp, min-w 112dp, max-w 280dp
						"min-h-12 min-w-28 max-w-70",
						// Horizontal padding
						menuVariant === "baseline"
							? MENU_BASELINE_ITEM_HORIZONTAL_PADDING
							: "px-4",
						// Spacing between items
						isStaticMenu ? "my-0.5" : "",
						// Shape morphing (position-based + selected override)
						shapeClass,
						// Animate border-radius AND background-color together (FastEffects: 150ms)
						"transition-[border-radius,background-color] duration-150 ease-in",
						// Colors based on variant + selection
						selected
							? cn(colors.selectedBg, colors.selectedText)
							: cn(colors.labelText),
						// State layers (only on unselected items)
						!selected && colors.hoverLayer,
						!selected && colors.focusLayer,
						// Focus visible ring (WCAG 2.4.11 — visible focus indicator)
						// Uses ring-inset so the ring doesn't overflow the item bounds.
						"focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-m3-primary",
						// Disabled
						disabled && "pointer-events-none opacity-[0.38]",
						className,
					)}
					{...rest}
				>
					{/* ── Leading slot ── */}
					{(isSelectable || leadingIcon) && (
						<div
							className="flex h-5 w-5 shrink-0 items-center justify-center mr-3"
							aria-hidden="true"
						>
							{isSelectable ? (
								<AnimatePresence initial={false} mode="wait">
									{selected ? (
										<m.span
											key="check"
											className={cn(
												"flex h-full w-full items-center justify-center overflow-hidden",
												colors.selectedIcon,
											)}
											variants={CHECK_ICON_VARIANTS}
											initial="hidden"
											animate="visible"
											exit="exit"
										>
											<Icon name="check" fill={1} size={MENU_CHECK_ICON_SIZE} />
										</m.span>
									) : leadingIcon ? (
										<m.span
											key="icon"
											className={cn(
												"flex h-full w-full items-center justify-center overflow-hidden",
												colors.iconColor,
											)}
											variants={CHECK_ICON_VARIANTS}
											initial="hidden"
											animate="visible"
											exit="exit"
										>
											{leadingIcon}
										</m.span>
									) : (
										// Spacer for selectable items with no icon, to keep text aligned
										<div className="w-5" />
									)}
								</AnimatePresence>
							) : (
								// Static icon for non-selectable items
								<span
									className={cn(
										"flex h-full w-full items-center justify-center",
										colors.iconColor,
									)}
								>
									{leadingIcon}
								</span>
							)}
						</div>
					)}

					{/* ── Label + Supporting Text ── */}
					<span className="flex flex-1 flex-col">
						<span className="text-body-large leading-snug">{children}</span>
						{supportingText && (
							<span
								className={cn(
									"text-body-medium leading-snug",
									// Source: StandardMenuTokens.ItemSupportingTextColor / VibrantMenuTokens
									selected ? colors.selectedText : colors.supportingTextColor,
								)}
							>
								{supportingText}
							</span>
						)}
					</span>

					{/* ── Trailing: shortcut text OR trailing icon ── */}
					{(trailingText || trailingIcon) && (
						<span
							className={cn(
								// Minimum 12dp gap from label column (ListTokens)
								"ml-3 flex shrink-0 items-center",
								// Source: StandardMenuTokens.ItemTrailingIconColor / VibrantMenuTokens
								selected ? colors.selectedText : colors.trailingIconColor,
							)}
							aria-hidden={trailingIcon ? "true" : undefined}
						>
							{trailingText ? (
								<span className="text-label-small tracking-wider">
									{trailingText}
								</span>
							) : (
								trailingIcon
							)}
						</span>
					)}
				</div>
			</ItemPrimitive>
		);
	},
);
MenuItem.displayName = "MenuItem";
