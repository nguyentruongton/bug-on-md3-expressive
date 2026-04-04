/**
 * @file text-field.tokens.ts
 * MD3 design token mapping for the TextField component.
 *
 * All color values reference CSS custom properties defined by the MD3 theme.
 * Do NOT use raw hex values — always use CSS variables.
 *
 * @see https://m3.material.io/components/text-fields/specs
 */

// ─── Color Tokens ────────────────────────────────────────────────────────────

export const TF_COLORS = {
	/** Filled container background */
	filledBg: "var(--color-m3-surface-container-highest)",
	/** Input text color */
	inputText: "var(--color-m3-on-surface)",
	/** Label (unfloated) + icons + prefix/suffix + supporting text */
	onSurfaceVariant: "var(--color-m3-on-surface-variant)",
	/** Focused active indicator / outline, floated label */
	primary: "var(--color-m3-primary)",
	/** Error indicator / outline / label / icon / supporting text */
	error: "var(--color-m3-error)",
	/** Outlined border (enabled) */
	outline: "var(--color-m3-outline)",
	/** Transparent */
	transparent: "transparent",
} as const;

// ─── Size Tokens ──────────────────────────────────────────────────────────────

export const TF_SIZE = {
	/** Container height — normal */
	height: 56,
	/** Container height — dense variant */
	denseHeight: 48,
	/** Active indicator height — enabled */
	indicatorThin: 1,
	/** Active indicator height — focused */
	indicatorThick: 2,
	/** Outline stroke width — enabled */
	outlineThin: 1,
	/** Outline stroke width — focused */
	outlineThick: 2,
	/** Corner radius — all variants */
	cornerRadius: 4,
	/** Leading/Trailing icon size */
	iconSize: 24,
	/** Padding inline start (no leading icon) */
	paddingStart: 16,
	/** Padding inline start (with leading icon) */
	paddingStartWithIcon: 12,
	/** Padding inline end */
	paddingEnd: 16,
	/** Padding inline end (with trailing icon) */
	paddingEndWithIcon: 12,
	/** Notch extra padding per side on outlined label gap */
	notchPadding: 4,
} as const;

// ─── Typography Tokens ────────────────────────────────────────────────────────

export const TF_TYPOGRAPHY = {
	/** Body Large — input text, unfloated label */
	bodyLargePx: 16,
	/** Body Small — floated label, supporting text, counter */
	bodySmallPx: 12,
	/** Scale ratio when label floats: 12/16 = 0.75 */
	labelScaleRatio: 12 / 16,
} as const;

// ─── Tailwind Class Snippets ──────────────────────────────────────────────────

/**
 * Tailwind utility classes for key TextField elements.
 * Use via cn() — do NOT use these as standalone strings without merging.
 */
export const TF_CLASSES = {
	// Container
	filledContainer:
		"bg-[var(--color-m3-surface-container-highest)] rounded-tl-[4px] rounded-tr-[4px] rounded-bl-none rounded-br-none",
	outlinedContainer: "bg-transparent rounded-[4px]",

	// Input
	input:
		"bg-transparent outline-none w-full text-base text-[var(--color-m3-on-surface)] caret-[var(--color-m3-primary)] placeholder:text-[var(--color-m3-on-surface-variant)]",
	inputNoSpinner:
		"[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",

	// States
	disabled: "opacity-[0.38] pointer-events-none cursor-not-allowed",

	// Supporting text
	supportingText: "text-xs text-[var(--color-m3-on-surface-variant)] px-4",
	errorText: "text-xs text-[var(--color-m3-error)] px-4",

	// Prefix / Suffix
	prefixSuffix:
		"text-base text-[var(--color-m3-on-surface-variant)] select-none shrink-0",

	// State layer (hover)
	stateLayer:
		"absolute inset-0 bg-[var(--color-m3-on-surface)] opacity-0 transition-opacity duration-150 pointer-events-none rounded-[inherit]",
} as const;
