import { RadioButton, RadioGroup } from "@bug-on/md3-react";

export default function RadioButtonBasicDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			<RadioGroup
				name="basic-group"
				defaultValue="apple"
				label="Select a fruit"
			>
				<RadioButton value="apple" label="Apple" />
				<RadioButton value="banana" label="Banana" />
				<RadioButton value="orange" label="Orange" />
			</RadioGroup>
		</div>
	);
}
