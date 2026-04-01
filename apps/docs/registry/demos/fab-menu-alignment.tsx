"use client";

import { FABMenu, Icon, useTypography } from "@bug-on/md3-react";
import * as React from "react";

export default function FABMenuAlignment() {
	const [expandedStart, setExpandedStart] = React.useState(false);
	const [expandedEnd, setExpandedEnd] = React.useState(false);
	const [expandedCenter, setExpandedCenter] = React.useState(false);
	const t = useTypography();

	const actions = [
		{
			id: "compose",
			label: "Compose",
			icon: <Icon name="edit" />,
			onClick: () => console.log("Compose"),
		},
		{
			id: "copy",
			label: "Copy Link",
			icon: <Icon name="content_copy" />,
			onClick: () => console.log("Copy Link"),
		},
		{
			id: "share",
			label: "Share",
			icon: <Icon name="share" />,
			onClick: () => console.log("Share"),
		},
	];

	return (
		<div className="flex flex-col gap-8 md:flex-row w-full justify-around items-start h-auto border border-dashed border-m3-outline-variant bg-m3-surface md:rounded-xl p-8 relative overflow-hidden">
			{/* Start Alignment */}
			<div className="relative flex-1 h-100 w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Alignment: start
				</span>
				<FABMenu
					className="absolute bottom-6 left-6!"
					expanded={expandedStart}
					onToggle={setExpandedStart}
					alignment="start"
					aria-label="Start aligned actions menu"
					items={actions}
				/>
			</div>

			{/* Center Alignment */}
			<div className="relative flex-1 h-100 w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Alignment: center
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expandedCenter}
					onToggle={setExpandedCenter}
					alignment="center"
					aria-label="Center aligned actions menu"
					items={actions}
				/>
			</div>

			{/* End Alignment */}
			<div className="relative flex-1 h-100 w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Alignment: end
				</span>
				<FABMenu
					className="absolute bottom-6 right-6!"
					expanded={expandedEnd}
					onToggle={setExpandedEnd}
					alignment="end"
					aria-label="End aligned actions menu"
					items={actions}
				/>
			</div>
		</div>
	);
}
