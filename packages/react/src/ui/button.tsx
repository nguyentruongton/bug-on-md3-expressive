/**
 * @file button.tsx
 *
 * MD3 Expressive Button component.
 *
 * Spec: https://m3.material.io/components/buttons/overview
 * Sizing (May 2025):
 *   XS → h:32dp  | px: 12dp | icon: 18dp | gap: 8dp
 *   SM → h:40dp  | px: 16dp | icon: 20dp | gap: 8dp
 *   MD → h:56dp  | px: 24dp | icon: 24dp | gap: 8dp
 *   LG → h:96dp  | px: 48dp | icon: 32dp | gap: 12dp
 *   XL → h:136dp | px: 48dp | icon: 40dp | gap: 12dp
 */

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { HTMLMotionProps } from "motion/react";
import {
	AnimatePresence,
	animate,
	domMax,
	LazyMotion,
	m,
	useMotionValue,
} from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { LoadingIndicator } from "./loading-indicator";
import { ProgressIndicator } from "./progress-indicator";
import { Ripple, useRippleState } from "./ripple";
import { SPRING_TRANSITION, SPRING_TRANSITION_FAST } from "./shared/constants";
import { TouchTarget } from "./shared/touch-target";

// ─── Design Tokens ────────────────────────────────────────────────────────────

/**
 * Per-size layout styles.
 * Heights and paddings are taken directly from the MD3 Expressive spec (May 2025).
 */
const SIZE_STYLES: Record<string, React.CSSProperties> = {
	xs: { height: "2rem",   minWidth: "4rem",  paddingInline: "0.75rem", gap: "0.5rem"  },
	sm: { height: "2.5rem", minWidth: "5rem",  paddingInline: "1rem",    gap: "0.5rem"  },
	md: { height: "3.5rem", minWidth: "7rem",  paddingInline: "1.5rem",  gap: "0.5rem"  },
	lg: { height: "6rem",   minWidth: "11rem", paddingInline: "3rem",    gap: "0.75rem" },
	xl: { height: "8.5rem", minWidth: "14rem", paddingInline: "3rem",    gap: "0.75rem" },
};

/** Per-size label typography classes. */
const SIZE_TEXT_CLASS: Record<string, string> = {
	xs: "text-xs  font-medium tracking-wide",
	sm: "text-sm  font-medium tracking-wide",
	md: "text-base font-medium tracking-wide",
	lg: "text-lg  font-medium tracking-wide",
	xl: "text-xl  font-medium tracking-wide",
};

/**
 * Per-size icon container Tailwind classes.
 * MD3 icon sizes: XS=18dp, SM=20dp, MD=24dp, LG=32dp, XL=40dp.
 */
const SIZE_ICON_CLASS: Record<string, string> = {
	xs: "size-[1.125rem]",
	sm: "size-5",
	md: "size-6",
	lg: "size-8",
	xl: "size-10",
};

/**
 * Icon pixel-sizes for given button sizes.
 * MD3 icon sizes: XS=18, SM=20, MD=24, LG=32, XL=40.
 */
const SIZE_ICON_PX: Record<string, number> = {
	xs: 18,
	sm: 20,
	md: 24,
	lg: 32,
	xl: 40,
};

// ─── Shape Morphing ────────────────────────────────────────────────────────────
//
// IMPORTANT: Do NOT use 9999 for the "pill" default radius.
// CSS clips any border-radius > height/2 identically, so animating from
// 9999 → small value creates a perceptual dead zone (nothing looks different
// until the value drops below height/2). This makes the animation feel like
// it snaps/jerks. Use exact half-height values instead for truly smooth morph.
//
// Size heights: xs=32dp, sm=40dp, md=56dp, lg=96dp, xl=136dp

/** Per-size border radius values for a given shape state. */
type MorphRadius = { default: number; pressed: number };

/**
 * Border-radius token map for the "round" (pill) shape variant.
 * Values equal `height / 2` for each size to ensure the pill stays perceptually
 * smooth during spring animation (no dead zone artefact).
 */
const ROUND_RADIUS: Record<string, MorphRadius> = {
	xs: { default: 16, pressed: 8  },
	sm: { default: 20, pressed: 10 },
	md: { default: 28, pressed: 16 },
	lg: { default: 48, pressed: 28 },
	xl: { default: 68, pressed: 40 },
};

/**
 * Border-radius token map for the "square" (rounded-square) shape variant.
 * Pressed values compress inward following MD3 Expressive morphing spec.
 */
const SQUARE_RADIUS: Record<string, MorphRadius> = {
	xs: { default: 4,  pressed: 2  },
	sm: { default: 8,  pressed: 4  },
	md: { default: 16, pressed: 10 },
	lg: { default: 28, pressed: 20 },
	xl: { default: 40, pressed: 28 },
};

// ─── Color Variants (CVA) ──────────────────────────────────────────────────────

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
					"hover:bg-m3-primary/8",
					"active:bg-m3-primary/12 active:shadow-sm",
					"disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]",
				],
				// filled = default + toggle-selected state (routes here via effectiveColorStyle)
				filled: [
					"bg-m3-primary text-m3-on-primary",
					"hover:brightness-95",
					"active:brightness-90 active:shadow-none",
					"disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]",
				],
				tonal: [
					"bg-m3-secondary-container text-m3-on-secondary-container",
					"hover:bg-m3-on-secondary-container/8",
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

// ─── Types ─────────────────────────────────────────────────────────────────────
// Use HTMLMotionProps<"button"> as the base to avoid onDrag / event handler
// conflicts between native React and Framer Motion's extended prop types.

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

/**
 * Base props shared between the standard and toggle button variants.
 *
 * @see {@link ButtonProps} for the complete discriminated union type.
 * @see https://m3.material.io/components/buttons/overview
 */
export interface BaseButtonProps extends MotionButtonProps {
	/**
	 * Visual style variant following MD3 color roles.
	 * @default "filled"
	 */
	colorStyle?: "elevated" | "filled" | "tonal" | "outlined" | "text";
	/**
	 * Color style applied when the toggle button is in the *selected* state.
	 * Only meaningful when `variant="toggle"`.
	 * Falls back to `"filled"` when not specified.
	 */
	selectedColorStyle?: "elevated" | "filled" | "tonal" | "outlined" | "text";
	/**
	 * Button size following MD3 Expressive size scale.
	 * @default "sm"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/**
	 * Container shape — controls border-radius morphing.
	 * - `round`: pill shape (CornerFull), morphs to rounded-square when toggled.
	 * - `square`: rounded-square, morphs to pill when toggled.
	 * @default "round"
	 */
	shape?: "round" | "square";
	/**
	 * Optional leading or trailing icon node.
	 * Size is automatically scaled to match the button's `size` prop.
	 */
	icon?: React.ReactNode;
	/**
	 * Position of the icon relative to the label text.
	 * @default "leading"
	 */
	iconPosition?: "leading" | "trailing";
	/**
	 * When `true`, replaces the icon with an animated loading indicator
	 * and prevents interaction.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Controls which loading spinner is shown while `loading={true}`.
	 * - `loading-indicator`: MD3 Expressive morphing shape (default).
	 * - `circular`: Classic circular spinner.
	 * @default "loading-indicator"
	 */
	loadingVariant?: "loading-indicator" | "circular";
	/**
	 * When `true`, the Button renders its child element directly (using Radix Slot),
	 * merging all button props (className, style, event handlers) onto it.
	 * Useful for rendering a Next.js `<Link>` with Button styles.
	 *
	 * @example
	 * ```tsx
	 * <Button asChild size="lg">
	 *   <Link href="/components">Explore Components</Link>
	 * </Button>
	 * ```
	 * @default false
	 */
	asChild?: boolean;
	/** Button label — any React content, typically a string. */
	children: React.ReactNode;
}

/**
 * Complete `Button` props — discriminated union that enforces
 * `selected` is only valid for `variant="toggle"`.
 *
 * @example
 * ```tsx
 * // Standard button
 * <Button colorStyle="filled" size="md">Confirm</Button>
 *
 * // Toggle button (selected state required)
 * <Button variant="toggle" selected={isActive} onClick={toggle}>Filter</Button>
 *
 * // With leading icon and loading state
 * <Button icon={<CheckIcon />} loading={isSubmitting}>Save</Button>
 * ```
 *
 * @see https://m3.material.io/components/buttons/overview
 */
export type ButtonProps = BaseButtonProps &
	(
		| { variant?: "default"; selected?: never }
		| { variant: "toggle"; selected: boolean }
	);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function toSentenceCase(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function resolveLabel(children: React.ReactNode, asChild: boolean): React.ReactNode {
	if (asChild) {
		const child = React.Children.only(children) as React.ReactElement<{
			children?: React.ReactNode;
		}>;
		return child.props.children;
	}
	return typeof children === "string" ? toSentenceCase(children) : children;
}

/** Framer Motion-specific props to strip before forwarding to a plain DOM element. */
const MOTION_PROP_KEYS = [
	"animate", "exit", "initial", "transition", "variants",
	"whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
	"onAnimationStart", "onAnimationComplete", "onUpdate",
	"onDragStart", "onDragEnd", "onDrag", "onDirectionLock", "onDragTransitionEnd",
	"layout", "layoutId", "onLayoutAnimationComplete",
] as const;

function stripMotionProps(props: Record<string, unknown>): Record<string, unknown> {
	const result = { ...props };
	for (const key of MOTION_PROP_KEYS) delete result[key];
	return result;
}

function springAnimate(value: ReturnType<typeof useMotionValue<number>>, to: number) {
	animate(value, to, { ...SPRING_TRANSITION_FAST, type: "spring" });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
	size: number;
	variant: "loading-indicator" | "circular";
}

function LoadingSpinner({ size, variant }: LoadingSpinnerProps) {
	if (variant === "loading-indicator") {
		return <LoadingIndicator size={size} color="currentColor" aria-label="Loading" />;
	}
	return (
		<ProgressIndicator
			variant="circular"
			size={size}
			color="currentColor"
			trackColor="transparent"
			aria-label="Loading"
		/>
	);
}

interface AnimatedIconSlotProps {
	iconClass: string;
	children: React.ReactNode;
	ariaHidden?: boolean;
}

function AnimatedIconSlot({ iconClass, children, ariaHidden }: AnimatedIconSlotProps) {
	return (
		<m.span
			initial={{ width: 0, opacity: 0, scale: 0.5 }}
			animate={{ width: "auto", opacity: 1, scale: 1 }}
			exit={{ width: 0, opacity: 0, scale: 0.5 }}
			transition={SPRING_TRANSITION}
			aria-hidden={ariaHidden ? "true" : undefined}
			className={cn(
				"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full overflow-hidden",
				iconClass,
			)}
		>
			{children}
		</m.span>
	);
}

// ─── Component ─────────────────────────────────────────────────────────────────

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			style,
			variant = "default",
			colorStyle = "filled",
			selectedColorStyle,
			size = "sm",
			shape = "round",
			selected,
			icon,
			iconPosition = "leading",
			loading = false,
			loadingVariant = "loading-indicator",
			asChild = false,
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

		// When toggle is selected, shape flips (round ↔ square).
		const effectiveShape = isSelected
			? shape === "round" ? "square" : "round"
			: shape;

		// effectiveColorStyle is the single source of truth for color.
		// Avoids CSS specificity battles between two bg-* classes.
		const effectiveColorStyle =
			isToggle && isSelected ? selectedColorStyle ?? "filled" : colorStyle;

		const radiusMap = effectiveShape === "round" ? ROUND_RADIUS : SQUARE_RADIUS;
		const { default: animateRadius } = radiusMap[size] ?? radiusMap.sm;
		const { pressed: pressedRadius } = radiusMap[size] ?? radiusMap.sm;

		const iconClass = SIZE_ICON_CLASS[size] ?? "size-5";
		const mergedStyle = { ...SIZE_STYLES[size], ...style };
		const labelText = React.useMemo(() => resolveLabel(children, asChild), [children, asChild]);
		const computedAriaLabel = ariaLabelProp || (typeof children === "string" ? children : undefined);
		const needsTouchTarget = size === "xs" || size === "sm";

		// Shape morphing motion value for asChild mode.
		// Radix Slot clones the child, so Framer Motion loses DOM tracking.
		// Instead we subscribe to motionRadius.on("change") and update style.borderRadius imperatively.
		const motionRadius = useMotionValue(animateRadius);
		const asChildRef = React.useRef<HTMLElement | null>(null);

		// Merge forwardRef + asChildRef into a single callback ref (Slot accepts only one ref).
		const mergedRef = React.useCallback(
			(node: HTMLElement | null) => {
				asChildRef.current = node;
				if (typeof ref === "function") ref(node as HTMLButtonElement);
				else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node as HTMLButtonElement;
			},
			[ref],
		);

		// Keep DOM borderRadius synced with motionRadius.
		React.useEffect(
			() => motionRadius.on("change", (v) => {
				if (asChildRef.current) asChildRef.current.style.borderRadius = `${v}px`;
			}),
			[motionRadius],
		);

		// Animate to new target radius when toggle state or size changes.
		React.useEffect(() => {
			springAnimate(motionRadius, animateRadius);
		}, [animateRadius, motionRadius]);

		const { ripples, onPointerDown, removeRipple } = useRippleState({ disabled: loading });

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				if (loading) return e.preventDefault();
				onClick?.(e);
			},
			[loading, onClick],
		);

		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLButtonElement>) => {
				if (loading) return;
				if (onClick && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					(e.currentTarget as HTMLButtonElement).click();
				}
				onKeyDown?.(e);
			},
			[loading, onClick, onKeyDown],
		);

		const buttonClassName = cn(
			buttonColorVariants({ colorStyle: effectiveColorStyle }),
			// overflow-hidden clips Ripple to match the morphing border-radius
			"overflow-hidden",
			SIZE_TEXT_CLASS[size],
			needsTouchTarget && "relative",
			loading && "pointer-events-none opacity-75 cursor-not-allowed",
			className,
		);

		const innerContent = (
			<>
				{/* Invisible touch-target expander (min 48×48dp) for small buttons */}
				{needsTouchTarget && <TouchTarget />}

				{/* MD3 Expressive Ripple layer */}
				<Ripple ripples={ripples} onRippleDone={removeRipple} />

				<AnimatePresence initial={false}>
					{(loading || (icon && iconPosition === "leading")) && (
						<AnimatedIconSlot iconClass={iconClass} ariaHidden={!loading}>
							{loading
								? <LoadingSpinner size={SIZE_ICON_PX[size] ?? 20} variant={loadingVariant} />
								: icon}
						</AnimatedIconSlot>
					)}
				</AnimatePresence>

				<m.span
					layout="size"
					className="inline-flex items-center gap-[inherit]"
					transition={SPRING_TRANSITION}
				>
					{labelText}
				</m.span>

				<AnimatePresence initial={false}>
					{icon && iconPosition === "trailing" && (
						<AnimatedIconSlot iconClass={iconClass} ariaHidden>
							{icon}
						</AnimatedIconSlot>
					)}
				</AnimatePresence>
			</>
		);

		// asChild: render Slot with imperative motion value driving borderRadius.
		// Framer Motion works imperatively here because Radix Slot clones the child,
		// breaking Framer Motion's internal DOM tracking.
		if (asChild) {
			const htmlProps = stripMotionProps(restProps as Record<string, unknown>);
			const child = React.Children.only(children) as React.ReactElement<{
				children?: React.ReactNode;
			}>;

			const handleAsChildPointerDown = (e: React.PointerEvent<HTMLElement>) => {
				springAnimate(motionRadius, pressedRadius);
				(onPointerDown as React.PointerEventHandler<HTMLElement>)?.(e);
			};

			const handleAsChildPointerUp = () => {
				springAnimate(motionRadius, animateRadius);
			};

			return (
				<LazyMotion features={domMax} strict>
					<Slot
						ref={mergedRef as React.Ref<HTMLButtonElement>}
						aria-label={computedAriaLabel}
						onClick={handleClick as React.MouseEventHandler<HTMLElement>}
						onPointerDown={handleAsChildPointerDown}
						onPointerUp={handleAsChildPointerUp}
						onPointerLeave={handleAsChildPointerUp}
						onPointerCancel={handleAsChildPointerUp}
						onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLElement>}
						style={{ ...(mergedStyle as React.CSSProperties), borderRadius: `${animateRadius}px` }}
						className={buttonClassName}
						{...htmlProps}
					>
						{React.cloneElement(child, { children: innerContent })}
					</Slot>
				</LazyMotion>
			);
		}

		// Default: animated m.button
		return (
			<LazyMotion features={domMax} strict>
				<m.button
					ref={ref}
					type="button"
					aria-pressed={isToggle ? isSelected : undefined}
					aria-label={computedAriaLabel}
					aria-busy={loading ? true : undefined}
					aria-disabled={loading ? true : restProps.disabled}
					onClick={handleClick}
					onPointerDown={onPointerDown}
					onKeyDown={handleKeyDown}
					style={mergedStyle}
					animate={{ borderRadius: animateRadius }}
					whileTap={{ borderRadius: pressedRadius }}
					transition={{ borderRadius: SPRING_TRANSITION_FAST }}
					className={buttonClassName}
					{...restProps}
				>
					{innerContent}
				</m.button>
			</LazyMotion>
		);
	},
);

ButtonComponent.displayName = "Button";

/**
 * MD3 Expressive Button component.
 *
 * Supports all five MD3 color styles, five sizes, shape morphing on toggle,
 * leading/trailing icons, and an animated loading state.
 *
 * @remarks
 * - `variant="toggle"` requires `selected: boolean` — enforced by the type system.
 * - When `loading={true}`, the button is visually dimmed, pointer events are
 *   blocked, and `aria-busy` is set for screen readers.
 * - Shape morphs smoothly between pill ↔ rounded-square when toggle state changes,
 *   using a critically-damped spring (no overshoot artefacts).
 *
 * @example
 * ```tsx
 * // Standard filled button
 * <Button colorStyle="filled" size="md">Confirm</Button>
 *
 * // Button with icon
 * <Button icon={<CheckIcon />} loading={isSubmitting}>Save</Button>
 *
 * // Toggle button
 * <Button variant="toggle" selected={isActive} onClick={toggle}>
 *   Filter
 * </Button>
 * ```
 *
 * @see https://m3.material.io/components/buttons/overview
 */
export const Button = React.memo(ButtonComponent);
