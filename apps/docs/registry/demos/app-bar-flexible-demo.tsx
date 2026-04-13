"use client";

import { IconButton, LargeFlexibleAppBar } from "@bug-on/md3-react";
import * as React from "react";

export default function Demo() {
	const scrollRef = React.useRef<HTMLDivElement>(null);

	return (
		<div className="relative w-full overflow-hidden rounded-xl border border-m3-outline-variant bg-m3-background h-100">
			<LargeFlexibleAppBar
				title="Photos"
				subtitle="Today"
				scrollElement={scrollRef}
				className="absolute"
				navigationIcon={
					<IconButton aria-label="Menu">
						<span className="material-symbols-rounded">menu</span>
					</IconButton>
				}
				actions={
					<>
						<IconButton aria-label="Search">
							<span className="material-symbols-rounded">search</span>
						</IconButton>
						<IconButton aria-label="Account details">
							<span className="material-symbols-rounded">account_circle</span>
						</IconButton>
					</>
				}
			/>

			{/* Scrollable content with top padding to account for expanded app bar */}
			<div ref={scrollRef} className="h-full overflow-y-auto px-4 pb-4 pt-38">
				<div className="grid grid-cols-2 gap-2">
					{[
						"f1",
						"f2",
						"f3",
						"f4",
						"f5",
						"f6",
						"f7",
						"f8",
						"f9",
						"f10",
						"f11",
						"f12",
					].map((id) => (
						<div
							key={id}
							className="aspect-square bg-m3-surface-container-high rounded-lg"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
