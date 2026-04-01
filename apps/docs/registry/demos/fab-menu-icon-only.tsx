"use client";

import { FABMenu, Icon, useTypography } from "@bug-on/md3-react";
import * as React from "react";

export default function FABMenuIconOnly() {
	const [expanded, setExpanded] = React.useState(false);
	const t = useTypography();

	const actions = [
		{
			id: "download",
			label: "Download",
			icon: <Icon name="download" />,
			onClick: () => console.log("Download"),
		},
		{
			id: "edit",
			label: "Edit",
			icon: <Icon name="edit" />,
			onClick: () => console.log("Edit"),
		},
		{
			id: "share",
			label: "Share",
			icon: <Icon name="share" />,
			onClick: () => console.log("Share"),
		},
		{
			id: "delete",
			label: "Delete",
			icon: <Icon name="delete" />,
			onClick: () => console.log("Delete"),
		},
	];

	const iconOnlyActions = actions.map((action) => ({
		...action,
		className: "[&>span]:hidden w-14 justify-center px-0",
	}));

	return (
		<div className="flex flex-col gap-8 md:flex-row w-full justify-around items-center h-125 border border-dashed border-m3-outline-variant bg-m3-surface md:rounded-xl p-8 relative overflow-hidden">
			<div className="relative flex-1 h-full w-full min-w-50 flex justify-center items-end bg-m3-surface-container-low rounded-lg pb-12">
				<span
					style={t.labelLarge}
					className="absolute top-4 left-1/2 -translate-x-1/2 text-m3-on-surface text-center"
				>
					Icon Only Items
				</span>
				<FABMenu
					className="absolute bottom-6!"
					expanded={expanded}
					onToggle={setExpanded}
					alignment="center"
					aria-label="Icon only actions menu"
					items={iconOnlyActions}
				/>
			</div>
		</div>
	);
}
