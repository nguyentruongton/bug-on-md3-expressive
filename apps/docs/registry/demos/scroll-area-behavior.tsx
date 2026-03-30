"use client";

import { Card, ScrollArea } from "@bug-on/md3-react";

const TAGS = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);

export default function ScrollAreaBehaviorDemo() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
			{(
				[
					{
						type: "hover",
						label: "hover (default)",
						desc: "Shows scrollbar only when the pointer enters the container.",
					},
					{
						type: "scroll",
						label: "scroll",
						desc: "Shows scrollbar only while actively scrolling.",
					},
					{
						type: "always",
						label: "always",
						desc: "Scrollbar is always visible — best for accessibility.",
					},
					{
						type: "none",
						label: "none",
						desc: "Scrollbar is hidden entirely (native scrolling still works).",
					},
				] as const
			).map(({ type, label, desc }) => (
				<Card
					key={type}
					variant="outlined"
					className="p-6 bg-m3-surface-container-lowest flex flex-col gap-4"
				>
					<div>
						<code className="text-m3-primary font-mono text-sm">
							type="{type}"
						</code>
						<p className="text-xs text-m3-on-surface-variant mt-1">{desc}</p>
					</div>
					<ScrollArea
						type={type}
						className="h-36 rounded-m3-sm bg-m3-surface-container"
						aria-label={`Scroll area with type ${type}`}
					>
						<div className="p-3 space-y-1.5">
							{TAGS.slice(0, 20).map((tag) => (
								<div
									key={tag}
									className="px-2 py-1 rounded text-xs text-m3-on-surface bg-m3-surface-container-high"
								>
									{tag}
								</div>
							))}
						</div>
					</ScrollArea>
					<p className="text-sm font-medium text-m3-on-surface">{label}</p>
				</Card>
			))}
		</div>
	);
}
