import { RadioButton, RadioGroup } from "@bug-on/md3-react";

export default function RadioButtonHorizontalDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-lg">
			<RadioGroup
				name="horizontal-group"
				defaultValue="morning"
				orientation="horizontal"
				label="Select time of day"
			>
				<RadioButton value="morning" label="Morning" />
				<RadioButton value="afternoon" label="Afternoon" />
				<RadioButton value="evening" label="Evening" />
			</RadioGroup>
		</div>
	);
}
