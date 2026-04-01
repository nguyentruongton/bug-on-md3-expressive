"use client";

import { Checkbox } from "@bug-on/md3-react";
import * as React from "react";

export default function CheckboxBasicDemo() {
	const [checked, setChecked] = React.useState(true);

	return (
		<div className="flex flex-wrap gap-12 items-center">
			<div className="flex flex-col gap-2 items-center">
				<Checkbox
					checked={checked}
					onCheckedChange={setChecked}
					aria-label="Controlled checkbox"
				/>
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Controlled
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox defaultChecked={false} aria-label="Uncontrolled checkbox" />
				<span className="text-xs text-m3-on-surface-variant font-medium">
					Uncontrolled
				</span>
			</div>

			<div className="flex flex-col gap-2 items-center">
				<Checkbox checked={true} aria-label="ReadOnly checked" />
				<span className="text-xs text-m3-on-surface-variant font-medium">
					ReadOnly
				</span>
			</div>
		</div>
	);
}
