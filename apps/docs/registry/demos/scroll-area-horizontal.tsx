"use client";

import { ScrollArea } from "@bug-on/md3-react";

const COLS = [
	{ name: "Column A", value: 756 },
	{ name: "Column B", value: 324 },
	{ name: "Column C", value: 912 },
	{ name: "Column D", value: 489 },
	{ name: "Column E", value: 671 },
	{ name: "Column F", value: 125 },
	{ name: "Column G", value: 890 },
	{ name: "Column H", value: 543 },
	{ name: "Column I", value: 216 },
	{ name: "Column J", value: 789 },
	{ name: "Column K", value: 432 },
	{ name: "Column L", value: 654 },
];

export default function ScrollAreaHorizontalDemo() {
	return (
		<ScrollArea
			orientation="horizontal"
			className="rounded-m3-md bg-m3-surface-container pb-2"
			aria-label="Horizontal scroll area demo"
		>
			<div className="flex gap-3 p-4 w-max">
				{COLS.map((col) => (
					<div
						key={col.name}
						className="flex flex-col items-center gap-2 min-w-20"
					>
						<div
							className="w-16 rounded-m3-sm bg-m3-primary/80"
							style={{ height: `${(col.value / 999) * 160}px` }}
							role="img"
							aria-label={`${col.name}: ${col.value}`}
						/>
						<span className="text-xs text-m3-on-surface-variant">
							{col.name}
						</span>
						<span className="text-xs font-medium text-m3-on-surface">
							{col.value}
						</span>
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
