/**
 * @file use-search-keyboard.ts
 * Keyboard navigation hook for the MD3 Search component.
 *
 * Handles:
 * - ArrowDown / ArrowUp → navigate through suggestions (role="option")
 * - Enter → submit search or select active suggestion
 * - Escape → close the SearchView
 */

import * as React from "react";
import type { UseSearchKeyboardReturn } from "../search.types";

interface UseSearchKeyboardOptions {
	/** Whether the SearchView is currently open. */
	active: boolean;
	/** Callback to close the SearchView. */
	onActiveChange: (active: boolean) => void;
	/** Callback for search submission. */
	onSearch: (query: string) => void;
	/** Current search query. */
	query: string;
	/** Total number of suggestion items in the listbox. */
	itemCount: number;
	/** Called when user selects a specific suggestion by index. */
	onSelectSuggestion?: (index: number) => void;
}

/**
 * Manages keyboard navigation for the Search component.
 *
 * Complies with WAI-ARIA Combobox pattern:
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export function useSearchKeyboard({
	active,
	onActiveChange,
	onSearch,
	query,
	itemCount,
	onSelectSuggestion,
}: UseSearchKeyboardOptions): UseSearchKeyboardReturn {
	const [activeIndex, setActiveIndex] = React.useState(-1);

	// Reset active index when SearchView closes or query changes.
	// Done during render phase to prevent double-renders on every keystroke,
	// which would otherwise cause severe layout thrashing.
	const resetKeyRef = React.useRef(`${active}:${query}`);
	const currentKey = `${active}:${query}`;
	if (resetKeyRef.current !== currentKey) {
		resetKeyRef.current = currentKey;
		setActiveIndex(-1);
	}

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			if (!active) return;

			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					setActiveIndex((i) => (i < itemCount - 1 ? i + 1 : i));
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					setActiveIndex((i) => (i > -1 ? i - 1 : -1));
					break;
				}
				case "Enter": {
					e.preventDefault();
					if (activeIndex >= 0 && onSelectSuggestion) {
						onSelectSuggestion(activeIndex);
					} else {
						onSearch(query);
					}
					break;
				}
				case "Escape": {
					e.preventDefault();
					onActiveChange(false);
					break;
				}
				default:
					break;
			}
		},
		[
			active,
			activeIndex,
			itemCount,
			onActiveChange,
			onSearch,
			onSelectSuggestion,
			query,
		],
	);

	const resetActiveIndex = React.useCallback(() => {
		setActiveIndex(-1);
	}, []);

	return { activeIndex, handleKeyDown, resetActiveIndex };
}
