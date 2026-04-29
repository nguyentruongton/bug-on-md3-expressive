/**
 * @file shared/constants.ts
 *
 * Shared animation constants for MD3 Expressive UI components.
 * Centralises spring transition configs and motion variant objects to avoid
 * duplication across button, icon-button, FAB, and other interactive components.
 *
 * @see https://m3.material.io/foundations/animation/overview
 */

import type { Target, TargetAndTransition, Transition } from "motion/react";

// ─────────────────────────────────────────────────────────────────────────────
// Spring Transitions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fast critically-damped spring — used for border-radius morphing.
 *
 * - Duration: 200ms
 * - Bounce: 0 (no overshoot → prevents negative radius jitter)
 *
 * @example
 * ```tsx
 * <m.button transition={{ borderRadius: SPRING_TRANSITION_FAST }}>...</m.button>
 * ```
 */
export const SPRING_TRANSITION_FAST: Transition = {
	type: "spring",
	bounce: 0,
	duration: 0.2,
} as const;

/**
 * Standard critically-damped spring — used for icon/content scale animations.
 *
 * - Duration: 300ms
 * - Bounce: 0 (no overshoot)
 *
 * @example
 * ```tsx
 * <m.span transition={SPRING_TRANSITION}>...</m.span>
 * ```
 */
export const SPRING_TRANSITION: Transition = {
	type: "spring",
	bounce: 0,
	duration: 0.3,
} as const;

/**
 * MD3 Expressive spring — active indicator expand/collapse.
 * Higher bounce for the "pop" effect per MD3 Expressive spec.
 *
 * - Duration: 400ms
 * - Bounce: 0.35 (spring overshoot → lò xo)
 */
export const SPRING_TRANSITION_EXPRESSIVE: Transition = {
	type: "spring",
	bounce: 0.45,
	duration: 0.4,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Icon Span Motion Variants
// Used for icon/loading indicator swap animation inside FAB and IconButton.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Framer Motion variants for animating icon spans in/out.
 *
 * Scale from near-zero → 1 on enter; back to near-zero on exit.
 * The near-zero value (0.01) avoids the SMIL freeze bug on Chromium
 * that occurs when an element starts at exactly `scale(0)`.
 *
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   {loading ? (
 *     <m.span key="loading" {...ICON_SPAN_VARIANTS} transition={SPRING_TRANSITION}>
 *       <LoadingIndicator />
 *     </m.span>
 *   ) : (
 *     <m.span key="icon" {...ICON_SPAN_VARIANTS} transition={SPRING_TRANSITION}>
 *       {icon}
 *     </m.span>
 *   )}
 * </AnimatePresence>
 * ```
 */
export const ICON_SPAN_VARIANTS: {
	initial: Target;
	animate: TargetAndTransition;
	exit: TargetAndTransition;
} = {
	initial: { scale: 0.01 },
	animate: { scale: 1 },
	exit: { scale: 0.01 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MD3 TextField Animation Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MD3 Standard easing curve — used for label float, active indicator expand.
 * cubic-bezier(0.2, 0, 0, 1)
 *
 * @see https://m3.material.io/foundations/animation/easing-and-duration
 */
export const MD3_STANDARD_EASING: [number, number, number, number] = [
	0.2, 0, 0, 1,
];

/**
 * Duration for floating label transition: 150ms.
 * Used when label moves between inline position ↔ floated position.
 */
export const MD3_LABEL_FLOAT_DURATION = 0.15;

/**
 * Duration for active indicator expand/collapse: 200ms.
 * Used for the bottom border (filled) and outline (outlined) on focus.
 */
export const MD3_INDICATOR_DURATION = 0.2;

/**
 * Duration for supporting text / error text appear/disappear: 120ms.
 */
export const MD3_SUPPORTING_DURATION = 0.12;

/**
 * Duration for trailing icon appear/disappear (clear button, password toggle): 100ms.
 */
export const MD3_ICON_SWAP_DURATION = 0.1;
