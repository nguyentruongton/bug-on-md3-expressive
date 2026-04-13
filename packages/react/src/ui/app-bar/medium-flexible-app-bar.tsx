/**
 * @file medium-flexible-app-bar.tsx
 * MD3 Expressive Medium Flexible App Bar.
 *
 * Two-row layout in expanded state, collapses to single row on scroll.
 * Expanded height: 112px (no subtitle) / 136px (with subtitle)
 * Collapsed height: 64px
 * Title crossfade: HeadlineMedium (expanded) ↔ TitleLarge (collapsed)
 *
 * Supports `exitUntilCollapsed` scroll behavior only.
 *
 * @see docs/m3/app-bars/AppBarMediumFlexibleTokens.kt
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
 * MD3 Expressive Medium Flexible App Bar.
 *
 * @example
 * ```tsx
 * <MediumFlexibleAppBar
 *   title="Settings"
 *   subtitle="Manage your preferences"
 *   navigationIcon={<IconButton aria-label="Go back"><Icon>arrow_back</Icon></IconButton>}
 *   actions={<IconButton aria-label="More options"><Icon>more_vert</Icon></IconButton>}
 * />
 * ```
 */
export function MediumFlexibleAppBar({
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
			? AppBarTokens.heights.mediumFlexWithSubtitleExpanded
			: AppBarTokens.heights.mediumFlexExpanded);

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
		largeTitleFadeRange: [0, 0.4],
		smallTitleFadeRange: [0.5, 0.9],
		subtitleFadeRange: [0, 0.3],
		headerContentFadeRange: [0, 0.25],
		largeTitleYRange: [0, 8],
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
					className={cn(
						"flex-1 min-w-0",
						isCentered ? "text-center" : "text-start",
						!navigationIcon && "pl-4",
					)}
					style={{ opacity: smallTitleOpacity }}
					aria-hidden="true"
				>
					<span
						className={cn(appBarTypography.titleLarge, "truncate block")}
						style={{ color: colors?.titleColor ?? APP_BAR_COLORS.title }}
					>
						{title}
					</span>
				</m.div>

				{actions && <div className="flex items-center shrink-0">{actions}</div>}
			</div>

			<div
				className={cn(
					"flex flex-col flex-1 px-4 pb-3 justify-end",
					isCentered ? "items-center" : "items-start",
				)}
			>
				<m.span
					className={cn(appBarTypography.headlineMedium, "truncate w-full")}
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
						className={cn(appBarTypography.labelLarge, "truncate w-full")}
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
						className="mt-2 w-full"
						style={{ opacity: headerContentOpacity }}
					>
						{headerContent}
					</m.div>
				)}
			</div>
		</m.header>
	);
}
