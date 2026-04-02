"use client";

import { TextField } from "@bug-on/md3-react";

export default function TextFieldBasicDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			<TextField label="First name" />
			<TextField variant="outlined" label="Last name" />
		</div>
	);
}
