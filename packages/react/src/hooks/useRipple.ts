"use client";

import { useCallback, useRef } from "react";

export interface RippleOptions {
	/** Thời gian hiệu ứng ripple (ms). Mặc định: 600 */
	duration?: number;
	/** Màu ripple. Mặc định: 'currentColor' */
	color?: string;
	/** Opacity. Mặc định: 0.12 (chuẩn MD3) */
	opacity?: number;
	/** Tắt ripple (ví dụ khi disabled) */
	disabled?: boolean;
}

/**
 * useRipple — Material Design 3 Expressive Ripple Effect
 *
 * Hook thuần DOM, không phụ thuộc thư viện animation ngoài.
 * Chú ý: Yêu cầu element có `position: relative` và `overflow: hidden`.
 *
 * @example
 * ```tsx
 * const { rippleRef, onPointerDown } = useRipple();
 * <button ref={rippleRef} onPointerDown={onPointerDown}>Click me</button>
 * ```
 */
export function useRipple<T extends HTMLElement = HTMLElement>(
	options: RippleOptions = {},
) {
	const {
		duration = 600,
		color = "currentColor",
		opacity = 0.12,
		disabled = false,
	} = options;
	const ref = useRef<T>(null);

	const onPointerDown = useCallback(
		(event: React.PointerEvent<T>) => {
			if (disabled || !ref.current) return;

			const el = ref.current;
			const rect = el.getBoundingClientRect();

			const size = Math.max(rect.width, rect.height) * 2;
			const x = event.clientX - rect.left - size / 2;
			const y = event.clientY - rect.top - size / 2;

			const ripple = document.createElement("span");
			ripple.setAttribute("aria-hidden", "true");

			Object.assign(ripple.style, {
				position: "absolute",
				borderRadius: "50%",
				pointerEvents: "none",
				width: `${size}px`,
				height: `${size}px`,
				left: `${x}px`,
				top: `${y}px`,
				background: color,
				opacity: String(opacity),
				transform: "scale(0)",
				transition: `transform ${duration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${duration * 0.6}ms ease-out`,
			});

			el.appendChild(ripple);

			// Frame sau để trigger animation
			requestAnimationFrame(() => {
				ripple.style.transform = "scale(1)";
			});

			const cleanup = () => {
				ripple.style.opacity = "0";
				setTimeout(() => {
					if (el.contains(ripple)) el.removeChild(ripple);
				}, duration * 0.6);
				el.removeEventListener("pointerup", cleanup);
				el.removeEventListener("pointerleave", cleanup);
			};

			el.addEventListener("pointerup", cleanup, { once: true });
			el.addEventListener("pointerleave", cleanup, { once: true });
		},
		[disabled, duration, color, opacity],
	);

	return { rippleRef: ref, onPointerDown };
}
