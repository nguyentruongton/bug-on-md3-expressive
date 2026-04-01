"use client";

import { type CheckboxState, TriStateCheckbox } from "@bug-on/md3-react";
import * as React from "react";

export default function CheckboxTriStateDemo() {
	const [state, setState] = React.useState<CheckboxState>("unchecked");

	return (
		<div className="flex flex-col gap-4 items-center">
			<TriStateCheckbox
				state={state}
				onStateChange={setState}
				label={`Current state: ${state}`}
			/>
			<p className="text-sm text-m3-on-surface-variant">
				Click to cycle: Unchecked → Checked → Indeterminate
			</p>
		</div>
	);
}
