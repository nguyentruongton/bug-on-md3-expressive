/**
 * @file search-view-docked.tsx
 * MD3 Expressive SearchView — Docked variant.
 *
 * Displays as a popup dropdown below the SearchBar.
 * Recommended for medium and large screens (tablets, desktops).
 *
 * Shape: CornerExtraLarge (rounded-[28px]) per SearchViewTokens.DockedContainerShape.
 * Header height: 56dp per SearchViewTokens.DockedHeaderContainerHeight.
 *
 * Animation (Option B — MD3 morphing):
 * - Shares `layoutId` with SearchBar. After SearchBar exits via its own
 *   AnimatePresence (mode="popLayout"), this view claims the layoutId and
 *   Framer Motion morphs the pill shape → rounded-[28px] container.
 * - Uses mode="popLayout" so SearchBar can re-enter after this exits.
 * - Focus: double-rAF pattern syncs focus with layout animation frame.
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../lib/utils";
import { AnimatedPlaceholder } from "./animated-placeholder";
import { useSearchViewFocus } from "./hooks/use-search-view-focus";
import {
	SEARCH_COLORS,
	SEARCH_DOCKED_REVEAL_SPRING,
	SearchTokens,
} from "./search.tokens";
import type { SearchInternalProps, SearchProps } from "./search.types";
import { TrailingAction } from "./trailing-action";

type SearchViewDockedProps = Pick<
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
	| "hasGap"
	| "children"
	| "viewClassName"
	| "aria-label"
> &
	SearchInternalProps & {
		onKeyDown: (e: React.KeyboardEvent) => void;
		activeIndex: number;
	};

export function SearchViewDocked({
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
	hasGap = false,
	children,
	viewClassName,
	"aria-label": ariaLabel = "Search",
	searchId,
	listboxId,
	onKeyDown,
	activeIndex,
}: SearchViewDockedProps) {
	const shouldReduceMotion = useReducedMotion();
	const inputRef = React.useRef<HTMLInputElement>(null);

	useSearchViewFocus(inputRef, active);

	const dropdownRef = useClickOutside<HTMLDivElement>(() => {
		onActiveChange(false);
	}, active);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query);
	};

	const activeDescendant =
		activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

	return (
		/*
		 * mode="popLayout": when SearchView exits, it plays exit animation first,
		 * then unmounts — freeing the layoutId for SearchBar to re-enter and morph back.
		 */
		<AnimatePresence mode="popLayout">
			{active && (
				<m.div
					ref={dropdownRef}
					key={`${searchId}-view`}
					layoutId={shouldReduceMotion ? undefined : searchId}
					className={cn(
						// DockedContainerShape = CornerExtraLarge = 28dp radius
						"rounded-[28px] overflow-hidden",
						viewClassName,
					)}
					style={{ backgroundColor: SEARCH_COLORS.container }}
					initial={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
					transition={
						shouldReduceMotion ? { duration: 0 } : SEARCH_DOCKED_REVEAL_SPRING
					}
				>
					{/* Header row — h-56px per DockedHeaderContainerHeight */}
					<search
						aria-label={ariaLabel}
						className="flex items-center gap-2 px-4"
						style={{ height: SearchTokens.heights.dockedHeader }}
					>
						<form className="contents" onSubmit={handleFormSubmit}>
							<span
								className="flex shrink-0 items-center justify-center"
								style={{ color: SEARCH_COLORS.leadingIcon }}
								aria-hidden="true"
							>
								{leadingIcon}
							</span>

							<AnimatedPlaceholder
								text={placeholder}
								textAlign={textAlign}
								visible={!query}
								focused={active}
							>
								<input
									ref={inputRef}
									id={`${searchId}-view`}
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

					{/* hasGap: 2dp gap between header and results. */}
					{hasGap && children && <div className="h-0.5" aria-hidden="true" />}

					{/* Divider for "divided" styleType */}
					{styleType === "divided" && children && (
						<hr
							className="border-0 border-t"
							style={{ borderColor: SEARCH_COLORS.divider }}
						/>
					)}

					{/* Results / Suggestions listbox */}
					{children && (
						<div
							id={listboxId}
							role="listbox"
							aria-label={`${ariaLabel} results`}
							className="min-h-30"
						>
							{children}
						</div>
					)}
				</m.div>
			)}
		</AnimatePresence>
	);
}
