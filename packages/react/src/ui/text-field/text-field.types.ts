/**
 * @file text-field.types.ts
 * TypeScript interfaces and types for TextField MD3 Expressive component.
 * @see https://m3.material.io/components/text-fields/overview
 */

import type * as React from "react";

// ─── Variant & Input Types ───────────────────────────────────────────────────

export type TextFieldVariant = "filled" | "outlined";

export type TextFieldInputType =
	| "text"
	| "email"
	| "number"
	| "password"
	| "search"
	| "tel"
	| "url"
	| "textarea";

export type TextFieldTrailingIconMode = "none" | "clear" | "password-toggle" | "custom";

// ─── Imperative Handle ───────────────────────────────────────────────────────

/**
 * Imperative handle exposed via forwardRef.
 * Allows parent components to programmatically control the text field.
 */
export interface TextFieldHandle {
	/** Focuses the input element. */
	focus(): void;
	/** Blurs the input element. */
	blur(): void;
	/** Selects all text in the input. */
	select(): void;
	/** Clears the current value and fires onChange with empty string. */
	clear(): void;
	/** Sets a custom validation message on the native input. */
	setCustomValidity(message: string): void;
	/** Returns true if the input is valid. Does not show validation UI. */
	checkValidity(): boolean;
	/** Returns true if the input is valid. Shows validation UI if invalid. */
	reportValidity(): boolean;
	/** Returns the current value string. */
	getValue(): string;
	/** Returns the underlying input or textarea element. */
	getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
}

// ─── Main Props ──────────────────────────────────────────────────────────────

export interface TextFieldProps {
	// ── Core ──────────────────────────────────────────────────────────────────
	/** Filled or outlined variant. @default 'filled' */
	variant?: TextFieldVariant;
	/** Floating label text. Also used as accessible name when no aria-label is set. */
	label?: string;
	/** Controlled value. Use with onChange for controlled mode. */
	value?: string;
	/** Initial value for uncontrolled mode. */
	defaultValue?: string;
	/** Fires when value changes. Receives new value string and native event. */
	onChange?: (
		value: string,
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;

	// ── Input config ──────────────────────────────────────────────────────────
	/** Input type. Use 'textarea' for multi-line input. @default 'text' */
	type?: TextFieldInputType;
	/** Placeholder text — shown only when no label OR label is floated. */
	placeholder?: string;
	name?: string;
	id?: string;
	autoComplete?: string;
	inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
	/** Number of rows for textarea type. @default 2 */
	rows?: number;
	/** Number of columns for textarea type. @default 20 */
	cols?: number;
	/** Whether the textarea should automatically resize to fit its content. @default false */
	autoResize?: boolean;
	/** Maximum number of rows when autoResize is true. */
	maxRows?: number;
	/** CSS direction override for input text. */
	textDirection?: "ltr" | "rtl" | "";

	// ── Validation ────────────────────────────────────────────────────────────
	/** Marks field as required. Shows asterisk on label. */
	required?: boolean;
	/** Hides the asterisk even when required=true. */
	noAsterisk?: boolean;
	/** Manual error override — forces error visual state. */
	error?: boolean;
	/** Error message shown below the field (replaces supportingText). */
	errorText?: string;
	minLength?: number;
	/** When set, enables character counter display. */
	maxLength?: number;
	min?: string;
	max?: string;
	step?: string;
	pattern?: string;
	/** For type="email" — allows multiple email addresses. */
	multiple?: boolean;

	// ── Supporting text ───────────────────────────────────────────────────────
	/** Helper text shown below the field. Replaced by errorText when in error state. */
	supportingText?: string;

	// ── Decorators ────────────────────────────────────────────────────────────
	/** Text displayed before the input value (e.g., "$"). */
	prefixText?: string;
	/** Text displayed after the input value (e.g., ".00"). */
	suffixText?: string;
	/** Icon node for the leading slot. Should be 24×24px. */
	leadingIcon?: React.ReactNode;
	/** Custom trailing icon node. Used when trailingIconMode='custom'. */
	trailingIcon?: React.ReactNode;

	// ── Trailing icon mode ────────────────────────────────────────────────────
	/**
	 * Built-in trailing icon behavior.
	 * - 'none' — no trailing icon
	 * - 'clear' — ✕ button, clears value when clicked
	 * - 'password-toggle' — eye icon, toggles password visibility
	 * - 'custom' — uses trailingIcon prop
	 * @default 'none'
	 */
	trailingIconMode?: TextFieldTrailingIconMode;

	// ── States ────────────────────────────────────────────────────────────────
	disabled?: boolean;
	readOnly?: boolean;
	/** Hides spinner arrows on type="number". */
	noSpinner?: boolean;

	// ── Form integration ──────────────────────────────────────────────────────
	form?: string;

	// ── Accessibility ─────────────────────────────────────────────────────────
	"aria-label"?: string;
	"aria-describedby"?: string;
	"aria-labelledby"?: string;

	// ── Layout ────────────────────────────────────────────────────────────────
	/** Extra class applied to the root wrapper element. */
	className?: string;
	/** Makes the component fill its container width. */
	fullWidth?: boolean;
	/** Dense variant — reduced height (48px instead of 56px). */
	dense?: boolean;

	// ── Callbacks ─────────────────────────────────────────────────────────────
	onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onKeyUp?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;

	// ── Ref ───────────────────────────────────────────────────────────────────
	ref?: React.Ref<TextFieldHandle>;

	// ── ScrollArea ────────────────────────────────────────────────────────────
	/**
	 * Controls when the scrollbars are visible when type="textarea".
	 * - `hover`: Show on hover (default)
	 * - `scroll`: Show only while scrolling
	 * - `always`: Always visible
	 * - `none`: Never visible
	 */
	scrollAreaType?: "hover" | "scroll" | "always" | "none";
}
