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
	sm: { default: 12, pressed: 8, extended: 12, extended_pressed: 8 },
	md: { default: 16, pressed: 10, extended: 16, extended_pressed: 10 },
	lg: { default: 28, pressed: 20, extended: 28, extended_pressed: 20 },
	xl: { default: 40, pressed: 28, extended: 40, extended_pressed: 28 },
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
 * Tham số Props dùng cho component thao tác nổi `FAB`.
 *
 * @remarks
 * - Đảm bảo rằng đối với loại FAB chỉ show ra mỗi con Icon mà không có nhãn hiển thị (icon-only), bắt buộc phải có thuộc tính `aria-label` nhằm phục vụ (accessibility).
 * - Ở hình thể mở rộng (khi `extended={true}`), phần nội dung truyền vào `children` chính là chuỗi Text được thể hiện cùng nút, và nó sẽ khiến nút button có label mặc định nên bạn có thể chém bớt tham số `aria-label`.
 * - Thuộc tính cờ `lowered` (chìm) giúp giáng cấp hiệu ứng tạo bóng Shadow của thẻ, rải mảng cái shadow theo phong thái MD3 "lowered" FAB;
 *   sử dụng khi nút FAB này vốn bị bọc bên trong bề mặt chìm đè lên component gì khác mà vốn tụi nó đã nhún ở mực sâu (Ví dụ Bottom App Bar) để thiết lập Hierarchy hài hoà.
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
export interface FABProps extends MotionButtonProps {
	/**
	 * Icon đại diện render — thông thường là truyền thẻ component Icon.
	 * Sẽ được tráo đổi thành Spinner tự động quay khi giá trị `loading={true}`.
	 */
	icon: React.ReactNode;
	/**
	 * Kích thước hiển thị FAB. Tuân chuẩn.
	 * - `sm`: Small (40dp) — Được khuyên dùng cho các không gian kín/trong lòng Content.
	 * - `md`: Regular (56dp) — Action thứ yếu hoặc tiêu điểm màn hình. (Phần đông người dùng xài).
	 * - `lg`: Large (96dp) — Trọng tâm thao tác quan trọng lớn nhát.
	 * - `xl`: Extra-large (136dp) — Gây tiếng vang, dạng Spotlight cực bùng nổ của app.
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg" | "xl";
	/**
	 * Container vai trò hệ thống tông màu MD3 dùng phết nền.
	 * @default "primary"
	 */
	colorStyle?: "primary" | "secondary" | "tertiary" | "surface";
	/**
	 * Kích hoạt khi giá trị được đổi là `true`, sẽ diễn tả Animation bung chữ kèm theo độ dãn hình dài cho cái FAB.
	 * Chiều rộng tự cơi nới để thích ứng chuỗi `children`.
	 * @default false
	 */
	extended?: boolean;
	/**
	 * Nơi đón lấy chữ được render cùng khi `extended={true}` bật lên.
	 * Khuyến nghị là Text string thuần.
	 */
	children?: React.ReactNode;
	/**
	 * Nhấn `true`, thì rút lại shadow đi một cấp xuống độ nổi nông cạn.
	 * Mảng bám ở Bottom bar hay Top bar Surface để ránh rườm rà.
	 * @default false
	 */
	lowered?: boolean;
	/**
	 * Nhấp chuột sang `true`, đổi Icon thành cối xay Spinner chờ kết quả. Đồng loạt chặn click tương tác.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Có 2 chuẩn hình của Loading chờ.
	 * @default "loading-indicator"
	 */
	loadingVariant?: "loading-indicator" | "circular";
	/**
	 * Hiện thẻ FAB lên layout không (Kiểm soát bằng motion scale Entrance/Exit).
	 * @default true
	 */
	visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// FABPosition — Layout Wrapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Interface cho component bọc thẻ `FABPosition` — Gắn lớp absolute position nhét cục FAB vào một góc cố định của góc nào đó tại trình duyệt/bề mặt render.
 *
 * @see {@link FABPosition}
 */
export interface FABPositionProps {
	/**
	 * Góc để niêm chặt nút FAB.
	 * @default "bottom-right"
	 */
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	/** Kẹp một nùi element. Mong chờ thả Node `<FAB>` vào đây.*/
	children: React.ReactNode;
	/** CSS Class hỗ trợ chỉnh override */
	className?: string;
}

const POSITION_CLASS: Record<string, string> = {
	"bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
	"bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
	"top-right": "top-4 right-4 sm:top-6 sm:right-6",
	"top-left": "top-4 left-4 sm:top-6 sm:left-6",
};

/**
 * Element bao bọc thẻ định vị Absolute cho component `<FAB>`.
 *
 * Component dùng để cắm phao Neo cái FAB vào sát ở góc của screen kèm theo một cái offset space theo responsive an toàn mà lại trơn chu nhạy nhẽo.
 * Nhưng có quy tắc gốc đó là phần tử bao bọc cha mẹ của nó PHẢI có thẻ tag css `position: relative` (hoặc ở cấp tổ tiêm của trang nào đó phải đẻ gốc rễ ra posisition).
 *
 * @example
 * ```tsx
 * <div className="relative min-h-screen">
 *   // Cái nút sẽ xà xuống dưới cùng bên lề Trái
 *   <FABPosition position="bottom-left">
 *     <FAB icon={<Icon name="edit" />} aria-label="Compose New Mail" />
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
 * Action nổi chính theo phong cách MD3 Expressive Floating Action Button (FAB).
 *
 * Phơi nhiễm các action tạo nhịp điệu kích hoạt cho người sử dụng với đủ bộ trang hoàn trọn kích thước Size (SM->XL),
 * mang nhiều màu sắc Color role khác biệt, cung cấp một sức nén cho Label để kéo toẹt cái ống dài ra (gọi là Dạng Mở Rộng - Extended) tạo nên hành động sinh động,
 * Trạng thái load/nhấp hiện xuất cùng animation thu scale thoát cảnh bắt mắt đầy nghệ thuật.
 *
 * @remarks
 * - Chỉ định bắt buộc `aria-label` cho những mẫu icon bị đơn côi trơ trọi (icon-only FABs).
 * - Trường hợp xài mode Mở Rộng qua việc truyền hàm `extended={true}`, nút FAB này tự ngộ nhận thân thế, lấy `children` dùng làm Aria label luôn hễ như `children` đó đang chứa text string.
 *   Khi ấy bạn tha hồ cắt bỏ thuộc tính `aria-label` ra.
 * - Lúc cho biến mất (`visible={false}`), bộ nút tung chiêu lùi về sau làm quả rút bóng thoát Scale-out qua effect spring uyển chuyển.
 * - Sài kèm `FABPosition` bao đùm nó lại nếu bạn muốn xích nó cố định ngấm chân sâu góc màn hình hiển thị.
 *
 * @example
 * ```tsx
 * // FAB cơ bản, nhỏ xinh, chỉ hiện icon.
 * <FAB icon={<Icon name="search" />} aria-label="Nhấn tìm kiếm" size="sm" />
 *
 * // Dịch sang dòng Extended có dòng caption chữ dài thòn
 * const [isOpen, setOpen] = React.useState(false);
 * <FAB
 *   icon={<Icon name="edit" />}
 *   extended={isOpen}
 *   onClick={() => setOpen(!isOpen)}
 * >
 *   Viết tâm thư
 * </FAB>
 *
 * // FAB to lớn nhất dùng trạng thái chờ load Submit lên Server
 * <FAB
 *   icon={<Icon name="upload" />}
 *   size="lg"
 *   loading={isUploading}
 *   colorStyle="secondary"
 *   aria-label="Upload Files lên mây xanh"
 * />
 *
 * // Cố định dưới chân tay phải
 * <FABPosition position="bottom-right">
 *   <FAB icon={<Icon name="add" />} aria-label="Dấu Cộng sinh nảy" />
 * </FABPosition>
 * ```
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
export const FAB = React.memo(FABComponent);
