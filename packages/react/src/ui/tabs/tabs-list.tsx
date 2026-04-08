/**
 * @file tabs-list.tsx
 * MD3 Expressive TabsList — Container component for tab buttons.
 *
 * Responsibilities:
 * - Applies variant (primary/secondary) layout and styling
 * - Manages horizontal scroll for scrollable mode (52px edge padding per MD3)
 * - Renders the bottom divider for secondary variant
 * - Scopes Framer Motion LayoutGroup so indicators animate correctly
 *   when multiple <Tabs> instances are on the same page
 * - Restores focus to activeTab when keyboard focus leaves the tablist
 *   (matches Google's `focusout` handler on <md-tabs>)
 */

import { LayoutGroup } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { TabsListContext, useTabsContext } from "./tabs";
import { TabsTokens } from "./tabs.tokens";
import type { TabsListProps } from "./tabs.types";

// ─── TabsList ──────────────────────────────────────────────────────────────────

const TabsListComponent = React.forwardRef<HTMLDivElement, TabsListProps>(
	(
		{
			variant,
			scrollable = false,
			backgroundColor,
			children,
			className,
			"aria-label": ariaLabel,
		},
		ref,
	) => {
		const { layoutGroupId, value, setFocusedValue } = useTabsContext();

		// Unique layout group ID scoped to this TabsList instance.
		const listLayoutId = `${layoutGroupId}-list`;

		// ── TabsListContext: provide variant + scrollable to children ──────────
		const listContextValue = React.useMemo(
			() => ({ variant, scrollable }),
			[variant, scrollable],
		);

		// ── Background color ───────────────────────────────────────────────────
		const bgColor = backgroundColor ?? "var(--md-sys-color-surface)";

		// ── Focusout handler — restore roving focus to active tab ──────────────
		// When keyboard focus leaves the tablist entirely (e.g. user presses Tab
		// to move to the panel), reset `focusedValue` back to the selected tab.
		// This ensures the next time the user Tabs back into the tablist, focus
		// lands on the active tab — not the last arrow-key-focused tab.
		// Mirrors Google's `handleFocusout` in tabs.ts:
		//   "restore focus to selected item when blurring the tab bar"
		const handleBlur = React.useCallback(
			(e: React.FocusEvent<HTMLDivElement>) => {
				// `relatedTarget` is the element receiving focus.
				// If it's still inside the tablist, this is an internal focus move
				// (e.g. clicking another tab) — don't restore.
				const listEl = e.currentTarget;
				if (listEl.contains(e.relatedTarget as Node | null)) return;

				// Focus left the tablist — restore focusedValue to the active tab.
				setFocusedValue(value);
			},
			[value, setFocusedValue],
		);

		return (
			<TabsListContext.Provider value={listContextValue}>
				{/* LayoutGroup scopes shared layout animation so indicators from different Tabs instances don't bleed into each other. */}
				<LayoutGroup id={listLayoutId}>
					{/* Outer wrapper: positioning context for the secondary divider */}
					<div
						ref={ref}
						className={cn("relative w-full", className)}
						style={{ backgroundColor: bgColor }}
					>
						<div
							role="tablist"
							aria-label={ariaLabel}
							onBlur={handleBlur}
							className={cn(
								"flex flex-row items-stretch",
								scrollable && "overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
							)}
							style={
								scrollable
									? {
											paddingLeft: TabsTokens.scrollableEdgePadding,
											paddingRight: TabsTokens.scrollableEdgePadding,
										}
									: undefined
							}
						>
							{children}
						</div>

						{/* Secondary variant: bottom divider — absolute so it doesn't affect tab layout flow */}
						{variant === "secondary" && (
							<div
								aria-hidden="true"
								className="absolute bottom-0 left-0 right-0"
								style={{
									height: TabsTokens.dividerHeight,
									backgroundColor: "var(--md-sys-color-surface-variant)",
								}}
							/>
						)}
					</div>
				</LayoutGroup>
			</TabsListContext.Provider>
		);
	},
);

TabsListComponent.displayName = "TabsList";

/**
 * MD3 Expressive TabsList container component.
 *
 * Renders a horizontal row of `<Tab>` components with MD3-compliant
 * layout (fixed or scrollable) and variant styling (primary or secondary).
 *
 * - **Primary**: Tabs divide available width equally, indicator width = content width.
 * - **Secondary**: Tabs divide equally + full-width indicator + bottom divider line.
 * - **Scrollable**: Tabs have min-width (90px), scroll horizontally with 52px edge padding.
 * - **Focusout**: When focus leaves the tablist, roving focus resets to the active tab.
 *
 * @example
 * ```tsx
 * <TabsList variant="primary" scrollable={false}>
 *   <Tab value="tab1">Tab 1</Tab>
 *   <Tab value="tab2">Tab 2</Tab>
 * </TabsList>
 *
 * <TabsList variant="secondary" scrollable={true} aria-label="Content sections">
 *   <Tab value="a">Alpha</Tab>
 *   <Tab value="b">Beta</Tab>
 * </TabsList>
 * ```
 */
export const TabsList = React.memo(TabsListComponent);
