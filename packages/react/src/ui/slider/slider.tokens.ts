/**
 * @file slider.tokens.ts
 * MD3 Expressive Slider — Design tokens ported from:
 *   - SliderTokens.kt (Jetpack Compose M3 Expressive)
 *   - M3 Expressive visual spec (handle squeeze, gaps, asymmetric radii)
 *
 * All dimensional values are in px (dp equivalents for web).
 * Colors reference CSS custom properties — do NOT hardcode hex.
 * @see docs/m3/sliders/Slider.kt
 */

import type { SliderTrackSize } from "./slider.types";

// ─── Dimensional tokens ───────────────────────────────────────────────────────

/**
 * Core dimensional design tokens for the MD3 Expressive Slider.
 * Maps directly from SliderTokens.kt to CSS/JS values.
 */
export const SliderTokens = {
	// ── Track sizes (height for horizontal, width for vertical) ────────────────
	trackSizes: {
		xs: 16,
		s: 24,
		m: 40,
		l: 56,
		xl: 96,
	} satisfies Record<SliderTrackSize, number>,

	// ── Track shapes (border radius) ──────────────────────────────────────────
	trackShapes: {
		xs: 8,
		s: 8,
		m: 12,
		l: 16,
		xl: 28,
	} satisfies Record<SliderTrackSize, number>,

	// ── Thumb (handle) ────────────────────────────────────────────────────────
	/** Thumb height grows with track size */
	thumbHeights: {
		xs: 44,
		s: 44,
		m: 52,
		l: 68,
		xl: 108,
	} satisfies Record<SliderTrackSize, number>,
	/**
	 * Thumb width at rest and on hover.
	 * MD3 Expressive handle pill: 4dp wide.
	 */
	thumbWidthDefault: 4,
	/**
	 * Thumb width while pressed/dragging.
	 * "Squeeze" animation: 4dp → 2dp (M3 Expressive behavior).
	 */
	thumbWidthPressed: 2,

	// ── Track–thumb gap ───────────────────────────────────────────────────────
	/**
	 * Transparent gap between the active/inactive track segments and the thumb.
	 * Maps to ActiveHandleLeadingSpace / ActiveHandleTrailingSpace = 6dp.
	 *
	 * This gap is rendered by mathematically subtracting it from the track
	 * segment width — NOT using margin/padding.
	 */
	thumbGap: 6,

	// ── Track corner radii ────────────────────────────────────────────────────
	/**
	 * Corner radius on the INNER ends of each track segment (facing the thumb).
	 * Fixed to 2px according to MD3 Expressive Slider specs (TrackInsideCornerSize).
	 * Outer ends use `trackSize / 2` (pill cap) — computed inline per component.
	 */
	trackInnerRadius: 2,

	// ── Stop indicator / Tick ─────────────────────────────────────────────────
	/** Tick dot size (width and height). = 4dp. */
	tickSize: 4,

	// ── Touch target ─────────────────────────────────────────────────────────
	/**
	 * Minimum touch target for the thumb wrapper.
	 * MD3 requires 48dp minimum touch target for interactive elements.
	 */
	thumbTouchTarget: 48,

	// ── Value indicator ───────────────────────────────────────────────────────
	/** Offset above the thumb center for the value indicator tooltip. */
	valueIndicatorOffset: 52,

	// ── Inset icon ────────────────────────────────────────────────────────────
	/** Standard icon size map for inset icons inside the track. */
	insetIconSizes: {
		xs: 0,
		s: 0,
		m: 24,
		l: 24,
		xl: 32,
	} satisfies Record<SliderTrackSize, number>,
	/**
	 * Padding between icon and track edge (horizontal).
	 * Keeps the icon visually centered within the pill track.
	 */
	insetIconPadding: 4,
} as const;

// ─── Color tokens ─────────────────────────────────────────────────────────────

/**
 * CSS custom property references for Slider colors.
 * Maps to --md-sys-color-* tokens in the MD3 theme system.
 *
 * DO NOT hardcode hex/rgba values — these references automatically
 * adapt to light/dark theme.
 */
export const SliderColors = {
	// ── Track ─────────────────────────────────────────────────────────────────
	/** Active track color. Maps to ActiveTrackColor token. */
	activeTrack: "var(--md-sys-color-primary)",
	/** Inactive track color. Maps to InactiveTrackColor token. */
	inactiveTrack: "var(--md-sys-color-secondary-container)",
	/**
	 * Disabled track color.
	 * Uses opacity + on-surface per MD3 disabled state spec.
	 */
	disabledActiveTrack: "var(--md-sys-color-on-surface)",
	disabledInactiveTrack: "var(--md-sys-color-on-surface)",

	// ── Thumb ─────────────────────────────────────────────────────────────────
	/** Thumb (handle) color. Maps to HandleColor token. */
	thumb: "var(--md-sys-color-primary)",
	/** Disabled thumb color. */
	disabledThumb: "var(--md-sys-color-on-surface)",

	// ── Value indicator ───────────────────────────────────────────────────────
	/** Value indicator (tooltip) background. Maps to InverseSurface. */
	valueIndicatorBg: "var(--md-sys-color-inverse-surface)",
	/** Value indicator (tooltip) text. Maps to InverseOnSurface. */
	valueIndicatorText: "var(--md-sys-color-inverse-on-surface)",

	// ── Ticks ────────────────────────────────────────────────────────────────
	/**
	 * Tick on the INACTIVE portion of the track.
	 * Maps to TickMarkActiveContainerColor (in spec: primary color stands out).
	 */
	tickOnInactive: "var(--md-sys-color-primary)",
	/**
	 * Tick on the ACTIVE portion of the track.
	 * Maps to TickMarkInactiveContainerColor (secondary-container blends in).
	 */
	tickOnActive: "var(--md-sys-color-secondary-container)",
	disabledTick: "var(--md-sys-color-on-surface)",
} as const;

// ─── Animation constants ──────────────────────────────────────────────────────

/**
 * FastSpatial spring for thumb width squeeze animation.
 * Equivalent to MotionSchemeKeyTokens.FastSpatial in Compose.
 */
export const SLIDER_THUMB_SPRING = {
	type: "spring",
	stiffness: 500,
	damping: 40,
} as const;

/**
 * DefaultSpatial spring for thumb position/track updates.
 * Slightly looser feel for position changes.
 */
export const SLIDER_POSITION_SPRING = {
	type: "spring",
	stiffness: 400,
	damping: 38,
} as const;

/** Color crossfade for active/inactive track color transitions. */
export const SLIDER_COLOR_TRANSITION = {
	duration: 0.18,
	ease: "easeInOut",
} as const;

/** Value indicator appear/disappear animation. */
export const SLIDER_INDICATOR_TRANSITION = {
	type: "spring",
	stiffness: 450,
	damping: 32,
} as const;
