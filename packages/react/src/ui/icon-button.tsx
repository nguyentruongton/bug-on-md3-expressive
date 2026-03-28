import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence, domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { LoadingIndicator } from "./loading-indicator";
import { ProgressIndicator } from "./progress-indicator";
import { Ripple, type RippleOrigin } from "./ripple";

// ─── MD3 Expressive sizing tokens (v14.1.0) ─────────────────────────────────
// XS=32dp, SM=40dp, MD=56dp, LG=96dp, XL=136dp
const SIZE_STYLES: Record<string, string> = {
	xs: "h-8 w-8",
	sm: "h-10 w-10",
	md: "h-14 w-14",
	lg: "h-24 w-24",
	xl: "h-[8.5rem] w-[8.5rem]",
};

// Icon size class & px — single source of truth
const SIZE_ICON: Record<string, { cls: string; px: number }> = {
	xs: { cls: "size-5", px: 20 },
	sm: { cls: "size-6", px: 24 },
	md: { cls: "size-6", px: 24 },
	lg: { cls: "size-8", px: 32 },
	xl: { cls: "size-10", px: 40 },
};

// ─── MD3 shape morphing radius map ──────────────────────────────────────────
// Keys: round=CornerFull, square=CornerMedium–XL, pressed, selectedRound, selectedSquare
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
	xs: { round: 16, square: 12, pressed: 8, selectedRound: 12, selectedSquare: 16 },
	sm: { round: 20, square: 12, pressed: 8, selectedRound: 12, selectedSquare: 20 },
	md: { round: 28, square: 16, pressed: 12, selectedRound: 16, selectedSquare: 28 },
	lg: { round: 48, square: 28, pressed: 16, selectedRound: 28, selectedSquare: 48 },
	xl: { round: 68, square: 28, pressed: 16, selectedRound: 28, selectedSquare: 68 },
};

// ─── Outline width (outlined variant only) ───────────────────────────────────
// XS/SM/MD=1dp, LG=2dp, XL=3dp
const SIZE_OUTLINE_WIDTH: Record<string, string> = {
	xs: "border",
	sm: "border",
	md: "border",
	lg: "border-2",
	xl: "border-[3px]",
};

// ─── Color variants ──────────────────────────────────────────────────────────
const colorStyles = {
	standard: {
		default: "text-m3-on-surface-variant hover:bg-m3-on-surface-variant/8 active:bg-m3-on-surface-variant/12",
		selected: "text-m3-primary hover:bg-m3-primary/8 active:bg-m3-primary/12",
	},
	filled: {
		default: "bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-on-surface-variant/8 active:bg-m3-on-surface-variant/12",
		selected: "bg-m3-primary text-m3-on-primary hover:brightness-95 active:brightness-90",
	},
	tonal: {
		default: "bg-m3-secondary-container text-m3-on-secondary-container hover:bg-m3-on-secondary-container/8 active:bg-m3-on-secondary-container/12",
		selected: "bg-m3-secondary text-m3-on-secondary hover:brightness-95 active:brightness-90",
	},
	outlined: {
		default: "border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-on-surface-variant/8 active:bg-m3-on-surface-variant/12",
		selected: "bg-m3-inverse-surface text-m3-inverse-on-surface border-transparent hover:brightness-95 active:brightness-90",
	},
};

const baseIconButtonClasses = [
	"relative shrink-0 inline-flex items-center justify-center",
	"select-none cursor-pointer",
	"transition-[background-color,color,border-color,box-shadow,opacity,filter] duration-200",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
	"disabled:pointer-events-none disabled:opacity-[0.38]",
];

// ─── Types ───────────────────────────────────────────────────────────────────
type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

export interface BaseIconButtonProps extends MotionButtonProps {
	/**
	 * Biến thể màu sắc của icon button theo MD3.
	 * @default "standard"
	 */
	colorStyle?: "standard" | "filled" | "tonal" | "outlined";
	/**
	 * Kích thước của icon button, hỗ trợ từ XS (32dp) đến XL (136dp).
	 * @default "sm"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/**
	 * Hình dạng container:
	 * - `round`: bo tròn hoàn toàn (CornerFull)
	 * - `square`: bo góc nhỏ hơn (CornerMedium–CornerExtraLarge theo size)
	 * @default "round"
	 */
	shape?: "round" | "square";
	/**
	 * Hiển thị trạng thái đang tải thay thế icon.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Kiểu loading indicator khi `loading=true`.
	 * @default "loading-indicator"
	 */
	loadingVariant?: "loading-indicator" | "circular";
	/** Icon hiển thị bên trong button. */
	children: React.ReactNode;
	/**
	 * Nhãn accessibility — **BẮT BUỘC** vì icon button không có text label.
	 * @see https://m3.material.io/components/icon-button/accessibility
	 */
	"aria-label": string;
}

export type IconButtonProps = BaseIconButtonProps &
	(
		| { variant?: "default"; selected?: never }
		| { variant: "toggle"; selected: boolean }
	);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function resolveAnimateRadius(
	radiusConfig: (typeof RADIUS_MAP)[string],
	shape: "round" | "square",
	isToggle: boolean,
	isSelected: boolean,
): number {
	if (isToggle && isSelected) {
		return shape === "round" ? radiusConfig.selectedRound : radiusConfig.selectedSquare;
	}
	return shape === "round" ? radiusConfig.round : radiusConfig.square;
}

function resolveDisabledBgClass(colorStyle: string): string {
	if (colorStyle === "filled" || colorStyle === "tonal") {
		return "disabled:bg-m3-on-surface/12 disabled:text-m3-on-surface/[0.38]";
	}
	if (colorStyle === "outlined") {
		return "disabled:text-m3-on-surface/[0.38] disabled:border-m3-on-surface/[0.12]";
	}
	return "disabled:text-m3-on-surface/[0.38]";
}

const SPRING_TRANSITION = { type: "spring", bounce: 0, duration: 0.3 } as const;

// ─── Component ───────────────────────────────────────────────────────────────
const IconButtonComponent = React.forwardRef<HTMLButtonElement, IconButtonProps>(
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

		const resolvedColorClass = isSelected
			? colorStyles[colorStyle].selected
			: colorStyles[colorStyle].default;

		const outlineWidthClass =
			colorStyle === "outlined" && !isSelected ? (SIZE_OUTLINE_WIDTH[size] ?? "border") : "";

		const disabledBgClass = resolveDisabledBgClass(colorStyle);

		const radiusConfig = RADIUS_MAP[size] ?? RADIUS_MAP.sm;
		const animateRadius = resolveAnimateRadius(radiusConfig, shape, isToggle, isSelected);
		const pressedRadius = radiusConfig.pressed;

		const sizeIcon = SIZE_ICON[size] ?? SIZE_ICON.sm;
		const iconClass = sizeIcon.cls;
		const iconPx = sizeIcon.px;

		// xs/sm need 48dp touch target (WCAG 2.5.5 + MD3 a11y)
		const needsTouchTarget = size === "xs" || size === "sm";

		// ── Ripple state ──────────────────────────────────────────────────────
		const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

		const handlePointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLButtonElement>) => {
				if (loading) return;
				const rect = e.currentTarget.getBoundingClientRect();
				const rippleSize = Math.hypot(rect.width, rect.height) * 2;
				setRipples((prev) => [
					...prev,
					{ id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top, size: rippleSize },
				]);
			},
			[loading],
		);

		const removeRipple = React.useCallback((id: number) => {
			setRipples((prev) => prev.filter((r) => r.id !== id));
		}, []);

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
					onPointerDown={handlePointerDown}
					onKeyDown={handleKeyDown}
					style={style}
					animate={{ borderRadius: animateRadius }}
					whileTap={{ borderRadius: pressedRadius }}
					transition={{ borderRadius: { type: "spring", bounce: 0, duration: 0.2 } }}
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
					{needsTouchTarget && (
						<span
							aria-hidden="true"
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-12 min-h-12 cursor-pointer pointer-events-none"
						/>
					)}

					<Ripple ripples={ripples} onRippleDone={removeRipple} />

					<AnimatePresence mode="wait" initial={false}>
						{loading ? (
							<m.span
								key="loading"
								initial={{ scale: 0.01 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0.01 }}
								transition={SPRING_TRANSITION}
								className={cn("flex items-center justify-center shrink-0", iconClass)}
							>
								{loadingVariant === "loading-indicator" ? (
									<LoadingIndicator size={iconPx} color="currentColor" aria-label="Loading" />
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
								initial={{ scale: 0.01 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0.01 }}
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
 * Icon Button theo chuẩn Material Design 3 Expressive.
 *
 * - Shape morphing (spring animation) khi hover/press/toggle
 * - Ripple effect chuẩn MD3
 * - Loading indicator (morphing shape hoặc circular)
 * - Toggle variant với `aria-pressed`
 * - Touch target 48dp cho xs/sm (WCAG 2.5.5)
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Thích" onClick={handleLike}>
 *   <HeartIcon />
 * </IconButton>
 *
 * <IconButton variant="toggle" selected={isLiked} aria-label={isLiked ? "Bỏ thích" : "Thích"}
 *   colorStyle="filled" onClick={() => setIsLiked(!isLiked)}>
 *   <HeartIcon />
 * </IconButton>
 * ```
 */
export const IconButton = React.memo(IconButtonComponent);
