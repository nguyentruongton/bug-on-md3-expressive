/**
 * @file floating-label.tsx
 * Animated floating label for MD3 TextField.
 * Animates between inline (body large) and floated (body small) positions.
 */

import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import {
	MD3_LABEL_FLOAT_DURATION,
	MD3_STANDARD_EASING,
} from "../../shared/constants";
import { TF_COLORS, TF_TYPOGRAPHY } from "../text-field.tokens";

export interface FloatingLabelProps {
	/** The label text content. */
	text: string;
	/** Whether the label is in the floated (small) position. */
	isFloated: boolean;
	/** Whether the field is currently focused. */
	isFocused: boolean;
	/** Whether the field is in error state. */
	isError: boolean;
	/** Whether the field is disabled. */
	isDisabled: boolean;
	/** 'filled' or 'outlined' — determines vertical y offset. */
	variant: "filled" | "outlined";
	/** Container height in px (56 normal, 48 dense). */
	containerHeight: number;
	/** Whether to skip animations (prefers-reduced-motion). */
	prefersReduced: boolean;
	/** Whether the required asterisk should be shown. */
	showAsterisk: boolean;
	/** ID of the label element, for associating with a containing element. */
	htmlFor?: string;
	/** Ref callback so the parent can measure label width for the outlined notch. */
	labelRef?: React.Ref<HTMLSpanElement>;
	/** Whether there is a leading icon. */
	hasLeading?: boolean;
}

/**
 * Calculates the y-translation (in px) for the floated label position.
 *
 * For FILLED: move up from vertical center to the top inline padding area.
 * For OUTLINED: move up so the label sits on the top border line.
 *
 * The label starts at y=0 (vertically centered by flex parent).
 * When floated, it moves upward by `offset` pixels.
 */
function getFloatedY(variant: "filled" | "outlined", containerHeight: number): number {
	// Label body-large line height ≈ 24px (16px * 1.5)
	// Label body-small line height ≈ 16px (12px * 1.33)
	// Floated container top-padding: 8px from top of container
	const labelSmallHeight = 16;
	const paddingTop = 8;

	if (variant === "filled") {
		// Center of container → top-padding area
		// Center is at containerHeight/2, floated center is at paddingTop + labelSmallHeight/2
		const floatedCenter = paddingTop + labelSmallHeight / 2;
		const unfloatedCenter = containerHeight / 2;
		return -(unfloatedCenter - floatedCenter);
	}
	// Outlined: label sits on the border line (y = 0 relative to container top)
	// We move up by half the container height to reach the border
	return -(containerHeight / 2);
}

/**
 * Returns the label color based on current state.
 */
function getLabelColor(
	isFloated: boolean,
	isFocused: boolean,
	isError: boolean,
	isDisabled: boolean,
): string {
	if (isDisabled) return TF_COLORS.onSurfaceVariant;
	if (isError) return TF_COLORS.error;
	if (isFloated && isFocused) return TF_COLORS.primary;
	return TF_COLORS.onSurfaceVariant;
}

/**
 * MD3 Expressive Floating Label.
 *
 * Animates y-position, scale, and color when the label floats.
 * Uses `transformOrigin: 'left center'` so scaling anchors at the start.
 *
 * @accessibility
 * Rendered as a `<label>` with `htmlFor` linking to the `<input>`.
 * When floated, visual size changes but the semantic label is unchanged.
 */
export const FloatingLabel = React.memo(function FloatingLabel({
	text,
	isFloated,
	isFocused,
	isError,
	isDisabled,
	variant,
	containerHeight,
	prefersReduced,
	showAsterisk,
	htmlFor,
	labelRef,
	hasLeading = false,
}: FloatingLabelProps) {
	const duration = prefersReduced ? 0 : MD3_LABEL_FLOAT_DURATION;
	const ease = MD3_STANDARD_EASING;

	const y = isFloated ? getFloatedY(variant, containerHeight) : 0;
	const x = variant === "outlined" && isFloated && hasLeading ? -36 : 0;
	const scale = isFloated ? TF_TYPOGRAPHY.labelScaleRatio : 1;
	const color = getLabelColor(isFloated, isFocused, isError, isDisabled);

	return (
		<m.label
			htmlFor={htmlFor}
			className={cn(
				"absolute pointer-events-none select-none origin-[left_center] leading-6 text-base whitespace-nowrap",
				"px-1 -mx-1", // Clear the notch gap and keep text aligned
				variant === "outlined" && isFloated && "bg-m3-surface",
				"left-4",
				isDisabled && "opacity-[0.38]"
			)}
			animate={{ y, x, scale, color }}
			transition={{ duration, ease }}
			style={{
				top: (containerHeight - 24) / 2, // 24px is the resting line-height
				transformOrigin: "left center",
				zIndex: 1,
			}}
		>
			<span ref={labelRef} className="inline-block relative">
				{text}
				<AnimatePresence>
					{showAsterisk && (
						<m.span
							key="asterisk"
							aria-hidden="true"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: prefersReduced ? 0 : 0.1 }}
							className="ml-0.5 text-m3-error"
						>
							*
						</m.span>
					)}
				</AnimatePresence>
			</span>
		</m.label>
	);
});

FloatingLabel.displayName = "FloatingLabel";
