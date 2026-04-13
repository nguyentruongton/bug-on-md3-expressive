/**
 * @file slider-track.tsx
 * MD3 Expressive Slider — Track with asymmetric corner radii, 6px thumb gaps,
 * discrete tick marks, and centered-mode support.
 *
 * Design decisions:
 * 1. GAP MATH: The 6px gap between track and thumb is calculated mathematically
 *    using CSS calc() — NOT using margin/padding which would break layout.
 * 2. ASYMMETRIC RADII: Inner corners (facing thumb) = 2px; outer ends = size/2 (pill cap).
 * 3. CENTERED MODE: Active segment spans from 50% outward to thumb, not from min.
 * 4. TICKS: 4×4px dots positioned absolutely along track center axis.
 *    Color differs on active vs inactive portions of the track.
 * 5. VERTICAL: Uses height/top instead of width/left, with inverted axis
 *    (bottom=0%, top=100%) per MD3 vertical spec.
 *
 * @see docs/m3/sliders/Slider.kt#SliderDefaults.Track
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { SliderColors, SliderTokens } from "./slider.tokens";
import type {
	SliderOrientation,
	SliderTrackProps,
	SliderTrackSize,
	SliderVariant,
} from "./slider.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns border-radius for a horizontal track segment.
 * @param isLeading - whether this segment is on the leading (left) side of the thumb
 */
function getHorizontalRadius(
	isLeading: boolean,
	innerR: number,
	outerR: number,
): React.CSSProperties {
	if (isLeading) {
		return {
			borderTopLeftRadius: outerR,
			borderBottomLeftRadius: outerR,
			borderTopRightRadius: innerR,
			borderBottomRightRadius: innerR,
		};
	}
	return {
		borderTopLeftRadius: innerR,
		borderBottomLeftRadius: innerR,
		borderTopRightRadius: outerR,
		borderBottomRightRadius: outerR,
	};
}

/** Border-radius for a vertical track segment. */
function getVerticalRadius(
	isLeading: boolean,
	innerR: number,
	outerR: number,
): React.CSSProperties {
	if (isLeading) {
		return {
			borderBottomLeftRadius: outerR,
			borderBottomRightRadius: outerR,
			borderTopLeftRadius: innerR,
			borderTopRightRadius: innerR,
		};
	}
	return {
		borderTopLeftRadius: outerR,
		borderTopRightRadius: outerR,
		borderBottomLeftRadius: innerR,
		borderBottomRightRadius: innerR,
	};
}

/** All-inner-radius shorthand for centered active segments (no pill caps). */
const allInnerRadius = (innerR: number): React.CSSProperties => ({
	borderTopLeftRadius: innerR,
	borderBottomLeftRadius: innerR,
	borderTopRightRadius: innerR,
	borderBottomRightRadius: innerR,
});

// ─── Inset Icon ───────────────────────────────────────────────────────────────

interface InsetIconProps {
	/** The icon node to render. */
	icon: React.ReactNode;
	/** Whether the icon is currently positioned on the active (filled) segment. */
	isOnActiveSegment: boolean;
	/** The computed 'left' (horizontal) or 'bottom' (vertical) CSS value. */
	position: string;
	orientation: SliderOrientation;
	/** Physical track height/width in px. */
	trackSize: number;
	/** Size token for looking up tokens (e.g. 'xl') */
	trackSizeToken: SliderTrackSize;
	disabled: boolean;
	/** Color variant to match leading/trailing track. */
	variant: SliderVariant;
	/** Suppresses motion when user prefers reduced motion. */
	prefersReduced: boolean;
}

/**
 * Icon rendered inside the slider track.
 *
 * When the key changes (active ↔ inactive swap), AnimatePresence unmounts this
 * with a fade-out, then mounts the new instance with a fade-in at its target
 * position — producing the MD3 "hop" effect without any position cross-over.
 * When the key stays the same (e.g. trailing-inactive tracking the thumb),
 * the spring on `left`/`bottom` keeps it smoothly glued to the thumb.
 */
const InsetIcon = React.memo(function InsetIcon({
	icon,
	isOnActiveSegment,
	position,
	orientation,
	trackSize,
	trackSizeToken,
	disabled,
	variant,
	prefersReduced,
}: InsetIconProps) {
	const iconSize = Math.min(
		SliderTokens.insetIconSizes[trackSizeToken],
		Math.max(4, trackSize - SliderTokens.insetIconPadding * 2),
	);

	const activeColor = `var(--md-sys-color-on-${variant})`;
	const inactiveColor = `var(--md-sys-color-${variant})`;
	const isHorizontal = orientation === "horizontal";
	const fastFade = prefersReduced ? { duration: 0 } : { duration: 0.12 };

	return (
		<m.div
			aria-hidden="true"
			className="[&_svg]:w-full [&_svg]:h-full"
			initial={{
				opacity: 0,
				...(isHorizontal ? { left: position } : { bottom: position }),
			}}
			animate={{
				[isHorizontal ? "left" : "bottom"]: position,
				opacity: disabled ? 0.38 : 1,
				color: isOnActiveSegment ? activeColor : inactiveColor,
			}}
			exit={{ opacity: 0, transition: fastFade }}
			transition={
				prefersReduced
					? { duration: 0 }
					: {
							left: { type: "spring", stiffness: 500, damping: 40 },
							bottom: { type: "spring", stiffness: 500, damping: 40 },
							opacity: fastFade,
							color: fastFade,
						}
			}
			style={{
				position: "absolute",
				width: iconSize,
				height: iconSize,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				pointerEvents: "none",
				zIndex: 1,
				willChange: isHorizontal ? "left" : "bottom",
				...(isHorizontal
					? { top: "50%", transform: "translateY(-50%)" }
					: { left: "50%", transform: "translateX(-50%)" }),
			}}
		>
			{icon}
		</m.div>
	);
});

// ─── Tick Marks ───────────────────────────────────────────────────────────────

interface TicksProps {
	ticks: number[];
	min: number;
	max: number;
	percent: number;
	orientation: "horizontal" | "vertical";
	variant: SliderVariant;
	disabled: boolean;
	/** Pre-computed track inset — avoids recalculating in every tick render. */
	trackInset: number;
}

/** Renders tick dot markers for discrete slider mode. */
function Ticks({
	ticks,
	min,
	max,
	percent,
	orientation,
	variant,
	isCentered,
	disabled,
	trackInset,
}: TicksProps & { isCentered?: boolean }) {
	if (ticks.length === 0) return null;
	const { thumbGap, thumbWidthDefault, tickSize } = SliderTokens;

	return (
		<>
			{ticks.map((tick) => {
				const tickPercent = (tick - min) / (max - min);
				const isOnActive = isCentered
					? percent >= 0.5
						? tickPercent >= 0.5 && tickPercent <= percent
						: tickPercent <= 0.5 && tickPercent >= percent
					: tickPercent <= percent;

				// Skip ticks that would be visually hidden inside the thumb gap
				const thumbStart = percent - (thumbGap + thumbWidthDefault / 2) / 100;
				const thumbEnd = percent + (thumbGap + thumbWidthDefault / 2) / 100;
				if (tickPercent > thumbStart && tickPercent < thumbEnd) return null;

				const color = disabled
					? SliderColors.disabledTick
					: isOnActive
						? `var(--md-sys-color-${variant}-container)`
						: `var(--md-sys-color-${variant})`;

				const style: React.CSSProperties = {
					position: "absolute",
					width: tickSize,
					height: tickSize,
					borderRadius: "50%",
					backgroundColor: color,
					opacity: disabled ? 0.38 : 1,
					...(orientation === "horizontal"
						? {
								left: `calc(${trackInset}px + ${tickPercent} * (100% - ${trackInset * 2}px) - ${tickSize / 2}px)`,
								top: "50%",
								transform: "translateY(-50%)",
							}
						: {
								// Vertical: bottom=0%, top=100% (inverted Y-axis)
								bottom: `calc(${trackInset}px + ${tickPercent} * (100% - ${trackInset * 2}px) - ${tickSize / 2}px)`,
								left: "50%",
								transform: "translateX(-50%)",
							}),
				};

				return <div key={tick} style={style} aria-hidden="true" />;
			})}
		</>
	);
}

// ─── SliderTrack ──────────────────────────────────────────────────────────────

/**
 * MD3 Expressive Slider Track.
 */
export const SliderTrack = React.memo(function SliderTrack({
	percent,
	trackSize,
	orientation,
	variant,
	isCentered,
	min,
	max,
	disabled,
	trackRef,
	onTrackPointerDown,
	ticks = [],
	insetIcon,
	insetIconAtMin,
	insetIconTrailing,
	insetIconAtMax,
	value,
	trackShape = "md3",
}: Omit<SliderTrackProps, "step"> & { ticks?: number[] }) {
	const isHorizontal = orientation === "horizontal";
	const size = SliderTokens.trackSizes[trackSize];
	const thumbHeight = SliderTokens.thumbHeights[trackSize];
	const { thumbGap, thumbWidthDefault, trackInnerRadius } = SliderTokens;
	const innerR = trackInnerRadius;

	let outerR = size / 2;
	if (trackShape === "md3") {
		outerR = Math.min(SliderTokens.trackShapes[trackSize], size / 2);
	} else if (typeof trackShape === "number") {
		outerR = Math.min(trackShape, size / 2);
	}

	const thumbHalfWidth = thumbWidthDefault / 2;
	const gapWithThumbStr = `${thumbGap + thumbHalfWidth}px`;

	// ── Inset icon state ─────────────────────────────────────────────────────
	const hasAnyInsetIcon = Boolean(insetIcon || insetIconTrailing);
	const prefersReduced = useReducedMotion() ?? false;

	// Measure actual track width to compute placement threshold.
	const [trackWidth, setTrackWidth] = React.useState(0);
	React.useLayoutEffect(() => {
		const el = trackRef.current;
		if (!el || !hasAnyInsetIcon) return;
		// Initial measure
		setTrackWidth(isHorizontal ? el.clientWidth : el.clientHeight);
		// Update on resize
		const ro = new ResizeObserver(() => {
			setTrackWidth(isHorizontal ? el.clientWidth : el.clientHeight);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [hasAnyInsetIcon, isHorizontal, trackRef]);

	// Minimum percent required to keep icon on the active segment.
	// = (iconSize + 2*padding + gap + halfThumb) / trackWidth
	const activeIconSize = Math.min(
		SliderTokens.insetIconSizes[trackSize],
		Math.max(4, size - SliderTokens.insetIconPadding * 2),
	);

	const iconTotalWidth =
		activeIconSize +
		SliderTokens.insetIconPadding * 2 +
		thumbGap +
		thumbHalfWidth;
	const iconThreshold = trackWidth > 0 ? iconTotalWidth / trackWidth : 0.15;

	// Ref-based hysteresis — avoids a setState re-render cycle (which caused a
	// 1-frame lag flicker). A dead-zone of 4% prevents rapid toggling when the
	// thumb is near the switch boundary during fast drags.
	// Enter active when: remaining space < threshold
	// Exit active when:  remaining space > threshold + 4%  (dead-zone)
	const HYSTERESIS_GAP = 0.04;
	const trailingActiveRef = React.useRef(1 - percent <= iconThreshold);
	const leadingActiveRef = React.useRef(percent > iconThreshold);

	// Trailing icon hysteresis
	const trailingPercent = 1 - percent;
	if (trailingActiveRef.current) {
		if (trailingPercent > iconThreshold + HYSTERESIS_GAP) {
			trailingActiveRef.current = false;
		}
	} else {
		if (trailingPercent <= iconThreshold) {
			trailingActiveRef.current = true;
		}
	}
	const trailingOnActive = trailingActiveRef.current;

	// Leading icon hysteresis
	if (leadingActiveRef.current) {
		if (percent <= iconThreshold - HYSTERESIS_GAP) {
			leadingActiveRef.current = false;
		}
	} else {
		if (percent > iconThreshold) {
			leadingActiveRef.current = true;
		}
	}
	const leadingOnActive = leadingActiveRef.current;

	// Resolve which icon to show (swap at min)
	const isAtMin = value !== undefined && value <= min;
	const resolvedLeadingIcon =
		isAtMin && insetIconAtMin ? insetIconAtMin : insetIcon;

	const isAtMax = value !== undefined && value >= max;
	const resolvedTrailingIcon =
		isAtMax && insetIconAtMax ? insetIconAtMax : insetIconTrailing;

	// ── Colors ───────────────────────────────────────────────────────────────
	const activeColor = disabled
		? SliderColors.disabledActiveTrack
		: `var(--md-sys-color-${variant})`;
	const inactiveColor = disabled
		? SliderColors.disabledInactiveTrack
		: `var(--md-sys-color-${variant}-container)`;
	const insetLimit = SliderTokens.thumbGap + SliderTokens.thumbWidthDefault / 2;
	const trackInset = Math.min(size / 2, insetLimit);

	// Icon positions in CSS (computed after trackInset is available)
	const gapTotal = thumbGap + thumbHalfWidth;
	const thumbCenter = `calc(${trackInset}px + ${percent} * (100% - ${trackInset * 2}px))`;

	// Leading Icon positions
	const leadingActiveLeft = `${trackInset + SliderTokens.insetIconPadding}px`;
	const leadingInactiveLeft = `calc(${thumbCenter} + ${gapTotal}px + ${SliderTokens.insetIconPadding}px)`;

	// Trailing Icon positions
	const trailingInactiveLeft = `calc(100% - ${trackInset}px - ${activeIconSize}px - ${SliderTokens.insetIconPadding}px)`;
	const trailingActiveLeft = `calc(${thumbCenter} - ${gapTotal}px - ${activeIconSize}px - ${SliderTokens.insetIconPadding}px)`;

	// ── Horizontal layout ────────────────────────────────────────────────────
	if (isHorizontal) {
		const cxStr = `calc(${trackInset}px + ${percent} * (100% - ${trackInset * 2}px))`;

		const segments: React.ReactNode[] = [];

		if (!isCentered) {
			const leftSegmentWidth = `max(0px, calc(${cxStr} - ${gapWithThumbStr}))`;
			const rightSegmentLeft = `calc(${cxStr} + ${gapWithThumbStr})`;
			const rightSegmentWidth = `max(0px, calc(100% - (${cxStr} + ${gapWithThumbStr})))`;

			// Leading Segment
			segments.push(
				<div
					key="left"
					aria-hidden="true"
					style={{
						position: "absolute",
						left: 0,
						top: "50%",
						transform: "translateY(-50%)",
						width: leftSegmentWidth,
						height: size,
						backgroundColor: activeColor,
						opacity: disabled ? 0.38 : 1,
						...getHorizontalRadius(true, innerR, outerR),
					}}
				/>,
			);

			// Trailing Segment
			segments.push(
				<div
					key="right"
					aria-hidden="true"
					style={{
						position: "absolute",
						left: rightSegmentLeft,
						top: "50%",
						transform: "translateY(-50%)",
						width: rightSegmentWidth,
						height: size,
						backgroundColor: inactiveColor,
						opacity: disabled ? 0.38 : 1,
						...getHorizontalRadius(false, innerR, outerR),
					}}
				/>,
			);
		} else {
			// Centered mode
			const halfCenterGap = SliderTokens.thumbGap / 2;

			if (percent >= 0.5) {
				// Left base segment (Inactive)
				const leftBaseWidth = `max(0px, min(calc(50% - ${halfCenterGap}px), calc(${cxStr} - ${gapWithThumbStr})))`;
				segments.push(
					<div
						key="left-base"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: 0,
							top: "50%",
							transform: "translateY(-50%)",
							width: leftBaseWidth,
							height: size,
							backgroundColor: inactiveColor,
							opacity: disabled ? 0.38 : 1,
							...getHorizontalRadius(true, innerR, outerR),
						}}
					/>,
				);

				// Center active segment
				const centerActiveLeft = `calc(50% + ${halfCenterGap}px)`;
				const centerActiveWidth = `max(0px, calc(${cxStr} - ${gapWithThumbStr} - (50% + ${halfCenterGap}px)))`;
				segments.push(
					<div
						key="center-active"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: centerActiveLeft,
							top: "50%",
							transform: "translateY(-50%)",
							width: centerActiveWidth,
							height: size,
							backgroundColor: activeColor,
							opacity: disabled ? 0.38 : 1,
							...allInnerRadius(innerR),
						}}
					/>,
				);

				// Right base segment (Inactive)
				const rightBaseLeft = `calc(${cxStr} + ${gapWithThumbStr})`;
				const rightBaseWidth = `max(0px, calc(100% - (${cxStr} + ${gapWithThumbStr})))`;
				segments.push(
					<div
						key="right-base"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: rightBaseLeft,
							top: "50%",
							transform: "translateY(-50%)",
							width: rightBaseWidth,
							height: size,
							backgroundColor: inactiveColor,
							opacity: disabled ? 0.38 : 1,
							...getHorizontalRadius(false, innerR, outerR),
						}}
					/>,
				);
			} else {
				// Left base segment (Inactive)
				const leftBaseWidth = `max(0px, calc(${cxStr} - ${gapWithThumbStr}))`;
				segments.push(
					<div
						key="left-base"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: 0,
							top: "50%",
							transform: "translateY(-50%)",
							width: leftBaseWidth,
							height: size,
							backgroundColor: inactiveColor,
							opacity: disabled ? 0.38 : 1,
							...getHorizontalRadius(true, innerR, outerR),
						}}
					/>,
				);

				// Center active segment
				const centerActiveLeft = `calc(${cxStr} + ${gapWithThumbStr})`;
				const centerActiveWidth = `max(0px, calc(50% - ${halfCenterGap}px - (${cxStr} + ${gapWithThumbStr})))`;
				segments.push(
					<div
						key="center-active"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: centerActiveLeft,
							top: "50%",
							transform: "translateY(-50%)",
							width: centerActiveWidth,
							height: size,
							backgroundColor: activeColor,
							opacity: disabled ? 0.38 : 1,
							...allInnerRadius(innerR),
						}}
					/>,
				);

				// Right base segment (Inactive)
				const rightBaseLeft = `max(calc(50% + ${halfCenterGap}px), calc(${cxStr} + ${gapWithThumbStr}))`;
				const rightBaseWidth = `max(0px, calc(100% - max(calc(50% + ${halfCenterGap}px), calc(${cxStr} + ${gapWithThumbStr}))))`;
				segments.push(
					<div
						key="right-base"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: rightBaseLeft,
							top: "50%",
							transform: "translateY(-50%)",
							width: rightBaseWidth,
							height: size,
							backgroundColor: inactiveColor,
							opacity: disabled ? 0.38 : 1,
							...getHorizontalRadius(false, innerR, outerR),
						}}
					/>,
				);
			}
		}

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
				{segments}
				{ticks.length > 0 && (
					<Ticks
						ticks={ticks}
						min={min}
						max={max}
						percent={percent}
						orientation={orientation}
						disabled={disabled}
						variant={variant}
						isCentered={isCentered}
						trackInset={trackInset}
					/>
				)}
				{/* Inset Icons (Leading & Trailing) */}
				{/* Leading icon: key changes on min-swap OR active↔inactive swap → fade transition */}
				<AnimatePresence mode="wait">
					{resolvedLeadingIcon && (
						<InsetIcon
							key={
								isAtMin
									? "lead-min"
									: leadingOnActive
										? "lead-active"
										: "lead-inactive"
							}
							icon={resolvedLeadingIcon}
							isOnActiveSegment={leadingOnActive}
							position={
								leadingOnActive ? leadingActiveLeft : leadingInactiveLeft
							}
							orientation={orientation}
							trackSize={size}
							trackSizeToken={trackSize}
							disabled={disabled}
							variant={variant}
							prefersReduced={prefersReduced}
						/>
					)}
				</AnimatePresence>

				{/* Trailing icon: key changes on max-swap OR active↔inactive swap → fade transition */}
				<AnimatePresence mode="wait">
					{resolvedTrailingIcon && (
						<InsetIcon
							key={
								isAtMax
									? "trail-max"
									: trailingOnActive
										? "trail-active"
										: "trail-inactive"
							}
							icon={resolvedTrailingIcon}
							isOnActiveSegment={trailingOnActive}
							position={
								trailingOnActive ? trailingActiveLeft : trailingInactiveLeft
							}
							orientation={orientation}
							trackSize={size}
							trackSizeToken={trackSize}
							disabled={disabled}
							variant={variant}
							prefersReduced={prefersReduced}
						/>
					)}
				</AnimatePresence>
			</div>
		);
	}

	// ── Vertical layout ───────────────────────────────────────────────────────
	const cyStr = `calc(${trackInset}px + ${percent} * (100% - ${trackInset * 2}px))`;

	const segments: React.ReactNode[] = [];

	if (!isCentered) {
		const bottomSegmentHeight = `max(0px, calc(${cyStr} - ${gapWithThumbStr}))`;
		const topSegmentBottom = `calc(${cyStr} + ${gapWithThumbStr})`;
		const topSegmentHeight = `max(0px, calc(100% - (${cyStr} + ${gapWithThumbStr})))`;

		// Bottom segment
		segments.push(
			<div
				key="bottom"
				aria-hidden="true"
				style={{
					position: "absolute",
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					height: bottomSegmentHeight,
					width: size,
					backgroundColor: activeColor,
					opacity: disabled ? 0.38 : 1,
					...getVerticalRadius(true, innerR, outerR),
				}}
			/>,
		);

		// Top segment
		segments.push(
			<div
				key="top"
				aria-hidden="true"
				style={{
					position: "absolute",
					bottom: topSegmentBottom,
					left: "50%",
					transform: "translateX(-50%)",
					height: topSegmentHeight,
					width: size,
					backgroundColor: inactiveColor,
					opacity: disabled ? 0.38 : 1,
					...getVerticalRadius(false, innerR, outerR),
				}}
			/>,
		);
	} else {
		// Centered mode (Vertical is inverted: bottom=0%, top=100%)
		const halfCenterGap = SliderTokens.thumbGap / 2;

		if (percent >= 0.5) {
			// Bottom base segment (Inactive)
			const bottomBaseHeight = `max(0px, min(calc(50% - ${halfCenterGap}px), calc(${cyStr} - ${gapWithThumbStr})))`;
			segments.push(
				<div
					key="bottom-base"
					aria-hidden="true"
					style={{
						position: "absolute",
						bottom: 0,
						left: "50%",
						transform: "translateX(-50%)",
						height: bottomBaseHeight,
						width: size,
						backgroundColor: inactiveColor,
						opacity: disabled ? 0.38 : 1,
						...getVerticalRadius(true, innerR, outerR),
					}}
				/>,
			);

			// Center active segment
			const centerActiveBottom = `calc(50% + ${halfCenterGap}px)`;
			const centerActiveHeight = `max(0px, calc(${cyStr} - ${gapWithThumbStr} - (50% + ${halfCenterGap}px)))`;
			segments.push(
				<div
					key="center-active"
					aria-hidden="true"
					style={{
						position: "absolute",
						bottom: centerActiveBottom,
						left: "50%",
						transform: "translateX(-50%)",
						height: centerActiveHeight,
						width: size,
						backgroundColor: activeColor,
						opacity: disabled ? 0.38 : 1,
						...allInnerRadius(innerR),
					}}
				/>,
			);

			// Top base segment (Inactive)
			const topBaseBottom = `calc(${cyStr} + ${gapWithThumbStr})`;
			const topBaseHeight = `max(0px, calc(100% - (${cyStr} + ${gapWithThumbStr})))`;
			segments.push(
				<div
					key="top-base"
					aria-hidden="true"
					style={{
						position: "absolute",
						bottom: topBaseBottom,
						left: "50%",
						transform: "translateX(-50%)",
						height: topBaseHeight,
						width: size,
						backgroundColor: inactiveColor,
						opacity: disabled ? 0.38 : 1,
						...getVerticalRadius(false, innerR, outerR),
					}}
				/>,
			);
		} else {
			// Bottom base segment (Inactive)
			const bottomBaseHeight = `max(0px, calc(${cyStr} - ${gapWithThumbStr}))`;
			segments.push(
				<div
					key="bottom-base"
					aria-hidden="true"
					style={{
						position: "absolute",
						bottom: 0,
						left: "50%",
						transform: "translateX(-50%)",
						height: bottomBaseHeight,
						width: size,
						backgroundColor: inactiveColor,
						opacity: disabled ? 0.38 : 1,
						...getVerticalRadius(true, innerR, outerR),
					}}
				/>,
			);

			// Center active segment
			const centerActiveBottom = `calc(${cyStr} + ${gapWithThumbStr})`;
			const centerActiveHeight = `max(0px, calc(50% - ${halfCenterGap}px - (${cyStr} + ${gapWithThumbStr})))`;
			segments.push(
				<div
					key="center-active"
					aria-hidden="true"
					style={{
						position: "absolute",
						bottom: centerActiveBottom,
						left: "50%",
						transform: "translateX(-50%)",
						height: centerActiveHeight,
						width: size,
						backgroundColor: activeColor,
						opacity: disabled ? 0.38 : 1,
						...allInnerRadius(innerR),
					}}
				/>,
			);

			// Top base segment (Inactive)
			const topBaseBottom = `max(calc(50% + ${halfCenterGap}px), calc(${cyStr} + ${gapWithThumbStr}))`;
			const topBaseHeight = `max(0px, calc(100% - max(calc(50% + ${halfCenterGap}px), calc(${cyStr} + ${gapWithThumbStr}))))`;
			segments.push(
				<div
					key="top-base"
					aria-hidden="true"
					style={{
						position: "absolute",
						bottom: topBaseBottom,
						left: "50%",
						transform: "translateX(-50%)",
						height: topBaseHeight,
						width: size,
						backgroundColor: inactiveColor,
						opacity: disabled ? 0.38 : 1,
						...getVerticalRadius(false, innerR, outerR),
					}}
				/>,
			);
		}
	}

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
			{segments}
			{ticks.length > 0 && (
				<Ticks
					ticks={ticks}
					min={min}
					max={max}
					percent={percent}
					orientation={orientation}
					disabled={disabled}
					variant={variant}
					isCentered={isCentered}
					trackInset={trackInset}
				/>
			)}
			{/* Inset Icons (Leading & Trailing) */}
			{/* Leading icon: key changes on min-swap OR active↔inactive swap → fade transition */}
			<AnimatePresence mode="wait">
				{resolvedLeadingIcon && (
					<InsetIcon
						key={
							isAtMin
								? "lead-min"
								: leadingOnActive
									? "lead-active"
									: "lead-inactive"
						}
						icon={resolvedLeadingIcon}
						isOnActiveSegment={leadingOnActive}
						position={leadingOnActive ? leadingActiveLeft : leadingInactiveLeft}
						orientation={orientation}
						trackSize={size}
						trackSizeToken={trackSize}
						disabled={disabled}
						variant={variant}
						prefersReduced={prefersReduced}
					/>
				)}
			</AnimatePresence>

			{/* Trailing icon: key changes on max-swap OR active↔inactive swap → fade transition */}
			<AnimatePresence mode="wait">
				{resolvedTrailingIcon && (
					<InsetIcon
						key={
							isAtMax
								? "trail-max"
								: trailingOnActive
									? "trail-active"
									: "trail-inactive"
						}
						icon={resolvedTrailingIcon}
						isOnActiveSegment={trailingOnActive}
						position={
							trailingOnActive ? trailingActiveLeft : trailingInactiveLeft
						}
						orientation={orientation}
						trackSize={size}
						trackSizeToken={trackSize}
						disabled={disabled}
						variant={variant}
						prefersReduced={prefersReduced}
					/>
				)}
			</AnimatePresence>
		</div>
	);
});
