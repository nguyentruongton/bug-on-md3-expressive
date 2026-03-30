"use client";

import { FABMenu, useTypography } from "@bug-on/md3-react";
import { Download, Edit2, Heart, Share2 } from "lucide-react";
import * as React from "react";

export default function FABMenuVariants() {
	const [expandedPrimary, setExpandedPrimary] = React.useState(false);
	const [expandedSecondary, setExpandedSecondary] = React.useState(false);
	const [expandedTertiary, setExpandedTertiary] = React.useState(false);
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
			id: "favorite",
			label: "Favorite",
			icon: <Heart />,
			onClick: () => console.log("Favorite"),
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
			{/* Primary Variant */}
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface"
				>
					Primary
				</span>
				<FABMenu
					className="absolute bottom-6!"
					alignment="center"
					expanded={expandedPrimary}
					onToggle={setExpandedPrimary}
					colorVariant="primary"
					aria-label="Primary actions menu"
					items={actions}
				/>
			</div>

			{/* Secondary Variant */}
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface"
				>
					Secondary
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expandedSecondary}
					onToggle={setExpandedSecondary}
					colorVariant="secondary"
					alignment="center"
					aria-label="Secondary actions menu"
					items={actions}
				/>
			</div>

			{/* Tertiary Variant */}
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface"
				>
					Tertiary
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expandedTertiary}
					onToggle={setExpandedTertiary}
					colorVariant="tertiary"
					alignment="center"
					aria-label="Tertiary actions menu"
					items={actions}
				/>
			</div>
		</div>
	);
}
