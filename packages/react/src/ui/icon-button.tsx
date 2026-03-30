/**
 * @file icon-button.tsx
 *
 * MD3 Expressive Icon Button component.
 *
 * An icon-only button with shape morphing, ripple effect, loading state,
 * and toggle variant. Requires `aria-label` for accessibility since there
 * is no visible text label.
 *
 * @see https://m3.material.io/components/icon-buttons/overview
 */

import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence, domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { LoadingIndicator } from "./loading-indicator";
import { ProgressIndicator } from "./progress-indicator";
import { Ripple, useRippleState } from "./ripple";
import {
	ICON_SPAN_VARIANTS,
	SPRING_TRANSITION,
	SPRING_TRANSITION_FAST,
} from "./shared/constants";
import { TouchTarget } from "./shared/touch-target";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Per-size container dimensions (Tailwind utility classes).
 * MD3 Expressive sizing tokens (v14.1.0): XS=32dp, SM=40dp, MD=56dp, LG=96dp, XL=136dp.
 * @internal
 */
const SIZE_STYLES: Record<string, string> = {
	xs: "h-8 w-8",
	sm: "h-10 w-10",
	md: "h-14 w-14",
	lg: "h-24 w-24",
	xl: "h-[8.5rem] w-[8.5rem]",
};

/**
 * Per-size icon dimensions — Tailwind class + pixel value.
 * Single source of truth to keep icon class and LoadingIndicator size in sync.
 * @internal
 */
const SIZE_ICON: Record<string, { cls: string; px: number }> = {
	xs: { cls: "size-5", px: 20 },
	sm: { cls: "size-6", px: 24 },
	md: { cls: "size-6", px: 24 },
	lg: { cls: "size-8", px: 32 },
	xl: { cls: "size-10", px: 40 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Shape Morphing — Border Radius Map
// Keys: round=CornerFull, square=CornerMedium–XL, pressed, selectedRound, selectedSquare
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Per-size shape morphing radius configuration for all interaction states.
 *
 * - `round` / `square`: idle border-radius per shape variant.
 * - `pressed`: compressed radius on whileTap.
 * - `selectedRound` / `selectedSquare`: radius when toggle is selected
 *   (shape flips — round selected → selectedRound which is squarer).
 *
 * @internal
 */
const RADIUS_MAP: Record<
	string,
	{
		round: number;
		square: number;
		pressed: number;
		selectedRound: number;
		selectedSquare: number;
	}
> = {
	xs: {
		round: 16,
		square: 12,
		pressed: 8,
		selectedRound: 12,
		selectedSquare: 16,
	},
	sm: {
		round: 20,
		square: 12,
		pressed: 8,
		selectedRound: 12,
		selectedSquare: 20,
	},
	md: {
		round: 28,
		square: 16,
		pressed: 12,
		selectedRound: 16,
		selectedSquare: 28,
	},
	lg: {
		round: 48,
		square: 28,
		pressed: 16,
		selectedRound: 28,
		selectedSquare: 48,
	},
	xl: {
		round: 68,
		square: 28,
		pressed: 16,
		selectedRound: 28,
		selectedSquare: 68,
	},
};

/**
 * Outline border width per size for the `outlined` color style.
 * XS/SM/MD = 1dp, LG = 2dp, XL = 3dp.
 * @internal
 */
const SIZE_OUTLINE_WIDTH: Record<string, string> = {
	xs: "border",
	sm: "border",
	md: "border",
	lg: "border-2",
	xl: "border-[3px]",
};

// ─────────────────────────────────────────────────────────────────────────────
// Color Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Color-role class pairs for each `colorStyle` × selection state combination.
 * @internal
 */
const colorStyles = {
	standard: {
		default:
			"text-m3-on-surface-variant hover:bg-m3-on-surface-variant/8 active:bg-m3-on-surface-variant/12",
		selected: "text-m3-primary hover:bg-m3-primary/8 active:bg-m3-primary/12",
	},
	filled: {
		default:
			"bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-on-surface-variant/8 active:bg-m3-on-surface-variant/12",
		selected:
			"bg-m3-primary text-m3-on-primary hover:brightness-95 active:brightness-90",
	},
	tonal: {
		default:
			"bg-m3-secondary-container text-m3-on-secondary-container hover:bg-m3-on-secondary-container/8 active:bg-m3-on-secondary-container/12",
		selected:
			"bg-m3-secondary text-m3-on-secondary hover:brightness-95 active:brightness-90",
	},
	outlined: {
		default:
			"border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-on-surface-variant/8 active:bg-m3-on-surface-variant/12",
		selected:
			"bg-m3-inverse-surface text-m3-inverse-on-surface border-transparent hover:brightness-95 active:brightness-90",
	},
};

/**
 * Base Tailwind classes shared by all icon button variants.
 * Separated from CVA to keep bundle output lean (no runtime variant lookups needed here).
 * @internal
 */
const baseIconButtonClasses = [
	"relative shrink-0 inline-flex items-center justify-center",
	"select-none cursor-pointer",
	"transition-[background-color,color,border-color,box-shadow,opacity,filter] duration-200",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
	"disabled:pointer-events-none disabled:opacity-[0.38]",
];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

/**
 * Base props for the Icon Button component.
 *
 * @see {@link IconButtonProps} for the full discriminated union.
 * @see https://m3.material.io/components/icon-buttons/overview
 */
export interface BaseIconButtonProps extends MotionButtonProps {
	/**
	 * Visual color style following MD3 color roles.
	 * @default "standard"
	 */
	colorStyle?: "standard" | "filled" | "tonal" | "outlined";
	/**
	 * Button container size.
	 * Sizes: XS=32dp, SM=40dp, MD=56dp, LG=96dp, XL=136dp.
	 * @default "sm"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/**
	 * Container shape controlling border-radius morphing.
	 * - `round`: fully circular (CornerFull).
	 * - `square`: rounded square (CornerMedium–CornerExtraLarge per size).
	 * @default "round"
	 */
	shape?: "round" | "square";
	/**
	 * When `true`, replaces the icon with an animated loading indicator.
	 * Interaction is blocked and `aria-busy` is set.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Spinner style shown while `loading={true}`.
	 * @default "loading-indicator"
	 */
	loadingVariant?: "loading-indicator" | "circular";
	/** Icon content — typically a single SVG icon component. */
	children: React.ReactNode;
	/**
	 * Accessible label — **REQUIRED** because icon buttons have no visible text.
	 *
	 * @example "Close", "Add to favourites", "Toggle dark mode"
	 * @see https://m3.material.io/components/icon-buttons/accessibility
	 */
	"aria-label": string;
}

/**
 * Complete `IconButton` props — discriminated union that enforces
 * `selected` is only valid with `variant="toggle"`.
 *
 * @example
 * ```tsx
 * // Standard
 * <IconButton aria-label="Close" onClick={handleClose}>
 *   <XIcon />
 * </IconButton>
 *
 * // Toggle
 * <IconButton
 *   variant="toggle"
 *   selected={isLiked}
 *   aria-label={isLiked ? "Unlike" : "Like"}
 *   colorStyle="filled"
 *   onClick={() => setIsLiked(!isLiked)}
 * >
 *   <HeartIcon />
 * </IconButton>
 * ```
 *
 * @see https://m3.material.io/components/icon-buttons/overview
 */
export type IconButtonProps = BaseIconButtonProps &
	(
		| { variant?: "default"; selected?: never }
		| { variant: "toggle"; selected: boolean }
	);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the animated border-radius based on shape and toggle state.
 *
 * @param radiusConfig - The radius map entry for the current size.
 * @param shape - Current shape variant.
 * @param isToggle - Whether the button is a toggle variant.
 * @param isSelected - Current toggle selection state.
 * @returns Border radius in px.
 * @internal
 */
function resolveAnimateRadius(
	radiusConfig: (typeof RADIUS_MAP)[string],
	shape: "round" | "square",
	isToggle: boolean,
	isSelected: boolean,
): number {
	if (isToggle && isSelected) {
		return shape === "round"
			? radiusConfig.selectedRound
			: radiusConfig.selectedSquare;
	}
	return shape === "round" ? radiusConfig.round : radiusConfig.square;
}

/**
 * Returns extra disabled-state classes specific to background-bearing color styles.
 *
 * `filled` and `tonal` need a dimmed background; `outlined` needs a dimmed border.
 * `standard` only dims the icon colour (handled by global `disabled:opacity-[0.38]`).
 *
 * @param colorStyle - Current color style.
 * @returns Tailwind disabled-state override classes.
 * @internal
 */
function resolveDisabledBgClass(colorStyle: string): string {
	if (colorStyle === "filled" || colorStyle === "tonal") {
		return "disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]";
	}
	if (colorStyle === "outlined") {
		return "disabled:text-m3-on-surface/[0.38] disabled:border-m3-on-surface/[0.12]";
	}
	return "disabled:text-m3-on-surface/[0.38]";
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const IconButtonComponent = React.forwardRef<
	HTMLButtonElement,
	IconButtonProps
>(
	(
		{
			className,
			style,
			variant = "default",
			colorStyle = "standard",
			size = "sm",
			shape = "round",
			selected,
			loading = false,
			loadingVariant = "loading-indicator",
			children,
			onClick,
			onKeyDown,
			"aria-label": ariaLabel,
			...restProps
		},
		ref,
	) => {
		const isToggle = variant === "toggle";
		const isSelected = isToggle && !!selected;

		// Derived display values — memoized to avoid recalculation on every render
		const resolvedColorClass = React.useMemo(
			() =>
				isSelected
					? colorStyles[colorStyle].selected
					: colorStyles[colorStyle].default,
			[isSelected, colorStyle],
		);

		const outlineWidthClass = React.useMemo(
			() =>
				colorStyle === "outlined" && !isSelected
					? (SIZE_OUTLINE_WIDTH[size] ?? "border")
					: "",
			[colorStyle, isSelected, size],
		);

		const disabledBgClass = React.useMemo(
			() => resolveDisabledBgClass(colorStyle),
			[colorStyle],
		);

		const radiusConfig = RADIUS_MAP[size] ?? RADIUS_MAP.sm;
		const animateRadius = resolveAnimateRadius(
			radiusConfig,
			shape,
			isToggle,
			isSelected,
		);
		const pressedRadius = radiusConfig.pressed;

		const sizeIcon = SIZE_ICON[size] ?? SIZE_ICON.sm;
		const iconClass = sizeIcon.cls;
		const iconPx = sizeIcon.px;

		// xs/sm need 48dp touch target (WCAG 2.5.5 + MD3 a11y)
		const needsTouchTarget = size === "xs" || size === "sm";

		// ── Ripple ───────────────────────────────────────────────────────
		const { ripples, onPointerDown, removeRipple } = useRippleState({
			disabled: loading,
		});

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				if (loading) {
					e.preventDefault();
					return;
				}
				onClick?.(e);
			},
			[loading, onClick],
		);

		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLButtonElement>) => {
				if (loading) return;
				// Manually trigger click for Enter/Space — needed because JSDOM does not
				// fire native click events from keyboard, and some custom scroll containers
				// suppress the default browser behaviour.
				if ((e.key === "Enter" || e.key === " ") && onClick) {
					e.preventDefault();
					(e.currentTarget as HTMLButtonElement).click();
				}
				onKeyDown?.(e);
			},
			[loading, onClick, onKeyDown],
		);

		return (
			<LazyMotion features={domMax} strict>
				<m.button
					ref={ref}
					type="button"
					aria-pressed={isToggle ? isSelected : undefined}
					aria-label={ariaLabel}
					aria-busy={loading || undefined}
					aria-disabled={loading || restProps.disabled}
					onClick={handleClick}
					onPointerDown={onPointerDown}
					onKeyDown={handleKeyDown}
					style={style}
					animate={{ borderRadius: animateRadius }}
					whileTap={{ borderRadius: pressedRadius }}
					transition={{ borderRadius: SPRING_TRANSITION_FAST }}
					className={cn(
						baseIconButtonClasses,
						resolvedColorClass,
						outlineWidthClass,
						disabledBgClass,
						"overflow-hidden",
						SIZE_STYLES[size],
						loading && "pointer-events-none opacity-75 cursor-not-allowed",
						className,
					)}
					{...restProps}
				>
					{/* Extended 48dp touch target for xs/sm (WCAG 2.5.5) */}
					{needsTouchTarget && <TouchTarget />}

					<Ripple ripples={ripples} onRippleDone={removeRipple} />

					<AnimatePresence mode="wait" initial={false}>
						{loading ? (
							<m.span
								key="loading"
								{...ICON_SPAN_VARIANTS}
								transition={SPRING_TRANSITION}
								className={cn(
									"flex items-center justify-center shrink-0",
									iconClass,
								)}
							>
								{loadingVariant === "loading-indicator" ? (
									<LoadingIndicator
										size={iconPx}
										color="currentColor"
										aria-label="Loading"
									/>
								) : (
									<ProgressIndicator
										variant="circular"
										size={iconPx}
										color="currentColor"
										trackColor="transparent"
										aria-label="Loading"
									/>
								)}
							</m.span>
						) : (
							<m.span
								key="content"
								{...ICON_SPAN_VARIANTS}
								transition={SPRING_TRANSITION}
								aria-hidden="true"
								className={cn(
									"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full",
									iconClass,
								)}
							>
								{children}
							</m.span>
						)}
					</AnimatePresence>
				</m.button>
			</LazyMotion>
		);
	},
);

IconButtonComponent.displayName = "IconButton";

/**
 * MD3 Expressive Icon Button.
 *
 * An icon-only button with spring shape morphing, ripple effect, loading state support,
 * and an optional toggle variant. Compliant with MD3 Expressive sizing and WCAG 2.5.5
 * (touch target minimum for XS and SM sizes).
 *
 * @remarks
 * - `aria-label` is **required** — icon buttons have no visible text label.
 * - `variant="toggle"` requires `selected: boolean`.
 * - Touch target is automatically extended to 48dp for `xs` and `sm` sizes.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Close" onClick={handleClose}>
 *   <XIcon />
 * </IconButton>
 *
 * <IconButton
 *   variant="toggle"
 *   selected={isBookmarked}
 *   aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
 *   colorStyle="filled"
 *   onClick={toggleBookmark}
 * >
 *   <BookmarkIcon />
 * </IconButton>
 * ```
 *
 * @see https://m3.material.io/components/icon-buttons/overview
 */
export const IconButton = React.memo(IconButtonComponent);
