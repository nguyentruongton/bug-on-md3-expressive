/**
 * @file search-app-bar.tsx
 * MD3 Expressive Search App Bar.
 *
 * New variant in MD3 Expressive (May 2025).
 * Replaces the title area with a pill-shaped search bar.
 * Uses Framer Motion layoutId to enable shared element transition with <SearchView>.
 *
 * @see docs/m3/app-bars/AppBar.kt — SearchAppBar
 */

import { m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import {
	APP_BAR_COLOR_TRANSITION,
	APP_BAR_COLORS,
	AppBarTokens,
} from "./app-bar.tokens";
import type { SearchAppBarProps } from "./app-bar.types";
import { useAppBarScroll } from "./hooks/use-app-bar-scroll";

/** Built-in search icon (Material Symbols) used as default. */
function SearchIcon({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"material-symbols-rounded text-[20px] leading-none select-none",
				className,
			)}
			aria-hidden="true"
		>
			search
		</span>
	);
}

/**
 * MD3 Expressive Search App Bar.
 *
 * When the search bar is clicked, callers should open a `<SearchView>` overlay.
 * Uses Framer Motion `layoutId` (via `searchBarId`) for a smooth shared-element
 * transition between this bar and the search view.
 *
 * @example
 * ```tsx
 * const [searchOpen, setSearchOpen] = useState(false);
 *
 * <SearchAppBar
 *   searchBarId="main-search"
 *   searchPlaceholder="Search messages..."
 *   onSearchFocus={() => setSearchOpen(true)}
 *   trailingSearchActions={
 *     <IconButton aria-label="Voice search"><Icon>mic</Icon></IconButton>
 *   }
 *   externalActions={<Avatar src={user.avatar} />}
 * />
 *
 * <AnimatePresence>
 *   {searchOpen && (
 *     <SearchView
 *       searchBarId="main-search"
 *       onClose={() => setSearchOpen(false)}
 *     />
 *   )}
 * </AnimatePresence>
 * ```
 */
export function SearchAppBar({
	searchPlaceholder = "Search",
	searchValue,
	onSearchFocus,
	leadingSearchIcon,
	trailingSearchActions,
	externalActions,
	navigationIcon,
	colors,
	scrollBehavior = "pinned",
	scrollElement,
	searchBarId = "search-bar",
	className,
}: SearchAppBarProps) {
	const shouldReduceMotion = useReducedMotion();
	const [isSearchOpen, setIsSearchOpen] = React.useState(false);

	const { isScrolled } = useAppBarScroll({
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

	const handleSearchClick = () => {
		setIsSearchOpen(true);
		onSearchFocus?.();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleSearchClick();
		}
	};

	return (
		<m.header
			role="banner"
			className={cn(
				"fixed top-0 inset-x-0 z-50 flex items-center gap-2 px-4",
				className,
			)}
			style={{
				height: AppBarTokens.heights.small,
				backgroundColor: currentBg,
				transition: cssTransition,
			}}
		>
			{/* Optional navigation icon — leading edge */}
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
				layoutId={shouldReduceMotion ? undefined : searchBarId}
				role="search"
				aria-label={searchPlaceholder}
				aria-expanded={isSearchOpen}
				tabIndex={0}
				className="relative flex flex-1 items-center gap-2 rounded-full cursor-text h-10 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				onClick={handleSearchClick}
				onKeyDown={handleKeyDown}
			>
				<div className="absolute inset-0 rounded-full bg-m3-surface-container-high -z-10" />
				<span
					className="shrink-0"
					style={{ color: APP_BAR_COLORS.searchBarContent }}
				>
					{leadingSearchIcon ?? <SearchIcon />}
				</span>

				<span
					className="flex-1 text-[16px] leading-6 truncate select-none"
					style={{ color: APP_BAR_COLORS.searchBarContent }}
				>
					{searchValue ?? searchPlaceholder}
				</span>

				{trailingSearchActions && (
					<div className="flex items-center shrink-0">
						{trailingSearchActions}
					</div>
				)}
			</m.div>

			{externalActions && (
				<div className="flex items-center shrink-0">{externalActions}</div>
			)}
		</m.header>
	);
}
