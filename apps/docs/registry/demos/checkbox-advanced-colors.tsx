"use client";

import { Checkbox } from "@bug-on/md3-react";

export default function CheckboxAdvancedColorsDemo() {
	return (
		<div className="flex flex-wrap gap-12 items-center">
			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					defaultChecked
					className="[--color-m3-primary:#16a34a]"
					aria-label="Green checkbox"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Green
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					defaultChecked
					className="[--color-m3-primary:#dc2626]"
					aria-label="Red checkbox"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Red
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					defaultChecked
					className="[--color-m3-primary:#9333ea]"
					aria-label="Purple checkbox"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Purple
				</span>
			</div>
		</div>
	);
}
