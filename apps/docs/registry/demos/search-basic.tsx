"use client";

import { cn, Icon, Search } from "@bug-on/md3-react"; // Giả định thư viện export cn
import * as React from "react";

const FRUITS = [
	"Apple",
	"Banana",
	"Cherry",
	"Date",
	"Elderberry",
	"Fig",
	"Grape",
	"Honeydew",
];

interface SearchResultItemProps {
	label: string;
	index: number;
	onSelect: () => void;
}

function SearchResultItem({ label, index, onSelect }: SearchResultItemProps) {
	const { activeIndex, listboxId } = Search.useSearch();
	const isActive = activeIndex === index;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelect();
		}
	};

	return (
		<div
			id={`${listboxId}-option-${index}`}
			role="option"
			aria-selected={isActive}
			tabIndex={-1}
			className={cn(
				"flex cursor-pointer items-center gap-4 px-4 py-3 outline-none transition-colors",
				"hover:bg-m3-surface-container-high",
				isActive && "bg-m3-surface-container-highest",
			)}
			onClick={onSelect}
			onKeyDown={handleKeyDown}
		>
			<Icon name="search" className="text-m3-on-surface-variant" />
			<span className="text-m3-on-surface">{label}</span>
		</div>
	);
}

export default function SearchBasicDemo() {
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(false);

	const filteredFruits = React.useMemo(() => {
		const searchId = query.toLowerCase();
		return FRUITS.filter((fruit) => fruit.toLowerCase().includes(searchId));
	}, [query]);

	const handleSearch = (q: string) => {
		alert(`Searched for: ${q}`);
		setActive(false);
	};

	const handleSelect = (fruit: string) => {
		setQuery(fruit);
		setActive(false);
	};

	return (
		<div className="flex w-full max-w-md flex-col p-4 min-h-87.5">
			<Search
				id="search-basic"
				query={query}
				onQueryChange={setQuery}
				onSearch={handleSearch}
				active={active}
				onActiveChange={setActive}
				variant="docked"
				styleType="contained"
				placeholder="Search fruits..."
				textAlign="center"
			>
				{filteredFruits.length > 0 ? (
					filteredFruits.map((fruit, index) => (
						<SearchResultItem
							key={fruit}
							index={index}
							label={fruit}
							onSelect={() => handleSelect(fruit)}
						/>
					))
				) : (
					<div className="px-4 py-8 text-center text-m3-on-surface-variant">
						<p className="text-sm">No results found for "{query}"</p>
					</div>
				)}
			</Search>
		</div>
	);
}
