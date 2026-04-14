"use client";

import { cn, Icon, Search } from "@bug-on/md3-react";
import * as React from "react";

const PLACES = ["New York", "London", "Tokyo", "Paris", "Berlin"];

interface LocationResultItemProps {
	label: string;
	index: number;
	onSelect: () => void;
}

function LocationResultItem({
	label,
	index,
	onSelect,
}: LocationResultItemProps) {
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
			<Icon name="location_on" className="text-m3-on-surface-variant" />
			<span className="text-m3-on-surface">{label}</span>
		</div>
	);
}

export default function SearchFullscreenDemo() {
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(false);

	const filtered = React.useMemo(() => {
		const searchId = query.toLowerCase();
		return PLACES.filter((p) => p.toLowerCase().includes(searchId));
	}, [query]);

	const handleSelect = () => {
		setActive(false);
	};

	return (
		<div className="flex min-h-62.5 w-full max-w-md flex-col items-center p-4">
			<div className="w-full rounded-m3-xl border border-m3-outline-variant bg-m3-surface p-8 text-center">
				<p className="mb-4 text-sm text-m3-on-surface-variant">
					On mobile devices (or in this demo), the search view can expand to
					fill the entire screen via a Portal.
				</p>
				<Search
					id="search-fullscreen"
					query={query}
					onQueryChange={setQuery}
					onSearch={() => setActive(false)}
					active={active}
					onActiveChange={setActive}
					variant="fullscreen"
					placeholder="Search destinations..."
					textAlign="center"
				>
					{filtered.map((place, index) => (
						<LocationResultItem
							key={place}
							index={index}
							label={place}
							onSelect={handleSelect}
						/>
					))}
				</Search>
			</div>
		</div>
	);
}
