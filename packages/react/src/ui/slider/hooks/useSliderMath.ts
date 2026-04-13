/**
 * @file useSliderMath.ts
 * MD3 Expressive Slider — Math utility hook.
 *
 * Handles all slider math in one place:
 * - value coercion to [min, max]
 * - step snapping for discrete mode
 * - value ↔ percent conversion
 * - keyboard delta calculation
 * - tick position generation
 *
 * Exported as a pure hook for testability and reuse in both Slider and RangeSlider.
 */

import { useMemo } from "react";

// ─── Pure math helpers (exported for unit testing) ───────────────────────────

/**
 * Clamps `value` to the closed interval `[min, max]`.
 *
 * @example coerceValue(150, 0, 100) → 100
 */
export function coerceValue(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Rounds `value` to the nearest multiple of `step` relative to `min`.
 * When `step === 0`, returns `value` unchanged (continuous mode).
 *
 * @example snapToStep(23, 0, 10) → 20
 * @example snapToStep(27, 0, 10) → 30
 */
export function snapToStep(value: number, min: number, step: number): number {
	if (step <= 0) return value;
	const steps = Math.round((value - min) / step);
	// Use toPrecision to avoid floating-point drift (e.g., 0.1 + 0.2 issues)
	return Number((min + steps * step).toPrecision(10));
}

/**
 * Converts a raw value to a 0–1 fraction of the [min, max] range.
 * Returns 0 when max === min (degenerate range).
 *
 * @example valueToPercent(50, 0, 100) → 0.5
 */
export function valueToPercent(
	value: number,
	min: number,
	max: number,
): number {
	if (max === min) return 0;
	return (value - min) / (max - min);
}

/**
 * Converts a 0–1 fraction to a value within [min, max], then snaps to step.
 * The result is also coerced to [min, max].
 *
 * @example percentToValue(0.5, 0, 100, 10) → 50
 * @example percentToValue(0.23, 0, 100, 10) → 20
 */
export function percentToValue(
	percent: number,
	min: number,
	max: number,
	step: number,
): number {
	const raw = min + percent * (max - min);
	const snapped = snapToStep(raw, min, step);
	return coerceValue(snapped, min, max);
}

/**
 * Computes the keyboard increment for a given key.
 *
 * Key mappings per WAI-ARIA Slider pattern:
 * - ArrowRight/Up → +step (or +1% of range if continuous)
 * - ArrowLeft/Down → -step (or -1% of range)
 * - PageUp → +10% of range (snapped to step)
 * - PageDown → -10% of range (snapped to step)
 * - Home / End → handled by the caller (jump to min/max)
 *
 * @returns the signed delta to add to current value, or `null` for Home/End.
 */
export function getKeyboardDelta(
	key: string,
	step: number,
	min: number,
	max: number,
): number | null {
	const range = max - min;
	const discreteStep = step > 0 ? step : range / 100; // 1% of range for continuous

	switch (key) {
		case "ArrowRight":
		case "ArrowUp":
			return discreteStep;
		case "ArrowLeft":
		case "ArrowDown":
			return -discreteStep;
		case "PageUp":
			return step > 0 ? snapToStep(range * 0.1, 0, step) : range * 0.1;
		case "PageDown":
			return step > 0 ? -snapToStep(range * 0.1, 0, step) : -(range * 0.1);
		default:
			return null;
	}
}

/**
 * Generates the list of value positions for tick marks.
 * Returns an empty array when `step === 0` (continuous mode).
 *
 * @example generateTicks(0, 100, 10) → [0, 10, 20, ..., 100]
 */
export function generateTicks(
	min: number,
	max: number,
	step: number,
): number[] {
	if (step <= 0) return [];
	const ticks: number[] = [];
	let current = min;
	while (current <= max) {
		ticks.push(Number(current.toPrecision(10)));
		current += step;
	}
	// Ensure max is included even if floating-point drift skips it
	if (ticks[ticks.length - 1] !== max) {
		ticks.push(max);
	}
	return ticks;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseSliderMathOptions {
	min: number;
	max: number;
	step: number;
}

export interface UseSliderMathReturn {
	/** Clamp value to [min, max]. */
	coerce: (v: number) => number;
	/** Snap value to nearest step (no-op if step=0). */
	snap: (v: number) => number;
	/** Value → percent [0, 1]. */
	toPercent: (v: number) => number;
	/** Percent [0, 1] → snapped value. */
	fromPercent: (pct: number) => number;
	/**
	 * Signed delta for a keyboard key.
	 * Returns `null` for Home/End (jump to min/max, handled by caller).
	 */
	getKeyDelta: (key: string) => number | null;
	/** Tick positions. Empty array in continuous mode. */
	ticks: number[];
}

/**
 * Math utility hook for MD3 Slider components.
 *
 * Memoizes all math functions against `min`, `max`, `step` changes.
 * Use this in both `<Slider>` and `<RangeSlider>` to share logic.
 *
 * @example
 * ```ts
 * const { coerce, snap, toPercent, fromPercent, getKeyDelta, ticks } =
 *   useSliderMath({ min: 0, max: 100, step: 10 });
 *
 * const percent = toPercent(value);          // → 0.5 for value=50
 * const newValue = fromPercent(dragPercent); // → 50
 * const delta = getKeyDelta("ArrowRight");   // → 10
 * ```
 */
export function useSliderMath({
	min,
	max,
	step,
}: UseSliderMathOptions): UseSliderMathReturn {
	return useMemo(
		() => ({
			coerce: (v: number) => coerceValue(v, min, max),
			snap: (v: number) => snapToStep(v, min, step),
			toPercent: (v: number) => valueToPercent(v, min, max),
			fromPercent: (pct: number) => percentToValue(pct, min, max, step),
			getKeyDelta: (key: string) => getKeyboardDelta(key, step, min, max),
			ticks: generateTicks(min, max, step),
		}),
		[min, max, step],
	);
}
