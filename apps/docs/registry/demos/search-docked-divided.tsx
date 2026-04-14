"use client";

import { cn, Search } from "@bug-on/md3-react";
import * as React from "react";

const CONTACTS = [
	{ name: "Alice Johnson", email: "alice@example.com" },
	{ name: "Bob Smith", email: "bob@example.com" },
	{ name: "Charlie Davis", email: "charlie@example.com" },
];

interface ContactResultItemProps {
	name: string;
	email: string;
	index: number;
	onSelect: () => void;
}

function ContactResultItem({
	name,
	email,
	index,
	onSelect,
}: ContactResultItemProps) {
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
			<div className="flex flex-col">
				<span className="text-m3-on-surface font-medium">{name}</span>
				<span className="text-sm text-m3-on-surface-variant font-normal">
					{email}
				</span>
			</div>
		</div>
	);
}

export default function SearchDockedDividedDemo() {
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(false);

	const filtered = React.useMemo(() => {
		const searchId = query.toLowerCase();
		return CONTACTS.filter((c) => c.name.toLowerCase().includes(searchId));
	}, [query]);

	const handleSelect = () => {
		setActive(false);
	};

	return (
		<div className="flex w-full max-w-md flex-col bg-m3-surface p-4 min-h-87.5">
			<Search
				id="search-docked-divided"
				query={query}
				onQueryChange={setQuery}
				onSearch={() => setActive(false)}
				active={active}
				onActiveChange={setActive}
				variant="docked"
				styleType="divided"
				placeholder="Search contacts..."
			>
				{filtered.length > 0 ? (
					filtered.map((contact, index) => (
						<ContactResultItem
							key={contact.email}
							index={index}
							name={contact.name}
							email={contact.email}
							onSelect={handleSelect}
						/>
					))
				) : (
					<div className="px-4 py-8 text-center text-m3-on-surface-variant">
						<p className="text-sm">No contacts found</p>
					</div>
				)}
			</Search>
		</div>
	);
}
