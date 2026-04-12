/**
 * @file slider.types.ts
 * MD3 Expressive Slider — TypeScript prop definitions.
 * Spec: https://m3.material.io/components/sliders/overview
 * Reference: docs/m3/sliders/Slider.kt
 */

import type * as React from "react";

// ─── Track Size ───────────────────────────────────────────────────────────────

/** Track size variants mapping to physical px values. */
export type SliderTrackSize = "xs" | "s" | "m" | "l" | "xl";
export type SliderVariant = "primary" | "secondary" | "tertiary" | "error";

export type SliderTrackShape = "md3" | "full" | number;

// ─── Orientation ──────────────────────────────────────────────────────────────

/** Slider layout direction. */
export type SliderOrientation = "horizontal" | "vertical";

// ─── Internal Context ────────────────────────────────────────────────────────

/**
 * Internal context shared between Slider sub-components.
 * @internal
 */
export interface SliderContextValue {
	/** Minimum allowed value. */
	min: number;
	/** Maximum allowed value. */
	max: number;
	/**
	 * Step size. When > 0, slider is discrete and snaps to multiples of step.
	 * When 0, slider is continuous.
	 */
	step: number;
	/** Whether the slider is interactive. */
	disabled: boolean;
	/** Layout orientation. */
	orientation: SliderOrientation;
	/** Physical size of the track. */
	trackSize: SliderTrackSize;
	/** Color variant. */
	variant: SliderVariant;
	/**
	 * When true, active track originates from center (50%) instead of the min end.
	 * Mirrors Compose's `SliderDefaults.Track(drawCenteredTrack = true)`.
	 */
	isCentered: boolean;
	/** Show the floating value tooltip on hover/drag. */
	showValueIndicator: boolean;
	/** Ref to the track DOM element — used for drag constraint. */
	trackRef: React.RefObject<HTMLDivElement | null>;
}

// ─── Slider Props ────────────────────────────────────────────────────────────

/**
 * Props for the `<Slider>` component.
 *
 * Supports both controlled (`value` + `onValueChange`) and
 * uncontrolled (`defaultValue`) usage patterns per React standards.
 *
 * @example
 * ```tsx
 * // Controlled
 * <Slider value={volume} onValueChange={setVolume} min={0} max={100} />
 *
 * // Uncontrolled
 * <Slider defaultValue={50} />
 *
 * // Discrete (step snapping)
 * <Slider defaultValue={0} step={10} />
 *
 * // Vertical orientation
 * <Slider defaultValue={50} orientation="vertical" />
 *
 * // Centered active track
 * <Slider defaultValue={0} isCentered />
 * ```
 */
export interface SliderProps {
	/** Controlled current value. Use with `onValueChange`. */
	value?: number;
	/** Initial value for uncontrolled usage. @default midpoint of min/max */
	defaultValue?: number;
	/** Called whenever the value changes during interaction. */
	onValueChange?: (value: number) => void;
	/** Called when the user finishes dragging / commits a keyboard change. */
	onValueChangeEnd?: (value: number) => void;
	/** Minimum value. @default 0 */
	min?: number;
	/** Maximum value. @default 100 */
	max?: number;
	/**
	 * Step size. When > 0, slider snaps to multiples of `step` from `min`
	 * and renders tick marks. When 0, slider is continuous.
	 * @default 0
	 */
	step?: number;
	/** Layout orientation. @default "horizontal" */
	orientation?: SliderOrientation;
	/**
	 * Physical track size.
	 * Horizontal: height. Vertical: width.
	 * @default "m"
	 */
	trackSize?: SliderTrackSize;
	/**
	 * Color variant.
	 * @default "primary"
	 */
	variant?: SliderVariant;
	/**
	 * When true, the active track segment grows from the center (50%)
	 * outward toward the thumb position.
	 * @default false
	 */
	isCentered?: boolean;
	/** Disables all interaction. @default false */
	disabled?: boolean;
	/**
	 * When true, shows a floating value indicator tooltip above the thumb.
	 * @default false
	 */
	showValueIndicator?: boolean;
	/**
	 * When true, shows tick marks along the track.
	 * Only applicable if `step` > 0.
	 * @default false
	 */
	showTicks?: boolean;
	/**
	 * Track shape configuration for border radius.
	 * - "md3": Default MD3 specific border radius per size
	 * - "full": Fully rounded ends (pill shape - size/2)
	 * - number: Custom border radius in px
	 * @default "md3"
	 */
	trackShape?: SliderTrackShape;
	/**
	 * Icon rendered inside the track (inset icon).
	 * MD3 spec: only valid for M, L, XL track sizes.
	 * The icon moves from the active track to the inactive track
	 * when there's not enough space at low values.
	 * Do not use with `isCentered` or `RangeSlider`.
	 */
	insetIcon?: React.ReactNode;
	/**
	 * Alternate icon shown when value equals `min`.
	 * Swaps with `insetIcon` at the minimum value
	 * (e.g., a mute icon replacing a volume icon when volume = 0).
	 */
	insetIconAtMin?: React.ReactNode;
	/**
	 * Icon rendered inside the track at the trailing end (right side).
	 * Only valid for track sizes >= 40dp (e.g. XL).
	 */
	insetIconTrailing?: React.ReactNode;
	/**
	 * Alternate icon shown when value equals `max`.
	 * Swaps with `insetIconTrailing` at the maximum value.
	 */
	insetIconAtMax?: React.ReactNode;
	/** Additional CSS class applied to the outermost wrapper. */
	className?: string;
	/**
	 * Accessible label for the slider when no visible label exists.
	 * Required if parent does not have a visible label.
	 */
	"aria-label"?: string;
	/** ID of a visible label element. Required if `aria-label` is not provided. */
	"aria-labelledby"?: string;
	/**
	 * Format function for the displayed value in the value indicator tooltip.
	 * Defaults to `String(value)`.
	 */
	formatValue?: (value: number) => string;
}

// ─── Range Slider Props ──────────────────────────────────────────────────────

/**
 * Props for the `<RangeSlider>` component.
 *
 * Extends `SliderProps` with tuple-based value API.
 * The two thumbs cannot cross each other.
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   value={[20, 80]}
 *   onValueChange={([start, end]) => setRange([start, end])}
 * />
 * ```
 */
export interface RangeSliderProps
	extends Omit<
		SliderProps,
		"value" | "defaultValue" | "onValueChange" | "onValueChangeEnd" | "isCentered"
	> {
	/** Controlled [start, end] tuple. Use with `onValueChange`. */
	value?: [number, number];
	/** Initial [start, end] tuple for uncontrolled usage. */
	defaultValue?: [number, number];
	/** Called whenever [start, end] changes during interaction. */
	onValueChange?: (value: [number, number]) => void;
	/** Called when the user finishes dragging either thumb. */
	onValueChangeEnd?: (value: [number, number]) => void;
}

// ─── Internal Sub-component Props ────────────────────────────────────────────

/**
 * Props for `<SliderTrack>`.
 * @internal
 */
export interface SliderTrackProps {
	/** Current thumb position as 0–1 fraction. */
	percent: number;
	trackSize: SliderTrackSize;
	orientation: SliderOrientation;
	variant: SliderVariant;
	isCentered: boolean;
	/** For discrete mode: step size. 0 = no ticks. */
	step: number;
	min: number;
	max: number;
	disabled: boolean;
	trackShape?: SliderTrackShape;
	/** Ref forwarded to the root track element for drag constraint. */
	trackRef: React.RefObject<HTMLDivElement | null>;
	/** onClick handler on the track for click-to-jump. */
	onTrackPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
	/**
	 * Icon rendered inside the track (inset icon).
	 * @internal — passed down from Slider after guard check.
	 */
	insetIcon?: React.ReactNode;
	/** Alternate icon swapped in when value === min. @internal */
	insetIconAtMin?: React.ReactNode;
	/** Icon rendered at the trailing end (right side). @internal */
	insetIconTrailing?: React.ReactNode;
	/** Alternate icon swapped in when value === max. @internal */
	insetIconAtMax?: React.ReactNode;
	/** Current slider value — used for inset icon swap at min/max. @internal */
	value?: number;
}

/**
 * Props for `<SliderThumb>`.
 * @internal
 */
export interface SliderThumbProps {
	/** Current value (for ARIA). */
	value: number;
	/** Current 0–1 fraction (for positioning). */
	percent: number;
	min: number;
	max: number;
	step: number;
	disabled: boolean;
	orientation: SliderOrientation;
	showValueIndicator: boolean;
	/** For the drag constraint ref. */
	trackRef: React.RefObject<HTMLDivElement | null>;
	trackSize: SliderTrackSize;
	variant: SliderVariant;
	/** Called during pointer drag with new value. */
	onValueChange: (value: number) => void;
	/** Called on drag end / keyboard commit. */
	onValueChangeEnd?: (value: number) => void;
	/** Value display formatter. */
	formatValue?: (value: number) => string;
	/** Unique ID for ARIA. */
	thumbId?: string;
	/** zIndex for RangeSlider layering. */
	zIndex?: number;
	/** Optional accessible label for this specific thumb. */
	"aria-label"?: string;
	"aria-labelledby"?: string;
}
