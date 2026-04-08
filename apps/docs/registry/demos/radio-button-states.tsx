import { RadioButton, RadioGroup } from "@bug-on/md3-react";

export default function RadioButtonStatesDemo() {
	return (
		<div className="flex flex-col gap-12 w-full max-w-sm">
			{/* Disabled Group */}
			<div>
				<h3 className="text-sm font-medium text-m3-on-surface-variant mb-4">
					Disabled Group
				</h3>
				<RadioGroup
					name="disabled-group"
					defaultValue="selected"
					disabled
					label="Disabled Group"
				>
					<RadioButton value="selected" label="Disabled & Selected" />
					<RadioButton value="unselected" label="Disabled & Unselected" />
				</RadioGroup>
			</div>

			{/* Error State */}
			<div>
				<h3 className="text-sm font-medium text-m3-error mb-4">Error State</h3>
				<RadioGroup
					name="error-group"
					defaultValue="error-1"
					label="Error Group"
				>
					<RadioButton value="error-1" label="Invalid Option 1" error />
					<RadioButton value="error-2" label="Invalid Option 2" color="error" />
				</RadioGroup>
			</div>

			{/* Mixed States */}
			<div>
				<h3 className="text-sm font-medium text-m3-on-surface-variant mb-4">
					Mixed States (Individual)
				</h3>
				<div className="flex flex-col gap-4">
					<RadioButton
						name="standalone"
						value="1"
						label="Standalone Uncontrolled"
					/>
					<RadioButton
						name="standalone"
						value="2"
						label="Standalone Disabled"
						disabled
					/>
					<RadioButton
						name="standalone"
						value="3"
						label="Standalone Error"
						error
						defaultSelected
					/>
				</div>
			</div>
		</div>
	);
}
