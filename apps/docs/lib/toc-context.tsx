"use client";

import { createContext, useCallback, useContext, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TocItem {
	id: string;
	label: string;
}

interface TocContextType {
	/** Current TOC items — empty when page has no headings */
	items: TocItem[];
	/** Replace the current TOC items (called by page-level client component) */
	setItems: (items: TocItem[]) => void;
	/** Whether the mobile TOC drawer is open */
	isTocDrawerOpen: boolean;
	/** Toggle the mobile TOC drawer */
	toggleTocDrawer: () => void;
	/** Close the mobile TOC drawer */
	closeTocDrawer: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const TocContext = createContext<TocContextType | undefined>(undefined);

export function TocProvider({ children }: { children: React.ReactNode }) {
	const [items, setItemsState] = useState<TocItem[]>([]);
	const [isTocDrawerOpen, setIsTocDrawerOpen] = useState(false);

	const setItems = useCallback((next: TocItem[]) => {
		setItemsState(next);
	}, []);

	const toggleTocDrawer = useCallback(() => {
		setIsTocDrawerOpen((prev) => !prev);
	}, []);

	const closeTocDrawer = useCallback(() => {
		setIsTocDrawerOpen(false);
	}, []);

	return (
		<TocContext.Provider
			value={{
				items,
				setItems,
				isTocDrawerOpen,
				toggleTocDrawer,
				closeTocDrawer,
			}}
		>
			{children}
		</TocContext.Provider>
	);
}

export function useToc() {
	const context = useContext(TocContext);
	if (!context) {
		throw new Error("useToc must be used within a TocProvider");
	}
	return context;
}
