"use client";

import { Chip, Icon } from "@bug-on/md3-react";
import { useState } from "react";

function FilterChipToggle({
	label,
	icon,
	elevated,
}: {
	label: string;
	icon?: string;
	elevated?: boolean;
}) {
	const [selected, setSelected] = useState(false);
	return (
		<Chip
			variant="filter"
			label={label}
			selected={selected}
			elevated={elevated}
			leadingIcon={
				icon ? <Icon name={icon} className="w-4.5 h-4.5" /> : undefined
			}
			onClick={() => setSelected((v) => !v)}
		/>
	);
}

export default function ChipFilterDemo() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Interactive — click to toggle
				</p>
				<div className="flex flex-wrap gap-2">
					<FilterChipToggle label="Starred" />
					<FilterChipToggle label="Bookmarked" icon="bookmark" />
					<FilterChipToggle label="Music" icon="music_note" />
					<FilterChipToggle label="Photography" icon="photo_camera" />
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					States preview
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip variant="filter" label="Unselected" selected={false} />
					<Chip variant="filter" label="Selected" selected />
					<Chip
						variant="filter"
						label="Icon — unselected"
						selected={false}
						leadingIcon={<Icon name="star" className="w-4.5 h-4.5" />}
					/>
					<Chip
						variant="filter"
						label="Icon — selected"
						selected
						leadingIcon={<Icon name="star" className="w-4.5 h-4.5" />}
					/>
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Elevated
				</p>
				<div className="flex flex-wrap gap-2">
					<FilterChipToggle label="Elevated filter" elevated />
					<FilterChipToggle label="With icon" elevated icon="star" />
				</div>
			</div>
		</div>
	);
}
