/**
 * @file use-flexible-app-bar.ts
 * Shared animation hook for MediumFlexibleAppBar and LargeFlexibleAppBar.
 *
 * Extracts common scroll-driven animation state to avoid duplication.
 */

import type { MotionValue } from "motion/react";
import { useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { RefObject } from "react";
import * as React from "react";
import { APP_BAR_COLOR_TRANSITION, APP_BAR_COLORS } from "../app-bar.tokens";
import type { AppBarColors } from "../app-bar.types";
import { useAppBarScroll } from "./use-app-bar-scroll";

interface UseFlexibleAppBarOptions {
	collapsedHeight: number;
	expandedHeight: number;
	scrollElement?: RefObject<HTMLElement | null>;
	colors?: AppBarColors;
	/** [start, end] progress range where large title fades from 1 → 0 */
	largeTitleFadeRange: [number, number];
	/** [start, end] progress range where small title fades from 0 → 1 */
	smallTitleFadeRange: [number, number];
	/** [start, end] progress range where subtitle fades from 1 → 0 */
	subtitleFadeRange: [number, number];
	/** [start, end] progress range where headerContent fades from 1 → 0 */
	headerContentFadeRange: [number, number];
	/** [expanded, collapsed] Y offset for large title */
	largeTitleYRange: [number, number];
}

export interface FlexibleAppBarAnimationState {
	height: MotionValue<number>;
	currentBg: string;
	cssTransition: string | undefined;
	largeTitleOpacity: MotionValue<number>;
	largeTitleY: MotionValue<number>;
	smallTitleOpacity: MotionValue<number>;
	subtitleOpacity: MotionValue<number>;
	headerContentOpacity: MotionValue<number>;
}

export function useFlexibleAppBar({
	collapsedHeight,
	expandedHeight,
	scrollElement,
	colors,
	largeTitleFadeRange,
	smallTitleFadeRange,
	subtitleFadeRange,
	headerContentFadeRange,
	largeTitleYRange,
}: UseFlexibleAppBarOptions): FlexibleAppBarAnimationState {
	const shouldReduceMotion = useReducedMotion();

	const { collapsedFraction } = useAppBarScroll({
		scrollElement,
		behavior: "exitUntilCollapsed",
		collapsedHeight,
		expandedHeight,
	});

	const scrollProgress = useMotionValue(0);

	React.useEffect(() => {
		scrollProgress.set(
			shouldReduceMotion
				? collapsedFraction > 0.5
					? 1
					: 0
				: collapsedFraction,
		);
	}, [collapsedFraction, scrollProgress, shouldReduceMotion]);

	const height = useTransform(
		scrollProgress,
		[0, 1],
		[expandedHeight, collapsedHeight],
	);

	const containerBg = colors?.containerColor ?? APP_BAR_COLORS.container;
	const scrolledBg =
		colors?.scrolledContainerColor ?? APP_BAR_COLORS.scrolledContainer;
	const currentBg = collapsedFraction > 0 ? scrolledBg : containerBg;

	const cssTransition = shouldReduceMotion
		? undefined
		: `background-color ${APP_BAR_COLOR_TRANSITION.duration}s cubic-bezier(${APP_BAR_COLOR_TRANSITION.ease.join(",")})`;

	const largeTitleOpacity = useTransform(
		scrollProgress,
		[largeTitleFadeRange[0], largeTitleFadeRange[1]],
		[1, 0],
	);
	const largeTitleY = useTransform(scrollProgress, [0, 1], largeTitleYRange);
	const smallTitleOpacity = useTransform(
		scrollProgress,
		[smallTitleFadeRange[0], smallTitleFadeRange[1]],
		[0, 1],
	);
	const subtitleOpacity = useTransform(
		scrollProgress,
		[subtitleFadeRange[0], subtitleFadeRange[1]],
		[1, 0],
	);
	const headerContentOpacity = useTransform(
		scrollProgress,
		[headerContentFadeRange[0], headerContentFadeRange[1]],
		[1, 0],
	);

	return {
		height,
		currentBg,
		cssTransition,
		largeTitleOpacity,
		largeTitleY,
		smallTitleOpacity,
		subtitleOpacity,
		headerContentOpacity,
	};
}
