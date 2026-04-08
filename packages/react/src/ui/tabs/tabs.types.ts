/**
 * @file tabs.types.ts
 * MD3 Expressive Tabs — TypeScript prop definitions.
 * Spec: https://m3.material.io/components/tabs/overview
 */

import type * as React from "react";

// ─── Variant & Layout ─────────────────────────────────────────────────────────

/** Visual variant: primary (content-width indicator) or secondary (full-width indicator + divider). */
export type TabsVariant = "primary" | "secondary";

// ─── Internal Context ──────────────────────────────────────────────────────────

/**
 * Internal context shared across all compound components.
 * @internal
 */
export interface TabsContextValue {
	/** Currently selected tab value. */
	value: string;
	/** Callback to change the selected tab. */
	onValueChange: (value: string) => void;
	/** Currently keyboard-focused tab value (for roving tabindex). */
	focusedValue: string;
	/** Sets the focused tab value (keyboard nav only — does NOT select). */
	setFocusedValue: (value: string) => void;
	/** Ordered list of all registered tab values (for ArrowKey nav). */
	tabValues: string[];
	/** Register a tab value when a <Tab> mounts. */
	registerTab: (value: string) => void;
	/** Unregister a tab value when a <Tab> unmounts. */
	unregisterTab: (value: string) => void;
	/** Unique layout group ID scoped to this Tabs instance. */
	layoutGroupId: string;
	/**
	 * Set of currently disabled tab values.
	 * Used by keyboard navigation to skip disabled tabs.
	 */
	disabledValues: Set<string>;
	/**
	 * Mark or unmark a tab value as disabled.
	 * Called by <Tab> on mount and when `disabled` prop changes.
	 */
	markTabDisabled: (value: string, disabled: boolean) => void;
	/**
	 * When true, focus moving via ArrowKey also selects the tab immediately.
	 * Mirrors Google's `autoActivate` attribute on <md-tabs>.
	 * @default false
	 */
	autoActivate: boolean;
}

// ─── Component Props ───────────────────────────────────────────────────────────

/**
 * Props for the `<Tabs>` root component.
 *
 * Supports both controlled (`value` + `onValueChange`) and
 * uncontrolled (`defaultValue`) usage patterns.
 *
 * @example
 * ```tsx
 * // Controlled
 * <Tabs value={tab} onValueChange={setTab}>...</Tabs>
 *
 * // Uncontrolled
 * <Tabs defaultValue="flights">...</Tabs>
 *
 * // Auto-activate (focus = select)
 * <Tabs defaultValue="flights" autoActivate>...</Tabs>
 * ```
 */
export interface TabsProps {
	/** Controlled selected value. Use with `onValueChange`. */
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	/** Called when the selected tab changes. */
	onValueChange?: (value: string) => void;
	/**
	 * When true, ArrowKey navigation also selects the focused tab immediately.
	 * Mirrors Google's `auto-activate` attribute on `<md-tabs>`.
	 * @default false
	 */
	autoActivate?: boolean;
	/** Tab compound components as children. */
	children: React.ReactNode;
	/** Additional CSS class names for the root wrapper. */
	className?: string;
}

/**
 * Props for the `<TabsList>` container component.
 *
 * @example
 * ```tsx
 * <TabsList variant="primary" scrollable={false}>
 *   <Tab value="tab1">Tab 1</Tab>
 * </TabsList>
 * ```
 */
export interface TabsListProps {
	/** Visual style variant. @required */
	variant: TabsVariant;
	/**
	 * When true, tabs scroll horizontally with 52px edge padding (MD3 spec).
	 * When false, tabs divide the available width equally (flex-1).
	 * @default false
	 */
	scrollable?: boolean;
	/**
	 * Background color override for the tab bar.
	 * @default "var(--md-sys-color-surface)"
	 */
	backgroundColor?: string;
	/** Tab components as children. */
	children: React.ReactNode;
	/** Additional CSS class names. */
	className?: string;
	/** Forwarded aria-label for the tablist. */
	"aria-label"?: string;
}

/**
 * Props for an individual `<Tab>` component.
 *
 * @example
 * ```tsx
 * <Tab value="flights" icon={<Icon name="flight" />}>Flights</Tab>
 * <Tab value="trips" disabled>Trips</Tab>
 * <Tab value="hotels" icon={<Icon name="hotel" />} inlineIcon>Hotels</Tab>
 * ```
 */
export interface TabProps {
	/** Unique value identifying this tab. Must match a `<TabsContent value>`. */
	value: string;
	/**
	 * Optional icon rendered with the label text.
	 * - Default (stacked): icon above label, height increases to 64dp.
	 * - With `inlineIcon`: icon beside label (same row), height stays 48dp.
	 */
	icon?: React.ReactNode;
	/**
	 * When true, icon is placed inline (same row) with the label text.
	 * Container height stays at 48dp (does NOT increase to 64dp).
	 * Mirrors the `inline-icon` attribute on `<md-primary-tab>`.
	 * @default false
	 */
	inlineIcon?: boolean;
	/**
	 * When true, disables interaction.
	 * Disabled tabs are skipped entirely in keyboard navigation (ArrowKey).
	 */
	disabled?: boolean;
	/** Additional CSS class names. */
	className?: string;
	/**
	 * Optional badge element overlaid on the tab content.
	 * Handled via `BadgedBox`:
	 * - Stacked icon: Overlaps icon's top-trailing corner.
	 * - Inline/Text-only: Placed next to the text.
	 */
	badge?: React.ReactNode;
	/** Label text rendered inside the tab. */
	children: React.ReactNode;
}

/**
 * Props for the `<TabsContent>` panel component.
 *
 * @example
 * ```tsx
 * <TabsContent value="flights">Flight content here</TabsContent>
 * ```
 */
export interface TabsContentProps {
	/** Must match the `value` of a sibling `<Tab>`. */
	value: string;
	/** Additional CSS class names. */
	className?: string;
	/** Panel content. */
	children: React.ReactNode;
}
