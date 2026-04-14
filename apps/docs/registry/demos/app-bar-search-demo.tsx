"use client";

import {
	IconButton,
	SearchAppBar,
	SearchViewContainer,
} from "@bug-on/md3-react";
import * as React from "react";

export default function Demo() {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");
	const scrollRef = React.useRef<HTMLDivElement>(null);

	return (
		<div className="relative w-full overflow-hidden rounded-xl border border-m3-outline-variant bg-m3-background h-100">
			{/* Main Search App Bar */}
			<SearchAppBar
				searchBarId="demo-search"
				searchPlaceholder="Search messages..."
				className="absolute"
				scrollElement={scrollRef}
				onSearchFocus={() => setSearchOpen(true)}
				navigationIcon={
					<IconButton aria-label="Menu">
						<span className="material-symbols-rounded">menu</span>
					</IconButton>
				}
				trailingSearchActions={
					<IconButton aria-label="Voice search" size="xs">
						<span className="material-symbols-rounded">mic</span>
					</IconButton>
				}
				externalActions={
					<IconButton aria-label="Account details">
						<span className="material-symbols-rounded">account_circle</span>
					</IconButton>
				}
			/>

			{/* Full Screen Search View Overlay */}
			<SearchViewContainer
				isOpen={searchOpen}
				searchBarId="demo-search"
				value={searchValue}
				onChange={setSearchValue}
				onClose={() => setSearchOpen(false)}
				placeholder="Search messages..."
				className="absolute" // Kept inside the container instead of viewport for this demo
			>
				{/* Dummy Search Results */}
				<div className="px-4 py-2">
					<p className="text-m3-on-surface-variant text-sm font-medium tracking-wide pb-2">
						Recent
					</p>
					{["Alice", "Bob", "Charlie", "Diana", "Eve"].map((name) => (
						<button
							key={name}
							type="button"
							className="w-full flex items-center gap-4 py-3 hover:bg-m3-on-surface/5 outline-none rounded-lg focus-visible:ring-2 px-2"
						>
							<span className="material-symbols-rounded text-m3-on-surface-variant">
								history
							</span>
							<span className="text-m3-on-surface text-base">{name}</span>
						</button>
					))}
				</div>
			</SearchViewContainer>

			{/* Dummy scrollable content */}
			<div ref={scrollRef} className="pt-16 h-full overflow-y-auto px-4 pb-4">
				{["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((id) => (
					<div key={id} className="py-4 border-b border-m3-outline-variant">
						<div className="w-3/4 h-6 bg-m3-surface-container-high rounded-md mb-2" />
						<div className="w-full h-4 bg-m3-surface-container rounded-md mb-1" />
					</div>
				))}
			</div>
		</div>
	);
}
