"use client";

import { Chip, Icon } from "@bug-on/md3-react";
import { useState } from "react";

export default function ChipInputDemo() {
	const [inputTags, setInputTags] = useState([
		"React",
		"TypeScript",
		"Tailwind",
		"Framer Motion",
	]);

	const removeTag = (tag: string) =>
		setInputTags((prev) => prev.filter((t) => t !== tag));

	return (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Interactive — click × to remove
				</p>
				<div className="flex flex-wrap gap-2 min-h-9">
					{inputTags.length > 0 ? (
						inputTags.map((tag) => (
							<Chip
								key={tag}
								variant="input"
								label={tag}
								onRemove={() => removeTag(tag)}
							/>
						))
					) : (
						<span className="text-sm text-m3-on-surface-variant italic">
							All tags removed — reload to reset
						</span>
					)}
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					With leading icon
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip
						variant="input"
						label="Location"
						leadingIcon={<Icon name="location_on" className="w-4.5 h-4.5" />}
						onRemove={() => {}}
					/>
					<Chip
						variant="input"
						label="Calendar"
						leadingIcon={<Icon name="calendar_today" className="w-4.5 h-4.5" />}
						onRemove={() => {}}
					/>
					<Chip
						variant="input"
						label="Tag"
						leadingIcon={<Icon name="label" className="w-4.5 h-4.5" />}
						onRemove={() => {}}
					/>
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					With avatar
				</p>
				<div className="flex flex-wrap gap-2">
					{[
						{
							name: "Alice",
							bg: "bg-m3-primary-container text-m3-on-primary-container",
						},
						{
							name: "Bob",
							bg: "bg-m3-secondary-container text-m3-on-secondary-container",
						},
						{
							name: "Carol",
							bg: "bg-m3-tertiary-container text-m3-on-tertiary-container",
						},
					].map(({ name, bg }) => (
						<Chip
							key={name}
							variant="input"
							label={name}
							avatar={
								<span
									className={`w-full h-full flex items-center justify-center text-xs font-bold ${bg}`}
								>
									{name[0]}
								</span>
							}
							onRemove={() => {}}
						/>
					))}
				</div>
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Selected state
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip variant="input" label="Selected" selected onRemove={() => {}} />
					<Chip
						variant="input"
						label="Icon — selected"
						selected
						leadingIcon={<Icon name="person" className="w-4.5 h-4.5" />}
						onRemove={() => {}}
					/>
				</div>
			</div>
		</div>
	);
}
