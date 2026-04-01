"use client";

import { Button, Checkbox } from "@bug-on/md3-react";
import * as React from "react";

export default function CheckboxAdvancedFormDemo() {
	const [submittedData, setSubmittedData] = React.useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		setSubmittedData(JSON.stringify(data, null, 2));
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Checkbox
					name="newsletter"
					value="subscribed"
					label="Subscribe to newsletter"
					defaultChecked
				/>
				<Checkbox
					name="terms"
					value="accepted"
					label="I accept the terms"
					aria-required
				/>

				<div className="mt-2">
					<Button type="submit" colorStyle="filled">
						Submit Form
					</Button>
				</div>
			</form>

			{submittedData && (
				<pre className="p-4 bg-m3-surface-container-low rounded-m3-md text-xs font-mono overflow-auto">
					{submittedData}
				</pre>
			)}
		</div>
	);
}
