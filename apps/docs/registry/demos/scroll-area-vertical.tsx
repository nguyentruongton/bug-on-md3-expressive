"use client";

import { ScrollArea } from "@bug-on/md3-react";

const TAGS = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);

export default function ScrollAreaVerticalDemo() {
	return (
		<div className="flex flex-col sm:flex-row gap-8 items-start">
			{/* Demo */}
			<ScrollArea
				className="h-64 w-52 rounded-m3-md bg-m3-surface-container"
				aria-label="Vertical scroll area demo"
			>
				<div className="p-4 space-y-2">
					{TAGS.map((tag) => (
						<div
							key={tag}
							className="px-3 py-2 rounded-m3-sm bg-m3-surface-container-high text-sm text-m3-on-surface"
						>
							{tag}
						</div>
					))}
				</div>
			</ScrollArea>

			<div className="max-w-sm">
				<h3 className="text-lg font-medium text-m3-on-surface mb-2">
					Default behaviour
				</h3>
				<ul className="space-y-2 text-sm text-m3-on-surface-variant list-disc list-inside">
					<li>
						<code className="text-m3-primary">type="hover"</code> (default) —
						scrollbar appears on hover.
					</li>
					<li>Pill-shaped thumb with soft opacity.</li>
					<li>Grows visual weight on hover / active for clarity.</li>
					<li>Full keyboard navigation supported (Tab, ↑↓, PgUp/PgDn).</li>
				</ul>
			</div>
		</div>
	);
}
