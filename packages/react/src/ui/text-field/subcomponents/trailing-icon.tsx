/**
 * @file trailing-icon.tsx
 * Trailing icon slot for MD3 TextField.
 *
 * Supports three built-in modes:
 * - 'clear': ✕ button, visible when field has value
 * - 'password-toggle': eye icon, toggles password visibility
 * - 'custom': renders the `children` prop
 */

import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import {
	MD3_ICON_SWAP_DURATION,
	MD3_STANDARD_EASING,
} from "../../shared/constants";
import { TF_COLORS } from "../text-field.tokens";
import type { TextFieldTrailingIconMode } from "../text-field.types";

export interface TrailingIconProps {
	mode: TextFieldTrailingIconMode;
	/** Custom icon content (used when mode='custom'). */
	children?: React.ReactNode;
	/** Current input value — used to determine if clear button is visible. */
	value: string;
	/** Whether password is currently visible (for password-toggle mode). */
	showPassword?: boolean;
	/** Fires when clear button is clicked. */
	onClear?: () => void;
	/** Fires when password visibility toggle is clicked. */
	onPasswordToggle?: () => void;
	/** Whether the field is in error state. */
	isError: boolean;
	/** Whether the field is disabled. */
	isDisabled: boolean;
	/** Disable animations. */
	prefersReduced: boolean;
}

/** Animated icon wrapper with scale + opacity transition. */
function AnimatedIconSlot({
	children,
	motionKey,
	duration,
}: {
	children: React.ReactNode;
	motionKey: string;
	duration: number;
}) {
	return (
		<m.span
			key={motionKey}
			className="flex items-center justify-center"
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
			transition={{ duration, ease: MD3_STANDARD_EASING }}
		>
			{children}
		</m.span>
	);
}

/** Eye icon (password visible). */
function EyeOpenIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
		</svg>
	);
}

/** Eye-off icon (password hidden). */
function EyeOffIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
		</svg>
	);
}

/** ✕ Clear icon. */
function ClearIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
		</svg>
	);
}

/**
 * MD3 Trailing Icon.
 *
 * Touch target: 48×48px (padding extends the hit area beyond the 24×24 icon).
 *
 * @accessibility
 * - Clear button: `aria-label="Clear input"`
 * - Password toggle: `aria-label="Show password"` / `"Hide password"`
 * - Custom: no aria — consumer provides accessible markup
 */
export const TrailingIcon = React.memo(function TrailingIcon({
	mode,
	children,
	value,
	showPassword = false,
	onClear,
	onPasswordToggle,
	isError,
	isDisabled,
	prefersReduced,
}: TrailingIconProps) {
	const duration = prefersReduced ? 0 : MD3_ICON_SWAP_DURATION;

	const iconColor =
		isError && !isDisabled ? TF_COLORS.error : TF_COLORS.onSurfaceVariant;

	// Touch target button styles: 48×48px, centered icon
	const btnClass =
		"relative flex items-center justify-center w-12 h-12 -mr-1 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-m3-primary)] transition-colors hover:bg-[var(--color-m3-on-surface)]/8 active:bg-[var(--color-m3-on-surface)]/12 disabled:pointer-events-none";

	if (mode === "clear") {
		const hasValue = value.length > 0;
		return (
			<AnimatePresence>
				{hasValue && (
					<AnimatedIconSlot motionKey="clear" duration={duration}>
						<button
							type="button"
							aria-label="Clear input"
							onClick={onClear}
							disabled={isDisabled}
							tabIndex={isDisabled ? -1 : 0}
							className={btnClass}
							style={{ color: iconColor }}
						>
							<ClearIcon />
						</button>
					</AnimatedIconSlot>
				)}
			</AnimatePresence>
		);
	}

	if (mode === "password-toggle") {
		return (
			<AnimatePresence mode="wait">
				<AnimatedIconSlot
					motionKey={showPassword ? "eye-off" : "eye-on"}
					duration={duration}
				>
					<button
						type="button"
						aria-label={showPassword ? "Hide password" : "Show password"}
						onClick={onPasswordToggle}
						disabled={isDisabled}
						tabIndex={isDisabled ? -1 : 0}
						className={btnClass}
						style={{ color: iconColor }}
					>
						{showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
					</button>
				</AnimatedIconSlot>
			</AnimatePresence>
		);
	}

	if (mode === "custom" && children) {
		return (
			<div
				className="flex items-center justify-center w-6 h-6 mr-3"
				style={{ color: iconColor }}
			>
				{children}
			</div>
		);
	}

	return null;
});

TrailingIcon.displayName = "TrailingIcon";
