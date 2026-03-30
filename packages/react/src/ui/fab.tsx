/**
 * @file fab.tsx
 *
 * MD3 Expressive Floating Action Button (FAB).
 *
 * Supports four sizes, an extended variant with animated label reveal,
 * shape morphing, a `lowered` elevation variant, and an optional
 * `FABPosition` container for absolute positioning within a layout.
 *
 * @see https://m3.material.io/components/floating-action-button/overview
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
 * Per-size layout classes for the FAB container.
 * MD3 sizes: SM=40dp, MD=56dp, LG=96dp, XL=136dp.
 * Extended FABs use `w-full` + `px-*` via the caller.
 * @internal
 */
const SIZE_STYLES: Record<string, string> = {
	sm: "h-10 w-10",
	md: "h-14 w-14",
	lg: "h-24 w-24",
	xl: "h-[8.5rem] w-[8.5rem]",
};

/**
 * Per-size icon dimensions (Tailwind class + pixel value).
 * MD3 icon sizes: SM=24dp, MD=24dp, LG=32dp, XL=40dp.
 * @internal
 */
const SIZE_ICON: Record<string, { cls: string; px: number }> = {
	sm: { cls: "size-6", px: 24 },
	md: { cls: "size-6", px: 24 },
	lg: { cls: "size-8", px: 32 },
	xl: { cls: "size-10", px: 40 },
};

/**
 * Per-size label typography classes used in the extended variant.
 * @internal
 */
const SIZE_TEXT_CLASS: Record<string, string> = {
	sm: "text-sm  font-medium",
	md: "text-base font-medium",
	lg: "text-xl  font-semibold",
	xl: "text-2xl font-semibold",
};

// ─────────────────────────────────────────────────────────────────────────────
// Shape Morphing — Border Radius Map
//
// IMPORTANT: Use exact height/2 values for "round" radii to avoid the dead-zone
// artefact: CSS clips any radius > height/2 identically, so animating from
// 9999 → small value produces a jump/snap at the threshold.
// Heights: SM=40dp, MD=56dp, LG=96dp, XL=136dp
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Per-size border-radius tokens for all interaction / selection states.
 *
 * - `default`: idle pill radius (height / 2).
 * - `pressed`: compressed on `whileTap`.
 * - `extended`: radius for the extended (label-visible) state.
 * - `extended_pressed`: compressed extended state on `whileTap`.
 *
 * @internal
 */
const MORPH_RADIUS: Record<
	string,
	{
		default: number;
		pressed: number;
		extended: number;
		extended_pressed: number;
	}
> = {
	sm: { default: 20, pressed: 10, extended: 20, extended_pressed: 10 },
	md: { default: 28, pressed: 16, extended: 16, extended_pressed: 10 },
	lg: { default: 48, pressed: 28, extended: 28, extended_pressed: 20 },
	xl: { default: 68, pressed: 40, extended: 40, extended_pressed: 28 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Color Roles
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Color-role Tailwind class map for each FAB color variant.
 * @internal
 */
const COLOR_CLASSES: Record<
	string,
	{ bg: string; text: string; shadow: string }
> = {
	primary: {
		bg: "bg-m3-primary-container",
		text: "text-m3-on-primary-container",
		shadow: "shadow-md",
	},
	secondary: {
		bg: "bg-m3-secondary-container",
		text: "text-m3-on-secondary-container",
		shadow: "shadow-md",
	},
	tertiary: {
		bg: "bg-m3-tertiary-container",
		text: "text-m3-on-tertiary-container",
		shadow: "shadow-md",
	},
	surface: {
		bg: "bg-m3-surface-container-high",
		text: "text-m3-primary",
		shadow: "shadow-md",
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

/**
 * Props for the `FAB` component.
 *
 * @remarks
 * - For icon-only FABS, `aria-label` is **required** (no visible text).
 * - In extended mode (`extended={true}`), `children` provides the label text
 *   and the button becomes self-labelling.
 * - `lowered` reduces the elevation shadow to match MD3's "lowered" FAB variant,
 *   used when the FAB is embedded within a component (e.g. bottom app bar).
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
export interface FABProps extends MotionButtonProps {
	/**
	 * Icon to display — typically a single SVG icon component.
	 * Swapped out for a loading spinner when `loading={true}`.
	 */
	icon: React.ReactNode;
	/**
	 * FAB size variant.
	 * - `sm`: Small (40dp) — use inside content areas.
	 * - `md`: Regular (56dp) — primary action on a screen.
	 * - `lg`: Large (96dp) — prominent primary action.
	 * - `xl`: Extra-large (136dp) — hero / spotlight action.
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg" | "xl";
	/**
	 * MD3 color container role controlling the FAB's background and icon colour.
	 * @default "primary"
	 */
	colorStyle?: "primary" | "secondary" | "tertiary" | "surface";
	/**
	 * When `true`, renders an extended FAB with an animated label.
	 * The label is read from `children`.
	 * @default false
	 */
	extended?: boolean;
	/**
	 * Label content for the extended FAB (`extended={true}`).
	 * Typically a string.
	 */
	children?: React.ReactNode;
	/**
	 * When `true`, uses the *lowered* elevation variant (less shadow).
	 * Use inside bottom app bars or surfaces where elevation hierarchy demands it.
	 * @default false
	 */
	lowered?: boolean;
	/**
	 * When `true`, replaces the icon with an animated loading indicator
	 * and prevents interactions.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Spinner style shown while `loading={true}`.
	 * @default "loading-indicator"
	 */
	loadingVariant?: "loading-indicator" | "circular";
	/**
	 * Whether the FAB is currently visible. Drives entrance/exit animations.
	 * @default true
	 */
	visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// FABPosition — Layout Wrapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props for `FABPosition` — an absolute-positioned FAB container.
 *
 * @see {@link FABPosition}
 */
export interface FABPositionProps {
	/**
	 * Screen corner to anchor the FAB.
	 * @default "bottom-right"
	 */
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	/** The `<FAB>` element to position. */
	children: React.ReactNode;
	/** Additional class names for the position wrapper. */
	className?: string;
}

const POSITION_CLASS: Record<string, string> = {
	"bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
	"bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
	"top-right": "top-4 right-4 sm:top-6 sm:right-6",
	"top-left": "top-4 left-4 sm:top-6 sm:left-6",
};

/**
 * Absolute-position wrapper for a `<FAB>` element.
 *
 * Anchors the FAB to any of the four screen corners with responsive offset spacing.
 * The parent must be `position: relative` (or a positioned ancestor within the page).
 *
 * @example
 * ```tsx
 * <div className="relative min-h-screen">
 *   <FABPosition position="bottom-right">
 *     <FAB icon={<PencilIcon />} aria-label="Compose" />
 *   </FABPosition>
 * </div>
 * ```
 *
 * @see {@link FAB}
 * @see https://m3.material.io/components/floating-action-button/guidelines
 */
export function FABPosition({
	position = "bottom-right",
	children,
	className,
}: FABPositionProps) {
	return (
		<div
			className={cn(
				"absolute z-10",
				POSITION_CLASS[position] ?? POSITION_CLASS["bottom-right"],
				className,
			)}
		>
			{children}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// FAB Component
// ─────────────────────────────────────────────────────────────────────────────

const FABComponent = React.forwardRef<HTMLButtonElement, FABProps>(
	(
		{
			className,
			style,
			icon,
			size = "md",
			colorStyle = "primary",
			extended = false,
			children,
			lowered = false,
			loading = false,
			loadingVariant = "loading-indicator",
			visible = true,
			onClick,
			onKeyDown,
			"aria-label": ariaLabel,
			...restProps
		},
		ref,
	) => {
		const colors = COLOR_CLASSES[colorStyle] ?? COLOR_CLASSES.primary;
		const radiusConfig = MORPH_RADIUS[size] ?? MORPH_RADIUS.md;

		const animateRadius = extended
			? radiusConfig.extended
			: radiusConfig.default;
		const pressedRadius = extended
			? radiusConfig.extended_pressed
			: radiusConfig.pressed;

		const sizeIcon = SIZE_ICON[size] ?? SIZE_ICON.md;
		const iconClass = sizeIcon.cls;
		const iconPx = sizeIcon.px;

		// xs/sm share the SM token; only MD FAB (40dp) needs the touch target
		const needsTouchTarget = size === "sm";

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
				<AnimatePresence>
					{visible && (
						<m.button
							ref={ref}
							type="button"
							aria-label={
								ariaLabel ||
								(typeof children === "string" ? children : undefined)
							}
							aria-busy={loading || undefined}
							aria-disabled={loading || restProps.disabled}
							onClick={handleClick}
							onPointerDown={onPointerDown}
							onKeyDown={handleKeyDown}
							style={style}
							// ── Entrance / Exit (FAB visibility) ────────────────
							initial={{ scale: 0.5, opacity: 0, borderRadius: animateRadius }}
							animate={{ scale: 1, opacity: 1, borderRadius: animateRadius }}
							exit={{ scale: 0.5, opacity: 0 }}
							// ── Shape Morphing (extended toggle) ────────────────
							whileTap={{ borderRadius: pressedRadius }}
							transition={{
								borderRadius: SPRING_TRANSITION_FAST,
								scale: SPRING_TRANSITION,
								opacity: { duration: 0.25, ease: "easeOut" },
							}}
							className={cn(
								"relative shrink-0 inline-flex items-center justify-center",
								"select-none cursor-pointer overflow-hidden",
								"transition-[box-shadow,opacity,filter] duration-200",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
								"disabled:pointer-events-none disabled:opacity-[0.38] disabled:shadow-none",
								colors.bg,
								colors.text,
								lowered ? "shadow-sm" : colors.shadow,
								SIZE_STYLES[size] ?? "h-14 w-14",
								extended && "w-auto px-6",
								SIZE_TEXT_CLASS[size],
								loading && "pointer-events-none opacity-75 cursor-not-allowed",
								className,
							)}
							{...restProps}
						>
							{needsTouchTarget && <TouchTarget />}

							<Ripple ripples={ripples} onRippleDone={removeRipple} />

							{/* Icon / Loading swap */}
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
										key="icon"
										{...ICON_SPAN_VARIANTS}
										transition={SPRING_TRANSITION}
										aria-hidden="true"
										className={cn(
											"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full",
											iconClass,
										)}
									>
										{icon}
									</m.span>
								)}
							</AnimatePresence>

							{/* Extended label — animates in/out with the `extended` prop */}
							<AnimatePresence initial={false}>
								{extended && children && (
									<m.span
										key="label"
										initial={{ width: 0, opacity: 0 }}
										animate={{ width: "auto", opacity: 1 }}
										exit={{ width: 0, opacity: 0 }}
										transition={SPRING_TRANSITION}
										className="overflow-hidden whitespace-nowrap ml-3"
									>
										{children}
									</m.span>
								)}
							</AnimatePresence>
						</m.button>
					)}
				</AnimatePresence>
			</LazyMotion>
		);
	},
);

FABComponent.displayName = "FAB";

/**
 * MD3 Expressive Floating Action Button.
 *
 * Represents the primary action of a screen. Supports size variants (SM–XL),
 * color roles, an extended mode with animated label, loading states,
 * and entrance/exit visibility animations.
 *
 * @remarks
 * - `aria-label` is **required** for icon-only FABs.
 * - When `extended={true}`, the FAB automatically becomes self-labelled
 *   if `children` is a string; `aria-label` can be omitted in that case.
 * - `visible={false}` triggers a scale-out exit animation (spring).
 * - Use `FABPosition` to anchor it to a corner of the screen.
 *
 * @example
 * ```tsx
 * // Icon-only FAB (primary action)
 * <FAB icon={<PencilIcon />} aria-label="Compose" />
 *
 * // Extended FAB
 * <FAB icon={<PencilIcon />} extended>Compose</FAB>
 *
 * // Large FAB with loading
 * <FAB icon={<UploadIcon />} size="lg" loading={sending} aria-label="Upload" />
 *
 * // Anchored to bottom-right
 * <FABPosition position="bottom-right">
 *   <FAB icon={<PlusIcon />} aria-label="New note" />
 * </FABPosition>
 * ```
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
export const FAB = React.memo(FABComponent);
