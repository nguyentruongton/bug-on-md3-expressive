/**
 * @file use-app-bar-scroll.ts
 * MD3 Expressive App Bar — Scroll behavior hook.
 *
 * Tracks scroll state for App Bar behaviors:
 * - `pinned`: background color change only
 * - `enterAlways`: hide/show based on scroll direction
 * - `exitUntilCollapsed`: drives collapse fraction (0 = expanded, 1 = collapsed)
 */

import * as React from "react";
import type {
	AppBarScrollBehavior,
	UseAppBarScrollReturn,
} from "../app-bar.types";

interface UseAppBarScrollOptions {
	/** Ref to the scrollable container. Defaults to `window`. */
	scrollElement?: React.RefObject<HTMLElement | null>;
	/** Scroll behavior mode. @default "pinned" */
	behavior?: AppBarScrollBehavior;
	/** Collapsed height in px — used for `exitUntilCollapsed`. @default 64 */
	collapsedHeight?: number;
	/** Expanded height in px — used for `exitUntilCollapsed`. @default 112 */
	expandedHeight?: number;
}

/**
 * Tracks scroll position and derives App Bar state for all three behaviors.
 *
 * @example
 * ```tsx
 * // pinned (color change only)
 * const { isScrolled } = useAppBarScroll({ behavior: 'pinned' });
 *
 * // enterAlways (hide/show)
 * const { isHidden } = useAppBarScroll({ behavior: 'enterAlways' });
 *
 * // exitUntilCollapsed (collapse animation)
 * const { collapsedFraction } = useAppBarScroll({
 *   behavior: 'exitUntilCollapsed',
 *   collapsedHeight: 64,
 *   expandedHeight: 112,
 * });
 * ```
 */
export function useAppBarScroll({
	scrollElement,
	behavior = "pinned",
	collapsedHeight = 64,
	expandedHeight = 112,
}: UseAppBarScrollOptions = {}): UseAppBarScrollReturn {
	const [isScrolled, setIsScrolled] = React.useState(false);
	const [collapsedFraction, setCollapsedFraction] = React.useState(0);
	const [isHidden, setIsHidden] = React.useState(false);

	// Track previous scroll position for direction detection
	const prevScrollYRef = React.useRef(0);
	// Hysteresis to prevent rapid toggling on enterAlways
	const hideThreshold = 64;

	React.useEffect(() => {
		const scrollDistance = expandedHeight - collapsedHeight;

		const getScrollY = (): number => {
			const el = scrollElement?.current;
			return el ? el.scrollTop : window.scrollY;
		};

		const handleScroll = () => {
			const currentY = getScrollY();
			const prevY = prevScrollYRef.current;
			const delta = currentY - prevY;
			prevScrollYRef.current = currentY;

			// Pinned: only toggle background color
			setIsScrolled(currentY > 0);

			if (behavior === "exitUntilCollapsed") {
				const fraction =
					scrollDistance > 0
						? Math.min(1, Math.max(0, currentY / scrollDistance))
						: 0;
				setCollapsedFraction(fraction);
			}

			if (behavior === "enterAlways") {
				if (delta > 0 && currentY > hideThreshold) {
					// Scrolling down — hide
					setIsHidden(true);
				} else if (delta < 0) {
					// Scrolling up — show
					setIsHidden(false);
				}
			}
		};

		const target = scrollElement?.current ?? window;
		target.addEventListener("scroll", handleScroll, { passive: true });

		// Sync initial state
		handleScroll();

		return () => {
			target.removeEventListener("scroll", handleScroll);
		};
	}, [scrollElement, behavior, collapsedHeight, expandedHeight]);

	return { isScrolled, collapsedFraction, isHidden };
}
