/**
 * @file large-flexible-app-bar.tsx
 * MD3 Expressive Large Flexible App Bar.
 *
 * Like MediumFlexibleAppBar but with larger typography.
 * Expanded height: 120px (no subtitle) / 152px (with subtitle)
 * Collapsed height: 64px
 * Title crossfade: DisplaySmall (expanded) ↔ TitleLarge (collapsed)
 *
 * @see docs/m3/app-bars/AppBarLargeFlexibleTokens.kt
 */

import { m } from "motion/react";
import { cn } from "../../lib/utils";
import {
	APP_BAR_COLORS,
	AppBarTokens,
	appBarTypography,
} from "./app-bar.tokens";
import type { FlexibleAppBarProps } from "./app-bar.types";
import { useFlexibleAppBar } from "./hooks/use-flexible-app-bar";

/**
 * MD3 Expressive Large Flexible App Bar.
 *
 * @example
 * ```tsx
 * <LargeFlexibleAppBar
 *   title="Discover"
 *   subtitle="Trending today"
 *   navigationIcon={<IconButton aria-label="Open menu"><Icon>menu</Icon></IconButton>}
 *   headerContent={<img src="/banner.jpg" alt="" className="rounded-xl h-20 w-full object-cover" />}
 * />
 * ```
 */
export function LargeFlexibleAppBar({
	title,
	subtitle,
	titleAlignment = "start",
	navigationIcon,
	actions,
	colors,
	scrollElement,
	headerContent,
	collapsedHeight = AppBarTokens.heights.flexibleCollapsed,
	expandedHeight,
	className,
}: FlexibleAppBarProps) {
	const resolvedExpandedHeight =
		expandedHeight ??
		(subtitle
			? AppBarTokens.heights.largeFlexWithSubtitleExpanded
			: AppBarTokens.heights.largeFlexExpanded);

	const {
		height,
		currentBg,
		cssTransition,
		largeTitleOpacity,
		largeTitleY,
		smallTitleOpacity,
		subtitleOpacity,
		headerContentOpacity,
	} = useFlexibleAppBar({
		collapsedHeight,
		expandedHeight: resolvedExpandedHeight,
		scrollElement,
		colors,
		largeTitleFadeRange: [0, 0.35],
		smallTitleFadeRange: [0.55, 0.95],
		subtitleFadeRange: [0, 0.25],
		headerContentFadeRange: [0, 0.2],
		largeTitleYRange: [0, 12],
	});

	const isCentered = titleAlignment === "center";

	return (
		<m.header
			role="banner"
			className={cn(
				"fixed top-0 inset-x-0 z-50 flex flex-col overflow-hidden",
				className,
			)}
			style={{ height, backgroundColor: currentBg, transition: cssTransition }}
		>
			<div
				className="flex items-center px-1 shrink-0"
				style={{ height: collapsedHeight }}
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

				<m.div
					className={cn("flex-1 min-w-0", !navigationIcon && "pl-4")}
					style={{ opacity: smallTitleOpacity }}
					aria-hidden="true"
				>
					<span
						className={cn(
							appBarTypography.titleLarge,
							"truncate block",
							isCentered && "text-center",
						)}
						style={{ color: colors?.titleColor ?? APP_BAR_COLORS.title }}
					>
						{title}
					</span>
				</m.div>

				{actions && <div className="flex items-center shrink-0">{actions}</div>}
			</div>

			<div
				className={cn(
					"flex flex-col flex-1 px-4 pb-4 justify-end",
					isCentered ? "items-center" : "items-start",
				)}
			>
				<m.span
					className={cn(appBarTypography.displaySmall, "truncate w-full")}
					style={{
						opacity: largeTitleOpacity,
						y: largeTitleY,
						color: colors?.titleColor ?? APP_BAR_COLORS.title,
						...(isCentered && { textAlign: "center" }),
					}}
				>
					{title}
				</m.span>

				{subtitle && (
					<m.span
						className={cn(appBarTypography.titleMedium, "truncate w-full")}
						style={{
							opacity: subtitleOpacity,
							color: colors?.subtitleColor ?? APP_BAR_COLORS.subtitle,
							...(isCentered && { textAlign: "center" }),
						}}
					>
						{subtitle}
					</m.span>
				)}

				{headerContent && (
					<m.div
						className="mt-3 w-full"
						style={{ opacity: headerContentOpacity }}
					>
						{headerContent}
					</m.div>
				)}
			</div>
		</m.header>
	);
}
