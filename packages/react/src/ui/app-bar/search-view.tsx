/**
 * @file search-view.tsx
 * MD3 Expressive Search View.
 *
 * Full-screen overlay activated when a SearchAppBar's search bar is clicked.
 * Shares a Framer Motion `layoutId` with the SearchAppBar search bar for a
 * smooth shared element transition.
 *
 * Usage pattern:
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * // In render:
 * <SearchAppBar searchBarId="main" onSearchFocus={() => setOpen(true)} />
 * <AnimatePresence>
 *   {open && <SearchView searchBarId="main" onClose={() => setOpen(false)} />}
 * </AnimatePresence>
 * ```
 *
 * Design notes:
 * - The SearchView is intentionally separate from SearchAppBar to allow consumers
 *   to customize the results/suggestions content without coupling.
 * - The `searchBarId` prop must match between SearchAppBar and SearchView to
 *   enable the shared element transition.
 * - Focus is moved to the search input when the view opens.
 * - Escape key closes the view and returns focus to the search bar.
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import {
	APP_BAR_COLORS,
	AppBarTokens,
	SEARCH_VIEW_SPRING,
} from "./app-bar.tokens";
import type { SearchViewProps } from "./app-bar.types";

/** Built-in back arrow icon. */
function ArrowBackIcon() {
	return (
		<span
			className="material-symbols-rounded text-[24px] leading-none select-none"
			aria-hidden="true"
		>
			arrow_back
		</span>
	);
}

/** Built-in clear icon. */
function CloseIcon() {
	return (
		<span
			className="material-symbols-rounded text-[24px] leading-none select-none"
			aria-hidden="true"
		>
			close
		</span>
	);
}

/**
 * MD3 Expressive Search View.
 *
 * Renders a full-screen search overlay with a shared element transition
 * from the triggering `<SearchAppBar>` search bar.
 *
 * Mount/unmount this component via `<AnimatePresence>` in the consumer.
 */
export function SearchView({
	searchBarId = "search-bar",
	value = "",
	onChange,
	onClose,
	placeholder = "Search",
	children,
	leadingIcon,
	trailingAction,
	className,
}: SearchViewProps) {
	const shouldReduceMotion = useReducedMotion();
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Move focus to the search input when the view opens
	React.useEffect(() => {
		const timer = window.setTimeout(() => {
			inputRef.current?.focus();
		}, 50);
		return () => window.clearTimeout(timer);
	}, []);

	// Close on Escape key
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	const viewTransition = shouldReduceMotion
		? { duration: 0 }
		: SEARCH_VIEW_SPRING;

	return (
		<m.div
			role="dialog"
			aria-modal="true"
			aria-label="Search"
			className={cn(
				"fixed inset-0 z-60 flex flex-col bg-m3-surface",
				className,
			)}
			initial={shouldReduceMotion ? {} : { opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={shouldReduceMotion ? {} : { opacity: 0 }}
			transition={viewTransition}
			onKeyDown={handleKeyDown}
		>
			{/* Search Bar — matches layoutId of SearchAppBar search bar */}
			<m.div
				layoutId={shouldReduceMotion ? undefined : searchBarId}
				className="flex items-center gap-2 px-4 shrink-0 bg-m3-surface"
				style={{
					height: AppBarTokens.heights.small,
				}}
			>
				{/* Leading: back button or custom icon */}
				<button
					type="button"
					className={cn(
						"shrink-0 flex items-center justify-center rounded-full",
						"focus-visible:outline-none focus-visible:ring-2",
					)}
					style={{
						width: AppBarTokens.iconButtonTouchTarget,
						height: AppBarTokens.iconButtonTouchTarget,
						color: APP_BAR_COLORS.navigationIcon,
					}}
					aria-label="Close search"
					onClick={onClose}
				>
					{leadingIcon ?? <ArrowBackIcon />}
				</button>

				{/* Search input */}
				<div
					className="relative flex flex-1 items-center rounded-full px-4 gap-2"
					style={{
						height: 40,
					}}
				>
					{/* Background Layer */}
					<div className="absolute inset-0 rounded-full bg-m3-surface-container-high -z-10" />
					<input
						ref={inputRef}
						aria-label={placeholder}
						type="search"
						value={value}
						onChange={(e) => onChange?.(e.target.value)}
						placeholder={placeholder}
						className={cn(
							"flex-1 bg-transparent border-none outline-none",
							"text-[16px] leading-6",
							"placeholder:text-m3-on-surface-variant",
						)}
						style={{ color: APP_BAR_COLORS.title }}
					/>

					{/* Clear button — show when there's a value */}
					{value && (
						<button
							type="button"
							className={cn(
								"shrink-0 flex items-center justify-center rounded-full",
								"focus-visible:outline-none focus-visible:ring-2",
							)}
							style={{
								width: 40,
								height: 40,
								color: APP_BAR_COLORS.searchBarContent,
							}}
							aria-label="Clear search"
							onClick={() => onChange?.("")}
						>
							{trailingAction ?? <CloseIcon />}
						</button>
					)}
				</div>
			</m.div>

			{/* Results / suggestions area */}
			{children && (
				<m.div
					className="flex-1 overflow-y-auto"
					initial={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.15 }}
				>
					{children}
				</m.div>
			)}
		</m.div>
	);
}

/**
 * Convenience wrapper that handles the AnimatePresence + open state.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   isOpen={searchOpen}
 *   onClose={() => setSearchOpen(false)}
 *   searchBarId="main-search"
 * >
 *   <SearchResultsList results={results} />
 * </SearchBar>
 * ```
 */
export function SearchViewContainer({
	isOpen,
	...props
}: SearchViewProps & { isOpen: boolean }) {
	return (
		<AnimatePresence>{isOpen && <SearchView {...props} />}</AnimatePresence>
	);
}
