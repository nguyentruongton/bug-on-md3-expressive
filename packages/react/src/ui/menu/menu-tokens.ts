// ─── MD3 Expressive Menu — Design Token Constants ─────────────────────────────
// Sourced from: SegmentedMenuTokens.kt, StandardMenuTokens.kt, VibrantMenuTokens.kt,
//               MenuTokens.kt, MenuDefaults.kt, ListTokens.kt

// ─── Spacing (px → dp) ────────────────────────────────────────────────────────

/** Horizontal padding for menu items: 16dp (ItemLeadingSpace / ItemTrailingSpace) */
export const MENU_ITEM_HORIZONTAL_PADDING = "px-4"; // 16dp

/** Min height for selectable items: 44dp (SegmentedMenuTokens.Item) */
export const MENU_ITEM_MIN_HEIGHT = "min-h-11"; // 44dp = 11 * 4px

/** Min height for standard list items: 48dp (MenuListItemContainerHeight) */
export const MENU_LIST_ITEM_MIN_HEIGHT = "min-h-12"; // 48dp

/** Min width of menu container: 112dp (DropdownMenuItemDefaultMinWidth) */
export const MENU_MIN_WIDTH = "min-w-28"; // 112dp

/** Max width of menu container: 280dp (DropdownMenuItemDefaultMaxWidth) */
export const MENU_MAX_WIDTH = "max-w-[280px]";

/** Gap between MenuGroup segments: 2dp (SegmentedMenuTokens.SegmentedGap) */
export const MENU_GROUP_GAP = "gap-0.5"; // 2dp

/** Internal group vertical padding: 4dp (DropdownMenuGroupVerticalPadding) */
export const MENU_GROUP_PADDING_Y = "py-1"; // 4dp

/** Popup container vertical padding: 8dp (DropdownMenuVerticalPadding) */
export const MENU_POPUP_PADDING_Y = "py-2"; // 8dp

/** Leading icon size: 20dp (SegmentedMenuTokens.ItemLeadingIconSize) */
export const MENU_ICON_SIZE = 20;

// ─── Container Shape ──────────────────────────────────────────────────────────

/**
 * Menu popup container shape: CornerExtraSmall = 4px.
 * Source: MenuTokens.ContainerShape = ShapeKeyTokens.CornerExtraSmall
 */
export const MENU_CONTAINER_SHAPE = "rounded-[4px]"; // CornerExtraSmall

// ─── Shape: CSS border-radius values (used with motion/react `animate`) ────────
// These are used for animated shape morphing via Framer Motion's `borderRadius`
// property — NOT as Tailwind classes (Tailwind cannot animate between values).

/**
 * Shape values for MenuGroup container (borderRadius CSS shorthand string).
 * Format: "topLeft topRight bottomRight bottomLeft"
 *
 * Source: MenuDefaults.kt groupShape() + SegmentedMenuTokens/ShapeTokens
 * - ContainerShape (standalone) = CornerLarge (16px) all corners
 * - InactiveContainerShape = CornerSmall (8px) all corners
 * - Leading group: topStart=CornerLarge, topEnd=CornerLarge, bottomStart=CornerSmall, bottomEnd=CornerSmall
 * - Middle group: GroupShape = CornerSmall (8px)
 * - Trailing group: topStart=CornerSmall, topEnd=CornerSmall, bottomStart=CornerLarge, bottomEnd=CornerLarge
 */
export const GROUP_SHAPES = {
	/** Active standalone group shape: CornerLarge all corners (16px) */
	standaloneActive: "16px",
	/**
	 * Active leading group shape: top=CornerLarge(16px), bottom=CornerExtraSmall(4px)
	 * Source: SegmentedMenuTokens — bottom corners use CornerExtraSmall to create
	 * a sharp boundary toward the 2dp gap, reinforcing the segmented structure.
	 */
	leadingActive: "16px 16px 4px 4px",
	/** Active middle group shape: CornerExtraSmall all corners (4px) */
	middleActive: "4px",
	/**
	 * Active trailing group shape: top=CornerSmall(8px), bottom=CornerMedium(12px)
	 * Source: SegmentedMenuTokens — bottom corners use CornerMedium(12px) not CornerLarge(16px).
	 */
	trailingActive: "8px 8px 12px 12px",
	/** Inactive (default, pre-hover) shape for all groups: CornerExtraSmall (4px) */
	inactive: "4px",
} as const;

/**
 * Shape values for MenuItem (borderRadius CSS shorthand string).
 * Used as Tailwind classes via arbitrary values for static rendering.
 * Animated shape (selected ↔ unselected) is handled via `transition-[border-radius]`.
 *
 * Source: MenuDefaults.kt itemShape() + SegmentedMenuTokens/ShapeTokens
 * - leading item: topStart/topEnd=CornerMedium(12px), bottomStart/bottomEnd=CornerExtraSmall(4px)
 * - middle item: CornerExtraSmall all (ItemShape = 4px)
 * - trailing item: topStart/topEnd=CornerExtraSmall(4px), bottomStart/bottomEnd=CornerMedium(12px)
 * - standalone item: same as middle (ItemShape = 4px)
 * - selected (all positions): CornerMedium all (ItemSelectedShape = 12px)
 */
export const ITEM_SHAPE_CLASSES = {
	leading: "rounded-t-[12px] rounded-b-[4px]",
	middle: "rounded-[4px]",
	trailing: "rounded-t-[4px] rounded-b-[12px]",
	standalone: "rounded-[4px]",
	selected: "rounded-[12px]",
} as const;

// ─── Color token Tailwind classes ─────────────────────────────────────────────

/**
 * Standard color variant tokens (SurfaceContainerLow-based).
 * Source: StandardMenuTokens.kt
 *
 * Container: SurfaceContainerLow
 * Text: OnSurface
 * Icons: OnSurfaceVariant
 * Selected container: TertiaryContainer
 * Selected text/icons: OnTertiaryContainer
 */
export const STANDARD_COLORS = {
	/** Group/popup container background (StandardMenuTokens.ContainerColor) */
	containerBg: "bg-m3-surface-container-low",
	/** Label text color (StandardMenuTokens.ItemLabelTextColor) */
	labelText: "text-m3-on-surface",
	/** Leading/trailing icon color (StandardMenuTokens.ItemLeadingIconColor) */
	iconColor: "text-m3-on-surface-variant",
	/** Supporting text below label (StandardMenuTokens.ItemSupportingTextColor) */
	supportingTextColor: "text-m3-on-surface-variant",
	/** Trailing supporting text (StandardMenuTokens.ItemTrailingSupportingTextColor) */
	trailingSupportingTextColor: "text-m3-on-surface-variant",
	/** Trailing icon color (StandardMenuTokens.ItemTrailingIconColor) */
	trailingIconColor: "text-m3-on-surface-variant",
	/** Hover state layer (OnSurface @ 8% opacity) */
	hoverLayer: "hover:bg-m3-on-surface/8",
	/** Focus state layer (OnSurface @ 12% opacity) */
	focusLayer: "focus:bg-m3-on-surface/12",
	/** Selected item background (StandardMenuTokens.ItemSelectedContainerColor) */
	selectedBg: "bg-m3-tertiary-container",
	/** Selected item text (StandardMenuTokens.ItemSelectedLabelTextColor) */
	selectedText: "text-m3-on-tertiary-container",
	/** Selected item icon (StandardMenuTokens.ItemSelectedLeadingIconColor) */
	selectedIcon: "text-m3-on-tertiary-container",
	/** Disabled opacity: 38% (StandardMenuTokens.ItemDisabledLabelTextOpacity) */
	disabledOpacity: "data-disabled:opacity-[0.38]",
} as const;

/**
 * Vibrant color variant tokens (TertiaryContainer-based).
 * Source: VibrantMenuTokens.kt
 *
 * Container: TertiaryContainer
 * Text: OnTertiaryContainer
 * Icons: OnTertiaryContainer
 * Selected container: Tertiary
 * Selected text/icons: OnTertiary
 */
export const VIBRANT_COLORS = {
	/** Group/popup container background (VibrantMenuTokens.ContainerColor) */
	containerBg: "bg-m3-tertiary-container",
	/** Label text color (VibrantMenuTokens.ItemLabelTextColor) */
	labelText: "text-m3-on-tertiary-container",
	/** Leading/trailing icon color (VibrantMenuTokens.ItemLeadingIconColor) */
	iconColor: "text-m3-on-tertiary-container",
	/** Supporting text below label (VibrantMenuTokens.ItemSupportingTextColor) */
	supportingTextColor: "text-m3-on-tertiary-container",
	/** Trailing supporting text (VibrantMenuTokens.ItemTrailingSupportingTextColor) */
	trailingSupportingTextColor: "text-m3-on-tertiary-container",
	/** Trailing icon color (VibrantMenuTokens.ItemTrailingIconColor) */
	trailingIconColor: "text-m3-on-tertiary-container",
	/** Hover state layer (OnTertiaryContainer @ 8% opacity) */
	hoverLayer: "hover:bg-m3-on-tertiary-container/8",
	/** Focus state layer (OnTertiaryContainer @ 12% opacity) */
	focusLayer: "focus:bg-m3-on-tertiary-container/12",
	/** Selected item background (VibrantMenuTokens.ItemSelectedContainerColor = Tertiary) */
	selectedBg: "bg-m3-tertiary",
	/** Selected item text (VibrantMenuTokens.ItemSelectedLabelTextColor = OnTertiary) */
	selectedText: "text-m3-on-tertiary",
	/** Selected item icon (VibrantMenuTokens.ItemSelectedLeadingIconColor = OnTertiary) */
	selectedIcon: "text-m3-on-tertiary",
	/** Disabled opacity: 38% (VibrantMenuTokens.ItemDisabledLabelTextOpacity) */
	disabledOpacity: "data-disabled:opacity-[0.38]",
} as const;

// ─── Divider ──────────────────────────────────────────────────────────────────

/**
 * HorizontalDivider padding: horizontal=12dp, vertical=2dp.
 * Source: MenuDefaults.HorizontalDividerPadding
 */
export const DIVIDER_PADDING = "mx-3 my-0.5"; // 12dp horizontal, 2dp vertical
export const DIVIDER_COLOR = "bg-m3-outline-variant";
