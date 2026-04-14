"use client";

import { cn, Icon, Search } from "@bug-on/md3-react";
import * as React from "react";

const HISTORY = ["Flights to Tokyo", "Hotels in Paris", "Car rental NYC"];

interface HistoryResultItemProps {
	label: string;
	index: number;
	onSelect: () => void;
}

function HistoryResultItem({ label, index, onSelect }: HistoryResultItemProps) {
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
			<Icon name="history" className="text-m3-on-surface-variant" />
			<span className="text-m3-on-surface">{label}</span>
		</div>
	);
}

export default function SearchDockedGapDemo() {
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(false);

	const handleSelect = (item: string) => {
		setQuery(item);
		setActive(false);
	};

	return (
		<div className="flex w-full max-w-md flex-col bg-m3-surface p-4 min-h-87.5">
			<Search
				id="search-docked-gap"
				query={query}
				onQueryChange={setQuery}
				onSearch={() => setActive(false)}
				active={active}
				onActiveChange={setActive}
				variant="docked"
				styleType="contained"
				hasGap
				placeholder="Search places..."
			>
				{HISTORY.map((item, index) => (
					<HistoryResultItem
						key={item}
						index={index}
						label={item}
						onSelect={() => handleSelect(item)}
					/>
				))}
			</Search>
		</div>
	);
}
