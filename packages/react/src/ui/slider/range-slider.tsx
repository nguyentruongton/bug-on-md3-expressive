/**
 * @file range-slider.tsx
 * MD3 Expressive RangeSlider — Two-thumb slider with crossover prevention.
 *
 * Extends the core Slider architecture with:
 * - Two SliderThumb instances (start + end)
 * - Crossover prevention: start cannot exceed end and vice versa
 * - Z-index management: last-dragged thumb always on top
 * - Active track spans from startPercent to endPercent
 *
 * Design decisions:
 * - The track renders a custom "range" segment between the two thumbs.
 * - Each thumb has independent onValueChange callbacks + crossover clamping.
 * - Last-active thumb gets zIndex=2 to appear on top when thumbs are at same position.
 *
 * @see https://m3.material.io/components/sliders/overview
 * @see docs/m3/sliders/Slider.kt#RangeSlider
 */

import { domMax, LazyMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { useSliderMath } from "./hooks/useSliderMath";
import { SliderColors, SliderTokens } from "./slider.tokens";
import type { RangeSliderProps, SliderTrackShape, SliderTrackSize, SliderVariant } from "./slider.types";
import { SliderThumb } from "./slider-thumb";

// ─── Range Track ─────────────────────────────────────────────────────────────

interface RangeTrackProps {
	startPercent: number;
	endPercent: number;
	trackSize: SliderTrackSize;
	orientation: "horizontal" | "vertical";
	variant: SliderVariant;
	disabled: boolean;
	ticks: number[];
	min: number;
	max: number;
	trackShape?: SliderTrackShape;
	trackRef: React.RefObject<HTMLDivElement | null>;
	onTrackPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

/**
 * Track for RangeSlider: renders three segments.
 * Inactive | Gap | Active (range) | Gap | Inactive
 */
const RangeTrack = React.memo(function RangeTrack({
	startPercent,
	endPercent,
	trackSize,
	orientation,
	variant,
	disabled,
	ticks,
	min,
	max,
	trackShape = "md3",
	trackRef,
	onTrackPointerDown,
}: RangeTrackProps) {
	const isHorizontal = orientation === "horizontal";
	const size = SliderTokens.trackSizes[trackSize];
	const thumbHeight = SliderTokens.thumbHeights[trackSize];
	const { thumbGap, thumbWidthDefault, tickSize } = SliderTokens;
	const thumbHalfWidth = thumbWidthDefault / 2;

	const activeTrack = disabled
		? SliderColors.disabledActiveTrack
		: `var(--md-sys-color-${variant})`;
	const inactiveTrack = disabled
		? SliderColors.disabledInactiveTrack
		: `var(--md-sys-color-${variant}-container)`;

	const innerR = SliderTokens.trackInnerRadius;

	let outerR = size / 2;
	if (trackShape === "md3") {
		outerR = Math.min(SliderTokens.trackShapes[trackSize], size / 2);
	} else if (typeof trackShape === "number") {
		outerR = Math.min(trackShape, size / 2);
	}

	if (isHorizontal) {
		const insetLimit = thumbGap + thumbWidthDefault / 2;
		const trackInset = Math.min(size / 2, insetLimit);
		const cxStart = `calc(${trackInset}px + ${startPercent} * (100% - ${trackInset * 2}px))`;
		const cxEnd = `calc(${trackInset}px + ${endPercent} * (100% - ${trackInset * 2}px))`;
		const gapWithThumbStr = `${thumbGap + thumbHalfWidth}px`;

		const leadingWidth = `max(0px, calc(${cxStart} - ${gapWithThumbStr}))`;
		const activeLeft = `calc(${cxStart} + ${gapWithThumbStr})`;
		const activeWidth = `max(0px, calc(${cxEnd} - ${cxStart} - ${gapWithThumbStr} * 2))`;
		const trailingLeft = `calc(${cxEnd} + ${gapWithThumbStr})`;
		const trailingWidth = `max(0px, calc(100% - (${cxEnd} + ${gapWithThumbStr})))`;

		return (
			<div
				ref={trackRef}
				className={cn(
					"relative w-full",
					disabled ? "cursor-not-allowed" : "cursor-pointer",
				)}
				style={{ height: thumbHeight }}
				onPointerDown={onTrackPointerDown}
				aria-hidden="true"
			>
				{/* Leading inactive */}
				<div
					aria-hidden="true"
					style={{
						position: "absolute",
						left: 0,
						top: "50%",
						transform: "translateY(-50%)",
						width: leadingWidth,
						height: size,
						backgroundColor: inactiveTrack,
						opacity: disabled ? 0.38 : 1,
						borderTopLeftRadius: outerR,
						borderBottomLeftRadius: outerR,
						borderTopRightRadius: innerR,
						borderBottomRightRadius: innerR,
					}}
				/>
				{/* Active middle segment */}
				<div
					aria-hidden="true"
					style={{
						position: "absolute",
						left: activeLeft,
						top: "50%",
						transform: "translateY(-50%)",
						width: activeWidth,
						height: size,
						backgroundColor: activeTrack,
						opacity: disabled ? 0.38 : 1,
						borderTopLeftRadius: startPercent <= 0 ? outerR : innerR,
						borderBottomLeftRadius: startPercent <= 0 ? outerR : innerR,
						borderTopRightRadius: endPercent >= 1 ? outerR : innerR,
						borderBottomRightRadius: endPercent >= 1 ? outerR : innerR,
					}}
				/>
				{/* Trailing inactive */}
				<div
					aria-hidden="true"
					style={{
						position: "absolute",
						left: trailingLeft,
						top: "50%",
						transform: "translateY(-50%)",
						width: trailingWidth,
						height: size,
						backgroundColor: inactiveTrack,
						opacity: disabled ? 0.38 : 1,
						borderTopLeftRadius: innerR,
						borderBottomLeftRadius: innerR,
						borderTopRightRadius: outerR,
						borderBottomRightRadius: outerR,
					}}
				/>
				{/* Ticks for discrete mode */}
				{ticks.map((tick) => {
					const tickPct = (tick - min) / (max - min);
					const isActive = tickPct > startPercent && tickPct < endPercent;
					return (
						<div
							key={tick}
							aria-hidden="true"
							style={{
								position: "absolute",
								width: tickSize,
								height: tickSize,
								borderRadius: "50%",
								backgroundColor: disabled
									? SliderColors.disabledTick
									: isActive
										? `var(--md-sys-color-${variant}-container)`
										: `var(--md-sys-color-${variant})`,
								opacity: disabled ? 0.38 : 1,
								left: `calc(${trackInset}px + ${tickPct} * (100% - ${trackInset * 2}px) - ${tickSize / 2}px)`,
								top: "50%",
								transform: "translateY(-50%)",
							}}
						/>
					);
				})}
			</div>
		);
	}

	// ── Vertical range track ──────────────────────────────────────────────────
	const insetLimit = thumbGap + thumbWidthDefault / 2;
	const trackInset = Math.min(size / 2, insetLimit);
	const cyStart = `calc(${trackInset}px + ${startPercent} * (100% - ${trackInset * 2}px))`;
	const cyEnd = `calc(${trackInset}px + ${endPercent} * (100% - ${trackInset * 2}px))`;
	const gapWithThumbStr = `${thumbGap + thumbHalfWidth}px`;

	const leadingHeight = `max(0px, calc(${cyStart} - ${gapWithThumbStr}))`;
	const activeBottom = `calc(${cyStart} + ${gapWithThumbStr})`;
	const activeHeight = `max(0px, calc(${cyEnd} - ${cyStart} - ${gapWithThumbStr} * 2))`;
	const trailingBottom = `calc(${cyEnd} + ${gapWithThumbStr})`;
	const trailingHeight = `max(0px, calc(100% - (${cyEnd} + ${gapWithThumbStr})))`;

	return (
		<div
			ref={trackRef}
			className={cn(
				"relative h-full",
				disabled ? "cursor-not-allowed" : "cursor-pointer",
			)}
			style={{ width: thumbHeight }}
			onPointerDown={onTrackPointerDown}
			aria-hidden="true"
		>
			{/* Bottom inactive */}
			<div
				aria-hidden="true"
				style={{
					position: "absolute",
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					height: leadingHeight,
					width: size,
					backgroundColor: inactiveTrack,
					opacity: disabled ? 0.38 : 1,
					borderBottomLeftRadius: outerR,
					borderBottomRightRadius: outerR,
					borderTopLeftRadius: innerR,
					borderTopRightRadius: innerR,
				}}
			/>
			{/* Active middle */}
			<div
				aria-hidden="true"
				style={{
					position: "absolute",
					bottom: activeBottom,
					left: "50%",
					transform: "translateX(-50%)",
					height: activeHeight,
					width: size,
					backgroundColor: activeTrack,
					opacity: disabled ? 0.38 : 1,
					borderBottomLeftRadius: startPercent <= 0 ? outerR : innerR,
					borderBottomRightRadius: startPercent <= 0 ? outerR : innerR,
					borderTopLeftRadius: endPercent >= 1 ? outerR : innerR,
					borderTopRightRadius: endPercent >= 1 ? outerR : innerR,
				}}
			/>
			{/* Top inactive */}
			<div
				aria-hidden="true"
				style={{
					position: "absolute",
					bottom: trailingBottom,
					left: "50%",
					transform: "translateX(-50%)",
					height: trailingHeight,
					width: size,
					backgroundColor: inactiveTrack,
					opacity: disabled ? 0.38 : 1,
					borderTopLeftRadius: outerR,
					borderTopRightRadius: outerR,
					borderBottomLeftRadius: innerR,
					borderBottomRightRadius: innerR,
				}}
			/>
			{/* Ticks for discrete mode */}
			{ticks.map((tick) => {
				const tickPct = (tick - min) / (max - min);
				const isActive = tickPct > startPercent && tickPct < endPercent;
				return (
					<div
						key={tick}
						aria-hidden="true"
						style={{
							position: "absolute",
							width: tickSize,
							height: tickSize,
							borderRadius: "50%",
							backgroundColor: disabled
								? SliderColors.disabledTick
								: isActive
									? `var(--md-sys-color-${variant}-container)`
									: `var(--md-sys-color-${variant})`,
							opacity: disabled ? 0.38 : 1,
							bottom: `calc(${trackInset}px + ${tickPct} * (100% - ${trackInset * 2}px) - ${tickSize / 2}px)`,
							left: "50%",
							transform: "translateX(-50%)",
						}}
					/>
				);
			})}
		</div>
	);
});

// ─── RangeSlider ──────────────────────────────────────────────────────────────

const RangeSliderComponent = React.forwardRef<HTMLDivElement, RangeSliderProps>(
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
			disabled = false,
			showValueIndicator = false,
			showTicks = false,
			formatValue,
			className,
			"aria-label": ariaLabel,
		},
		ref,
	) => {
		const isHorizontal = orientation === "horizontal";

		// ── Controlled / Uncontrolled ────────────────────────────────────────
		const defaultStart = defaultValue?.[0] ?? min;
		const defaultEnd = defaultValue?.[1] ?? max;
		const [internalValue, setInternalValue] = React.useState<[number, number]>([
			defaultStart,
			defaultEnd,
		]);

		const resolvedValue: [number, number] =
			controlledValue !== undefined ? controlledValue : internalValue;

		const { coerce, snap, toPercent, ticks } = useSliderMath({
			min,
			max,
			step,
		});

		// Safe, snapped values
		const startValue = snap(coerce(resolvedValue[0]));
		const endValue = snap(coerce(resolvedValue[1]));
		const startPercent = toPercent(startValue);
		const endPercent = toPercent(endValue);

		// ── Last-active thumb z-index management ────────────────────────────
		// Whichever thumb was most recently interacted with gets zIndex=2
		const [topThumb, setTopThumb] = React.useState<"start" | "end">("end");

		// ── Track ref ───────────────────────────────────────────────────────
		const trackRef = React.useRef<HTMLDivElement>(null);

		// ── Crossover-safe setters ──────────────────────────────────────────
		// Minimum gap: 1 step (or 1 unit for continuous)
		const minGap = step > 0 ? step : (max - min) / 1000;

		const handleStartChange = React.useCallback(
			(newStart: number) => {
				setTopThumb("start");
				// Cannot exceed end thumb
				const clamped = Math.min(newStart, endValue - minGap);
				const final = snap(coerce(clamped));
				if (controlledValue === undefined) {
					setInternalValue([final, endValue]);
				}
				onValueChange?.([final, endValue]);
			},
			[controlledValue, coerce, endValue, minGap, onValueChange, snap],
		);

		const handleEndChange = React.useCallback(
			(newEnd: number) => {
				setTopThumb("end");
				// Cannot go below start thumb
				const clamped = Math.max(newEnd, startValue + minGap);
				const final = snap(coerce(clamped));
				if (controlledValue === undefined) {
					setInternalValue([startValue, final]);
				}
				onValueChange?.([startValue, final]);
			},
			[controlledValue, coerce, minGap, onValueChange, snap, startValue],
		);

		const handleStartChangeEnd = React.useCallback(
			(v: number) => onValueChangeEnd?.([v, endValue]),
			[endValue, onValueChangeEnd],
		);

		const handleEndChangeEnd = React.useCallback(
			(v: number) => onValueChangeEnd?.([startValue, v]),
			[onValueChangeEnd, startValue],
		);

		// ── Click-to-jump on track ──────────────────────────────────────────
		const handleTrackPointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (disabled) return;
				const trackEl = trackRef.current;
				if (!trackEl) return;

				const rect = trackEl.getBoundingClientRect();
				let clickPercent: number;

				const insetLimit = SliderTokens.thumbGap + SliderTokens.thumbWidthDefault / 2;
				const trackInset = Math.min(SliderTokens.trackSizes[trackSize] / 2, insetLimit);
				if (isHorizontal) {
					const x = e.clientX - rect.left;
					clickPercent =
						(x - trackInset) /
						(rect.width - trackInset * 2);
				} else {
					const y = rect.bottom - e.clientY;
					clickPercent =
						(y - trackInset) /
						(rect.height - trackInset * 2);
				}

				const clamped = Math.max(0, Math.min(1, clickPercent));
				const rawValue = min + clamped * (max - min);
				const clickValue = snap(coerce(rawValue));

				// Move whichever thumb is closer to click point
				const distStart = Math.abs(clickValue - startValue);
				const distEnd = Math.abs(clickValue - endValue);

				if (distStart <= distEnd) {
					handleStartChange(clickValue);
				} else {
					handleEndChange(clickValue);
				}
			},
			[
				coerce,
				disabled,
				endValue,
				handleEndChange,
				handleStartChange,
				isHorizontal,
				max,
				min,
				snap,
				startValue,
				trackSize,
			],
		);

		// ── IDs ─────────────────────────────────────────────────────────────
		const id = React.useId();

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
				<RangeTrack
						startPercent={startPercent}
						endPercent={endPercent}
						trackSize={trackSize}
						trackShape={trackShape}
						orientation={orientation}
						variant={variant}
						disabled={disabled}
						ticks={showTicks ? ticks : []}
						min={min}
						max={max}
						trackRef={trackRef}
						onTrackPointerDown={handleTrackPointerDown}
					/>

					<SliderThumb
						value={startValue}
						percent={startPercent}
						min={min}
						max={max}
						step={step}
						disabled={disabled}
						orientation={orientation}
						trackSize={trackSize}
						variant={variant}
						showValueIndicator={showValueIndicator}
						trackRef={trackRef}
						onValueChange={handleStartChange}
						onValueChangeEnd={handleStartChangeEnd}
						formatValue={formatValue}
						thumbId={`${id}-start`}
						zIndex={topThumb === "start" ? 2 : 1}
						aria-label={ariaLabel ? `${ariaLabel} start` : "Range start"}
					/>

					<SliderThumb
						value={endValue}
						percent={endPercent}
						min={min}
						max={max}
						step={step}
						disabled={disabled}
						orientation={orientation}
						trackSize={trackSize}
						variant={variant}
						showValueIndicator={showValueIndicator}
						trackRef={trackRef}
						onValueChange={handleEndChange}
						onValueChangeEnd={handleEndChangeEnd}
						formatValue={formatValue}
						thumbId={`${id}-end`}
						zIndex={topThumb === "end" ? 2 : 1}
						aria-label={ariaLabel ? `${ariaLabel} end` : "Range end"}
					/>
				</div>
			</LazyMotion>
		);
	},
);

RangeSliderComponent.displayName = "RangeSlider";

/**
 * MD3 Expressive RangeSlider component.
 *
 * Two-thumb slider where the active track spans between the two thumbs.
 * Thumbs cannot cross each other (crossover prevention built in).
 *
 * @example
 * ```tsx
 * // Controlled
 * <RangeSlider
 *   value={[20, 80]}
 *   onValueChange={([start, end]) => setRange([start, end])}
 *   aria-label="Price range"
 * />
 *
 * // Discrete
 * <RangeSlider defaultValue={[0, 100]} step={10} />
 *
 * // Vertical
 * <div className="h-64">
 *   <RangeSlider defaultValue={[25, 75]} orientation="vertical" />
 * </div>
 * ```
 *
 * @see https://m3.material.io/components/sliders/overview
 */
export const RangeSlider = React.memo(RangeSliderComponent);
