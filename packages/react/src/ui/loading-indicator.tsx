"use client";

import { domMax, LazyMotion, m, useAnimationControls } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Expressive Loading Indicator
//
// Used for short wait times (<5s). Replaces most indeterminate circular
// progress indicators. The active indicator morphs continuously through
// 7 unique Material shape key-frames via SVG path animation.
//
// Spec: https://m3.material.io/components/loading-indicators
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 7 Material 1 shapes represented as SVG paths within a 240×240 viewBox.
 * Each shape is a closed bezier path that can be interpolated smoothly
 * by framer-motion's SVG path morphing.
 */
const MATERIAL_SHAPES: string[] = [
	// 1. Circle
	"M120,20 C175,20 220,65 220,120 C220,175 175,220 120,220 C65,220 20,175 20,120 C20,65 65,20 120,20 Z",
	// 2. Rounded triangle
	"M120,25 C130,25 140,30 148,38 L210,130 C218,142 218,158 210,170 L148,202 C140,210 130,215 120,215 C110,215 100,210 92,202 L30,170 C22,158 22,142 30,130 L92,38 C100,30 110,25 120,25 Z",
	// 3. Rounded diamond / rotated square
	"M120,15 C128,15 136,19 142,25 L215,98 C221,104 225,112 225,120 C225,128 221,136 215,142 L142,215 C136,221 128,225 120,225 C112,225 104,221 98,215 L25,142 C19,136 15,128 15,120 C15,112 19,104 25,98 L98,25 C104,19 112,15 120,15 Z",
	// 4. Rounded pentagon
	"M120,18 C128,18 136,22 140,28 L212,90 C220,97 224,108 222,118 L198,198 C196,208 188,216 178,220 L62,220 C52,216 44,208 42,198 L18,118 C16,108 20,97 28,90 L100,28 C104,22 112,18 120,18 Z",
	// 5. Rounded hexagon
	"M120,18 C128,18 136,22 142,30 L208,80 C216,88 220,98 220,110 L220,150 C220,162 216,172 208,180 L142,210 C136,218 128,222 120,222 C112,222 104,218 98,210 L32,180 C24,172 20,162 20,150 L20,110 C20,98 24,88 32,80 L98,30 C104,22 112,18 120,18 Z",
	// 6. Rounded star / 4-point soft star
	"M120,15 C130,15 135,40 150,55 C165,70 200,65 210,80 C220,95 195,115 195,130 C195,145 220,155 210,170 C200,185 168,175 150,188 C132,200 130,230 120,230 C110,230 108,200 90,188 C72,175 40,185 30,170 C20,155 45,145 45,130 C45,115 20,95 30,80 C40,65 75,70 90,55 C105,40 110,15 120,15 Z",
	// 7. Rounded clover / organic blob
	"M120,20 C145,20 160,45 170,60 C185,50 210,40 225,60 C240,80 220,105 210,120 C220,135 240,160 225,180 C210,200 185,190 170,180 C160,195 145,220 120,220 C95,220 80,195 70,180 C55,190 30,200 15,180 C0,160 20,135 30,120 C20,105 0,80 15,60 C30,40 55,50 70,60 C80,45 95,20 120,20 Z",
];

const MORPH_DURATION = 0.6;

// ─── Types ───────────────────────────────────────────────────────────────────
export interface LoadingIndicatorProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	/**
	 * Visual style variant.
	 * - `uncontained` (default): bare indicator, no background
	 * - `contained`: indicator sits inside a circular container (38dp)
	 */
	variant?: "uncontained" | "contained";
	/**
	 * Indicator size in pixels. Scales flexibly from 24 to 240.
	 * @default 48
	 */
	size?: number;
	/**
	 * Active indicator color override. Falls back to token.
	 */
	color?: string;
	/**
	 * Required accessible label describing what is loading.
	 * @example "Loading news article"
	 */
	"aria-label": string;
}

// ─── Inner morphing animation (extracted for clarity) ────────────────────────
function MorphingShape({
	color,
	indicatorSize,
}: { color?: string; indicatorSize: number }) {
	const controls = useAnimationControls();
	const shapeIndexRef = React.useRef(0);

	React.useEffect(() => {
		let cancelled = false;

		async function runLoop() {
			while (!cancelled) {
				const nextIdx =
					(shapeIndexRef.current + 1) % MATERIAL_SHAPES.length;
				shapeIndexRef.current = nextIdx;
				await controls.start({
					d: MATERIAL_SHAPES[nextIdx],
					transition: {
						duration: MORPH_DURATION,
						ease: [0.2, 0, 0, 1], // MD3 standard easing
					},
				});
			}
		}

		runLoop();
		return () => {
			cancelled = true;
		};
	}, [controls]);

	return (
		<svg
			viewBox="0 0 240 240"
			width={indicatorSize}
			height={indicatorSize}
			fill="none"
			aria-hidden="true"
		>
			<m.path
				d={MATERIAL_SHAPES[0]}
				fill={color || "var(--md-sys-color-indicator-active)"}
				animate={controls}
			/>
		</svg>
	);
}

// ─── Main Component ──────────────────────────────────────────────────────────
export const LoadingIndicator = React.forwardRef<
	HTMLDivElement,
	LoadingIndicatorProps
>(
	(
		{
			variant = "uncontained",
			size = 48,
			color,
			className,
			"aria-label": ariaLabel,
			...restProps
		},
		ref,
	) => {
		const isContained = variant === "contained";

		// Contained: indicator inside a 38dp circle, total wrapper 48dp (for margins)
		// Scale proportionally if size differs from default 48
		const scaleFactor = size / 48;
		const containerSize = isContained ? 38 * scaleFactor : undefined;
		const indicatorSize = isContained ? 24 * scaleFactor : size;

		// Clamp size between 24-240
		const clampedSize = Math.min(240, Math.max(24, indicatorSize));

		const activeColor = isContained
			? color || "var(--md-sys-color-indicator-contained-active)"
			: color;

		return (
			<LazyMotion features={domMax} strict>
				<div
					ref={ref}
					role="progressbar"
					aria-label={ariaLabel}
					aria-valuemin={0}
					aria-valuemax={100}
					className={cn(
						"inline-flex items-center justify-center shrink-0",
						className,
					)}
					style={{
						width: size,
						height: size,
					}}
					{...restProps}
				>
					{isContained ? (
						<div
							className="flex items-center justify-center rounded-full"
							style={{
								width: containerSize,
								height: containerSize,
								backgroundColor:
									"var(--md-sys-color-indicator-contained-container)",
							}}
						>
							<MorphingShape
								color={activeColor}
								indicatorSize={clampedSize}
							/>
						</div>
					) : (
						<MorphingShape
							color={activeColor}
							indicatorSize={clampedSize}
						/>
					)}
				</div>
			</LazyMotion>
		);
	},
);

LoadingIndicator.displayName = "LoadingIndicator";
