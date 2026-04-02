/**
 * @file outline-container.tsx
 * MD3-compliant outlined border with animated notch for the Outlined TextField.
 *
 * Implementation: 3-segment approach inspired by Material Web's fieldset/legend pattern.
 * The top border is split into: [left-segment] [notch-gap] [right-segment].
 * The notch-gap width animates from 0 → (labelWidth × scaleRatio + 8px) when label floats.
 *
 * This mirrors Material Web's implementation without requiring <fieldset> semantics.
 *
 * @see https://github.com/material-components/material-web/tree/main/textfield
 * @see https://m3.material.io/components/text-fields/specs#outlined-text-field
 */

import { m } from "motion/react";
import * as React from "react";
import {
	MD3_INDICATOR_DURATION,
	MD3_LABEL_FLOAT_DURATION,
	MD3_STANDARD_EASING,
} from "../../shared/constants";
import { TF_COLORS, TF_SIZE, TF_TYPOGRAPHY } from "../text-field.tokens";

export interface OutlineContainerProps {
	/** Whether the label is in the floated position. */
	isFloated: boolean;
	/** Whether the field is focused. */
	isFocused: boolean;
	/** Whether the field is in error state. */
	isError: boolean;
	/** Whether the field is disabled. */
	isDisabled: boolean;
	/** Whether the field is hovered. */
	isHovered: boolean;
	/**
	 * Measured width of the label element in its full (unfloated) size.
	 * The notch width = labelWidth × scaleRatio + 2×notchPadding.
	 */
	labelWidth: number;
	/** Whether to disable animations. */
	prefersReduced: boolean;
}

/**
 * Determines the outline border color based on current state.
 */
function getOutlineColor(
	isFocused: boolean,
	isError: boolean,
	isHovered: boolean,
	isDisabled: boolean,
): string {
	if (isDisabled) return TF_COLORS.onSurfaceVariant;
	if (isError) return TF_COLORS.error;
	if (isFocused) return TF_COLORS.primary;
	if (isHovered) return TF_COLORS.inputText;
	return TF_COLORS.outline;
}

/**
 * MD3 Outlined TextField container with animated notch.
 *
 * The notch gap expands/collapses in sync with the FloatingLabel animation,
 * creating the visual effect of the label breaking through the border.
 *
 * Accessibility: `aria-hidden="true"` — purely decorative border.
 */
export const OutlineContainer = React.memo(function OutlineContainer({
	isFloated,
	isFocused,
	isError,
	isDisabled,
	isHovered,
	labelWidth,
	prefersReduced,
}: OutlineContainerProps) {
	const colorDuration = prefersReduced ? 0 : MD3_INDICATOR_DURATION;
	const notchDuration = prefersReduced ? 0 : MD3_LABEL_FLOAT_DURATION;
	const ease = MD3_STANDARD_EASING;

	const borderColor = getOutlineColor(isFocused, isError, isHovered, isDisabled);
	const borderWidth = isFocused || isError ? TF_SIZE.outlineThick : TF_SIZE.outlineThin;

	// Calculate offset for notch (always 16px from the edge in M3 Outlined)
	const leftSegmentWidth = TF_SIZE.paddingStart;

	/**
	 * Notch width calculation:
	 * When floated: label is scaled to 0.75, so its displayed width = labelWidth × 0.75
	 * Add 2 × notchPadding (4px each side) for spacing inside the notch gap.
	 * When unfloated: 0 (no gap in the border).
	 */
	const notchWidth = isFloated
		? labelWidth * TF_TYPOGRAPHY.labelScaleRatio + TF_SIZE.notchPadding * 2
		: 0;

	const borderTransition = { duration: colorDuration, ease };
	const notchTransition = { duration: notchDuration, ease };

	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 pointer-events-none flex rounded-[inherit]"
		>
			{/* Left segment — left + bottom + top borders */}
			<m.div
				className="rounded-tl-[inherit] rounded-bl-[inherit]"
				style={{ width: leftSegmentWidth - TF_SIZE.notchPadding }}
				animate={{
					borderColor,
					borderWidth,
					borderStyle: "solid",
					borderRightWidth: 0,
				}}
				transition={borderTransition}
			/>

			{/* Center (notch) segment */}
			<m.div
				className="flex flex-col shrink-0"
				style={{ minWidth: 0 }}
				animate={{ width: notchWidth }}
				transition={notchTransition}
			>
				{/* Top border of notch: transparent when notched */}
				<m.div
					className="shrink-0"
					style={{ height: borderWidth }}
					animate={{
						borderTopColor: borderColor,
						opacity: isFloated ? 0 : 1,
						borderTopWidth: borderWidth,
						borderTopStyle: "solid",
					}}
					transition={borderTransition}
				/>
				{/* Bottom border (always present) */}
				<m.div
					className="flex-1"
					animate={{
						borderBottomColor: borderColor,
						borderBottomWidth: borderWidth,
						borderBottomStyle: "solid",
					}}
					transition={borderTransition}
				/>
			</m.div>

			{/* Right segment — full height, right + bottom + top borders */}
			<m.div
				className="flex-1 rounded-tr-[inherit] rounded-br-[inherit]"
				animate={{
					borderColor,
					borderWidth,
					borderStyle: "solid",
					borderLeftWidth: 0,
				}}
				transition={borderTransition}
			/>
		</div>
	);
});

OutlineContainer.displayName = "OutlineContainer";
