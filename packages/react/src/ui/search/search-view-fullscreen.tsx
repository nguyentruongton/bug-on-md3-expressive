/**
 * @file search-view-fullscreen.tsx
 * MD3 Expressive SearchView — FullScreen variant.
 *
 * Renders a full-screen overlay via React Portal.
 * Using Portal avoids z-index stacking context issues and ensures
 * the overlay always covers the entire viewport correctly.
 *
 * Animation (Option B — MD3 morphing):
 * - Shares `layoutId` with SearchBar. After SearchBar exits via its own
 *   AnimatePresence (mode="popLayout"), this view claims the layoutId and
 *   Framer Motion morphs the pill shape → full-screen rect (CornerFull → CornerNone).
 * - mode="popLayout" on this AnimatePresence enables SearchBar to re-enter
 *   after this view exits.
 * - Focus: double-rAF pattern syncs focus with layout animation frame.
 *
 * Header height: 72dp per SearchViewTokens.FullScreenHeaderContainerHeight.
 * ESC key closes the view (handled by useSearchKeyboard).
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { IconButton } from "../icon-button";
import { AnimatedPlaceholder } from "./animated-placeholder";
import { useSearchViewFocus } from "./hooks/use-search-view-focus";
import {
	SEARCH_COLORS,
	SEARCH_FULLSCREEN_SPRING,
	SearchTokens,
} from "./search.tokens";
import type { SearchInternalProps, SearchProps } from "./search.types";
import { TrailingAction } from "./trailing-action";

/** Back arrow icon for FullScreen header. */
function ArrowBackIcon() {
	return (
		<span
			className="material-symbols-rounded select-none leading-none"
			style={{ fontSize: 24 }}
			aria-hidden="true"
		>
			arrow_back
		</span>
	);
}

type SearchViewFullScreenProps = Pick<
	SearchProps,
	| "query"
	| "onQueryChange"
	| "onSearch"
	| "active"
	| "onActiveChange"
	| "leadingIcon"
	| "trailingIcon"
	| "placeholder"
	| "textAlign"
	| "styleType"
	| "children"
	| "viewClassName"
	| "aria-label"
> &
	SearchInternalProps & {
		onKeyDown: (e: React.KeyboardEvent) => void;
		activeIndex: number;
	};

/**
 * SearchView FullScreen — full-screen overlay via React Portal.
 *
 * The `layoutId` shared with SearchBar enables Framer Motion to animate
 * the shape morphing from the pill (rounded-full) to a full-screen rect.
 *
 * Contained style: no divider, background preserved.
 * Divided style: HorizontalDivider between header and results.
 */
export function SearchViewFullScreen({
	query,
	onQueryChange,
	onSearch,
	active,
	onActiveChange,
	leadingIcon,
	trailingIcon,
	placeholder = "Search",
	textAlign = "left",
	styleType = "contained",
	children,
	viewClassName,
	"aria-label": ariaLabel = "Search",
	searchId,
	listboxId,
	onKeyDown,
	activeIndex,
}: SearchViewFullScreenProps) {
	const shouldReduceMotion = useReducedMotion();
	const inputRef = React.useRef<HTMLInputElement>(null);

	useSearchViewFocus(inputRef, active);

	// Avoid SSR mismatch — only portal on client.
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query);
	};

	const handleEscape = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			e.stopPropagation();
			onActiveChange(false);
		}
	};

	const activeDescendant =
		activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

	if (!mounted) return null;

	const content = (
		/*
		 * mode="popLayout": when FullScreen exits, it plays exit animation first,
		 * then unmounts — freeing the layoutId for SearchBar to re-enter and morph back
		 * to the pill shape.
		 */
		<AnimatePresence mode="popLayout">
			{active && (
				<m.div
					key={`${searchId}-fs`}
					layoutId={shouldReduceMotion ? undefined : searchId}
					role="dialog"
					aria-modal="true"
					aria-label={ariaLabel}
					className={cn(
						"fixed inset-0 z-50 flex flex-col overflow-hidden",
						// CornerNone — shape is resolved by Framer Motion layout animation
						"rounded-none",
						viewClassName,
					)}
					style={{ backgroundColor: SEARCH_COLORS.container }}
					initial={shouldReduceMotion ? {} : { opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={shouldReduceMotion ? {} : { opacity: 0 }}
					transition={
						shouldReduceMotion ? { duration: 0 } : SEARCH_FULLSCREEN_SPRING
					}
					onKeyDown={handleEscape}
				>
					{/* Header — h-72px per FullScreenHeaderContainerHeight */}
					<search
						aria-label={ariaLabel}
						className="flex shrink-0 items-center gap-2 px-4"
						style={{ height: SearchTokens.heights.fullScreenHeader }}
					>
						<form className="contents" onSubmit={handleFormSubmit}>
							<IconButton
								size="sm"
								style={{ color: SEARCH_COLORS.leadingIcon }}
								aria-label="Close search"
								onClick={(e) => {
									e.stopPropagation();
									onActiveChange(false);
								}}
							>
								{leadingIcon ?? <ArrowBackIcon />}
							</IconButton>

							<AnimatedPlaceholder
								text={placeholder}
								textAlign={textAlign}
								visible={!query}
								focused={active}
							>
								<input
									ref={inputRef}
									id={`${searchId}-fs`}
									type="search"
									role="combobox"
									aria-expanded={true}
									aria-controls={listboxId}
									aria-autocomplete="list"
									aria-activedescendant={activeDescendant}
									aria-label={placeholder}
									value={query}
									placeholder={placeholder}
									className={cn(
										"w-full bg-transparent border-none outline-none",
										"text-[16px] leading-6 font-normal tracking-[0.5px]",
										"placeholder:text-transparent",
									)}
									style={{ color: SEARCH_COLORS.inputText }}
									onChange={(e) => onQueryChange(e.target.value)}
									onKeyDown={onKeyDown}
								/>
							</AnimatedPlaceholder>

							<TrailingAction
								query={query}
								trailingIcon={trailingIcon}
								onClear={() => onQueryChange("")}
							/>
						</form>
					</search>

					{/* Divider for "divided" styleType */}
					{styleType === "divided" && (
						<hr
							className="border-0 border-t shrink-0"
							style={{ borderColor: SEARCH_COLORS.divider }}
						/>
					)}

					{/* Results / Suggestions listbox — scrollable area */}
					<div
						id={listboxId}
						role="listbox"
						tabIndex={0}
						aria-label={`${ariaLabel} results`}
						className="flex-1 overflow-y-auto outline-none"
						onClick={(e) => {
							if (e.target === e.currentTarget) onActiveChange(false);
						}}
						onKeyDown={(e) => {
							if (
								e.target === e.currentTarget &&
								(e.key === "Enter" || e.key === " ")
							) {
								e.preventDefault();
								onActiveChange(false);
							}
						}}
					>
						{children}
					</div>
				</m.div>
			)}
		</AnimatePresence>
	);

	return createPortal(content, document.body);
}
