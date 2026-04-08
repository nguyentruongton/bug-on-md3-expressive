/**
 * @file tabs-content.tsx
 * MD3 Expressive TabsContent — Animated panel component.
 *
 * Implements WAI-ARIA tabpanel role with:
 * - AnimatePresence for fade transition on tab switch
 * - Proper aria-labelledby pointing to the associated <Tab>
 * - tabIndex=0 so keyboard users can Tab from the tablist into the panel
 * - Hidden panels are removed from the DOM (not just visually hidden)
 *   to prevent screen readers from reading inactive content
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { useTabsContext } from "./tabs";
import { TABS_CONTENT_TRANSITION } from "./tabs.tokens";
import type { TabsContentProps } from "./tabs.types";

// ─── TabsContent ───────────────────────────────────────────────────────────────

const TabsContentComponent = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ value, className, children }, ref) => {
		const { value: selectedValue, layoutGroupId } = useTabsContext();
		const isActive = selectedValue === value;
		const prefersReduced = useReducedMotion() ?? false;

		// ARIA wiring: panel is labelled by its corresponding <Tab> button
		const tabId = `${layoutGroupId}-tab-${value}`;
		const panelId = `${layoutGroupId}-panel-${value}`;

		const contentTransition = prefersReduced ? { duration: 0 } : TABS_CONTENT_TRANSITION;

		return (
			<AnimatePresence mode="popLayout" initial={false}>
				{isActive && (
					<m.div
						ref={ref}
						key={value}
						id={panelId}
						role="tabpanel"
						aria-labelledby={tabId}
						tabIndex={0}
						className={cn(
							"focus:outline-none w-full",
							"focus-visible:outline-2 focus-visible:outline-offset-2",
							"focus-visible:outline-(--md-sys-color-secondary)",
							className,
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={contentTransition}
					>
						{children}
					</m.div>
				)}
			</AnimatePresence>
		);
	},
);

TabsContentComponent.displayName = "TabsContent";

/**
 * MD3 Expressive TabsContent panel component.
 *
 * Each panel corresponds to a `<Tab>` with the same `value`.
 * Only the active panel is rendered in the DOM — inactive panels
 * are fully unmounted (not `display: none`) to prevent screen readers
 * from reading hidden content.
 *
 * Fade animation is applied on both enter and exit via Framer Motion
 * `AnimatePresence`. We use `mode="popLayout"` to prevent height layout shifting
 * during tab transitions. Animation is automatically disabled when the user
 * has enabled `prefers-reduced-motion`.
 *
 * @example
 * ```tsx
 * <TabsContent value="flights">
 *   <p>Available flights...</p>
 * </TabsContent>
 * ```
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
export const TabsContent = React.memo(TabsContentComponent);
