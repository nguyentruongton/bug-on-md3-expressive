/**
 * @file app-bar.types.ts
 * MD3 Expressive App Bar — TypeScript prop definitions.
 * Spec: https://m3.material.io/components/app-bars/overview
 * Reference: docs/m3/app-bars/AppBar.kt (MD3 Expressive, May 2025)
 *
 * Note: Component name is "App Bar" (not "Top App Bar") per MD3 Expressive May 2025 rename.
 */

import type * as React from "react";

// ─── Scroll Behavior ─────────────────────────────────────────────────────────

/**
 * Controls how the App Bar responds to scroll events.
 *
 * - `pinned`: Always visible. Changes background color when scrolled.
 * - `enterAlways`: Hides when scrolling down, reveals when scrolling up.
 * - `exitUntilCollapsed`: Collapses from expandedHeight → collapsedHeight as user scrolls.
 */
export type AppBarScrollBehavior =
	| "pinned"
	| "enterAlways"
	| "exitUntilCollapsed";

// ─── Title Alignment ─────────────────────────────────────────────────────────

/** Horizontal alignment of the title (and subtitle) text. */
export type TitleAlignment = "start" | "center";

// ─── Color Overrides ─────────────────────────────────────────────────────────

/**
 * Optional color overrides for the App Bar.
 * All values should be CSS color strings (var(--md-sys-color-*) or hex).
 *
 * By default, App Bars use MD3 system color tokens automatically.
 */
export interface AppBarColors {
	/** Background when not scrolled. Default: `var(--md-sys-color-surface)` */
	containerColor?: string;
	/** Background when content has scrolled past top. Default: `var(--md-sys-color-surface-container)` */
	scrolledContainerColor?: string;
	/** Title text color. Default: `var(--md-sys-color-on-surface)` */
	titleColor?: string;
	/** Subtitle text color. Default: `var(--md-sys-color-on-surface-variant)` */
	subtitleColor?: string;
	/** Navigation icon color. Default: `var(--md-sys-color-on-surface)` */
	navigationIconColor?: string;
	/** Action icon color. Default: `var(--md-sys-color-on-surface-variant)` */
	actionIconColor?: string;
}

// ─── Base Props ──────────────────────────────────────────────────────────────

/**
 * Shared props for all top App Bar variants.
 */
export interface BaseAppBarProps {
	/**
	 * Navigation icon slot (typically IconButton with back arrow or hamburger).
	 * Should have `aria-label` for accessibility.
	 */
	navigationIcon?: React.ReactNode;
	/**
	 * Action icon slots rendered at the trailing end.
	 * Typically `<IconButton>` components. Use `<AppBarRow>` for overflow support.
	 */
	actions?: React.ReactNode;
	/** Optional color overrides. Defaults use MD3 system color tokens. */
	colors?: AppBarColors;
	/**
	 * Scroll behavior that controls how the App Bar reacts to scroll events.
	 * @default "pinned"
	 */
	scrollBehavior?: AppBarScrollBehavior;
	/**
	 * Ref to the scrollable element to observe.
	 * If not provided, listens to `window` scroll events.
	 */
	scrollElement?: React.RefObject<HTMLElement | null>;
	/** Additional CSS class applied to the root header element. */
	className?: string;
}

// ─── Small App Bar ────────────────────────────────────────────────────────────

/**
 * Props for `<SmallAppBar>`.
 *
 * Single-row layout with navigation icon, title, and action buttons.
 * Height: 64px. Title font: TitleLarge (22sp).
 */
export interface SmallAppBarProps extends BaseAppBarProps {
	/** The main title content. */
	title: React.ReactNode;
	/**
	 * Optional subtitle displayed below the title.
	 * Font: LabelMedium (12sp).
	 */
	subtitle?: React.ReactNode;
	/**
	 * Horizontal alignment of the title and subtitle.
	 * When `center`: title is centered, nav icon and actions balance both sides.
	 * @default "start"
	 */
	titleAlignment?: TitleAlignment;
}

// ─── Flexible App Bars ────────────────────────────────────────────────────────

/**
 * Props for `<MediumFlexibleAppBar>` and `<LargeFlexibleAppBar>`.
 *
 * Two-row layout in expanded state (nav row + title row).
 * Collapses to single row when scrolled.
 * Only supports `exitUntilCollapsed` scroll behavior.
 */
export interface FlexibleAppBarProps extends BaseAppBarProps {
	/** The main title content (rendered in both expanded and collapsed states). */
	title: React.ReactNode;
	/**
	 * Optional subtitle displayed in the expanded title row.
	 * Affects expanded height (adds extra rows).
	 */
	subtitle?: React.ReactNode;
	/**
	 * Horizontal alignment of the title and subtitle.
	 * @default "start"
	 */
	titleAlignment?: TitleAlignment;
	/**
	 * Collapsed height in px. The App Bar settles to this height after full scroll.
	 * @default 64
	 */
	collapsedHeight?: number;
	/**
	 * Expanded (initial) height in px.
	 * Defaults depend on variant and subtitle presence.
	 */
	expandedHeight?: number;
	/**
	 * Additional content rendered in the expanded title area.
	 * Supports images, circular avatars (32dp), Filled Buttons, or custom elements.
	 * Hidden when collapsed.
	 */
	headerContent?: React.ReactNode;
}

// ─── Search App Bar ────────────────────────────────────────────────────────────

/** Visual variant of the search bar. */
export type SearchBarVariant = "filled" | "outlined";

/**
 * Props for `<SearchAppBar>`.
 *
 * Replaces the title with a pill-shaped search input bar.
 * New variant in MD3 Expressive (May 2025).
 *
 * @example
 * ```tsx
 * <SearchAppBar
 *   searchPlaceholder="Search..."
 *   onSearchFocus={() => setSearchViewOpen(true)}
 *   trailingSearchActions={<IconButton aria-label="Voice search">...</IconButton>}
 *   externalActions={<Avatar />}
 * />
 * ```
 */
export interface SearchAppBarProps extends BaseAppBarProps {
	/** Placeholder text in the search bar. @default "Search" */
	searchPlaceholder?: string;
	/** Controlled search value. */
	searchValue?: string;
	/** Called when search input changes (inside the SearchView). */
	onSearchChange?: (value: string) => void;
	/**
	 * Called when the search bar is focused/clicked.
	 * Consumers should open a `<SearchView>` in response.
	 */
	onSearchFocus?: () => void;
	/** Called when the search view is closed/blurred. */
	onSearchBlur?: () => void;
	/**
	 * Icon rendered at the leading edge of the search bar (inside the pill).
	 * Defaults to a search icon.
	 */
	leadingSearchIcon?: React.ReactNode;
	/**
	 * Action icons rendered at the trailing edge of the search bar (inside the pill).
	 * Common examples: mic, camera, QR code.
	 */
	trailingSearchActions?: React.ReactNode;
	/**
	 * Action icons rendered outside the search bar (at the trailing edge of the bar).
	 * Common example: profile avatar button.
	 */
	externalActions?: React.ReactNode;
	/**
	 * Horizontal alignment of the search bar.
	 * @default "start"
	 */
	titleAlignment?: TitleAlignment;
	/**
	 * Visual style of the search bar.
	 * @default "filled"
	 */
	searchBarVariant?: SearchBarVariant;
	/**
	 * Unique identifier for the search bar — used as the Framer Motion `layoutId`
	 * to enable shared element transitions with `<SearchView>`.
	 * Must be unique if multiple SearchAppBars are on the page.
	 * @default "search-bar"
	 */
	searchBarId?: string;
}

// ─── Bottom App Bar ───────────────────────────────────────────────────────────

/**
 * Props for `<BottomAppBar>`.
 *
 * Fixed to the bottom of the screen. Contains navigation actions and optional FAB.
 * Height: 80px. Background: `surface-container`. Elevation: Level2.
 */
export interface BottomAppBarProps {
	/**
	 * Action icon buttons rendered at the leading end.
	 * Typically 3-4 `<IconButton>` components.
	 */
	actions?: React.ReactNode;
	/**
	 * Floating Action Button rendered at the trailing end.
	 * Consumer provides a `<FAB>` or `<FABPosition>` component.
	 */
	floatingActionButton?: React.ReactNode;
	/**
	 * Scroll behavior.
	 * - `visible`: Always visible.
	 * - `hidden`: Slides down when scrolling down, appears when scrolling up.
	 * @default "visible"
	 */
	scrollBehavior?: "visible" | "hidden";
	/**
	 * Ref to the scrollable element to observe.
	 * If not provided, listens to `window` scroll events.
	 */
	scrollElement?: React.RefObject<HTMLElement | null>;
	/** Additional CSS class applied to the root nav element. */
	className?: string;
}

// ─── Docked Toolbar ────────────────────────────────────────────────────────────

/**
 * Props for `<DockedToolbar>`.
 *
 * Secondary navigation bar. Not an App Bar — typically appears below the main App Bar.
 * Height: 64px. Background: `surface-container`.
 * Contains chips, segmented buttons, or filter actions.
 */
export interface DockedToolbarProps {
	/** Toolbar content (chips, segmented buttons, filter actions, etc.) */
	children: React.ReactNode;
	/**
	 * Accessible label for the toolbar (required for accessibility).
	 * e.g., "Filter options" or "Content navigation"
	 */
	"aria-label": string;
	/** Additional CSS class applied to the root element. */
	className?: string;
}

// ─── App Bar DSL ──────────────────────────────────────────────────────────────

/** Type of item in an App Bar Row/Column. */
export type AppBarItemType = "clickable" | "toggleable" | "custom";

/**
 * State passed to custom overflow menu content renderers.
 */
export interface AppBarMenuState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

/**
 * Defines a single action item for use in `<AppBarRow>` or `<AppBarColumn>`.
 * Translated from `AppBarItem` sealed interface in Kotlin DSL.
 */
export interface AppBarItem {
	/** Type determines which props are required. */
	type: AppBarItemType;
	/** Icon displayed in the App Bar (always shown). */
	icon: React.ReactNode;
	/** Accessible label for the icon button. Also shown in overflow menu. */
	label: string;
	/** Whether the item is interactive. @default true */
	enabled?: boolean;
	// Clickable item
	/** Called when the item is pressed (required for `type: "clickable"`). */
	onClick?: () => void;
	// Toggleable item
	/** Current checked state (for `type: "toggleable"`). */
	checked?: boolean;
	/** Called when checked state changes (for `type: "toggleable"`). */
	onCheckedChange?: (checked: boolean) => void;
	// Custom item
	/** Custom content rendered in the App Bar (for `type: "custom"`). */
	appBarContent?: React.ReactNode;
	/** Custom content rendered in the overflow dropdown menu. */
	menuContent?: (state: AppBarMenuState) => React.ReactNode;
}

/**
 * Props for `<AppBarRow>`.
 *
 * Displays App Bar items in a horizontal row.
 * Items that overflow the available width collapse into a dropdown menu.
 */
export interface AppBarRowProps {
	/** App Bar action items to display. */
	items: AppBarItem[];
	/**
	 * Maximum number of items to display before collapsing to overflow.
	 * If not set, uses available container width to determine count.
	 */
	maxItemCount?: number;
	/** Additional CSS class applied to the row container. */
	className?: string;
}

/**
 * Props for `<AppBarColumn>`.
 *
 * Displays App Bar items in a vertical column.
 * Items that overflow collapse into a dropdown menu.
 */
export interface AppBarColumnProps {
	/** App Bar action items to display. */
	items: AppBarItem[];
	/**
	 * Maximum number of items to display before collapsing to overflow.
	 */
	maxItemCount?: number;
	/** Additional CSS class applied to the column container. */
	className?: string;
}

/**
 * Props for `<AppBarOverflowIndicator>`.
 *
 * Renders a "More" (MoreVert) icon button that opens a dropdown menu
 * containing overflow App Bar items.
 */
export interface AppBarOverflowIndicatorProps {
	/** Items that did not fit in the row/column and should appear in the dropdown. */
	items: AppBarItem[];
	/** Additional CSS class applied to the trigger button. */
	className?: string;
}

// ─── Search View ──────────────────────────────────────────────────────────────

/**
 * Props for `<SearchView>`.
 *
 * Full-screen overlay shown when the search bar is activated.
 * Designed to share a Framer Motion `layoutId` with the `<SearchAppBar>`
 * search bar for smooth shared element transitions.
 *
 * Integration with SearchAppBar:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <SearchAppBar
 *   searchBarId="main-search"
 *   onSearchFocus={() => setIsOpen(true)}
 * />
 * <AnimatePresence>
 *   {isOpen && (
 *     <SearchView
 *       searchBarId="main-search"
 *       onClose={() => setIsOpen(false)}
 *     />
 *   )}
 * </AnimatePresence>
 * ```
 */
export interface SearchViewProps {
	/**
	 * Must match the `searchBarId` of the triggering `<SearchAppBar>`.
	 * Used as the Framer Motion `layoutId` for shared element transition.
	 * @default "search-bar"
	 */
	searchBarId?: string;
	/** Current search value. */
	value?: string;
	/** Called when search value changes. */
	onChange?: (value: string) => void;
	/** Called when the view is closed (Escape key or back navigation). */
	onClose: () => void;
	/** Placeholder text in the search input. @default "Search" */
	placeholder?: string;
	/**
	 * Content rendered below the search input (suggestions, history, results).
	 */
	children?: React.ReactNode;
	/** Navigation icon (back arrow) rendered at the leading edge. */
	leadingIcon?: React.ReactNode;
	/** Trailing action in the search input (e.g., clear button). */
	trailingAction?: React.ReactNode;
	/** Additional CSS class applied to the overlay container. */
	className?: string;
}

// ─── Internal Hook Return ─────────────────────────────────────────────────────

/**
 * Return type for `useAppBarScroll`.
 * @internal
 */
export interface UseAppBarScrollReturn {
	/**
	 * True when the scroll position is greater than 0.
	 * Used by `pinned` behavior to change background color.
	 */
	isScrolled: boolean;
	/**
	 * Fraction from 0 (fully expanded) to 1 (fully collapsed).
	 * Used by `exitUntilCollapsed` to drive collapse animations.
	 */
	collapsedFraction: number;
	/**
	 * True when the App Bar should be visually hidden.
	 * Only relevant for `enterAlways` behavior.
	 */
	isHidden: boolean;
}
