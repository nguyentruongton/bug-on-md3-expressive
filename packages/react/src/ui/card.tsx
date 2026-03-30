/**
 * @file card.tsx
 *
 * MD3 Expressive Card component.
 *
 * Two modes (mirrors Android Card.kt architecture):
 * - **Static**      → plain `<div>`, no interaction
 * - **Interactive** → `<motion.button>` or `<motion.a>`, with Ripple + elevation animation
 *
 * Elevation levels (from ElevatedCardTokens / FilledCardTokens / OutlinedCardTokens / Elevation.kt):
 * - Level 0 = "none"
 * - Level 1 = box-shadow ~1dp
 * - Level 2 = box-shadow ~2dp
 *
 * @see https://m3.material.io/components/cards/overview
 */

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLMotionProps } from "motion/react";
import { domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, useRippleState } from "./ripple";

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Elevation Shadows (from packages/tailwind/src/index.ts)
// ─────────────────────────────────────────────────────────────────────────────
const SHADOW = {
	level0: "none",
	level1: "0px 1px 2px 0px rgba(0,0,0,.3), 0px 1px 3px 1px rgba(0,0,0,.15)",
	level2: "0px 1px 2px 0px rgba(0,0,0,.3), 0px 2px 6px 2px rgba(0,0,0,.15)",
} as const;

// Maps each variant to its elevation levels per interaction state.
// Source: ElevatedCardTokens.kt, FilledCardTokens.kt, OutlinedCardTokens.kt
const VARIANT_ELEVATION = {
	elevated: {
		rest: SHADOW.level1,
		hover: SHADOW.level2,
		pressed: SHADOW.level1,
		disabled: SHADOW.level1, // ElevatedCardTokens.DisabledContainerElevation = Level1
	},
	filled: {
		rest: SHADOW.level0,
		hover: SHADOW.level1,
		pressed: SHADOW.level0,
		disabled: SHADOW.level0,
	},
	outlined: {
		rest: SHADOW.level0,
		hover: SHADOW.level1,
		pressed: SHADOW.level0,
		disabled: SHADOW.level0,
	},
} as const;

type CardVariant = keyof typeof VARIANT_ELEVATION;

// ─────────────────────────────────────────────────────────────────────────────
// CVA – Variant base classes (token-aligned with MD3)
// ─────────────────────────────────────────────────────────────────────────────
const cardVariants = cva(
	"rounded-m3-lg flex flex-col relative overflow-hidden transition-colors duration-200",
	{
		variants: {
			variant: {
				// ElevatedCardTokens.ContainerColor = SurfaceContainerLow
				elevated: "bg-m3-surface-container-low",
				// FilledCardTokens.ContainerColor = SurfaceContainerHighest
				filled: "bg-m3-surface-container-highest",
				// OutlinedCardTokens.ContainerColor = Surface, OutlineColor = OutlineVariant
				outlined: "bg-m3-surface border border-m3-outline-variant",
			},
		},
		defaultVariants: { variant: "elevated" },
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// Hook: Card Elevation Animation
// Mirrors animateElevation() from Elevation.kt.
// Returns motion animation props for interactive boxShadow transitions.
// ─────────────────────────────────────────────────────────────────────────────
function useCardElevation(variant: CardVariant, disabled: boolean) {
	const levels = VARIANT_ELEVATION[variant];
	return {
		animate: { boxShadow: disabled ? levels.disabled : levels.rest },
		whileHover: disabled ? undefined : { boxShadow: levels.hover },
		whileTap: disabled ? undefined : { boxShadow: levels.pressed },
		whileFocus: disabled ? undefined : { boxShadow: levels.hover },
		transition: {
			boxShadow: {
				// Incoming: 120ms (from Elevation.kt DefaultIncomingSpec)
				duration: 0.12,
				ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
			},
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// Use HTMLMotionProps<"button"> as the base to avoid onDrag / event handler
// conflicts between native React HTMLAttributes and Motion's extended prop types.
// ─────────────────────────────────────────────────────────────────────────────
type MotionDivProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

export interface CardProps
	extends MotionDivProps,
		VariantProps<typeof cardVariants> {
	/** Vô hiệu hóa tương tác và giảm opacity (MD3 disabled state). */
	disabled?: boolean;
	/**
	 * Buộc card trở thành interactive dù không có `onClick`.
	 * Hữu ích khi card chứa các element con là interactive.
	 */
	interactive?: boolean;
	/**
	 * Nếu có, card render thành thẻ `<a>`. Tự động kích hoạt interactive mode.
	 * Ưu tiên dùng `href` thay vì `onClick` khi điều hướng trang.
	 */
	href?: string;
	/** Target cho thẻ `<a>` (chỉ có hiệu lực khi `href` được cung cấp). */
	target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
	/** rel cho thẻ `<a>` (tự động thêm `noreferrer` khi `target="_blank"`). */
	rel?: string;
	children?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const CardImpl = React.forwardRef<HTMLElement, CardProps>(
	(
		{
			className,
			variant = "elevated",
			disabled = false,
			interactive = false,
			href,
			target,
			rel: relProp,
			onClick,
			children,
			...props
		},
		ref,
	) => {
		const safeVariant = variant as CardVariant;
		const isInteractive = !!onClick || !!href || interactive;
		const elevationProps = useCardElevation(safeVariant, disabled);
		const { ripples, onPointerDown, removeRipple } = useRippleState();

		const baseClass = cn(
			cardVariants({ variant }),
			// Disabled state:
			// - pointer-events-none → vô hiệu hóa tương tác hoàn toàn
			// - opacity-[0.38] → MD3 DisabledContainerOpacity
			disabled && "pointer-events-none opacity-[0.38]",
			className,
		);

		// MD3 State Layer (Hover: 8%, Focus: 10%, Pressed: 10%)
		// Áp dụng cho interactive elements, dùng absolute inset ::before
		const interactiveClass = cn(
			// Xóa outline default, dùng state overlay & elevation của MD3 để biểu hiện focus
			"focus-visible:outline-none focus:outline-none group",
			// Layer overlay base pseudo-element
			"before:absolute before:inset-0 before:pointer-events-none before:bg-m3-on-surface before:opacity-0 before:transition-opacity before:duration-200",
			// Interactive states opacities
			"hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10]",
			// Outlined interactive card: đổi màu border sang m3-outline khi focus/press/hover
			variant === "outlined" &&
				"hover:border-m3-outline focus-visible:border-m3-outline active:border-m3-outline",
		);

		// ── Static Card – không có interaction ─────────────────────────────────
		if (!isInteractive) {
			return (
				<div
					ref={ref as React.Ref<HTMLDivElement>}
					className={baseClass}
					aria-disabled={disabled ? true : undefined}
				>
					{children}
				</div>
			);
		}

		// ── Safe rel: tự động thêm "noreferrer" khi target="_blank" ────────────
		const safeRel = href
			? (relProp ?? (target === "_blank" ? "noreferrer" : undefined))
			: undefined;

		// ── Link Card ────────────────────────────────────────────────────────────
		if (href) {
			return (
				<LazyMotion features={domMax} strict>
					<m.a
						ref={ref as React.Ref<HTMLAnchorElement>}
						href={disabled ? undefined : href}
						target={target}
						rel={safeRel}
						className={cn(baseClass, interactiveClass)}
						aria-disabled={disabled ? true : undefined}
						tabIndex={disabled ? -1 : 0}
						onPointerDown={onPointerDown}
						{...elevationProps}
					>
						<Ripple ripples={ripples} onRippleDone={removeRipple} />
						{children}
					</m.a>
				</LazyMotion>
			);
		}

		// ── Interactive Button Card ──────────────────────────────────────────────
		return (
			<LazyMotion features={domMax} strict>
				<m.button
					ref={ref as React.Ref<HTMLButtonElement>}
					type="button"
					disabled={disabled}
					onClick={onClick}
					className={cn(baseClass, interactiveClass)}
					aria-disabled={disabled ? true : undefined}
					tabIndex={disabled ? -1 : 0}
					onPointerDown={onPointerDown}
					{...elevationProps}
					{...props}
				>
					<Ripple ripples={ripples} onRippleDone={removeRipple} />
					{children}
				</m.button>
			</LazyMotion>
		);
	},
);
CardImpl.displayName = "Card";

export const Card = React.memo(CardImpl);
