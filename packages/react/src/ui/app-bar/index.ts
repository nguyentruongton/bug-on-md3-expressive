/**
 * @file index.ts
 * MD3 Expressive App Bar — Public API exports.
 *
 * Components:
 * - SmallAppBar: Single-row, 64px height, TitleLarge
 * - MediumFlexibleAppBar: Collapsible, HeadlineMedium → TitleLarge
 * - LargeFlexibleAppBar: Collapsible, DisplaySmall → TitleLarge
 * - SearchAppBar: Pill search bar with layoutId for SearchView transition
 * - SearchView: Full-screen search overlay
 * - SearchViewContainer: Wraps SearchView with AnimatePresence
 * - BottomAppBar: Fixed bottom nav with optional FAB
 * - DockedToolbar: Secondary navigation bar
 * - AppBarRow: Horizontal actions with overflow
 * - AppBarColumn: Vertical actions with overflow
 * - AppBarOverflowIndicator: More-vert dropdown trigger
 *
 * Hook:
 * - useAppBarScroll: Drives scroll-based behavior (pinned / enterAlways / exitUntilCollapsed)
 *
 * Tokens:
 * - AppBarTokens: Dimensional tokens (heights, spacing)
 * - appBarTypography: Typography class strings
 * - APP_BAR_COLORS: CSS custom property color references
 * - Animation constants (APP_BAR_COLOR_TRANSITION, etc.)
 */

// ─── Tokens ───────────────────────────────────────────────────────────────────
export {
	APP_BAR_BOTTOM_SPRING,
	APP_BAR_COLOR_TRANSITION,
	APP_BAR_COLORS,
	APP_BAR_ENTER_ALWAYS_SPRING,
	APP_BAR_TITLE_FADE,
	AppBarTokens,
	appBarTypography,
	SEARCH_VIEW_SPRING,
} from "./app-bar.tokens";
// ─── Types ────────────────────────────────────────────────────────────────────
export type {
	AppBarColors,
	AppBarColumnProps,
	AppBarItem,
	AppBarItemType,
	AppBarMenuState,
	AppBarOverflowIndicatorProps,
	AppBarRowProps,
	AppBarScrollBehavior,
	BaseAppBarProps,
	BottomAppBarProps,
	DockedToolbarProps,
	FlexibleAppBarProps,
	SearchAppBarProps,
	SearchBarVariant,
	SearchViewProps,
	SmallAppBarProps,
	TitleAlignment,
	UseAppBarScrollReturn,
} from "./app-bar.types";
export { AppBarColumn } from "./app-bar-column";
export { AppBarOverflowIndicator } from "./app-bar-overflow-indicator";
export { AppBarRow } from "./app-bar-row";
export { BottomAppBar } from "./bottom-app-bar";
export { DockedToolbar } from "./docked-toolbar";
// ─── Hook ─────────────────────────────────────────────────────────────────────
export { useAppBarScroll } from "./hooks/use-app-bar-scroll";
export { LargeFlexibleAppBar } from "./large-flexible-app-bar";
export { MediumFlexibleAppBar } from "./medium-flexible-app-bar";
export { SearchAppBar } from "./search-app-bar";
export { SearchView, SearchViewContainer } from "./search-view";
// ─── Components ───────────────────────────────────────────────────────────────
export { SmallAppBar } from "./small-app-bar";
