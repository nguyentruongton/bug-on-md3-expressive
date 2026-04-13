/**
 * @file small-app-bar.tsx
 * MD3 Expressive Small App Bar.
 *
 * Single-row layout: [navigationIcon][title + subtitle][actions]
 * Height: 64px | Title: TitleLarge (22sp) | Subtitle: LabelMedium (12sp)
 *
 * Scroll behaviors:
 * - pinned: changes background color surface → surface-container
 * - enterAlways: slides up when scrolling down, slides down when scrolling up
 *
 * @see docs/m3/app-bars/AppBarSmallTokens.kt
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import {
	APP_BAR_COLOR_TRANSITION,
	APP_BAR_COLORS,
	APP_BAR_ENTER_ALWAYS_SPRING,
	AppBarTokens,
	appBarTypography,
} from "./app-bar.tokens";
import type { SmallAppBarProps } from "./app-bar.types";
import { useAppBarScroll } from "./hooks/use-app-bar-scroll";

interface SmallAppBarInnerProps
	extends Pick<
		SmallAppBarProps,
		| "title"
		| "subtitle"
		| "titleAlignment"
		| "navigationIcon"
		| "actions"
		| "colors"
		| "className"
	> {
	currentBg: string;
	cssTransition: string | undefined;
}

/** Inner content shared between pinned and enterAlways variants. */
function SmallAppBarInner({
	title,
	subtitle,
	titleAlignment = "start",
	navigationIcon,
	actions,
	colors,
	className,
	currentBg,
	cssTransition,
}: SmallAppBarInnerProps) {
	const isCentered = titleAlignment === "center";

	return (
		<m.header
			role="banner"
			className={cn("flex items-center px-1 h-full w-full", className)}
			style={{ backgroundColor: currentBg, transition: cssTransition }}
		>
			{navigationIcon && (
				<div
					className="shrink-0 flex items-center justify-center"
					style={{
						width: AppBarTokens.iconButtonTouchTarget,
						height: AppBarTokens.iconButtonTouchTarget,
					}}
				>
					{navigationIcon}
				</div>
			)}

			<div
				className={cn(
					"flex-1 flex flex-col justify-center min-w-0",
					isCentered ? "items-center" : "items-start",
					!navigationIcon && "pl-4",
				)}
			>
				<span
					className={cn(
						appBarTypography.titleLarge,
						"truncate w-full",
						isCentered && "text-center",
					)}
					style={{ color: colors?.titleColor ?? APP_BAR_COLORS.title }}
				>
					{title}
				</span>
				{subtitle && (
					<span
						className={cn(
							appBarTypography.labelMedium,
							"truncate w-full",
							isCentered && "text-center",
						)}
						style={{ color: colors?.subtitleColor ?? APP_BAR_COLORS.subtitle }}
					>
						{subtitle}
					</span>
				)}
			</div>

			{actions && <div className="flex items-center shrink-0">{actions}</div>}
		</m.header>
	);
}

/**
 * MD3 Expressive Small App Bar.
 *
 * @example
 * ```tsx
 * // Left-aligned (default)
 * <SmallAppBar
 *   title="Inbox"
 *   navigationIcon={<IconButton aria-label="Go back"><Icon>arrow_back</Icon></IconButton>}
 *   actions={<IconButton aria-label="Search"><Icon>search</Icon></IconButton>}
 *   scrollBehavior="pinned"
 * />
 *
 * // Center-aligned with subtitle
 * <SmallAppBar
 *   title="Profile"
 *   subtitle="@username"
 *   titleAlignment="center"
 *   scrollBehavior="enterAlways"
 * />
 * ```
 */
export function SmallAppBar({
	title,
	subtitle,
	titleAlignment = "start",
	navigationIcon,
	actions,
	colors,
	scrollBehavior = "pinned",
	scrollElement,
	className,
}: SmallAppBarProps) {
	const shouldReduceMotion = useReducedMotion();

	const { isScrolled, isHidden } = useAppBarScroll({
		scrollElement,
		behavior:
			scrollBehavior === "exitUntilCollapsed" ? "pinned" : scrollBehavior,
	});

	const containerBg = colors?.containerColor ?? APP_BAR_COLORS.container;
	const scrolledBg =
		colors?.scrolledContainerColor ?? APP_BAR_COLORS.scrolledContainer;
	const currentBg = isScrolled ? scrolledBg : containerBg;

	const cssTransition = shouldReduceMotion
		? undefined
		: `background-color ${APP_BAR_COLOR_TRANSITION.duration}s cubic-bezier(${APP_BAR_COLOR_TRANSITION.ease.join(",")})`;

	const innerProps: SmallAppBarInnerProps = {
		title,
		subtitle,
		titleAlignment,
		navigationIcon,
		actions,
		colors,
		currentBg,
		cssTransition,
	};

	const barHeight = AppBarTokens.heights.small;

	if (scrollBehavior !== "enterAlways") {
		return (
			<div
				className={cn("fixed top-0 inset-x-0 z-50", className)}
				style={{ height: barHeight }}
			>
				<SmallAppBarInner {...innerProps} />
			</div>
		);
	}

	return (
		<AnimatePresence initial={false}>
			{!isHidden && (
				<m.div
					key="small-app-bar"
					initial={{ y: "-100%" }}
					animate={{ y: 0 }}
					exit={{ y: "-100%" }}
					transition={
						shouldReduceMotion ? { duration: 0 } : APP_BAR_ENTER_ALWAYS_SPRING
					}
					className={cn("fixed top-0 inset-x-0 z-50", className)}
					style={{ height: barHeight }}
				>
					<SmallAppBarInner {...innerProps} />
				</m.div>
			)}
		</AnimatePresence>
	);
}
