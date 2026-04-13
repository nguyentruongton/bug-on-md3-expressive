/**
 * @file app-bar.tokens.ts
 * MD3 Expressive App Bar — Design tokens ported from:
 *   - AppBarTokens.kt (shared tokens)
 *   - AppBarSmallTokens.kt
 *   - AppBarMediumFlexibleTokens.kt
 *   - AppBarLargeFlexibleTokens.kt
 *   - BottomAppBarTokens.kt
 *   - DockedToolbarTokens.kt
 *   - FabSecondaryContainerTokens.kt
 *
 * All dimensional values are in px (dp equivalents for web at 1dp = 1px).
 * Colors reference CSS custom properties — do NOT hardcode hex.
 * @see docs/m3/app-bars/
 */

// ─── Dimensional Tokens ───────────────────────────────────────────────────────

/**
 * Height and spacing tokens for all App Bar variants.
 * Maps directly from MD3 Kotlin token files.
 */
export const AppBarTokens = {
	// ── Heights ─────────────────────────────────────────────────────────────
	heights: {
		/** SmallAppBar height. AppBarSmallTokens.ContainerHeight = 64dp */
		small: 64,
		/** Collapsed height for flexible variants. = SmallAppBar height. */
		flexibleCollapsed: 64,
		/** MediumFlexibleAppBar expanded height (without subtitle). AppBarMediumFlexibleTokens */
		mediumFlexExpanded: 112,
		/** MediumFlexibleAppBar expanded height (with subtitle). */
		mediumFlexWithSubtitleExpanded: 136,
		/** LargeFlexibleAppBar expanded height (without subtitle). AppBarLargeFlexibleTokens */
		largeFlexExpanded: 120,
		/** LargeFlexibleAppBar expanded height (with subtitle). */
		largeFlexWithSubtitleExpanded: 152,
		/** BottomAppBar height. BottomAppBarTokens.ContainerHeight = 80dp */
		bottom: 80,
		/** DockedToolbar height. DockedToolbarTokens.ContainerHeight = 64dp */
		dockedToolbar: 64,
	},

	// ── Icon and Avatar sizes ──────────────────────────────────────────────
	/** AppBarTokens.IconSize = 24dp */
	iconSize: 24,
	/** AppBarTokens.AvatarSize = 32dp */
	avatarSize: 32,

	// ── Spacing ──────────────────────────────────────────────────────────────
	/** AppBarTokens.LeadingSpace = 4dp */
	leadingSpace: 4,
	/** AppBarTokens.TrailingSpace = 4dp */
	trailingSpace: 4,
	/** AppBarTokens.IconButtonSpace = 0dp (no gap between icon buttons) */
	iconButtonSpace: 0,

	// ── Docked Toolbar spacing ────────────────────────────────────────────
	dockedToolbar: {
		/** DockedToolbarTokens.ContainerLeadingSpace = 16dp */
		leadingSpace: 16,
		/** DockedToolbarTokens.ContainerTrailingSpace = 16dp */
		trailingSpace: 16,
		/** DockedToolbarTokens.ContainerMinSpacing = 4dp */
		minSpacing: 4,
		/** DockedToolbarTokens.ContainerMaxSpacing = 32dp */
		maxSpacing: 32,
	},

	// ── Touch targets ─────────────────────────────────────────────────────
	/** Minimum 48px touch target for icon buttons per MD3 accessibility spec. */
	iconButtonTouchTarget: 48,
} as const;

// ─── Typography Tokens ────────────────────────────────────────────────────────

/**
 * MD3 type scale values mapped to Tailwind CSS class strings.
 * Used across App Bar variants for consistent typography.
 *
 * Values derived from MD3 Material Type Scale specification.
 */
export const appBarTypography = {
	/**
	 * SmallAppBar title (collapsed state for flexible variants).
	 * AppBarSmallTokens.TitleFont = TitleLarge
	 * Spec: 22sp / 28sp line-height / medium weight
	 */
	titleLarge: "text-[22px] leading-[28px] font-medium tracking-[0px]",

	/**
	 * SmallAppBar subtitle.
	 * AppBarSmallTokens.SubtitleFont = LabelMedium
	 * Spec: 12sp / 16sp line-height / medium weight / 0.5px tracking
	 */
	labelMedium: "text-[12px] leading-[16px] font-medium tracking-[0.5px]",

	/**
	 * MediumFlexibleAppBar expanded title.
	 * AppBarMediumFlexibleTokens.TitleFont = HeadlineMedium
	 * Spec: 28sp / 36sp line-height / normal weight
	 */
	headlineMedium: "text-[28px] leading-[36px] font-normal tracking-[0px]",

	/**
	 * MediumFlexibleAppBar subtitle.
	 * AppBarMediumFlexibleTokens.SubtitleFont = LabelLarge
	 * Spec: 14sp / 20sp line-height / medium weight / 0.1px tracking
	 */
	labelLarge: "text-[14px] leading-[20px] font-medium tracking-[0.1px]",

	/**
	 * LargeFlexibleAppBar expanded title.
	 * AppBarLargeFlexibleTokens.TitleFont = DisplaySmall
	 * Spec: 36sp / 44sp line-height / normal weight / -0.25px tracking
	 */
	displaySmall: "text-[36px] leading-[44px] font-normal tracking-[-0.25px]",

	/**
	 * LargeFlexibleAppBar subtitle.
	 * AppBarLargeFlexibleTokens.SubtitleFont = TitleMedium
	 * Spec: 16sp / 24sp line-height / medium weight / 0.15px tracking
	 */
	titleMedium: "text-[16px] leading-6 font-medium tracking-[0.15px]",
} as const;

// ─── Color Tokens ─────────────────────────────────────────────────────────────

/**
 * CSS custom property references for App Bar colors.
 * Maps to --md-sys-color-* tokens in the MD3 theme system.
 *
 * IMPORTANT: Never hardcode hex/rgba values here — these references
 * automatically adapt to light/dark theme via the MD3ThemeProvider.
 *
 * AppBarTokens.kt spec:
 * - ContainerColor → md-sys-color-surface
 * - OnScrollContainerColor → md-sys-color-surface-container
 */
export const APP_BAR_COLORS = {
	// ── Container ────────────────────────────────────────────────────────────
	/** Default background. AppBarTokens.ContainerColor → surface */
	container: "var(--md-sys-color-surface)",
	/** Background when content is scrolled. AppBarTokens.OnScrollContainerColor → surface-container */
	scrolledContainer: "var(--md-sys-color-surface-container)",

	// ── Content ──────────────────────────────────────────────────────────────
	/** Title color. AppBarTokens.TitleColor → on-surface */
	title: "var(--md-sys-color-on-surface)",
	/** Subtitle color. AppBarTokens.SubtitleColor → on-surface-variant */
	subtitle: "var(--md-sys-color-on-surface-variant)",
	/** Navigation icon color. AppBarTokens.LeadingIconColor → on-surface */
	navigationIcon: "var(--md-sys-color-on-surface)",
	/** Action icon color. AppBarTokens.TrailingIconColor → on-surface-variant */
	actionIcon: "var(--md-sys-color-on-surface-variant)",

	// ── Search Bar ───────────────────────────────────────────────────────────
	/** Search bar pill background. → surface-container-high */
	searchBarBg: "var(--md-sys-color-surface-container-high)",
	/** Search bar text/icon color. */
	searchBarContent: "var(--md-sys-color-on-surface-variant)",

	// ── Bottom App Bar ───────────────────────────────────────────────────────
	/** BottomAppBarTokens.ContainerColor → surface-container */
	bottomContainer: "var(--md-sys-color-surface-container)",

	// ── FAB on Bottom App Bar ────────────────────────────────────────────────
	/** FabSecondaryContainerTokens.ContainerColor → secondary-container */
	fabContainer: "var(--md-sys-color-secondary-container)",
	/** FabSecondaryContainerTokens.IconColor → on-secondary-container */
	fabIcon: "var(--md-sys-color-on-secondary-container)",
} as const;

// ─── Animation Constants ──────────────────────────────────────────────────────

/**
 * Color transition when App Bar background changes on scroll.
 * MD3 Standard easing: cubic-bezier(0.2, 0, 0, 1), 200ms.
 */
export const APP_BAR_COLOR_TRANSITION = {
	duration: 0.2,
	ease: [0.2, 0, 0, 1] as [number, number, number, number],
} as const;

/**
 * Spring animation for enterAlways behavior (hide/show on scroll direction).
 * Equivalent to MD3 FastSpatial motion scheme.
 */
export const APP_BAR_ENTER_ALWAYS_SPRING = {
	type: "spring",
	stiffness: 380,
	damping: 40,
	mass: 1,
} as const;

/**
 * Spring animation for Bottom App Bar hide/show.
 * Slightly looser feel for bottom navigation.
 */
export const APP_BAR_BOTTOM_SPRING = {
	type: "spring",
	stiffness: 300,
	damping: 30,
} as const;

/**
 * SearchView appearance/disappearance transition.
 * Uses spring for natural feel of expanding overlay.
 */
export const SEARCH_VIEW_SPRING = {
	type: "spring",
	stiffness: 400,
	damping: 35,
} as const;

/**
 * Title crossfade transition for flexible App Bars.
 * Short duration keeps the collapse feeling snappy.
 */
export const APP_BAR_TITLE_FADE = {
	duration: 0.15,
	ease: "easeInOut",
} as const;
