import { domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { SPRING_TRANSITION_FAST } from "./shared/constants";

// @internal — font must be loaded via '@bug-on/md3-react/material-symbols.css'
const VARIANT_FONT: Record<NonNullable<IconProps["variant"]>, string> = {
	outlined: "'Material Symbols Outlined'",
	rounded: "'Material Symbols Rounded'",
	sharp: "'Material Symbols Sharp'",
};

/**
 * Props cho component {@link Icon}.
 *
 * Tất cả các trục biến thiên (variable font axes) được map trực tiếp sang `font-variation-settings`.
 */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Tên của Material Symbol theo định dạng snake_case.
	 * @example "home", "arrow_forward", "settings"
	 * @see https://fonts.google.com/icons
	 */
	name: string;

	/**
	 * Kiểu hình học (Geometric style variant) — tương ứng với font family được tải.
	 * @default "outlined"
	 */
	variant?: "outlined" | "rounded" | "sharp";

	/**
	 * Trục FILL. `0` = outlined (viền), `1` = filled (tràn màu).
	 * Có hiệu ứng spring khi `animateFill` là true.
	 * @default 0
	 */
	fill?: 0 | 1;

	/**
	 * Trục wght — độ dày của nét (stroke weight). Nên khớp với độ dày text xung quanh.
	 * @default 400
	 */
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;

	/**
	 * Trục GRAD — tinh chỉnh độ dày thị giác mà không ảnh hưởng tới layout.
	 * Dùng mức `-25` trên nền tối để bù trừ hiệu ứng phát sáng (halation).
	 * @default 0
	 */
	grade?: -50 | -25 | 0 | 100 | 200;

	/**
	 * Trục opsz — kích thước quang học (optical size) tính bằng dp. Dùng để thiết lập `font-size` nếu không truyền `size`.
	 * Hãy để giá trị khớp với pixel sẽ render ra để thấy chất lượng tốt nhất.
	 * @default 24
	 */
	opticalSize?: 20 | 24 | 40 | 48;

	/**
	 * Ghi đè trực tiếp `font-size` bằng px. Trục `opsz` vẫn sẽ tuân theo thuộc tính `opticalSize`.
	 * @example size={18} opticalSize={20}
	 */
	size?: number | "inherit";

	/**
	 * Kích hoạt hiệu ứng spring mượt mà khi chuyển đổi giá trị FILL (sử dụng cấu hình `SPRING_TRANSITION_FAST`).
	 * Yêu cầu dependency `motion/react`.
	 * @default false
	 * @example <Icon name="favorite" fill={isLiked ? 1 : 0} animateFill />
	 */
	animateFill?: boolean;
}

const IconComponent = React.forwardRef<HTMLSpanElement, IconProps>(
	(
		{
			name,
			variant = "outlined",
			fill = 0,
			weight = 400,
			grade = 0,
			opticalSize = 24,
			size,
			animateFill = false,
			className,
			style,
			...restProps
		},
		ref,
	) => {
		const fontVariationSettings = `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`;

		const computedStyle: React.CSSProperties = {
			fontFamily: VARIANT_FONT[variant],
			fontSize:
				size === "inherit"
					? "inherit"
					: size != null
						? `${size}px`
						: `${opticalSize}px`,
			fontVariationSettings,
			...style,
		};

		if (animateFill) {
			return (
				<LazyMotion features={domMax} strict>
					<m.span
						ref={ref}
						className={cn(
							"md-icon inline-flex items-center justify-center shrink-0 select-none",
							className,
						)}
						aria-hidden="true"
						animate={{ fontVariationSettings }}
						transition={SPRING_TRANSITION_FAST}
						style={computedStyle}
						// biome-ignore lint/suspicious/noExplicitAny: motion v12 HTMLMotionProps conflicts with React's event types
						{...(restProps as any)}
					>
						{name}
					</m.span>
				</LazyMotion>
			);
		}

		return (
			<span
				ref={ref}
				className={cn(
					"md-icon inline-flex items-center justify-center shrink-0 select-none",
					className,
				)}
				aria-hidden="true"
				style={computedStyle}
				{...restProps}
			>
				{name}
			</span>
		);
	},
);

IconComponent.displayName = "Icon";

/**
 * Component hiển thị Icon bằng Material Symbols (variable font).
 *
 * Hãy đảm bảo đã import CSS chứa font trước khi dùng:
 * ```ts
 * import '@bug-on/md3-react/material-symbols.css';
 * ```
 *
 * @remarks
 * - Đặt tên icon dùng snake_case: `"arrow_forward"`, KHÔNG PHẢI `"ArrowForward"`.
 * - Thuộc tính `aria-hidden="true"` được tự động thêm vào — bạn cần thêm label đọc bằng giọng nói (accessible labels) ở phần tử cha.
 *
 * @example
 * ```tsx
 * // Icon cơ bản
 * <Icon name="home" />
 *
 * // Tùy chỉnh trực quan (filled, nét dày)
 * <Icon name="favorite" variant="rounded" fill={1} weight={300} />
 *
 * // Animate khi trạng thái thay đổi
 * <Icon name="bookmark" fill={saved ? 1 : 0} animateFill />
 *
 * // Đổi kích thước icon cụ thể
 * <Icon name="close" size={18} opticalSize={20} />
 *
 * // Kết hợp với các component khác
 * <Button icon={<Icon name="add" />}>Thêm vào giỏ</Button>
 * ```
 *
 * @see https://fonts.google.com/icons
 * @see https://m3.material.io/styles/icons/overview
 */
export const Icon = React.memo(IconComponent);
