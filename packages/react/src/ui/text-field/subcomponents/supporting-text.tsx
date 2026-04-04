/**
 * @file supporting-text.tsx
 * Supporting text, error text, and character counter for MD3 TextField.
 *
 * Animates in/out using AnimatePresence. Uses aria-live for accessibility.
 */

import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import {
	MD3_STANDARD_EASING,
	MD3_SUPPORTING_DURATION,
} from "../../shared/constants";
import { TF_COLORS } from "../text-field.tokens";

export interface SupportingTextProps {
	/** Helper text shown in normal state. */
	supportingText?: string;
	/** Error message — shown instead of supportingText when isError=true. */
	errorText?: string;
	/** Whether field is in error state. */
	isError: boolean;
	/** Current character count (value.length). */
	charCount?: number;
	/** Maximum character limit. Counter shown only when maxLength is set. */
	maxLength?: number;
	/** ID for aria-describedby linking from the input. */
	id: string;
	/** Disable animations. */
	prefersReduced: boolean;
}

/**
 * AnimatePresence wrapper for text content changes.
 * Fades out old text, fades in new text.
 */
function AnimatedText({
	text,
	motionKey,
	className,
	ariaLive,
	duration,
}: {
	text: string;
	motionKey: string;
	className: string;
	ariaLive?: "polite" | "off";
	duration: number;
}) {
	return (
		<m.span
			key={motionKey}
			className={className}
			initial={{ opacity: 0, y: -4 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -4 }}
			transition={{ duration, ease: MD3_STANDARD_EASING }}
			aria-live={ariaLive}
		>
			{text}
		</m.span>
	);
}

/**
 * MD3 Supporting Text area.
 *
 * Layout: [helper/error text] [character counter]
 * - Error text replaces supporting text when isError=true.
 * - Character counter shows only when maxLength is provided.
 * - Both use aria-live="polite" to announce changes to screen readers.
 * - Animates in/out with opacity + y-offset via AnimatePresence.
 *
 * @accessibility
 * - Error text: `aria-live="polite"` — screen readers announce when error appears.
 * - Counter: `aria-live="polite"` — announces count changes.
 */
export const SupportingText = React.memo(function SupportingText({
	supportingText,
	errorText,
	isError,
	charCount,
	maxLength,
	id,
	prefersReduced,
}: SupportingTextProps) {
	const duration = prefersReduced ? 0 : MD3_SUPPORTING_DURATION;

	const activeText = isError && errorText ? errorText : supportingText;
	const isOverLimit = maxLength !== undefined && (charCount ?? 0) > maxLength;

	// Determine counter color
	const counterColor = isOverLimit
		? TF_COLORS.error
		: TF_COLORS.onSurfaceVariant;

	if (!activeText && maxLength === undefined) return null;

	return (
		<m.div
			className="flex items-start justify-between gap-2 mt-1 px-4"
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration, ease: MD3_STANDARD_EASING }}
		>
			{/* Left: helper or error text */}
			<div id={id} className="flex-1 min-w-0">
				<AnimatePresence mode="wait">
					{activeText && (
						<AnimatedText
							key={isError && errorText ? "error" : "helper"}
							motionKey={
								isError && errorText
									? `error-${errorText}`
									: `helper-${supportingText}`
							}
							text={activeText}
							className={`text-xs leading-4 block ${
								isError ? "text-m3-error" : "text-m3-on-surface-variant"
							}`}
							ariaLive="polite"
							duration={duration}
						/>
					)}
				</AnimatePresence>
			</div>

			{/* Right: character counter */}
			{maxLength !== undefined && typeof charCount === "number" && (
				<m.span
					className="text-xs leading-4 tabular-nums shrink-0"
					animate={{ color: counterColor }}
					transition={{ duration, ease: MD3_STANDARD_EASING }}
					aria-live="polite"
					aria-atomic="true"
				>
					{charCount} / {maxLength}
				</m.span>
			)}
		</m.div>
	);
});

SupportingText.displayName = "SupportingText";
