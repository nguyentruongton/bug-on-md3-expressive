/**
 * @file tabs.tsx
 * MD3 Expressive Tabs — Root context provider and state manager.
 * Implements compound component pattern (similar to Radix UI).
 * Spec: https://m3.material.io/components/tabs/overview
 */

import { domMax, LazyMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import type { TabsContextValue, TabsProps } from "./tabs.types";

// ─── Context ───────────────────────────────────────────────────────────────────

const TabsContext = React.createContext<TabsContextValue | null>(null);

/**
 * Hook to consume the Tabs context.
 * Throws if used outside a `<Tabs>` root.
 * @internal
 */
export function useTabsContext(): TabsContextValue {
	const ctx = React.useContext(TabsContext);
	if (!ctx) {
		throw new Error(
			"[MD3 Tabs] Component must be used within a <Tabs> root. " +
				"Ensure <TabsList>, <Tab>, and <TabsContent> are descendants of <Tabs>.",
		);
	}
	return ctx;
}

// ─── Tabs Root ─────────────────────────────────────────────────────────────────

const TabsComponent = React.forwardRef<HTMLDivElement, TabsProps>(
	(
		{
			value: controlledValue,
			defaultValue = "",
			onValueChange,
			autoActivate = false,
			children,
			className,
		},
		ref,
	) => {
		// ── State: selected value (controlled + uncontrolled) ──────────────────
		const [internalValue, setInternalValue] = React.useState(defaultValue);
		const isControlled = controlledValue !== undefined;
		const value = isControlled ? controlledValue : internalValue;

		const handleValueChange = React.useCallback(
			(newValue: string) => {
				if (!isControlled) setInternalValue(newValue);
				onValueChange?.(newValue);
			},
			[isControlled, onValueChange],
		);

		// ── State: keyboard focus (roving tabindex) ────────────────────────────
		// focusedValue is separate from `value` so focus can move without selecting.
		const [focusedValue, setFocusedValue] = React.useState(value);

		// Sync focusedValue when controlled value changes externally
		React.useEffect(() => {
			setFocusedValue(value);
		}, [value]);

		// ── Registered tabs registry ───────────────────────────────────────────
		// Tabs register/unregister themselves to enable ArrowKey navigation.
		const [tabValues, setTabValues] = React.useState<string[]>([]);

		const registerTab = React.useCallback((tabValue: string) => {
			setTabValues((prev) => {
				if (prev.includes(tabValue)) return prev;
				return [...prev, tabValue];
			});
		}, []);

		const unregisterTab = React.useCallback((tabValue: string) => {
			setTabValues((prev) => prev.filter((v) => v !== tabValue));
		}, []);

		// ── Auto-select first enabled tab when no defaultValue is provided ─────
		// Mirrors Google's behavior: if no tab is active, select the first one.
		const hasAutoSelected = React.useRef(false);

		// ── Disabled tab tracking ──────────────────────────────────────────────
		const [disabledValues, setDisabledValues] = React.useState<Set<string>>(
			new Set(),
		);

		const markTabDisabled = React.useCallback(
			(tabValue: string, disabled: boolean) => {
				setDisabledValues((prev) => {
					const next = new Set(prev);
					if (disabled) {
						next.add(tabValue);
					} else {
						next.delete(tabValue);
					}
					return next;
				});
			},
			[],
		);

		// Auto-select first enabled tab if no value is set
		React.useEffect(() => {
			if (isControlled || hasAutoSelected.current || tabValues.length === 0) {
				return;
			}
			if (value && tabValues.includes(value)) {
				hasAutoSelected.current = true;
				return;
			}
			const firstEnabled = tabValues.find((v) => !disabledValues.has(v));
			if (firstEnabled) {
				hasAutoSelected.current = true;
				setInternalValue(firstEnabled);
				setFocusedValue(firstEnabled);
			}
		}, [tabValues, disabledValues, isControlled, value]);

		// ── Unique layout group ID for Framer Motion ───────────────────────────
		const id = React.useId();
		const layoutGroupId = `tabs-${id}`;

		// ── Context value ──────────────────────────────────────────────────────
		const contextValue = React.useMemo<TabsContextValue>(
			() => ({
				value,
				onValueChange: handleValueChange,
				focusedValue,
				setFocusedValue,
				tabValues,
				registerTab,
				unregisterTab,
				layoutGroupId,
				disabledValues,
				markTabDisabled,
				autoActivate,
			}),
			[
				value,
				handleValueChange,
				focusedValue,
				tabValues,
				registerTab,
				unregisterTab,
				layoutGroupId,
				disabledValues,
				markTabDisabled,
				autoActivate,
			],
		);

		return (
			<LazyMotion features={domMax} strict>
				<TabsContext.Provider value={contextValue}>
					<div ref={ref} className={cn("w-full", className)}>
						{children}
					</div>
				</TabsContext.Provider>
			</LazyMotion>
		);
	},
);

TabsComponent.displayName = "Tabs";

/**
 * MD3 Expressive Tabs root component.
 *
 * Manages tab selection state and provides context to all
 * compound sub-components. Supports both controlled and
 * uncontrolled usage.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Tabs defaultValue="flights">
 *   <TabsList variant="primary">
 *     <Tab value="flights">Flights</Tab>
 *     <Tab value="trips">Trips</Tab>
 *   </TabsList>
 *   <TabsContent value="flights">Flight content</TabsContent>
 *   <TabsContent value="trips">Trip content</TabsContent>
 * </Tabs>
 *
 * // Controlled
 * const [tab, setTab] = useState("flights");
 * <Tabs value={tab} onValueChange={setTab}>...</Tabs>
 *
 * // Auto-activate mode (focus = select)
 * <Tabs defaultValue="flights" autoActivate>...</Tabs>
 * ```
 *
 * @see https://m3.material.io/components/tabs/overview
 */
export const Tabs = React.memo(TabsComponent);

// ─── TabsListContext ───────────────────────────────────────────────────────────

/**
 * Secondary context carrying variant + scrollable from <TabsList>.
 * Separate from TabsContext so Tabs root doesn't need these props —
 * they belong to the list, not the root.
 * @internal
 */
export interface TabsListContextValue {
	variant: "primary" | "secondary";
	scrollable: boolean;
}

export const TabsListContext =
	React.createContext<TabsListContextValue | null>(null);

/**
 * Hook to consume TabsList-level context (variant, scrollable).
 * @internal
 */
export function useTabsListContext(): TabsListContextValue {
	const ctx = React.useContext(TabsListContext);
	// Fallback to sensible defaults instead of throwing, since
	// Tab might be rendered without explicit context in tests.
	return ctx ?? { variant: "primary", scrollable: false };
}
