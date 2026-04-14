/**
 * @file index.ts
 * MD3 Expressive Search — Public API exports.
 *
 * Components:
 * - Search: Orchestrator (SearchBar + SearchView)
 * - SearchBar: Collapsed pill state (standalone use)
 * - SearchViewDocked: Expanded docked popup (standalone use)
 * - SearchViewFullScreen: Expanded full-screen overlay (standalone use)
 *
 * Hook:
 * - useSearchKeyboard: WAI-ARIA combobox keyboard navigation
 *
 * Tokens:
 * - SearchTokens: Dimensional tokens (heights, sizes)
 * - SEARCH_COLORS: CSS custom property color references
 * - SEARCH_TYPOGRAPHY: Typography class strings
 * - Animation constants
 */

export { useSearchKeyboard } from "./hooks/use-search-keyboard";
// ─── Components ───────────────────────────────────────────────────────────────
export { Search } from "./search";
// ─── Tokens ───────────────────────────────────────────────────────────────────
export {
	SEARCH_BAR_EXIT_SPRING,
	SEARCH_BAR_EXPAND_SPRING,
	SEARCH_COLORS,
	SEARCH_DOCKED_REVEAL_SPRING,
	SEARCH_FULLSCREEN_SPRING,
	SEARCH_TYPOGRAPHY,
	SearchTokens,
} from "./search.tokens";
// ─── Types ────────────────────────────────────────────────────────────────────
export type {
	SearchProps,
	SearchStyleType,
	SearchVariant,
} from "./search.types";
export { SearchBar } from "./search-bar";
// ─── Hook ─────────────────────────────────────────────────────────────────────
export { useSearch } from "./search-context";
export { SearchViewDocked } from "./search-view-docked";
export { SearchViewFullScreen } from "./search-view-fullscreen";
