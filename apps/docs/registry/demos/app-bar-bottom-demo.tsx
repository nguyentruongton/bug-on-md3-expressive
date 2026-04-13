"use client";

import { BottomAppBar, FAB, IconButton, SmallAppBar } from "@bug-on/md3-react";
import * as React from "react";

export default function Demo() {
	const scrollRef = React.useRef<HTMLDivElement>(null);

	return (
		<div className="relative w-full overflow-hidden rounded-xl border border-m3-outline-variant bg-m3-background h-100">
			{/* Top Bar for context */}
			<SmallAppBar
				title="Inbox"
				className="absolute"
				navigationIcon={
					<IconButton aria-label="Menu">
						<span className="material-symbols-rounded">menu</span>
					</IconButton>
				}
			/>

			{/* Dummy scrollable content */}
			<div ref={scrollRef} className="pt-16 h-full overflow-y-auto px-4 pb-24">
				{[
					"b1",
					"b2",
					"b3",
					"b4",
					"b5",
					"b6",
					"b7",
					"b8",
					"b9",
					"b10",
					"b11",
					"b12",
					"b13",
					"b14",
					"b15",
				].map((id) => (
					<div
						key={id}
						className="py-4 border-b border-m3-outline-variant flex items-center gap-4"
					>
						<div className="w-12 h-12 rounded-full bg-m3-surface-container-high shrink-0" />
						<div className="flex-1">
							<div className="w-1/2 h-5 bg-m3-surface-container-highest rounded-md mb-1" />
							<div className="w-full h-3 bg-m3-surface-container rounded-md" />
						</div>
					</div>
				))}
			</div>

			{/* Bottom App Bar */}
			<BottomAppBar
				className="absolute"
				scrollBehavior="hidden"
				scrollElement={scrollRef}
				actions={
					<>
						<IconButton aria-label="Check">
							<span className="material-symbols-rounded">check_box</span>
						</IconButton>
						<IconButton aria-label="Edit">
							<span className="material-symbols-rounded">edit</span>
						</IconButton>
						<IconButton aria-label="Mic">
							<span className="material-symbols-rounded">mic</span>
						</IconButton>
						<IconButton aria-label="Image">
							<span className="material-symbols-rounded">image</span>
						</IconButton>
					</>
				}
				floatingActionButton={
					<FAB aria-label="Compose" lowered icon={<span className="material-symbols-rounded">add</span>} />
				}
			/>
		</div>
	);
}
