/**
 * @file leading-icon.tsx
 * Leading icon slot for MD3 TextField.
 */

import * as React from "react";
import { TF_COLORS } from "../text-field.tokens";

export interface LeadingIconProps {
	/** Icon node — should be 24×24px. */
	children: React.ReactNode;
	/** Whether the field is in error state (changes icon color). */
	isError: boolean;
	/** Whether the field is disabled. */
	isDisabled: boolean;
}

/**
 * MD3 Leading Icon wrapper.
 *
 * Decorative — `aria-hidden="true"`.
 * Color: `on-surface-variant` (default), `error` (error state).
 * Size: 24×24px icon, 48×56px touch target via flex alignment.
 *
 * @see https://m3.material.io/components/text-fields/specs#anatomy
 */
export const LeadingIcon = React.memo(function LeadingIcon({
	children,
	isError,
	isDisabled,
}: LeadingIconProps) {
	const color =
		isError && !isDisabled ? TF_COLORS.error : TF_COLORS.onSurfaceVariant;

	return (
		<div
			aria-hidden="true"
			className="flex items-center justify-center shrink-0 w-6 h-6 ml-3"
			style={{ color }}
		>
			{children}
		</div>
	);
});

LeadingIcon.displayName = "LeadingIcon";
