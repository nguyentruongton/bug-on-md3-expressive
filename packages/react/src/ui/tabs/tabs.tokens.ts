/**
 * @file tabs.tokens.ts
 * MD3 Expressive Tabs — Design tokens ported from:
 *   - PrimaryNavigationTabTokens.kt (v0_162)
 *   - SecondaryNavigationTabTokens.kt (v0_162)
 *
 * All dimensional values are in px (dp equivalent for web).
 * @see docs/m3/tabs/PrimaryNavigationTabTokens.kt
 * @see docs/m3/tabs/SecondaryNavigationTabTokens.kt
 */

/**
 * Dimensional design tokens for the MD3 Tabs component.
 *
 * Maps directly from the `.kt` token files to CSS/JS values.
 * Use as the single source of truth for sizing.
 */
export const TabsTokens = {
	// ── Container ─────────────────────────────────────────────────────────────
	/** ContainerHeight = 48dp (text-only tab) */
	containerHeight: 48,
	/** IconAndLabelTextContainerHeight = 64dp (tab with icon + label stacked) */
	containerHeightWithIcon: 64,

	// ── Indicator ─────────────────────────────────────────────────────────────
	/** ActiveIndicatorHeight (Primary) = 3dp */
	primaryIndicatorHeight: 3,
	/** ActiveIndicatorHeight (Secondary) = 2dp */
	secondaryIndicatorHeight: 2,
	/**
	 * ActiveIndicatorShape = 3dp top-left and top-right (per MD3 token, not a full pill).
	 * Google reference: `var(--_active-indicator-shape)` resolves to `3px 3px 0 0` effectively.
	 */
	indicatorBorderRadius: "3px 3px 0 0",

	// ── Icon ──────────────────────────────────────────────────────────────────
	/** IconSize = 24dp */
	iconSize: 24,

	// ── Scrollable layout ─────────────────────────────────────────────────────
	/**
	 * Edge start/end padding for scrollable mode = 52px.
	 * Per MD3 spec: tabs have padding on both leading and trailing edges.
	 */
	scrollableEdgePadding: 52,
	/** Minimum tab width in scrollable mode = 90px. */
	scrollableMinTabWidth: 90,

	// ── Divider (Secondary only) ───────────────────────────────────────────────
	/** DividerHeight = 1dp */
	dividerHeight: 1,

	// ── Focus ring ────────────────────────────────────────────────────────────
	/**
	 * Focus ring border-radius = 8px.
	 * Google reference: `focus-ring.theme({ shape: 8px })` in _tab.scss.
	 */
	focusRingBorderRadius: 8,
} as const;

// ── MD3 Color token references (CSS custom properties) ────────────────────────

/**
 * CSS custom property references for Tabs colors.
 * Maps to `--md-sys-color-*` tokens in the MD3 theme system.
 *
 * DO NOT hardcode hex values — use these references for automatic
 * light/dark theme adaptation.
 */
export const TabsColors = {
	// ── Primary variant ───────────────────────────────────────────────────────
	/** Primary: ActiveLabelTextColor / ActiveIconColor = Primary */
	primaryActiveText: "var(--md-sys-color-primary)",
	/** Primary: InactiveLabelTextColor / InactiveIconColor = OnSurfaceVariant */
	primaryInactiveText: "var(--md-sys-color-on-surface-variant)",
	/** Primary: ActiveIndicatorColor = Primary */
	primaryIndicator: "var(--md-sys-color-primary)",

	// ── Secondary variant ─────────────────────────────────────────────────────
	/** Secondary: ActiveLabelTextColor / ActiveIconColor = OnSurface */
	secondaryActiveText: "var(--md-sys-color-on-surface)",
	/** Secondary: InactiveLabelTextColor / InactiveIconColor = OnSurfaceVariant */
	secondaryInactiveText: "var(--md-sys-color-on-surface-variant)",
	/** Secondary: Indicator color = Primary (same as primary variant) */
	secondaryIndicator: "var(--md-sys-color-primary)",
	/** Secondary: DividerColor = SurfaceVariant */
	divider: "var(--md-sys-color-surface-variant)",

	// ── Shared ────────────────────────────────────────────────────────────────
	/** ContainerColor = Surface */
	container: "var(--md-sys-color-surface)",
	/** Focus ring indicator = Secondary */
	focusIndicator: "var(--md-sys-color-secondary)",

	// ── State overlays ────────────────────────────────────────────────────────
	/** Hover state layer (primary active) */
	primaryActiveHover: "var(--md-sys-color-primary)",
	/** Hover state layer (inactive, both variants) */
	inactiveHover: "var(--md-sys-color-on-surface)",
} as const;

// ── Animation constants ────────────────────────────────────────────────────────

/** Spring transition for the sliding indicator (FastSpatial equivalent). */
export const TABS_INDICATOR_SPRING = {
	type: "spring",
	stiffness: 500,
	damping: 40,
} as const;

/** Color transition for label/icon color animate (active ↔ inactive). */
export const TABS_COLOR_TRANSITION = {
	duration: 0.2,
	ease: "easeInOut",
} as const;

/** Content fade transition when switching tabs. */
export const TABS_CONTENT_TRANSITION = {
	duration: 0.15,
	ease: "easeInOut",
} as const;
