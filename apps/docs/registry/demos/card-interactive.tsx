"use client";

import * as React from "react";
import { Card } from "@bug-on/md3-react";
import { ExternalLink } from "lucide-react";

export default function CardInteractive() {
	const [clicks, setClicks] = React.useState(0);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
			{/* Static */}
			<Card variant="elevated" className="p-6">
				<h3 className="font-medium text-m3-on-surface mb-2">Static Card</h3>
				<p className="text-sm text-m3-on-surface-variant">
					A plain <code>&lt;div&gt;</code>. No hover elevation or ripple. Use
					when the card contains its own interactive elements.
				</p>
			</Card>

			{/* Button card (onClick) */}
			<Card
				variant="elevated"
				className="p-6 text-left"
				onClick={() => setClicks((c) => c + 1)}
			>
				<h3 className="font-medium text-m3-on-surface mb-2">Clickable</h3>
				<p className="text-sm text-m3-on-surface-variant mb-4">
					Renders as <code>&lt;button&gt;</code> when <code>onClick</code> is
					provided. Shows ripple + elevation morph.
				</p>
				<div className="text-m3-primary font-medium text-sm font-mono">
					Clicked: {clicks}×
				</div>
			</Card>

			{/* Link card (href) */}
			<Card
				variant="elevated"
				className="p-6"
				href="https://m3.material.io/components/cards/overview"
				target="_blank"
			>
				<div className="flex justify-between items-start mb-2">
					<h3 className="font-medium text-m3-on-surface">Link Card</h3>
					<ExternalLink className="w-4 h-4 text-m3-on-surface-variant" />
				</div>
				<p className="text-sm text-m3-on-surface-variant">
					Renders as <code>&lt;a&gt;</code> when <code>href</code> is provided.
					Opens M3 spec in a new tab.
				</p>
			</Card>
		</div>
	);
}
