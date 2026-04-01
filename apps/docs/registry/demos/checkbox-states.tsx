"use client";

import { Checkbox } from "@bug-on/md3-react";

export default function CheckboxStatesDemo() {
	return (
		<div className="flex flex-wrap gap-12 items-center">
			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					disabled={true}
					checked={true}
					aria-label="Disabled Checked"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Disabled Checked
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					disabled={true}
					checked={false}
					aria-label="Disabled Unchecked"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Disabled Unchecked
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox error={true} checked={true} aria-label="Error Checked" />
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Error Checked
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox error={true} checked={false} aria-label="Error Unchecked" />
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Error Unchecked
				</span>
			</div>
		</div>
	);
}
