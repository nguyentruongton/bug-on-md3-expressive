"use client";

import { TextField } from "@bug-on/md3-react";

export default function TextFieldVariantsDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			{/* Filled */}
			<TextField label="Filled" defaultValue="Hello world" />

			{/* Outlined */}
			<TextField variant="outlined" label="Outlined" defaultValue="Hello world" />

			{/* Filled — no label */}
			<TextField placeholder="Placeholder only (no label)" aria-label="No label field" />

			{/* Outlined — dense */}
			<TextField variant="outlined" label="Dense outlined" dense />
		</div>
	);
}
