"use client";

import { TextField } from "@bug-on/md3-react";

export default function TextFieldSupportingDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			{/* Helper text */}
			<TextField
				label="Username"
				supportingText="Must be 3–20 characters, letters and numbers only"
			/>

			{/* Character counter only */}
			<TextField
				variant="outlined"
				label="Tweet"
				maxLength={280}
				supportingText="Share your thought"
			/>

			{/* Counter at limit — shows red */}
			<TextField
				label="Short bio"
				maxLength={20}
				defaultValue="This is toolonggggggg"
				errorText="Bio cannot exceed 20 characters"
			/>

			{/* Prefix & suffix */}
			<TextField
				label="Amount"
				type="number"
				noSpinner
				prefixText="$"
				suffixText="USD"
				defaultValue="1000"
			/>
		</div>
	);
}
