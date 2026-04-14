/**
 * @file search-bar.tsx
 * MD3 Expressive SearchBar — Collapsed state.
 *
 * Renders a pill-shaped search bar (CornerFull, h-56px).
 * When focused/clicked → calls onActiveChange(true) to open SearchView.
 *
 * Option B (MD3 morphing): SearchBar is wrapped in its own AnimatePresence
 * with mode="popLayout". When SearchView opens, SearchBar plays an exit
 * animation (opacity → 0, scale → 0.95) before unmounting, releasing the
 * shared layoutId so SearchView can claim it and morph from the same origin.
 *
 * Role: combobox (WAI-ARIA Search Combobox pattern).
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { AnimatedPlaceholder } from "./animated-placeholder";
import {
	SEARCH_BAR_EXIT_SPRING,
	SEARCH_BAR_EXPAND_SPRING,
	SEARCH_COLORS,
	SearchTokens,
} from "./search.tokens";
import type { SearchInternalProps, SearchProps } from "./search.types";

/** Default search icon (Material Symbols). */
function DefaultSearchIcon() {
	return (
		<span
			className="material-symbols-rounded select-none leading-none"
			style={{ fontSize: SearchTokens.iconSize }}
			aria-hidden="true"
		>
			search
		</span>
	);
}

type SearchBarProps = Pick<
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
	| "className"
	| "aria-label"
> &
	SearchInternalProps & {
		/** KeyDown handler from useSearchKeyboard. */
		onKeyDown: (e: React.KeyboardEvent) => void;
		/** Currently highlighted suggestion index (-1 = none). */
		activeIndex: number;
	};

/**
 * SearchBar — collapsed state of the MD3 Search component.
 *
 * Uses Framer Motion `layout` + shared `layoutId` to morph into
 * SearchView when active. Wrapped in AnimatePresence with mode="popLayout"
 * so it exits (fades/scales out) before SearchView claims the layoutId.
 */
export function SearchBar({
	query,
	onQueryChange,
	onSearch,
	active,
	onActiveChange,
	leadingIcon,
	trailingIcon,
	placeholder = "Search",
	textAlign = "left",
	className,
	"aria-label": ariaLabel = "Search",
	searchId,
	listboxId,
	onKeyDown,
	activeIndex,
}: SearchBarProps) {
	const shouldReduceMotion = useReducedMotion();
	const inputRef = React.useRef<HTMLInputElement>(null);

	const prevActiveRef = React.useRef(active);

	const isRestoringFocusRef = React.useRef(false);

	// When SearchView opens, focus moves to SearchView's input.
	// When SearchView closes (true → false), restore focus here.
	React.useEffect(() => {
		let rafId: number;
		if (prevActiveRef.current === true && active === false) {
			isRestoringFocusRef.current = true;
			inputRef.current?.focus();
			// Reset after a tick to allow the focus event to fire
			rafId = requestAnimationFrame(() => {
				isRestoringFocusRef.current = false;
			});
		}
		prevActiveRef.current = active;
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [active]);

	const handleFocus = () => {
		if (!active && !isRestoringFocusRef.current) {
			onActiveChange(true);
		}
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query);
	};

	// aria-activedescendant points to the highlighted suggestion
	const activeDescendant =
		activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

	return (
		/*
		 * AnimatePresence mode="popLayout":
		 * When SearchView opens (active=true), SearchBar plays its exit animation
		 * first, then unmounts — releasing the shared layoutId for SearchView to
		 * claim and morph from the pill shape.
		 */
		<AnimatePresence mode="popLayout">
			{!active && (
				<m.div
					key={searchId}
					layout={!shouldReduceMotion}
					layoutId={shouldReduceMotion ? undefined : searchId}
					transition={shouldReduceMotion ? undefined : SEARCH_BAR_EXPAND_SPRING}
					className={cn("relative", className)}
					style={{ height: SearchTokens.heights.bar }}
					initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={
						shouldReduceMotion
							? {}
							: { opacity: 0, scale: 0.95, transition: SEARCH_BAR_EXIT_SPRING }
					}
				>
					{/* Background layer — rounded-full per SearchBarTokens.ContainerShape */}
					<div
						className="absolute inset-0 rounded-full"
						style={{ backgroundColor: SEARCH_COLORS.container }}
						aria-hidden="true"
					/>

					{/* <search> is the semantic element for role="search" */}
					<search
						aria-label={ariaLabel}
						className="relative flex h-full items-center gap-2 rounded-full px-4"
					>
						<form className="contents" onSubmit={handleFormSubmit}>
							<span
								className="flex shrink-0 items-center justify-center"
								style={{ color: SEARCH_COLORS.leadingIcon }}
								aria-hidden="true"
							>
								{leadingIcon ?? <DefaultSearchIcon />}
							</span>

							{/* AnimatedPlaceholder wraps the input to provide a smooth
							    translateX animation from textAlign → left on focus. */}
							<AnimatedPlaceholder
								text={placeholder}
								textAlign={textAlign}
								visible={!query}
								focused={active}
							>
								{/* role="combobox" per WAI-ARIA combobox pattern */}
								<input
									ref={inputRef}
									id={searchId}
									type="search"
									role="combobox"
									aria-expanded={active}
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
									onFocus={handleFocus}
									onChange={(e) => onQueryChange(e.target.value)}
									onKeyDown={onKeyDown}
								/>
							</AnimatedPlaceholder>

							{trailingIcon && (
								<span
									className="flex shrink-0 items-center justify-center"
									style={{ color: SEARCH_COLORS.trailingIcon }}
									aria-hidden="true"
								>
									{trailingIcon}
								</span>
							)}
						</form>
					</search>
				</m.div>
			)}
		</AnimatePresence>
	);
}
