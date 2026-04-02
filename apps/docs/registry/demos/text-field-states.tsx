"use client";

import { TextField } from "@bug-on/md3-react";

export default function TextFieldStatesDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			{/* Default */}
			<TextField label="Default" />

			{/* Error with message */}
			<TextField
				label="Email address"
				type="email"
				error
				errorText="Enter a valid email address"
				defaultValue="invalid-email"
			/>

			{/* Disabled */}
			<TextField label="Disabled" disabled defaultValue="Cannot edit this" />

			{/* ReadOnly */}
			<TextField label="Read only" readOnly defaultValue="Just for reading" />

			{/* Required */}
			<TextField label="Required field" required />

			{/* Outlined error */}
			<TextField
				variant="outlined"
				label="Username"
				error
				errorText="Username is already taken"
				defaultValue="john_doe"
			/>
		</div>
	);
}
