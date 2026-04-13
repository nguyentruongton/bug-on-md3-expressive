/**
 * @file bottom-app-bar.tsx
 * MD3 Expressive Bottom App Bar.
 *
 * Fixed to bottom of screen. Contains action icons and optional FAB.
 * Height: 80px | Background: surface-container | Elevation: Level2 (always)
 *
 * @see docs/m3/app-bars/BottomAppBarTokens.kt
 */

import { m, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import { APP_BAR_BOTTOM_SPRING, AppBarTokens } from "./app-bar.tokens";
import type { BottomAppBarProps } from "./app-bar.types";
import { useAppBarScroll } from "./hooks/use-app-bar-scroll";

/**
 * MD3 Expressive Bottom App Bar.
 *
 * @example
 * ```tsx
 * // With FAB
 * <BottomAppBar
 *   actions={
 *     <>
 *       <IconButton aria-label="Check"><Icon>check_box</Icon></IconButton>
 *       <IconButton aria-label="Brush"><Icon>brush</Icon></IconButton>
 *     </>
 *   }
 *   floatingActionButton={<FAB aria-label="Compose">...</FAB>}
 * />
 *
 * // Auto-hide on scroll
 * <BottomAppBar scrollBehavior="hidden" actions={...} />
 * ```
 */
export function BottomAppBar({
	actions,
	floatingActionButton,
	scrollBehavior = "visible",
	scrollElement,
	className,
}: BottomAppBarProps) {
	const shouldReduceMotion = useReducedMotion();

	const { isHidden } = useAppBarScroll({
		scrollElement,
		behavior: scrollBehavior === "hidden" ? "enterAlways" : "pinned",
	});

	const hideTransition = shouldReduceMotion
		? { duration: 0 }
		: APP_BAR_BOTTOM_SPRING;

	const translateY = scrollBehavior === "hidden" && isHidden ? "100%" : "0%";

	return (
		<m.nav
			role="navigation"
			aria-label="Bottom app bar"
			className={cn(
				"fixed bottom-0 inset-x-0 z-50",
				"flex items-center",
				"bg-m3-surface-container",
				"px-2", // minimal horizontal padding, icon buttons provide spacing
				"elevation-2", // BottomAppBarTokens.ContainerElevation = Level2 (always)
				className,
			)}
			style={{
				height: AppBarTokens.heights.bottom,
			}}
			animate={{ y: translateY }}
			transition={hideTransition}
		>
			{/* Actions — leading end */}
			{actions && <div className="flex items-center flex-1">{actions}</div>}

			{/* FAB — trailing end */}
			{floatingActionButton && (
				<div className="shrink-0 ml-auto mr-2">{floatingActionButton}</div>
			)}
		</m.nav>
	);
}
