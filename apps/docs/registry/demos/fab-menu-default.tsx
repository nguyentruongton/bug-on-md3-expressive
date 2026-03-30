"use client";

import { FABMenu, useTypography } from "@bug-on/md3-react";
import { Copy, PenSquare, Share2, Trash2 } from "lucide-react";
import * as React from "react";

export default function FABMenuDefault() {
	const [expanded, setExpanded] = React.useState(false);
	const t = useTypography();

	return (
		<div className="relative h-100 w-full border border-dashed border-m3-outline-variant bg-m3-surface md:rounded-xl overflow-hidden">
			<div className="absolute inset-0 p-6 text-m3-on-surface">
				<h3 style={t.titleMedium} className="mb-2">
					Inbox
				</h3>
				<p style={t.bodyMedium} className="text-m3-on-surface-variant max-w-70">
					Click the floating action button in the bottom right corner to see the
					contextual actions for this screen.
				</p>
			</div>

			<FABMenu
				className="absolute"
				expanded={expanded}
				onToggle={setExpanded}
				aria-label="Email actions"
				items={[
					{
						id: "compose",
						label: "Compose",
						icon: <PenSquare />,
						onClick: () => console.log("Compose clicked"),
					},
					{
						id: "copy",
						label: "Copy Link",
						icon: <Copy />,
						onClick: () => console.log("Copy Link clicked"),
					},
					{
						id: "share",
						label: "Share",
						icon: <Share2 />,
						onClick: () => console.log("Share clicked"),
					},
					{
						id: "delete",
						label: "Delete",
						icon: <Trash2 />,
						onClick: () => console.log("Delete clicked"),
					},
				]}
			/>
		</div>
	);
}
