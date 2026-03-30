"use client";

import { Chip } from "@bug-on/md3-react";
import { Bookmark, Camera, Music, Star } from "lucide-react";
import { useState } from "react";

const Icon = ({ icon: IconComponent }: { icon: React.ElementType }) => (
	<IconComponent className="w-4.5 h-4.5" />
);

function FilterChipToggle({
	label,
	icon,
	elevated,
}: {
	label: string;
	icon?: React.ElementType;
	elevated?: boolean;
}) {
	const [selected, setSelected] = useState(false);
	return (
		<Chip
			variant="filter"
			label={label}
			selected={selected}
			elevated={elevated}
			leadingIcon={icon ? <Icon icon={icon} /> : undefined}
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
					<FilterChipToggle label="Bookmarked" icon={Bookmark} />
					<FilterChipToggle label="Music" icon={Music} />
					<FilterChipToggle label="Photography" icon={Camera} />
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
						leadingIcon={<Star className="w-4.5 h-4.5" />}
					/>
					<Chip
						variant="filter"
						label="Icon — selected"
						selected
						leadingIcon={<Star className="w-4.5 h-4.5" />}
					/>
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Elevated
				</p>
				<div className="flex flex-wrap gap-2">
					<FilterChipToggle label="Elevated filter" elevated />
					<FilterChipToggle label="With icon" elevated icon={Star} />
				</div>
			</div>
		</div>
	);
}
