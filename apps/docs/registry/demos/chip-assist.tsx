"use client";

import { Chip, Icon } from "@bug-on/md3-react";

export default function ChipAssistDemo() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Flat (default)
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip variant="assist" label="Add to calendar" />
					<Chip
						variant="assist"
						label="Add to calendar"
						leadingIcon={<Icon name="calendar_today" className="w-4.5 h-4.5" />}
					/>
					<Chip
						variant="assist"
						label="Find nearby"
						leadingIcon={<Icon name="location_on" className="w-4.5 h-4.5" />}
					/>
					<Chip
						variant="assist"
						label="Take photo"
						leadingIcon={<Icon name="photo_camera" className="w-4.5 h-4.5" />}
					/>
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Elevated
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip variant="assist" elevated label="Add to calendar" />
					<Chip
						variant="assist"
						elevated
						label="Add to calendar"
						leadingIcon={<Icon name="calendar_today" className="w-4.5 h-4.5" />}
					/>
					<Chip
						variant="assist"
						elevated
						label="Find nearby"
						leadingIcon={<Icon name="location_on" className="w-4.5 h-4.5" />}
					/>
				</div>
			</div>
		</div>
	);
}
