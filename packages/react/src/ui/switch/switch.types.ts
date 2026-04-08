/**
 * @file switch.types.ts
 * MD3 Expressive Switch — TypeScript prop definitions.
 * Spec: https://m3.material.io/components/switch/overview
 */

import type * as React from "react";

/**
 * Props for the `Switch` component.
 *
 * @example
 * ```tsx
 * <Switch checked={isOn} onCheckedChange={setIsOn} label="Wi-Fi" />
 * ```
 */
export interface SwitchProps {
	/** Controlled checked (on) state. */
	checked: boolean;
	/** Called when the switch is toggled. Not called when disabled. */
	onCheckedChange: (checked: boolean) => void;
	/** Disables interaction and applies disabled visual state. @default false */
	disabled?: boolean;
	/**
	 * Optional icon content rendered inside the thumb.
	 * Expected to measure 16dp (SwitchTokens.iconSize).
	 */
	thumbContent?: React.ReactNode;
	/**
	 * When true, shows thumb icons in both selected and unselected states.
	 * Requires `thumbContent` to be provided.
	 * @default false
	 */
	icons?: boolean;
	/**
	 * When true, shows the icon only in the selected/checked state.
	 * Requires `thumbContent` to be provided.
	 * @default false
	 */
	showOnlySelectedIcon?: boolean;
	/**
	 * Visible label text rendered adjacent to the switch.
	 * When provided, wraps the switch in a `<label>` for accessibility.
	 */
	label?: string;
	/**
	 * Overrides the accessible name. Used when no visible `label` is provided.
	 * Maps to the `aria-label` attribute.
	 */
	ariaLabel?: string;
	/** Additional CSS class names applied to the outermost wrapper. */
	className?: string;
	// ── Advanced color overrides ──────────────────────────────────────────────
	/** Override track background color when checked. Defaults to MD3 primary. */
	checkedTrackColor?: string;
	/** Override track background color when unchecked. Defaults to MD3 surface-container-highest. */
	uncheckedTrackColor?: string;
	/** Override thumb color when checked. Defaults to MD3 on-primary. */
	checkedThumbColor?: string;
	/** Override thumb color when unchecked. Defaults to MD3 outline. */
	uncheckedThumbColor?: string;
}
