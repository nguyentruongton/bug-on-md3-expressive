"use client";

import { cva } from "class-variance-authority";
import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence, domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { LoadingIndicator } from "./loading-indicator";
import { ProgressIndicator } from "./progress-indicator";
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// Use HTMLMotionProps<"button"> as the base to avoid onDrag / event handler
// conflicts between native React and Framer Motion's extended prop types.
// ─────────────────────────────────────────────────────────────────────────────
type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children" | "color">;

/**
 * Thuộc tính cơ bản của nút theo chuẩn thiết kế Material Design 3 (MD3) Expressive.
 */
export interface BaseButtonProps extends MotionButtonProps {
	/**
	 * Biến thể màu sắc của nút theo MD3.
	 * @default "filled"
	 */
	colorStyle?: "elevated" | "filled" | "tonal" | "outlined" | "text";
	/**
	 * Biến thể màu sắc khi nút được chọn (chỉ áp dụng cho nút chuyển đổi trạng thái - toggle).
	 */
	selectedColorStyle?: "elevated" | "filled" | "tonal" | "outlined" | "text";
	/**
	 * Kích thước của nút, hỗ trợ từ XS đến XL.
	 * @default "sm"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/**
	 * Định dạng viền của nút: hình viên thuốc (round) hoặc hình vuông có bo góc (square).
	 * @default "round"
	 */
	shape?: "round" | "square";
	/**
	 * Biểu tượng bên trong nút. Kích thước tự động được căn chỉnh theo `size` của nút dựa trên thông số thiết kế MD3.
	 */
	icon?: React.ReactNode;
	/**
	 * Vị trí xuất hiện của biểu tượng so với nội dung chữ.
	 * @default "leading"
	 */
	iconPosition?: "leading" | "trailing";
	/**
	 * Nếu `true`, nút sẽ chuyển sang trạng thái chờ hiển thị vòng quay tải và bị vô hiệu hóa tương tác.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Phong cách hiển thị của vòng quay tải khi ở trạng thái chờ:
	 * - `loading-indicator`: Hình khối thay đổi (morphing) đồng bộ với MD3 Expressive.
	 * - `circular`: Vòng quay tròn cổ điển (classic spinner).
	 * @default "loading-indicator"
	 */
	loadingVariant?: "loading-indicator" | "circular";
	/**
	 * Nội dung con của nút (chủ yếu được hiển thị dưới dạng nhãn chữ).
	 */
	children: React.ReactNode;
}

/**
 * Thuộc tính hoàn chỉnh của nút, bao gồm cấu hình là nút thông thường hay là nút trạng thái (toggle) yêu cầu thêm thuộc tính `selected`.
 */
export type ButtonProps = BaseButtonProps &
	(
		| { variant?: "default"; selected?: never }
		| { variant: "toggle"; selected: boolean }
	);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const getSizeIconPx = (size: string): number => {
	switch (size) {
		case "xs": return 18;
		case "sm": return 20;
		case "md": return 24;
		case "lg": return 32;
		case "xl": return 40;
		default: return 20;
	}
};

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

		// When toggle is selected, use selectedColorStyle if provided, else "filled".
		// This avoids CSS specificity battles between two bg-* classes from different
		// CVA variants. effectiveColorStyle is the single source of truth for color.
		const effectiveColorStyle = isToggle && isSelected ? (selectedColorStyle || "filled") : colorStyle;

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
		const labelText = React.useMemo(() => 
			typeof children === "string"
				? children.charAt(0).toUpperCase() + children.slice(1).toLowerCase()
				: children,
			[children]
		);

		const iconClass = React.useMemo(() => SIZE_ICON_CLASS[size] ?? "size-5", [size]);

		// Let TypeScript infer MotionStyle-compatible type (not React.CSSProperties)
		const mergedStyle = React.useMemo(() => ({
			...SIZE_STYLES[size],
			...style,
		}), [size, style]);

		// ── A11y: 48dp min touch target for XS / SM via invisible ::after span ─
		const needsTouchTarget = size === "xs" || size === "sm";

		// ── Ripple state ─────────────────────────────────────────────────────
		const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

		const handlePointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLButtonElement>) => {
				if (loading) return; // Không trigger ripple khi đang loading
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				// Ripple must entirely fill button: diagonal = max size needed
				const size = Math.hypot(rect.width, rect.height) * 2;
				setRipples((prev) => [...prev, { id: Date.now(), x, y, size }]);
			},
			[loading],
		);

		const removeRipple = React.useCallback((id: number) => {
			setRipples((prev) => prev.filter((r) => r.id !== id));
		}, []);

		const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
			if (loading) {
				e.preventDefault();
				return;
			}
			if (onClick) onClick(e);
		}, [loading, onClick]);

		const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (loading) return;
			if (e.key === "Enter" || e.key === " ") {
				if (onClick) {
					e.preventDefault();
					(e.currentTarget as HTMLButtonElement).click();
				}
			}
			if (onKeyDown) onKeyDown(e);
		}, [loading, onClick, onKeyDown]);

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
					aria-busy={loading ? true : undefined}
					aria-disabled={loading ? true : restProps.disabled}
					onClick={handleClick}
					onPointerDown={handlePointerDown}
					onKeyDown={handleKeyDown}
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
							duration: 0.2,
						},
					}}
					className={cn(
						buttonColorVariants({ colorStyle: effectiveColorStyle }),
						// overflow-hidden is critical: clips Ripple to match morphing border-radius
						"overflow-hidden",
						SIZE_TEXT_CLASS[size],
						needsTouchTarget ? "relative" : "",
						loading && "pointer-events-none opacity-75 cursor-not-allowed",
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

					<AnimatePresence initial={false}>
						{(loading || (icon && iconPosition === "leading")) && (
							<m.span
								initial={{ width: 0, opacity: 0, scale: 0.5 }}
								animate={{ width: "auto", opacity: 1, scale: 1 }}
								exit={{ width: 0, opacity: 0, scale: 0.5 }}
								transition={{ type: "spring", bounce: 0, duration: 0.3 }}
								aria-hidden={loading ? undefined : "true"}
								className={cn(
									"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full overflow-hidden",
									// Khi loading, nếu không có iconClass nào, ta vẫn giữ size box bằng cách lấy iconClass tương ứng với size Button.
									iconClass,
								)}
							>
								{loading ? (
									loadingVariant === "loading-indicator" ? (
										<LoadingIndicator
											size={getSizeIconPx(size)}
											color="currentColor"
											aria-label="Loading"
										/>
									) : (
										<ProgressIndicator
											variant="circular"
											size={getSizeIconPx(size)}
											color="currentColor"
											trackColor="transparent"
											aria-label="Loading"
										/>
									)
								) : (
									icon
								)}
							</m.span>
						)}
					</AnimatePresence>

					<m.span
						layout="size"
						className="inline-flex items-center gap-[inherit]"
						transition={{ type: "spring", bounce: 0, duration: 0.3 }}
					>
						{labelText}
					</m.span>

					<AnimatePresence initial={false}>
						{icon && iconPosition === "trailing" && (
							<m.span
								initial={{ width: 0, opacity: 0, scale: 0.5 }}
								animate={{ width: "auto", opacity: 1, scale: 1 }}
								exit={{ width: 0, opacity: 0, scale: 0.5 }}
								transition={{ type: "spring", bounce: 0, duration: 0.3 }}
								aria-hidden="true"
								className={cn(
									"flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full overflow-hidden",
									iconClass,
								)}
							>
								{icon}
							</m.span>
						)}
					</AnimatePresence>
				</m.button>
			</LazyMotion>
		);
	},
);

ButtonComponent.displayName = "Button";

/**
 * Component Nút (Button) theo chuẩn thiết kế Material Design 3 (MD3) Expressive.
 * Tích hợp sẵn các hiệu ứng gợn sóng (ripple wave), chuyển hóa hình dạng khi tương tác (morphing shape) và các trạng thái tải.
 * 
 * @example
 * ```tsx
 * // Nút bấm thông thường
 * <Button colorStyle="filled" size="md">Nhấn vào đây</Button>
 * 
 * // Nút bấm có biểu tượng và đang chờ xử lý
 * <Button icon={<CheckIcon />} loading={isSubmitting}>Xác nhận</Button>
 * 
 * // Nút chuyển đổi trạng thái (toggle/segmented)
 * <Button variant="toggle" selected={isToggled} onClick={() => setToggled(!isToggled)}>
 *   Bật / Tắt
 * </Button>
 * ```
 */
export const Button = React.memo(ButtonComponent);
