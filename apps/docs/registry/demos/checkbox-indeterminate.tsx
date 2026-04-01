"use client";

import { Checkbox } from "@bug-on/md3-react";

export default function CheckboxIndeterminateDemo() {
	return (
		<div className="flex flex-wrap gap-12 items-center">
			<div className="flex flex-col gap-2 items-center">
				<Checkbox indeterminate={true} aria-label="Indeterminate forced" />
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Forced
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					checked={false}
					indeterminate={true}
					aria-label="Indeterminate Unchecked"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Mixed
				</span>
			</div>
		</div>
	);
}
