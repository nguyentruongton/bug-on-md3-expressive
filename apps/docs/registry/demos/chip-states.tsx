"use client";

import { Chip, Icon } from "@bug-on/md3-react";

export default function ChipStatesDemo() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-lg font-medium text-m3-on-surface mb-3">
					Disabled
				</h3>
				<p className="text-sm text-m3-on-surface-variant mb-4">
					Disabled chips apply 38% opacity to text and 12% opacity to borders.
					They are removed from keyboard navigation.
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip variant="assist" label="Assist" disabled />
					<Chip
						variant="assist"
						label="With icon"
						disabled
						leadingIcon={<Icon name="calendar_today" className="w-4.5 h-4.5" />}
					/>
					<Chip variant="filter" label="Filter" disabled />
					<Chip variant="filter" label="Filter selected" disabled selected />
					<Chip variant="input" label="Input" disabled onRemove={() => {}} />
					<Chip variant="suggestion" label="Suggestion" disabled />
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium text-m3-on-surface mb-4">
					All variants at a glance
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{(
						[
							{ variant: "assist", label: "Assist chip" },
							{ variant: "filter", label: "Filter chip" },
							{ variant: "input", label: "Input chip" },
							{ variant: "suggestion", label: "Suggestion chip" },
						] as const
					).map(({ variant, label }) => (
						<div
							key={variant}
							className="p-4 rounded-xl border border-m3-outline-variant bg-m3-surface-container-lowest flex flex-col gap-3"
						>
							<span className="text-xs font-mono text-m3-on-surface-variant">
								variant=&quot;{variant}&quot;
							</span>
							<div className="flex gap-2 flex-wrap">
								<Chip
									variant={variant}
									label={label}
									{...(variant === "input" ? { onRemove: () => {} } : {})}
								/>
								{variant === "filter" && (
									<Chip variant="filter" label="Selected" selected />
								)}
								{variant === "assist" && (
									<Chip variant="assist" label="Elevated" elevated />
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
