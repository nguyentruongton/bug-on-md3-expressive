/**
 * @file prefix-suffix.tsx
 * Prefix and suffix text for MD3 TextField.
 * Visible only when the label is floated (or when there is no label).
 */

import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import {
	MD3_LABEL_FLOAT_DURATION,
	MD3_STANDARD_EASING,
} from "../../shared/constants";
import { TF_CLASSES } from "../text-field.tokens";

export interface PrefixSuffixProps {
	text: string;
	type: "prefix" | "suffix";
	/** Whether the label is floated (controls visibility). */
	visible: boolean;
	/** Disable animations. */
	prefersReduced: boolean;
}

/**
 * MD3 Prefix / Suffix Text.
 *
 * Animates in/out in sync with the floating label using AnimatePresence.
 * Hidden when label is in the inline position (would overlap the label).
 *
 * @accessibility
 * `aria-hidden="true"` — decorative. Screen readers read the full value in context.
 */
export const PrefixSuffix = React.memo(function PrefixSuffix({
	text,
	type,
	visible,
	prefersReduced,
}: PrefixSuffixProps) {
	const duration = prefersReduced ? 0 : MD3_LABEL_FLOAT_DURATION;

	return (
		<AnimatePresence>
			{visible && (
				<m.span
					aria-hidden="true"
					className={`${TF_CLASSES.prefixSuffix} ${type === "suffix" ? "ml-0.5" : "mr-0.5"}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration, ease: MD3_STANDARD_EASING }}
				>
					{text}
				</m.span>
			)}
		</AnimatePresence>
	);
});

PrefixSuffix.displayName = "PrefixSuffix";
