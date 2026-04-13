/**
 * @file slider.tsx
 * MD3 Expressive Slider — Main composition component.
 *
 * Supports:
 * - Controlled and uncontrolled usage patterns
 * - Horizontal and vertical orientations
 * - Discrete mode (step snapping + tick marks)
 * - Centered active track (isCentered)
 * - Value indicator tooltip
 * - Full keyboard navigation (ARIA Slider pattern)
 * - Click-to-jump on track
 *
 * Architecture: Flat (no Context needed for single thumb variant).
 * Track + Thumb are internal sub-components composed here.
 *
 * @see https://m3.material.io/components/sliders/overview
 * @see docs/m3/sliders/Slider.kt
 */

import { domMax, LazyMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { useSliderMath } from "./hooks/useSliderMath";
import { SliderTokens } from "./slider.tokens";
import type { SliderProps } from "./slider.types";
import { SliderThumb } from "./slider-thumb";
import { SliderTrack } from "./slider-track";

// ─── Slider ───────────────────────────────────────────────────────────────────

const SliderComponent = React.forwardRef<HTMLDivElement, SliderProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onValueChange,
			onValueChangeEnd,
			min = 0,
			max = 100,
			step = 0,
			orientation = "horizontal",
			trackSize = "m",
			trackShape = "md3",
			variant = "primary",
			isCentered = false,
			disabled = false,
			showValueIndicator = false,
			showTicks = false,
			insetIcon,
			insetIconAtMin,
			insetIconTrailing,
			insetIconAtMax,
			formatValue,
			className,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledBy,
		},
		ref,
	) => {
		const isHorizontal = orientation === "horizontal";

		// ── Controlled / Uncontrolled state ────────────────────────────────────
		const midpoint = min + (max - min) / 2;
		const initialValue = defaultValue ?? midpoint;
		const [internalValue, setInternalValue] = React.useState(initialValue);
		const resolvedValue =
			controlledValue !== undefined ? controlledValue : internalValue;

		const { coerce, snap, toPercent, ticks } = useSliderMath({
			min,
			max,
			step,
		});

		const safeValue = snap(coerce(resolvedValue));
		const percent = toPercent(safeValue);

		// ── Track ref (for click-to-jump + thumb drag constraint) ──────────────
		const trackRef = React.useRef<HTMLDivElement>(null);

		// ── onChange handler ───────────────────────────────────────────────────
		const handleValueChange = React.useCallback(
			(newValue: number) => {
				const clamped = snap(coerce(newValue));
				if (controlledValue === undefined) {
					setInternalValue(clamped);
				}
				onValueChange?.(clamped);
			},
			[coerce, controlledValue, onValueChange, snap],
		);

		const handleValueChangeEnd = React.useCallback(
			(newValue: number) => {
				onValueChangeEnd?.(snap(coerce(newValue)));
			},
			[coerce, onValueChangeEnd, snap],
		);

		// ── Click-to-jump on track ─────────────────────────────────────────────
		const handleTrackPointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (disabled) return;
				const trackEl = trackRef.current;
				if (!trackEl) return;

				const rect = trackEl.getBoundingClientRect();
				let clickPercent: number;

				const insetLimit =
					SliderTokens.thumbGap + SliderTokens.thumbWidthDefault / 2;
				const trackInset = Math.min(
					SliderTokens.trackSizes[trackSize] / 2,
					insetLimit,
				);

				if (isHorizontal) {
					const x = e.clientX - rect.left;
					clickPercent = (x - trackInset) / (rect.width - trackInset * 2);
				} else {
					const y = rect.bottom - e.clientY;
					clickPercent = (y - trackInset) / (rect.height - trackInset * 2);
				}

				const clamped = Math.max(0, Math.min(1, clickPercent));
				const rawValue = min + clamped * (max - min);
				const newValue = snap(coerce(rawValue));
				handleValueChange(newValue);
			},
			[
				coerce,
				disabled,
				handleValueChange,
				isHorizontal,
				max,
				min,
				snap,
				trackSize,
			],
		);

		// ── Generate unique IDs for ARIA ───────────────────────────────────────
		const id = React.useId();
		const thumbId = `slider-thumb-${id}`;

		// ── Inset icon guard (MD3 spec) ───────────────────────────────────────────
		// Only track sizes >= 40dp support inset icon. Not valid with isCentered.
		const supportsInsetIcon =
			!isCentered && SliderTokens.trackSizes[trackSize] >= 40;
		const hasAnyInsetIcon = !!(insetIcon || insetIconTrailing);
		if (hasAnyInsetIcon && !supportsInsetIcon) {
			console.warn(
				"[Slider] insetIcon is only supported on track sizes >= 40dp (e.g. xl track sizes). " +
					"See MD3 spec: https://m3.material.io/components/sliders/specs",
			);
		}

		return (
			<LazyMotion features={domMax} strict>
				<div
					ref={ref}
					className={cn(
						"relative flex items-center",
						isHorizontal ? "w-full flex-row" : "h-full flex-col",
						disabled && "pointer-events-none",
						className,
					)}
					style={isHorizontal ? { minWidth: 0 } : { minHeight: 0 }}
				>
					<SliderTrack
						percent={percent}
						trackSize={trackSize}
						trackShape={trackShape}
						orientation={orientation}
						isCentered={isCentered}
						min={min}
						max={max}
						disabled={disabled}
						variant={variant}
						trackRef={trackRef}
						onTrackPointerDown={handleTrackPointerDown}
						ticks={showTicks ? ticks : []}
						insetIcon={supportsInsetIcon ? insetIcon : undefined}
						insetIconAtMin={supportsInsetIcon ? insetIconAtMin : undefined}
						insetIconTrailing={
							supportsInsetIcon ? insetIconTrailing : undefined
						}
						insetIconAtMax={supportsInsetIcon ? insetIconAtMax : undefined}
						value={safeValue}
					/>

					<SliderThumb
						value={safeValue}
						percent={percent}
						min={min}
						max={max}
						step={step}
						disabled={disabled}
						orientation={orientation}
						trackSize={trackSize}
						variant={variant}
						showValueIndicator={showValueIndicator}
						trackRef={trackRef}
						onValueChange={handleValueChange}
						onValueChangeEnd={handleValueChangeEnd}
						formatValue={formatValue}
						thumbId={thumbId}
						zIndex={1}
						aria-label={ariaLabel}
						aria-labelledby={ariaLabelledBy}
					/>
				</div>
			</LazyMotion>
		);
	},
);

SliderComponent.displayName = "Slider";

/**
 * MD3 Expressive Slider component.
 *
 * A pill-shaped vertical handle that slides along a rounded track.
 * Supports continuous and discrete (step) modes, horizontal/vertical
 * orientations, and centered active track.
 *
 * Features:
 * - M3 Expressive handle: 4px pill that squeezes to 2px on press
 * - 6px transparent gap between track and thumb
 * - Asymmetric corner radii: outer ends=9999px, inner ends=2px
 * - Tick marks for discrete mode
 * - Optional floating value indicator tooltip
 * - Full keyboard navigation per WAI-ARIA Slider pattern
 *
 * @example
 * ```tsx
 * // Basic controlled
 * <Slider value={volume} onValueChange={setVolume} aria-label="Volume" />
 *
 * // Discrete with ticks
 * <Slider defaultValue={0} step={10} min={0} max={100} />
 *
 * // Vertical orientation
 * <div className="h-64">
 *   <Slider defaultValue={50} orientation="vertical" aria-label="Brightness" />
 * </div>
 *
 * // Centered active track
 * <Slider defaultValue={0} isCentered showValueIndicator />
 *
 * // Large track with value tooltip
 * <Slider defaultValue={50} trackSize="l" showValueIndicator
 *   formatValue={(v) => `${v}%`} />
 * ```
 *
 * @see https://m3.material.io/components/sliders/overview
 */
export const Slider = React.memo(SliderComponent);
