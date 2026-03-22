import type * as React from "react";

export interface ProgressBaseProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	/**
	 * Giá trị phần trăm tiến trình hiện tại (từ 0 đến 100).
	 * Nếu truyền giá trị này, tiến trình sẽ hiển thị ở trạng thái Determinate.
	 * Nếu bỏ trống (undefined), tiến trình sẽ tự động ở trạng thái Indeterminate.
	 *
	 * @example
	 * ```tsx
	 * <ProgressIndicator value={45} aria-label="Loading profile..." />
	 * ```
	 */
	value?: number;
	/**
	 * Nhan đề mô tả mục đích của thanh tiến trình dành cho screen readers (bắt buộc).
	 */
	"aria-label": string;
	/**
	 * Độ dày của track (đường nền) của thanh tiến trình (đơn vị: px).
	 * - Với Linear: là chiều cao của thanh.
	 * - Với Circular: là độ dày của viền hình tròn.
	 *
	 * @example
	 * trackHeight={8} // Dày hơn bình thường
	 */
	trackHeight?: number;
	/**
	 * Màu sắc của phần tiến trình (phần đã hoàn thành).
	 * Mặc định mượn màu `currentColor` của thẻ wrap, để dễ dàng tuỳ biến qua utility class.
	 *
	 * @example
	 * color="var(--md-sys-color-primary)" // Sử dụng custom token
	 */
	color?: string;
	/**
	 * Màu sắc của thanh nền (phần chưa hoàn thành).
	 * Mặc định sử dụng màu được tính toán từ bề mặt hoặc transparency để tạo sự tinh tế.
	 */
	trackColor?: string;
}

export interface LinearProgressProps extends ProgressBaseProps {
	/** Phân loại component sang kiểu dáng Linear (đường thẳng ngang). */
	variant: "linear";
	/**
	 * Hình dáng của vạch tiến trình (phần đã hoàn thành).
	 * - `flat`: Đường nét liền phẳng (mặc định)
	 * - `wavy`: Đường lượn sóng động
	 */
	shape?: "flat" | "wavy";
	/**
	 * Hình dáng của thanh nền chờ (track).
	 * - `flat`: Đường nét liền phẳng (mặc định)
	 * - `wavy`: Đường lượn sóng cố định hoặc động
	 */
	trackShape?: "flat" | "wavy";
	/**
	 * Biên độ sóng (áp dụng khi `shape` hoặc `trackShape` là "wavy").
	 * Chỉ định độ lượn cao thấp của con sóng.
	 */
	amplitude?: number;
	/**
	 * Chiều dài một nhịp sóng (áp dụng khi `shape` là "wavy" theo determinate).
	 * Khoảng cách giữa 2 đỉnh sóng kề nhau.
	 */
	wavelength?: number;
	/**
	 * Nhịp sóng dành riêng cho trạng thái chạy liên tục (Indeterminate Wavy).
	 */
	indeterminateWavelength?: number;
	/**
	 * Khoảng hở kết dính giữa cụm vạch đang chạy và thanh nền.
	 * Cho phép truyền \`0\` để hai thanh chạm sát vào nhau liền mạch.
	 *
	 * @example
	 * ```tsx
	 * <ProgressIndicator variant="linear" shape="wavy" gapSize={0} /> // Sóng chạm track liền nét
	 * ```
	 */
	gapSize?: number;
	/**
	 * Tốc độ dao động vỗ của sóng (Multiplier). Mặc định là \`1\`.
	 * Tăng giá trị (VD: 1.5, 2) để sóng dao động nhanh hơn.
	 */
	waveSpeed?: number;
	/**
	 * Tốc độ lướt / cuộn dải màu dọc trên track (Crawler) đối với trạng thái Indeterminate.
	 * Mặc định là \`1\`.
	 */
	crawlerSpeed?: number;
	/**
	 * Cấu hình hiệu ứng gợn khi thanh determinate ở mức xấp xỉ mép viền (<= 10% hoặc >= 90%).
	 * - `md3`: Tự động ép phẳng biên độ sóng thành số 0 một cách mềm mại (Chuẩn Google MD3).
	 * - `continuous`: Bỏ qua các ràng buộc ép phẳng, con sóng vẫn gợn lấp lóa trên mọi giá trị phần trăm.
	 *
	 * @example
	 * ```tsx
	 * <ProgressIndicator variant="linear" shape="wavy" determinateAnimation="continuous" />
	 * ```
	 */
	determinateAnimation?: "md3" | "continuous";
	/**
	 * Kiểu kịch bản tịnh tiến cho thanh Indeterminate.
	 * - `md3`: Render 2 vạch song song vọt tới & co giãn mô phỏng vật lý (Chuẩn Google MD3).
	 * - `continuous`: Vạch không ngắt quãng mà tràn lướt vòng lặp mượt mà.
	 *
	 * @example
	 * ```tsx
	 * <ProgressIndicator variant="linear" indeterminateAnimation="continuous" />
	 * ```
	 */
	indeterminateAnimation?: "md3" | "continuous";
	/**
	 * Bật/tắt dấm chấm điểm báo kết thúc ở cuối track (Stop Indicator).
	 * - `true`: Luôn thấy một chấm tròn bé xíu ở cuối đường đi
	 * - `false`: Tắt hoàn toàn
	 * - `"auto"`: Chấm tròn chỉ hiển thị và hòa trộn khi progress đạt 100%
	 */
	showStopIndicator?: boolean | "auto";
}

export interface CircularProgressProps extends ProgressBaseProps {
	/** Phân loại component sang kiểu dáng Circular (hình tròn khép kín). */
	variant: "circular";
	/**
	 * Đường kính hiển thị của vòng biểu đồ, đơn vị px.
	 *
	 * @example
	 * ```tsx
	 * <ProgressIndicator variant="circular" size={48} aria-label="Loading..." />
	 * ```
	 */
	size?: number;
	/**
	 * Phong cách nét vẽ của đường viền trong trạng thái trượt.
	 * - `flat`: Đường nét cứng, vuốt tròn hai đầu stroke.
	 * - `wavy`: Vệt màu chuyển động rung tạo hình răng cưa/gợn sóng.
	 */
	shape?: "flat" | "wavy";
	/**
	 * Biên độ gợn của trạng thái `wavy` cho vòng tròn.
	 */
	amplitude?: number;
	/** Bước sóng bao trọn chu vi hình tròn. */
	wavelength?: number;
	/** Khoảng hở khe đứt ngang nối đỉnh nét vẽ. */
	gapSize?: number;
	/**
	 * Xoay nhanh hay chậm theo số nhân cho Crawler Circular quay Indeterminate.
	 */
	crawlerSpeed?: number;
}

export type ProgressIndicatorProps =
	| LinearProgressProps
	| CircularProgressProps;
