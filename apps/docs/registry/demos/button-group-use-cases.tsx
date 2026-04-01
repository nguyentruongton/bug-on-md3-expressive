"use client";

import { Button, ButtonGroup, Icon } from "@bug-on/md3-react";
import React from "react";

export default function ButtonGroupUseCasesDemo() {
	const [selectedSizes, setSelectedSizes] = React.useState<string[]>(["M"]);

	const toggleSize = (size: string) => {
		setSelectedSizes((prev) =>
			prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
		);
	};

	return (
		<div className="flex flex-col gap-8">
			{/* Multi-select */}
			<div className="p-8 border border-m3-outline-variant rounded-xl bg-m3-surface-container-lowest">
				<h3 className="text-lg font-medium mb-4">Multi-selection (Toggle)</h3>
				<p className="text-sm text-m3-on-surface-variant mb-6">
					Allow users to select multiple options in a single group.
				</p>
				<div className="w-full overflow-x-auto pb-2 flex justify-start">
					<ButtonGroup variant="connected" className="min-w-max">
						{["S", "M", "L", "XL"].map((size) => (
							<Button
								key={size}
								variant="toggle"
								selected={selectedSizes.includes(size)}
								onClick={() => toggleSize(size)}
							>
								{size}
							</Button>
						))}
					</ButtonGroup>
				</div>
			</div>

			{/* Icon Only */}
			<div className="p-8 border border-m3-outline-variant rounded-xl bg-m3-surface-container-lowest">
				<h3 className="text-lg font-medium mb-4">Icon-only Toolbar</h3>
				<p className="text-sm text-m3-on-surface-variant mb-6">
					Compact groups for editing or formatting actions.
				</p>
				<div className="flex flex-col lg:flex-row gap-8 w-full overflow-x-auto pb-2">
					<ButtonGroup variant="connected" className="min-w-max">
						<Button
							variant="toggle"
							selected={false}
							className="px-3"
							title="Bold"
						>
							<span className="font-bold">B</span>
						</Button>
						<Button
							variant="toggle"
							selected={false}
							className="px-3"
							title="Italic"
						>
							<span className="italic">I</span>
						</Button>
						<Button
							variant="toggle"
							selected={false}
							className="px-3"
							title="Underline"
						>
							<span className="underline">U</span>
						</Button>
					</ButtonGroup>

					<ButtonGroup variant="standard" className="min-w-max">
						<Button colorStyle="tonal" className="px-3">
							<Icon name="add" size={20} />
						</Button>
						<Button colorStyle="filled" className="px-3">
							<Icon name="close" size={20} />
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
}
