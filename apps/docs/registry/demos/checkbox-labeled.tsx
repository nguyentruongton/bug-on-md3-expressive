"use client";

import { Checkbox } from "@bug-on/md3-react";

export default function CheckboxLabeledDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			<Checkbox
				label="I accept the terms and conditions"
				defaultChecked={false}
			/>

			<Checkbox label="Subscribe to newsletter" defaultChecked={true} />

			<Checkbox label="Disabled option" disabled defaultChecked={false} />

			<Checkbox
				label="Required field"
				aria-required
				error
				defaultChecked={false}
			/>
		</div>
	);
}
