/**
 * @file active-indicator.tsx
 * Animated bottom border line for the MD3 Filled TextField.
 * Expands height from 1px → 2px and color changes on focus.
 */

import { m } from "motion/react";
import * as React from "react";
import {
	MD3_INDICATOR_DURATION,
	MD3_STANDARD_EASING,
} from "../../shared/constants";
import { TF_COLORS, TF_SIZE } from "../text-field.tokens";

export interface ActiveIndicatorProps {
	isFocused: boolean;
	isError: boolean;
	isDisabled: boolean;
	isHovered: boolean;
	prefersReduced: boolean;
}

/**
 * MD3 Active Indicator — the bottom border line for Filled TextField.
 *
 * Animates:
 * - `height`: 1px (enabled) → 2px (focused)
 * - `backgroundColor`: on-surface-variant → primary (focused) → error
 * - `scaleX`: 0 → 1 expanding from center on focus in
 *
 * @see https://m3.material.io/components/text-fields/specs#filled-text-field
 */
export const ActiveIndicator = React.memo(function ActiveIndicator({
	isFocused,
	isError,
	isDisabled,
	isHovered,
	prefersReduced,
}: ActiveIndicatorProps) {
	const duration = prefersReduced ? 0 : MD3_INDICATOR_DURATION;
	const ease = MD3_STANDARD_EASING;

	const height = isFocused || isError
		? TF_SIZE.indicatorThick
		: TF_SIZE.indicatorThin;

	let backgroundColor: string;
	if (isError) {
		backgroundColor = TF_COLORS.error;
	} else if (isFocused) {
		backgroundColor = TF_COLORS.primary;
	} else if (isHovered && !isDisabled) {
		backgroundColor = TF_COLORS.inputText;
	} else {
		backgroundColor = TF_COLORS.onSurfaceVariant;
	}

	return (
		<m.div
			aria-hidden="true"
			className="absolute bottom-0 left-0 right-0 origin-center"
			animate={{ height, backgroundColor }}
			transition={{ duration, ease }}
		/>
	);
});

ActiveIndicator.displayName = "ActiveIndicator";
