"use client";

import { FABMenu, useTypography } from "@bug-on/md3-react";
import { Download, Edit2, Share2 } from "lucide-react";
import * as React from "react";

export default function FABMenuSizes() {
	const [expandedBaseline, setExpandedBaseline] = React.useState(false);
	const [expandedMedium, setExpandedMedium] = React.useState(false);
	const [expandedLarge, setExpandedLarge] = React.useState(false);
	const t = useTypography();

	const actions = [
		{
			id: "download",
			label: "Download",
			icon: <Download />,
			onClick: () => console.log("Download"),
		},
		{
			id: "edit",
			label: "Edit",
			icon: <Edit2 />,
			onClick: () => console.log("Edit"),
		},
		{
			id: "share",
			label: "Share",
			icon: <Share2 />,
			onClick: () => console.log("Share"),
		},
	];

	return (
		<div className="flex flex-col gap-8 md:flex-row w-full justify-around items-center h-125 border border-dashed border-m3-outline-variant bg-m3-surface md:rounded-xl p-8 relative overflow-hidden">
			{/* Baseline Size */}
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Baseline (56dp)
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expandedBaseline}
					onToggle={setExpandedBaseline}
					fabSize="baseline"
					alignment="center"
					aria-label="Baseline actions menu"
					items={actions}
				/>
			</div>

			{/* Medium Size */}
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Medium (80dp)
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expandedMedium}
					onToggle={setExpandedMedium}
					fabSize="medium"
					alignment="center"
					aria-label="Medium actions menu"
					items={actions}
				/>
			</div>

			{/* Large Size */}
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Large (96dp)
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expandedLarge}
					onToggle={setExpandedLarge}
					fabSize="large"
					alignment="center"
					aria-label="Large actions menu"
					items={actions}
				/>
			</div>
		</div>
	);
}
