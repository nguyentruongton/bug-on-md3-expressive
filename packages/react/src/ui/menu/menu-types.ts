// ─── MD3 Expressive Menu — Type Definitions ───────────────────────────────────
// Sourced from: StandardMenuTokens.kt, VibrantMenuTokens.kt, SegmentedMenuTokens.kt, MenuDefaults.kt

import type * as React from "react";

/** Color variant of the menu — standard (surface-based) or vibrant (tertiary-based). */
export type MenuColorVariant = "standard" | "vibrant";

/**
 * Position of a MenuItem within its group or menu.
 * Controls the shape morphing (border-radius) applied to each item.
 *
 * - `leading`    → first item: top corners rounded more (CornerMedium top, CornerExtraSmall bottom)
 * - `middle`     → middle items: CornerExtraSmall all corners
 * - `trailing`   → last item: bottom corners rounded more (CornerExtraSmall top, CornerMedium bottom)
 * - `standalone` → only item in group: CornerExtraSmall (same as middle, but semantically distinct)
 */
export type MenuItemPosition = "standalone" | "leading" | "middle" | "trailing";

/**
 * Position of a MenuGroup within the popup container.
 * Controls the container's border-radius shape morphing.
 */
export type MenuGroupPosition = "standalone" | "leading" | "middle" | "trailing";

// ─── Menu Root ────────────────────────────────────────────────────────────────

export interface MenuProps {
	/** Menu items and groups */
	children: React.ReactNode;
	/**
	 * Color variant of the menu.
	 * - `standard`: surface-container-low background (default)
	 * - `vibrant`: tertiary-container background (use sparingly, high emphasis)
	 */
	colorVariant?: MenuColorVariant;
	/**
	 * Controlled open state. When provided, the menu acts as a controlled component.
	 * Pair with `onOpenChange` to manage state externally.
	 */
	open?: boolean;
	/**
	 * Called when the menu's open state changes (both controlled and uncontrolled).
	 * Required when using `open` for controlled mode.
	 */
	onOpenChange?: (open: boolean) => void;
	/** Additional className for the root RadixDropdown.Root */
	className?: string;
}

// ─── Menu Trigger ─────────────────────────────────────────────────────────────

export interface MenuTriggerProps {
	children: React.ReactNode;
	/** If true, merges props with the child element instead of wrapping */
	asChild?: boolean;
	className?: string;
}

// ─── Menu Content (popup panel) ───────────────────────────────────────────────

export interface MenuContentProps {
	children: React.ReactNode;
	/** Gap between menu and anchor in pixels. Default: 6 */
	sideOffset?: number;
	/** Preferred side of the anchor to render the menu. */
	side?: "top" | "bottom" | "left" | "right";
	/** Preferred alignment relative to the anchor. */
	align?: "start" | "center" | "end";
	/**
	 * When true, disables overflow-hidden on the container so nested SubMenus
	 * can escape the bounds. Required when using SubMenu.
	 */
	hasOverflow?: boolean;
	/** Override colorVariant from MenuContext */
	colorVariant?: MenuColorVariant;
	className?: string;
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

export interface MenuItemProps {
	/** Primary label text of the item */
	children: React.ReactNode;
	/** Callback when the item is clicked */
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	/**
	 * Optional leading icon (20dp).
	 * For unselected state in selectable items; replaced by check icon when selected.
	 */
	leadingIcon?: React.ReactNode;
	/** Optional trailing icon (20dp) or chevron for submenus */
	trailingIcon?: React.ReactNode;
	/** Supporting text below the primary label (body-medium) */
	supportingText?: React.ReactNode;
	/** Trailing keyboard shortcut text e.g. "Ctrl+C", "⌘C" */
	trailingText?: string;
	/**
	 * Whether this item is selected/checked.
	 * When true: shows check icon (leading slot) and applies selected container color.
	 * Overrides itemPosition shape with `rounded-m3-md`.
	 */
	selected?: boolean;
	/** Whether this item is disabled */
	disabled?: boolean;
	/**
	 * Controls shape morphing based on position within its group.
	 * Automatically injected by MenuGroup via React.cloneElement when grouping is used.
	 */
	itemPosition?: MenuItemPosition;
	/** Override colorVariant from MenuContext */
	colorVariant?: MenuColorVariant;
	/** If true, keeps the menu open after clicking (e.g. for multi-select items) */
	keepOpen?: boolean;
	className?: string;
	/** Optional value for radio items. Required when role='menuitemradio'. */
	value?: string;
	/** Internal flag used by SubMenu to render this item as a SubTrigger primitive. */
	isSubTrigger?: boolean;
	/** ARIA role override. Defaults to 'menuitem', 'menuitemcheckbox', or 'menuitemradio' based on selected prop. */
	role?: string;
}

// ─── MenuGroup ────────────────────────────────────────────────────────────────

export interface MenuGroupProps {
	/** MenuItem children — itemPosition is auto-injected */
	children: React.ReactNode;
	/**
	 * Optional label displayed at the top of the group.
	 * Uses labelLarge typography with 12dp horizontal padding.
	 */
	label?: string;
	/**
	 * Zero-based index of this group in the parent menu.
	 * Used to determine shape (leading/middle/trailing/standalone).
	 * Auto-provided when using MenuContent's grouping utilities.
	 */
	index?: number;
	/**
	 * Total number of groups in the parent menu.
	 * Used together with index to determine shape.
	 */
	count?: number;
	/** Override colorVariant from MenuContext */
	colorVariant?: MenuColorVariant;
	/** Internal flag: true if rendered inside a gap-variant vertical menu (to adjust padding) */
	isGapVariant?: boolean;
	className?: string;
}

// ─── MenuDivider ──────────────────────────────────────────────────────────────

export interface MenuDividerProps {
	className?: string;
}

// ─── SubMenu ──────────────────────────────────────────────────────────────────

export interface SubMenuProps {
	/** The SubMenu children (another MenuContent) */
	children: React.ReactNode;
	/** The trigger element (typically a MenuItem with trailing chevron) */
	trigger: React.ReactNode;
	/** Preferred side to open the submenu. Default: 'right' */
	side?: "left" | "right";
	/** Override colorVariant from MenuContext */
	colorVariant?: MenuColorVariant;
	/** Delay in ms before submenu opens on hover. Default: 200 */
	hoverOpenDelay?: number;
	/** Delay in ms before submenu closes on pointer-leave. Default: 300 */
	hoverCloseDelay?: number;
}

// ─── Vertical Menu ────────────────────────────────────────────────────────────

/**
 * How groups within a VerticalMenuContent are separated.
 * - `gap`     → 2dp gap between groups (SegmentedMenuTokens.SegmentedGap)
 * - `divider` → outline-variant horizontal rule between groups (MenuDefaults.HorizontalDividerPadding)
 */
export type VerticalMenuSeparatorStyle = "gap" | "divider";

/**
 * Root of an always-visible vertical menu (no trigger, no popup).
 * Provides `MenuContext` with `colorVariant` to all descendants.
 */
export interface VerticalMenuProps {
	children: React.ReactNode;
	/**
	 * Color variant of the menu.
	 * - `standard`: surface-container-low background (default)
	 * - `vibrant`: tertiary-container background
	 */
	colorVariant?: MenuColorVariant;
	className?: string;
}

/**
 * Container that renders VerticalMenuGroup children in a vertical list.
 * Handles separator injection (gap or divider) and auto-injects `index`/`count` into groups.
 */
export interface VerticalMenuContentProps {
	children: React.ReactNode;
	/**
	 * Separation style between groups.
	 * - `gap`     → 2dp visual gap (default, matches MD3 Expressive spec image 1 left)
	 * - `divider` → horizontal `outline-variant` rule (matches MD3 Expressive spec image 1 right)
	 */
	separatorStyle?: VerticalMenuSeparatorStyle;
	/** Override colorVariant from VerticalMenu root */
	colorVariant?: MenuColorVariant;
	className?: string;
}

/** A group within a VerticalMenu. Alias of MenuGroupProps. */
export interface VerticalMenuGroupProps extends MenuGroupProps {}

/** A plain horizontal divider for use between groups in a VerticalMenuContent with `separatorStyle="divider"`. */
export interface VerticalMenuDividerProps {
	className?: string;
}
