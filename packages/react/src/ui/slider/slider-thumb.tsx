/**
 * @file slider-thumb.tsx
 * MD3 Expressive Slider — Animated pill-shaped thumb (handle).
 *
 * Design decisions:
 * 1. POINTER EVENTS (not Framer Motion drag): We use React pointer events
 *    + useMotionValue for real-time position tracking without re-render lag.
 *    Framer Motion's `drag` prop adds momentum/inertia that conflicts with MD3
 *    precise positioning; direct pointer handling gives us full control.
 * 2. SQUEEZE ANIMATION: `whileTap` shrinks width from 4px → 2px via spring.
 * 3. INVERTED Y-AXIS: Vertical slider maps bottom=min, top=max by inverting
 *    the pointer delta direction.
 * 4. VALUE INDICATOR: AnimatePresence pill tooltip with teardrop origin point.
 * 5. ACCESSIBILITY: role=slider, full ARIA attributes, keyboard nav.
 * 6. prefers-reduced-motion: Disables all animations for accessibility.
 *
 * @see docs/m3/sliders/Slider.kt#SliderDefaults.Thumb
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { getKeyboardDelta } from "./hooks/useSliderMath";
import {
	SLIDER_INDICATOR_TRANSITION,
	SLIDER_THUMB_SPRING,
	SliderColors,
	SliderTokens,
} from "./slider.tokens";
import type { SliderThumbProps, SliderTrackSize } from "./slider.types";

// ─── Value Indicator ─────────────────────────────────────────────────────────

interface ValueIndicatorProps {
	value: number;
	visible: boolean;
	orientation: "horizontal" | "vertical";
	formatValue?: (v: number) => string;
	prefersReduced: boolean;
	trackSize: SliderTrackSize;
}

/** Floating value label that appears above/beside thumb on hover/drag. */
const ValueIndicator = React.memo(function ValueIndicator({
	value,
	visible,
	orientation,
	formatValue,
	prefersReduced,
	trackSize,
}: ValueIndicatorProps) {
	const label = formatValue ? formatValue(value) : String(Math.round(value));
	const isHorizontal = orientation === "horizontal";

	// Calculate dynamic offset so tooltip sits above the thumb regardless of trackSize
	const thumbHeight = SliderTokens.thumbHeights[trackSize];
	// Container center is 50%. The thumb top is `thumbHeight / 2` from center.
	// Add an 8px visual gap to prevent the tooltip from overlapping the thumb.
	const offsetFromCenter = thumbHeight / 2 + 8;

	return (
		<AnimatePresence>
			{visible && (
				<m.div
					key="value-indicator"
					role="tooltip"
					aria-hidden="true"
					initial={
						prefersReduced
							? false
							: {
									scale: 0,
									opacity: 0,
									y: isHorizontal ? 6 : 0,
									x: !isHorizontal ? -6 : 0,
								}
					}
					animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
					exit={
						prefersReduced
							? {}
							: {
									scale: 0,
									opacity: 0,
									y: isHorizontal ? 6 : 0,
									x: !isHorizontal ? -6 : 0,
								}
					}
					transition={
						prefersReduced ? { duration: 0 } : SLIDER_INDICATOR_TRANSITION
					}
					className={cn(
						"absolute pointer-events-none select-none",
						"rounded-full px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap",
						// Position: above for horizontal, right for vertical
						isHorizontal
							? "-translate-x-1/2 left-1/2"
							: "translate-y-1/2 bottom-1/2",
					)}
					style={{
						backgroundColor: SliderColors.valueIndicatorBg,
						color: SliderColors.valueIndicatorText,
						transformOrigin: isHorizontal ? "bottom center" : "center left",
						...(isHorizontal
							? { bottom: `calc(50% + ${offsetFromCenter}px)` }
							: { left: `calc(50% + ${offsetFromCenter}px)` }),
					}}
				>
					{label}
				</m.div>
			)}
		</AnimatePresence>
	);
});

// ─── SliderThumb ──────────────────────────────────────────────────────────────

/**
 * MD3 Expressive Slider Thumb (handle).
 *
 * - Pill shape: 4px wide × 44px tall by default.
 * - Squeezes to 2px wide on press/drag (Framer Motion spring).
 * - Floats above track via absolute positioning at `percent` along the track.
 * - Handles pointer drag via React PointerEvents + useMotionValue.
 * - Full keyboard navigation per WAI-ARIA Slider pattern.
 * - Value indicator tooltip with AnimatePresence.
 *
 * @internal — consumed by `<Slider>` and `<RangeSlider>`
 */
export const SliderThumb = React.memo(function SliderThumb({
	value,
	percent,
	min,
	max,
	step,
	disabled,
	orientation,
	showValueIndicator,
	trackRef,
	onValueChange,
	onValueChangeEnd,
	formatValue,
	thumbId,
	trackSize,
	variant,
	zIndex = 1,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
}: SliderThumbProps) {
	const isHorizontal = orientation === "horizontal";

	// Map percent to [trackInset, 100% - trackInset]
	// Cap trackInset to gap + half thumb to prevent ghost segments and allow dragging to edge.
	const insetLimit = SliderTokens.thumbGap + SliderTokens.thumbWidthDefault / 2;
	const trackInset = Math.min(
		SliderTokens.trackSizes[trackSize] / 2,
		insetLimit,
	);
	const posTarget = isHorizontal ? "left" : "bottom";
	const motionStyle = {
		[posTarget]: `calc(${trackInset}px + ${percent} * (100% - ${trackInset * 2}px))`,
	};

	const prefersReduced = useReducedMotion() ?? false;

	const [isDragging, setIsDragging] = React.useState(false);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isFocused, setIsFocused] = React.useState(false);

	// Track pointer capture ID
	const pointerIdRef = React.useRef<number | null>(null);
	const thumbRef = React.useRef<HTMLDivElement | null>(null);

	const showIndicator =
		showValueIndicator && (isDragging || isHovered || isFocused);

	// ── Position calculation ────────────────────────────────────────────────
	// Position the thumb center at `percent` along the track.
	// Offset by half-thumb to center it on the track line.

	const positionStyle: React.CSSProperties = isHorizontal
		? {
				position: "absolute",
				...motionStyle,
				top: "50%",
				transform: "translate(-50%, -50%)",
				zIndex,
			}
		: {
				position: "absolute",
				...motionStyle,
				left: "50%",
				transform: "translate(-50%, 50%)",
				zIndex,
			};

	// ── Pointer drag handlers ───────────────────────────────────────────────

	const getDeltaFromPointer = React.useCallback(
		(e: PointerEvent): number => {
			const trackEl = trackRef.current;
			if (!trackEl) return percent;

			const rect = trackEl.getBoundingClientRect();
			const space = isHorizontal ? rect.width : rect.height;
			const insetLimit =
				SliderTokens.thumbGap + SliderTokens.thumbWidthDefault / 2;
			const trackInset = Math.min(
				SliderTokens.trackSizes[trackSize] / 2,
				insetLimit,
			);
			const safeSpace = space - trackInset * 2;
			if (safeSpace <= 0) return percent;

			let rawPercent: number;
			if (isHorizontal) {
				rawPercent = (e.clientX - rect.left - trackInset) / safeSpace;
			} else {
				// Inverted Y: bottom = min (0%), top = max (100%)
				rawPercent = (rect.bottom - e.clientY - trackInset) / safeSpace;
			}

			const clamped = Math.max(0, Math.min(1, rawPercent));
			const range = max - min;
			const rawValue = min + clamped * range;
			const snapped =
				step > 0 ? Math.round((rawValue - min) / step) * step + min : rawValue;
			return Math.max(min, Math.min(max, snapped));
		},
		[isHorizontal, max, min, percent, step, trackRef, trackSize],
	);

	const handlePointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (disabled) return;
			e.preventDefault();
			e.stopPropagation();
			(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
			pointerIdRef.current = e.pointerId;
			setIsDragging(true);
		},
		[disabled],
	);

	const handlePointerMove = React.useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (!isDragging || e.pointerId !== pointerIdRef.current) return;
			const newValue = getDeltaFromPointer(e.nativeEvent);
			onValueChange(newValue);
		},
		[isDragging, getDeltaFromPointer, onValueChange],
	);

	const handlePointerUp = React.useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (e.pointerId !== pointerIdRef.current) return;
			(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
			pointerIdRef.current = null;
			setIsDragging(false);
			onValueChangeEnd?.(value);
		},
		[onValueChangeEnd, value],
	);

	// ── Keyboard navigation ──────────────────────────────────────────────────

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;

			if (e.key === "Home") {
				e.preventDefault();
				onValueChange(min);
				onValueChangeEnd?.(min);
				return;
			}
			if (e.key === "End") {
				e.preventDefault();
				onValueChange(max);
				onValueChangeEnd?.(max);
				return;
			}

			const delta = getKeyboardDelta(e.key, step, min, max);
			if (delta === null) return;
			e.preventDefault();

			const newValue = Math.max(min, Math.min(max, value + delta));
			onValueChange(newValue);
			onValueChangeEnd?.(newValue);
		},
		[disabled, max, min, onValueChange, onValueChangeEnd, step, value],
	);

	// ── Render ───────────────────────────────────────────────────────────────
	const thumbColor = disabled
		? SliderColors.disabledThumb
		: `var(--md-sys-color-${variant})`;

	const squeezeSize = isDragging
		? SliderTokens.thumbWidthPressed
		: SliderTokens.thumbWidthDefault;

	return (
		<div
			style={{
				...positionStyle,
				width: SliderTokens.thumbTouchTarget,
				height: SliderTokens.thumbTouchTarget,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				touchAction: "none",
			}}
			className={cn(
				"cursor-grab",
				isDragging && "cursor-grabbing",
				disabled && "cursor-not-allowed",
			)}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
		>
			<ValueIndicator
				value={value}
				visible={showIndicator}
				orientation={orientation}
				formatValue={formatValue}
				prefersReduced={prefersReduced}
				trackSize={trackSize}
			/>

			<m.div
				ref={thumbRef}
				id={thumbId}
				role="slider"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-orientation={orientation}
				aria-disabled={disabled || undefined}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				tabIndex={disabled ? -1 : 0}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onMouseEnter={() => !disabled && setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				animate={{
					...(isHorizontal ? { width: squeezeSize } : { height: squeezeSize }),
					backgroundColor: thumbColor,
					opacity: disabled ? 0.38 : 1,
				}}
				transition={prefersReduced ? { duration: 0 } : SLIDER_THUMB_SPRING}
				className={cn(
					"relative shrink-0 rounded-full select-none outline-none",
					"focus-visible:outline-2 focus-visible:outline-offset-2",
					"focus-visible:outline-(--md-sys-color-secondary)",
				)}
				style={{
					...(isHorizontal
						? {
								height: SliderTokens.thumbHeights[trackSize],
								width: SliderTokens.thumbWidthDefault,
								willChange: "width",
							}
						: {
								width: SliderTokens.thumbHeights[trackSize],
								height: SliderTokens.thumbWidthDefault,
								willChange: "height",
							}),
					backgroundColor: thumbColor,
				}}
			/>
		</div>
	);
});
