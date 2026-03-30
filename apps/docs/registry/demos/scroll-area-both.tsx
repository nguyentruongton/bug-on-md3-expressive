"use client";

import { ScrollArea } from "@bug-on/md3-react";

const TAGS = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);

export default function ScrollAreaBothDemo() {
	return (
		<ScrollArea
			orientation="both"
			className="h-56 w-full max-w-lg rounded-m3-md bg-m3-surface-container"
			aria-label="Two-dimensional scroll area demo"
		>
			<table className="min-w-175 text-sm text-m3-on-surface border-collapse">
				<thead>
					<tr className="border-b border-m3-outline-variant sticky top-0 bg-m3-surface-container-high">
						{["#", "Name", "Value", "Type", "Status", "Date", "Tags"].map(
							(h) => (
								<th
									key={h}
									scope="col"
									className="px-4 py-3 text-left font-medium text-m3-on-surface-variant whitespace-nowrap"
								>
									{h}
								</th>
							),
						)}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: 30 }).map((_, i) => {
						const rowId = `mock-row-${i}`;
						return (
							<tr
								key={rowId}
								className="border-b border-m3-outline-variant/40 hover:bg-m3-on-surface/5 transition-colors"
							>
								<td className="px-4 py-2 text-m3-on-surface-variant">
									{i + 1}
								</td>
								<td className="px-4 py-2 whitespace-nowrap">Item {i + 1}</td>
								<td className="px-4 py-2">{100 + ((i * 27) % 899)}</td>
								<td className="px-4 py-2">
									{["Alpha", "Beta", "Gamma"][i % 3]}
								</td>
								<td className="px-4 py-2">
									<span className="px-2 py-0.5 rounded-full text-xs bg-m3-primary/10 text-m3-primary">
										{["Active", "Pending", "Done"][i % 3]}
									</span>
								</td>
								<td className="px-4 py-2 whitespace-nowrap">
									2025-0{(i % 9) + 1}-{String(i + 1).padStart(2, "0")}
								</td>
								<td className="px-4 py-2">{TAGS[i % 10]}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</ScrollArea>
	);
}
