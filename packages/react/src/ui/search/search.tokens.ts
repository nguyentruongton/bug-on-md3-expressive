/**
 * @file search.tokens.ts
 * MD3 Expressive Search — Design tokens ported from:
 *   - SearchBarTokens.kt (v0_210)
 *   - SearchViewTokens.kt (v0_210)
 *
 * All dimensional values are in px (1dp = 1px on web).
 * Colors reference CSS custom properties — do NOT hardcode hex.
 * @see docs/m3/search/SearchBarTokens.kt
 * @see docs/m3/search/SearchViewTokens.kt
 */

// ─── Dimensional Tokens ───────────────────────────────────────────────────────

/**
 * Height and shape tokens for Search variants.
 * Maps directly from MD3 Kotlin token files.
 */
export const SearchTokens = {
	// ── Heights ─────────────────────────────────────────────────────────────
	heights: {
		/** SearchBarTokens.ContainerHeight = 56dp */
		bar: 56,
		/** SearchViewTokens.DockedHeaderContainerHeight = 56dp */
		dockedHeader: 56,
		/** SearchViewTokens.FullScreenHeaderContainerHeight = 72dp */
		fullScreenHeader: 72,
	},

	// ── Avatar ────────────────────────────────────────────────────────────
	/** SearchBarTokens.AvatarSize = 30dp */
	avatarSize: 30,

	// ── Icon ───────────────────────────────────────────────────────────────
	/** Standard icon size for leading/trailing icons. */
	iconSize: 20,
	/** Touch target for interactive icons per MD3 a11y spec. */
	iconTouchTarget: 48,

	// ── Gap ────────────────────────────────────────────────────────────────
	/** Gap between SearchBar and results list when hasGap=true. */
	dropdownGap: 2,
} as const;

// ─── Color Tokens ─────────────────────────────────────────────────────────────

/**
 * CSS custom property references for Search colors.
 * Maps to --md-sys-color-* tokens in the MD3 theme system.
 *
 * SearchBarTokens.kt:
 * - ContainerColor → SurfaceContainerHigh
 * - LeadingIconColor → OnSurface
 * - TrailingIconColor → OnSurfaceVariant
 * - InputTextColor → OnSurface
 * - SupportingTextColor → OnSurfaceVariant (placeholder)
 *
 * SearchViewTokens.kt:
 * - ContainerColor → SurfaceContainerHigh
 * - DividerColor → Outline
 */
export const SEARCH_COLORS = {
	/** SearchBarTokens.ContainerColor → surface-container-high */
	container: "var(--md-sys-color-surface-container-high)",
	/** SearchBarTokens.LeadingIconColor → on-surface */
	leadingIcon: "var(--md-sys-color-on-surface)",
	/** SearchBarTokens.TrailingIconColor → on-surface-variant */
	trailingIcon: "var(--md-sys-color-on-surface-variant)",
	/** SearchBarTokens.InputTextColor → on-surface */
	inputText: "var(--md-sys-color-on-surface)",
	/** SearchBarTokens.SupportingTextColor → on-surface-variant (placeholder) */
	supportingText: "var(--md-sys-color-on-surface-variant)",
	/** SearchViewTokens.DividerColor → outline */
	divider: "var(--md-sys-color-outline)",
	/** Focus indicator → secondary */
	focusIndicator: "var(--md-sys-color-secondary)",
} as const;

// ─── Typography Tokens ────────────────────────────────────────────────────────

/**
 * SearchBarTokens.InputTextFont = BodyLarge (16sp / 24sp line-height).
 * SearchBarTokens.SupportingTextFont = BodyLarge.
 */
export const SEARCH_TYPOGRAPHY = {
	/** BodyLarge — used for input text and placeholder. */
	bodyLarge: "text-[16px] leading-6 font-normal tracking-[0.5px]",
} as const;

// ─── Animation Constants ──────────────────────────────────────────────────────

/**
 * Spring animation for SearchBar width expand (inactive → active).
 * Matches MD3 FastSpatial motion scheme.
 */
export const SEARCH_BAR_EXPAND_SPRING = {
	type: "spring" as const,
	stiffness: 380,
	damping: 38,
	mass: 1,
};

/**
 * Spring animation for Docked SearchView dropdown reveal (slide + fade).
 * Offset Y: -8px on enter, opacity 0→1.
 */
export const SEARCH_DOCKED_REVEAL_SPRING = {
	type: "spring" as const,
	stiffness: 400,
	damping: 35,
	mass: 0.8,
};

/**
 * Spring animation for FullScreen SearchView shape morphing.
 * Lower stiffness + mass gives a smoother pill→fullscreen morph.
 */
export const SEARCH_FULLSCREEN_SPRING = {
	type: "spring" as const,
	stiffness: 300,
	damping: 30,
	mass: 0.9,
};

/**
 * Exit transition for SearchBar when mode="popLayout" is used.
 * Fast fade-out so SearchView can claim the layoutId quickly.
 */
export const SEARCH_BAR_EXIT_SPRING = {
	type: "spring" as const,
	stiffness: 500,
	damping: 40,
	mass: 0.6,
};
