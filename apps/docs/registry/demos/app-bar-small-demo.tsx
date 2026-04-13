"use client";

import { IconButton, SmallAppBar } from "@bug-on/md3-react";

export default function Demo() {
	return (
		<div className="relative w-full overflow-hidden rounded-xl border border-m3-outline-variant bg-m3-background h-100">
			<SmallAppBar
				title="Inbox"
				titleAlignment="start"
				className="absolute"
				navigationIcon={
					<IconButton aria-label="Menu">
						<span className="material-symbols-rounded">menu</span>
					</IconButton>
				}
				actions={
					<IconButton aria-label="Account details">
						<span className="material-symbols-rounded">account_circle</span>
					</IconButton>
				}
			/>

			{/* Dummy scrollable content */}
			<div className="pt-16 h-full overflow-y-auto px-4 pb-4">
				{["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10"].map(
					(id) => (
						<div key={id} className="py-4 border-b border-m3-outline-variant">
							<div className="w-3/4 h-6 bg-m3-surface-container-high rounded-md mb-2" />
							<div className="w-full h-4 bg-m3-surface-container rounded-md mb-1" />
							<div className="w-5/6 h-4 bg-m3-surface-container rounded-md" />
						</div>
					),
				)}
			</div>
		</div>
	);
}
