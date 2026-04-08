/**
 * @file switch.tokens.ts
 * MD3 Expressive Switch — Design tokens ported from SwitchTokens.kt.
 * All dimensional values are in px (dp equivalent for web).
 * @see docs/m3/switch/SwitchTokens.kt
 */

/**
 * Design tokens for the MD3 Expressive Switch component.
 *
 * Maps directly from `SwitchTokens.kt` (v0_210) to CSS/JS values.
 * Use these as the single source of truth for sizing and opacity.
 *
 * Color tokens are NOT included here — they reference CSS custom properties
 * from the project's MD3 theme system (`--md-sys-color-*`).
 */
export const SwitchTokens = {
	// ── Track ─────────────────────────────────────────────────────────────────
	/** SwitchTokens.TrackWidth = 52dp */
	trackWidth: 52,
	/** SwitchTokens.TrackHeight = 32dp */
	trackHeight: 32,
	/** SwitchTokens.TrackOutlineWidth = 2dp */
	trackOutlineWidth: 2,

	// ── Handle (Thumb) ────────────────────────────────────────────────────────
	/** SwitchTokens.SelectedHandleWidth/Height = 24dp */
	selectedHandleSize: 24,
	/** SwitchTokens.UnselectedHandleWidth/Height = 16dp */
	unselectedHandleSize: 16,
	/** SwitchTokens.IconHandleWidth/Height = 24dp (when thumb has icon content) */
	iconHandleSize: 24,
	/** SwitchTokens.PressedHandleWidth/Height = 28dp */
	pressedHandleSize: 28,

	// ── State Layer ───────────────────────────────────────────────────────────
	/** SwitchTokens.StateLayerSize = 40dp */
	stateLayerSize: 40,

	// ── Icon ──────────────────────────────────────────────────────────────────
	/** SwitchTokens.SelectedIconSize / UnselectedIconSize = 16dp */
	iconSize: 16,

	// ── Opacity (disabled states) ─────────────────────────────────────────────
	/** SwitchTokens.DisabledTrackOpacity = 0.12 */
	disabledTrackOpacity: 0.12,
	/** SwitchTokens.DisabledSelectedHandleOpacity = 1.0 */
	disabledSelectedHandleOpacity: 1.0,
	/** SwitchTokens.DisabledUnselectedHandleOpacity = 0.38 */
	disabledUnselectedHandleOpacity: 0.38,
	/** SwitchTokens.DisabledSelectedIconOpacity = 0.38 */
	disabledSelectedIconOpacity: 0.38,
	/** SwitchTokens.DisabledUnselectedIconOpacity = 0.38 */
	disabledUnselectedIconOpacity: 0.38,
} as const;

// ── MD3 Color token references (CSS custom properties) ────────────────────────

/**
 * CSS custom property references for Switch colors.
 * These map to the project's `--md-sys-color-*` tokens in `colors.css`.
 *
 * DO NOT hardcode hex values — always use these references so the
 * component automatically adapts to light/dark theme switching.
 */
export const SwitchColors = {
	// Track
	checkedTrack: "var(--md-sys-color-primary)",
	uncheckedTrack: "var(--md-sys-color-surface-container-highest)",
	uncheckedTrackOutline: "var(--md-sys-color-outline)",

	// Thumb
	checkedThumb: "var(--md-sys-color-on-primary)",
	uncheckedThumb: "var(--md-sys-color-outline)",
	hoverCheckedThumb: "var(--md-sys-color-primary-container)",
	hoverUncheckedThumb: "var(--md-sys-color-on-surface-variant)",
	disabledCheckedThumb: "var(--md-sys-color-surface)",

	// Icon
	checkedIcon: "var(--md-sys-color-on-primary-container)",
	uncheckedIcon: "var(--md-sys-color-surface-container-highest)",

	// State layer
	checkedStateLayer: "var(--md-sys-color-primary)",
	uncheckedStateLayer: "var(--md-sys-color-on-surface)",

	// Focus indicator
	focusIndicator: "var(--md-sys-color-secondary)",
} as const;
