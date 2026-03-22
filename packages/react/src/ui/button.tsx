"use client";

import { cva } from "class-variance-authority";
import type { HTMLMotionProps } from "motion/react";
import { domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, type RippleOrigin } from "./ripple";

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Expressive Button – Sizing Specs (May 2025)
//   XS → h:32dp  | px: 12dp | icon: 18dp | gap: 8dp
//   SM → h:40dp  | px: 16dp | icon: 20dp | gap: 8dp
//   MD → h:56dp  | px: 24dp | icon: 24dp | gap: 8dp
//   LG → h:96dp  | px: 48dp | icon: 32dp | gap: 12dp
//   XL → h:136dp | px: 48dp | icon: 40dp | gap: 12dp
// ─────────────────────────────────────────────────────────────────────────────
const SIZE_STYLES: Record<string, React.CSSProperties> = {
	xs: {
		height: "2rem",
		minWidth: "4rem",
		paddingInline: "0.75rem",
		gap: "0.5rem",
	},
	sm: {
		height: "2.5rem",
		minWidth: "5rem",
		paddingInline: "1rem",
		gap: "0.5rem",
	},
	md: {
		height: "3.5rem",
		minWidth: "7rem",
		paddingInline: "1.5rem",
		gap: "0.5rem",
	},
	lg: {
		height: "6rem",
		minWidth: "11rem",
		paddingInline: "3rem",
		gap: "0.75rem",
	},
	xl: {
		height: "8.5rem",
		minWidth: "14rem",
		paddingInline: "3rem",
		gap: "0.75rem",
	},
};

const SIZE_TEXT_CLASS: Record<string, string> = {
	xs: "text-xs  font-medium tracking-wide",
	sm: "text-sm  font-medium tracking-wide",
	md: "text-base font-medium tracking-wide",
	lg: "text-lg  font-medium tracking-wide",
	xl: "text-xl  font-medium tracking-wide",
};

// MD3 icon sizes: XS=18dp, SM=20dp, MD=24dp, LG=32dp, XL=40dp
const SIZE_ICON_CLASS: Record<string, string> = {
	xs: "size-[1.125rem]",
	sm: "size-5",
	md: "size-6",
	lg: "size-8",
	xl: "size-10",
};

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Expressive Morphing – border-radius (px) per shape × size
//
// IMPORTANT: Do NOT use 9999 for the "pill" default radius.
// CSS clips any border-radius > height/2 identically, so animating from
// 9999 → small value creates a perceptual dead zone (nothing looks different
// until the value drops below height/2). This makes the animation feel like
// it snaps/jerks. Use exact half-height values instead for truly smooth morph.
//
// Size heights: xs=32dp, sm=40dp, md=56dp, lg=96dp, xl=136dp
// ─────────────────────────────────────────────────────────────────────────────
type MorphRadius = { default: number; pressed: number };

const ROUND_RADIUS: Record<string, MorphRadius> = {
	xs: { default: 16, pressed: 8 },
	sm: { default: 20, pressed: 10 },
	md: { default: 28, pressed: 16 },
	lg: { default: 48, pressed: 28 },
	xl: { default: 68, pressed: 40 },
};

const SQUARE_RADIUS: Record<string, MorphRadius> = {
	xs: { default: 4, pressed: 2 },
	sm: { default: 8, pressed: 4 },
	md: { default: 16, pressed: 10 },
	lg: { default: 28, pressed: 20 },
	xl: { default: 40, pressed: 28 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Color Variants
// ─────────────────────────────────────────────────────────────────────────────
const buttonColorVariants = cva(
	[
		"relative w-fit shrink-0 inline-flex flex-row items-center justify-center",
		"whitespace-nowrap select-none cursor-pointer",
		"transition-[background-color,color,border-color,box-shadow,opacity,filter] duration-200",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
		"disabled:pointer-events-none disabled:opacity-[0.38] disabled:shadow-none",
	],
	{
		variants: {
			colorStyle: {
				elevated: [
					"bg-m3-surface-container-low text-m3-primary shadow-md",
					"hover:bg-m3-primary/8 hover:shadow-lg",
					"active:bg-m3-primary/12 active:shadow-sm",
					"disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]",
				],
				// filled = default + toggle-selected state (routes here via effectiveColorStyle)
				filled: [
					"bg-m3-primary text-m3-on-primary",
					"hover:brightness-95 hover:shadow-md",
					"active:brightness-90 active:shadow-none",
					"disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]",
				],
				tonal: [
					"bg-m3-secondary-container text-m3-on-secondary-container",
					"hover:bg-m3-on-secondary-container/8 hover:shadow-md",
					"active:bg-m3-on-secondary-container/12 active:shadow-none",
					"disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]",
				],
				outlined: [
					"bg-transparent border border-m3-outline text-m3-primary",
					"hover:bg-m3-primary/8",
					"active:bg-m3-primary/12",
					"disabled:border-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]",
				],
				text: [
					"bg-transparent text-m3-primary px-3",
					"hover:bg-m3-primary/8",
					"active:bg-m3-primary/12",
					"disabled:text-m3-on-surface/[0.38]",
				],
			},
		},
		defaultVariants: { colorStyle: "filled" },
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// Use HTMLMotionProps<"button"> as the base to avoid onDrag / event handler
// conflicts between native React and Framer Motion's extended prop types.
// ─────────────────────────────────────────────────────────────────────────────
type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

export interface BaseButtonProps extends MotionButtonProps {
	/** MD3 color variant */
	colorStyle?: "elevated" | "filled" | "tonal" | "outlined" | "text";
	/** Button size – XS to XL */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Shape family: round (pill) or square (rect with scaled corners) */
	shape?: "round" | "square";
	/** Icon node – sized automatically per MD3 spec */
	icon?: React.ReactNode;
	iconPosition?: "leading" | "trailing";
	children: React.ReactNode;
}

export type ButtonProps = BaseButtonProps &
	(
		| { variant?: "default"; selected?: never }
		| { variant: "toggle"; selected: boolean }
	);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			style,
			variant = "default",
			colorStyle = "filled",
			size = "sm",
			shape = "round",
			selected,
			icon,
			iconPosition = "leading",
			children,
			onClick,
			onKeyDown,
			"aria-label": ariaLabelProp,
			...restProps
		},
		ref,
	) => {
		const isToggle = variant === "toggle";
		const isSelected = isToggle ? !!selected : false;

		// When toggle is selected, always use "filled" regardless of base colorStyle.
		// This avoids CSS specificity battles between two bg-* classes from different
		// CVA variants. effectiveColorStyle is the single source of truth for color.
		const effectiveColorStyle = isToggle && isSelected ? "filled" : colorStyle;

		// ── Shape Morphing ───────────────────────────────────────────────────
		// When toggle selected: shape flips (round → square, square → round)
		const effectiveShape = isSelected
			? shape === "round"
				? "square"
				: "round"
			: shape;

		const radiusMap = effectiveShape === "round" ? ROUND_RADIUS : SQUARE_RADIUS;
		const pressedRadiusMap = shape === "round" ? ROUND_RADIUS : SQUARE_RADIUS;
		const { default: animateRadius } = radiusMap[size] ?? radiusMap.sm;
		const { pressed: pressedRadius } =
			pressedRadiusMap[size] ?? pressedRadiusMap.sm;

		// ── Label: Sentence case ─────────────────────────────────────────────
		const labelText =
			typeof children === "string"
				? children.charAt(0).toUpperCase() + children.slice(1).toLowerCase()
				: children;

		const iconClass = SIZE_ICON_CLASS[size] ?? "size-5";

		// Let TypeScript infer MotionStyle-compatible type (not React.CSSProperties)
		const mergedStyle = {
			...SIZE_STYLES[size],
			...style,
		};

		// ── A11y: 48dp min touch target for XS / SM via invisible ::after span ─
		const needsTouchTarget = size === "xs" || size === "sm";

		// ── Ripple state ─────────────────────────────────────────────────────
		const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

		const handlePointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLButtonElement>) => {
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				// Ripple must entirely fill button: diagonal = max size needed
				const size = Math.hypot(rect.width, rect.height) * 2;
				setRipples((prev) => [...prev, { id: Date.now(), x, y, size }]);
			},
			[],
		);

		const removeRipple = React.useCallback((id: number) => {
			setRipples((prev) => prev.filter((r) => r.id !== id));
		}, []);

		return (
			<LazyMotion features={domMax} strict>
				<m.button
					ref={ref}
					type="button"
					aria-pressed={isToggle ? isSelected : undefined}
					aria-label={
						ariaLabelProp ||
						(typeof children === "string" ? children : undefined)
					}
					onClick={onClick}
					onPointerDown={handlePointerDown}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							if (onClick) {
								e.preventDefault();
								(e.currentTarget as HTMLButtonElement).click();
							}
						}
						if (onKeyDown) onKeyDown(e);
					}}
					style={mergedStyle}
					// ── Expressive Morphing ──────────────────────────────────
					// Shape morphs between pill ↔ rounded-square on toggle.
					// Removed whileTap scale — ripple provides click feedback instead.
					//
					// NOTE: Uses spring with bounce: 0 (critically damped) for border-radius.
					// This prevents overshoot below zero (visual jitter) while perfectly 
					// preserving velocity on rapid click interruptions, fixing the jerky morph.
					// `layout` is intentionally NOT on this element — it conflicts with
					// Framer Motion's layout projection correction of border-radius, causing jitter.
					// Width changes are handled by the inner label m.span with layout instead.
					animate={{ borderRadius: animateRadius }}
					whileTap={{ borderRadius: pressedRadius }}
					transition={{
						borderRadius: {
							type: "spring",
							bounce: 0,
							duration: 0.3,
						},
					}}
					className={cn(
						buttonColorVariants({ colorStyle: effectiveColorStyle }),
						// overflow-hidden is critical: clips Ripple to match morphing border-radius
						"overflow-hidden",
						SIZE_TEXT_CLASS[size],
						needsTouchTarget ? "relative" : "",
						className,
					)}
					{...restProps}
				>
					{/* Invisible touch-target expander (min 48×48dp) for small buttons */}
					{needsTouchTarget && (
						<span
							aria-hidden="true"
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-12 min-h-12 cursor-pointer pointer-events-none"
						/>
					)}

					{/* ── MD3 Expressive Ripple layer ───────────────────────── */}
					<Ripple ripples={ripples} onRippleDone={removeRipple} />

					{icon && iconPosition === "leading" && (
						<span
							aria-hidden="true"
							className={cn(
								"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full",
								iconClass,
							)}
						>
							{icon}
						</span>
					)}

					<m.span
						layout="size"
						transition={{ type: "spring", bounce: 0, duration: 0.3 }}
					>
						{labelText}
					</m.span>

					{icon && iconPosition === "trailing" && (
						<span
							aria-hidden="true"
							className={cn(
								"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full",
								iconClass,
							)}
						>
							{icon}
						</span>
					)}
				</m.button>
			</LazyMotion>
		);
	},
);

Button.displayName = "Button";
