"use client";

import { RadioButton, RadioGroup } from "@bug-on/md3-react";
import * as React from "react";

export default function RadioButtonControlledDemo() {
	const [selectedValue, setSelectedValue] = React.useState("standard");

	return (
		<div className="flex flex-col gap-8 w-full max-w-sm">
			<RadioGroup
				name="shipping"
				value={selectedValue}
				onValueChange={setSelectedValue}
				label="Shipping Method"
			>
				<RadioButton value="standard" label="Standard Shipping (3-5 days)" />
				<RadioButton value="express" label="Express Shipping (1-2 days)" />
				<RadioButton value="overnight" label="Overnight Delivery" />
			</RadioGroup>

			<div className="p-4 rounded-xl bg-m3-surface-container-high text-sm text-m3-on-surface">
				Selected Shipping Method:{" "}
				<span className="font-bold">{selectedValue}</span>
			</div>
		</div>
	);
}
