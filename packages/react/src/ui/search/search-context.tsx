import * as React from "react";

/**
 * MD3 Expressive Search Context
 * Shared state for the Search orchestrator and its children.
 */
interface SearchContextValue {
	/** Unique ID for the results listbox, used for aria-controls. */
	listboxId: string;
	/** Currently highlighted suggestion index. -1 = none. */
	activeIndex: number;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

/**
 * Provider for Search component state.
 * Internal use only within the library.
 */
export function SearchProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: SearchContextValue;
}) {
	return (
		<SearchContext.Provider value={value}>{children}</SearchContext.Provider>
	);
}

/**
 * Hook to access Search state from children (e.g., search items).
 */
export function useSearch() {
	const context = React.useContext(SearchContext);
	if (!context) {
		// If used outside Search, return defaults instead of throwing to avoid crashing simple use cases
		return { listboxId: "", activeIndex: -1 };
	}
	return context;
}
