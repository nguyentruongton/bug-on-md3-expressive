/**
 * @file search.tsx
 * MD3 Expressive Search — Orchestrator component.
 *
 * Composes SearchBar (collapsed) + SearchView (expanded) into a single
 * developer-facing API. Routes to the correct SearchView variant based on props.
 *
 * Developer usage:
 * ```tsx
 * const [query, setQuery] = useState("");
 * const [active, setActive] = useState(false);
 *
 * <Search
 *   query={query}
 *   onQueryChange={setQuery}
 *   onSearch={(q) => doSearch(q)}
 *   active={active}
 *   onActiveChange={setActive}
 *   variant="docked"
 *   styleType="contained"
 * >
 *   {results.map((r) => (
 *     <div key={r.id} id={`${YOUR_LISTBOX_ID}-option-0`} role="option">
 *       {r.label}
 *     </div>
 *   ))}
 * </Search>
 * ```
 */

import { m } from "motion/react";
import * as React from "react";
import { useSearchKeyboard } from "./hooks/use-search-keyboard";
import type { SearchProps } from "./search.types";
import { SearchBar } from "./search-bar";
import { SearchProvider, useSearch } from "./search-context";
import { SearchViewDocked } from "./search-view-docked";
import { SearchViewFullScreen } from "./search-view-fullscreen";

/**
 * MD3 Expressive Search — Orchestrator component.
 *
 * Renders a SearchBar (collapsed pill) and the appropriate SearchView
 * (docked popup or fullscreen overlay) based on `variant`.
 *
 * The component is fully controlled:
 * - `active` / `onActiveChange` manage open/close state.
 * - `query` / `onQueryChange` manage input value.
 *
 * Shared `searchId` (React.useId) links SearchBar and SearchView via
 * Framer Motion `layoutId` for seamless animated transitions.
 */
function SearchComponent({
	query,
	onQueryChange,
	onSearch,
	active,
	onActiveChange,
	variant = "docked",
	styleType = "contained",
	hasGap = false,
	leadingIcon,
	trailingIcon,
	placeholder = "Search",
	textAlign = "left",
	children,
	id,
	"aria-label": ariaLabel = "Search",
	className,
	viewClassName,
}: SearchProps) {
	const generatedId = React.useId();
	const searchId = id ?? generatedId;
	const listboxId = `${searchId}-listbox`;

	const itemCount = React.Children.count(children);

	const { activeIndex, handleKeyDown } = useSearchKeyboard({
		active,
		onActiveChange,
		onSearch,
		query,
		itemCount,
	});

	const sharedProps = {
		query,
		onQueryChange,
		onSearch,
		active,
		onActiveChange,
		leadingIcon,
		trailingIcon,
		placeholder,
		textAlign,
		"aria-label": ariaLabel,
		searchId,
		listboxId,
		onKeyDown: handleKeyDown,
		activeIndex,
	} as const;

	return (
		<SearchProvider value={{ activeIndex, listboxId }}>
			<m.div className={className} style={{ minHeight: 56 }}>
				<SearchBar {...sharedProps} />
				{variant === "fullscreen" ? (
					<SearchViewFullScreen
						{...sharedProps}
						styleType={styleType}
						viewClassName={viewClassName}
					>
						{children}
					</SearchViewFullScreen>
				) : (
					<SearchViewDocked
						{...sharedProps}
						styleType={styleType}
						hasGap={hasGap}
						viewClassName={viewClassName}
					>
						{children}
					</SearchViewDocked>
				)}
			</m.div>
		</SearchProvider>
	);
}

/** MD3 Expressive Search component with `Search.useSearch` context accessor. */
export const Search = Object.assign(SearchComponent, { useSearch });
