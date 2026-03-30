/**
 * MaterialSymbolsPreconnect
 *
 * Inject preconnect resource hints cho Google Fonts CDN và <head>.
 * Đặt component này CÀNG SỚM CÀNG TỐT trong app tree, lý tưởng là
 * ngay trong <head> hoặc root layout.
 *
 * WHY THIS MATTERS:
 * Nếu @import url() nằm trong CSS file, browser phải:
 * 1. Parse HTML -> download JS bundle -> execute CSS -> gặp @import -> mới bắt đầu connect Google Fonts
 * Preconnect hints cho phép browser bắt đầu TCP handshake + TLS ngay từ bước 1,
 * tiết kiệm 100-500ms connection time tùy network.
 *
 * USAGE:
 * ```tsx
 * // app/layout.tsx (Next.js) hoặc index.html equivalent
 * import { MaterialSymbolsPreconnect } from '@bug-on/md3-react';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <MaterialSymbolsPreconnect />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * NOTE: Chỉ dùng component này với CDN mode.
 * Với self-hosted fonts thì không cần preconnect đến external origin.
 */
export interface MaterialSymbolsPreconnectProps {
	/**
	 * Mảng các biến thể font Material Symbols cần tải.
	 * Chỉ nên chọn các biến thể mà ứng dụng thực sự sử dụng để tiết kiệm băng thông.
	 * @default ["outlined"]
	 */
	variants?: Array<"outlined" | "rounded" | "sharp">;
}

export function MaterialSymbolsPreconnect({
	variants = ["outlined"],
}: MaterialSymbolsPreconnectProps) {
	return (
		<>
			{/* Preconnect cho CSS stylesheet */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			{/* Preconnect cho font files — crossorigin bắt buộc vì font download là CORS request */}
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			{/* Load các biến thể được chọn.
			    Sử dụng display=swap để tối ưu hóa hiệu năng (Lighthouse/Next.js recommendation).
			    Lưu ý: Có thể gây ra hiện tượng chớp chữ (ligature flicker) trong tích tắc. */}
			{variants.includes("outlined") && (
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
					rel="stylesheet"
					precedence="default"
				/>
			)}
			{variants.includes("rounded") && (
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
					rel="stylesheet"
					precedence="default"
				/>
			)}
			{variants.includes("sharp") && (
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
					rel="stylesheet"
					precedence="default"
				/>
			)}
		</>
	);
}
