"use client";

import * as React from "react";
import { CircularProgress } from "./circular";
import { LinearProgress } from "./linear";
import type { ProgressIndicatorProps } from "./types";

/**
 * Thanh tiến trình (Progress Indicator) theo nguyên tắc Material Design 3 Expressive.
 * Hỗ trợ linh hoạt 2 loại hình hiển thị: Linear (Đường thẳng) và Circular (Hình tròn),
 * cùng với thiết kế Wavy (Lượn sóng) động rất mềm mại.
 * 
 * @example
 * ```tsx
 * // Determinate Flat Linear
 * <ProgressIndicator variant="linear" value={60} aria-label="Loading profile..." />
 * 
 * // Indeterminate Wavy Linear
 * <ProgressIndicator variant="linear" shape="wavy" aria-label="Connecting to server..." />
 * 
 * // Determinate Flat Circular
 * <ProgressIndicator variant="circular" value={45} size={48} aria-label="Syncing..." />
 * ```
 */
export const ProgressIndicator = React.forwardRef<
	HTMLDivElement,
	ProgressIndicatorProps
>((props, ref) => {
	if (props.variant === "circular") {
		return <CircularProgress ref={ref} {...props} />;
	}
	return <LinearProgress ref={ref} {...props} />;
});

ProgressIndicator.displayName = "ProgressIndicator";

export type {
	CircularProgressProps,
	LinearProgressProps,
	ProgressIndicatorProps,
} from "./types";
