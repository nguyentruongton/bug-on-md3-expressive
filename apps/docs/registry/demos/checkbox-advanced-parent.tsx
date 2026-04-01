"use client";

import {
	Checkbox,
	type CheckboxState,
	TriStateCheckbox,
} from "@bug-on/md3-react";
import * as React from "react";

export default function CheckboxAdvancedParentDemo() {
	const [items, setItems] = React.useState([
		{ id: "1", label: "Item 1", checked: false },
		{ id: "2", label: "Item 2", checked: true },
		{ id: "3", label: "Item 3", checked: false },
	]);

	const allChecked = items.every((i) => i.checked);
	const noneChecked = items.every((i) => !i.checked);

	// Parent state based on children
	const parentState: CheckboxState = allChecked
		? "checked"
		: noneChecked
			? "unchecked"
			: "indeterminate";

	const handleParentChange = (newState: CheckboxState) => {
		// Cycle logic:
		// If unchecked -> click -> select all
		// If checked -> click -> deselect all
		// If indeterminate -> click -> select all
		const targetChecked = newState === "checked";
		setItems(items.map((i) => ({ ...i, checked: targetChecked })));
	};

	const handleChildChange = (id: string, checked: boolean) => {
		setItems(items.map((i) => (i.id === id ? { ...i, checked } : i)));
	};

	return (
		<div className="flex flex-col gap-4 border border-m3-outline-variant/30 p-6 rounded-m3-lg bg-m3-surface-container-lowest w-full max-w-xs shadow-sm">
			<div className="border-b border-m3-outline-variant/30 pb-2 mb-2">
				<TriStateCheckbox
					state={parentState}
					onStateChange={handleParentChange}
					label="Select all"
					className="font-bold text-m3-on-surface"
				/>
			</div>
			<div className="flex flex-col gap-3 pl-6">
				{items.map((item) => (
					<Checkbox
						key={item.id}
						label={item.label}
						checked={item.checked}
						onCheckedChange={(checked) => handleChildChange(item.id, checked)}
					/>
				))}
			</div>
		</div>
	);
}
