"use client";
import { Icon, Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderWithIconsDemo() {
	const [value, setValue] = React.useState(30);

	return (
		<div className="flex w-full max-w-sm flex-col gap-8 p-4">
			{/* Leading and Trailing Icons */}
			<div className="flex flex-col gap-2">
				<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
					Leading & Trailing Icons
				</span>
				<div className="flex items-center gap-4">
					<Icon
						name={
							value === 0
								? "volume_mute"
								: value < 50
									? "volume_down"
									: "volume_up"
						}
						size={24}
						className="text-(--md-sys-color-on-surface-variant)"
					/>
					<Slider
						value={value}
						onValueChange={setValue}
						aria-label="Volume with icons"
						className="flex-1"
					/>
					<span className="min-w-8 text-right text-sm font-medium text-(--md-sys-color-on-surface)">
						{Math.round(value)}%
					</span>
				</div>
			</div>

			{/* Leading Icon only */}
			<div className="flex flex-col gap-2">
				<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
					Leading Icon with Secondary Color
				</span>
				<div className="flex items-center gap-4">
					<Icon
						name="brightness_medium"
						size={24}
						className="text-(--md-sys-color-secondary)"
					/>
					<Slider
						defaultValue={65}
						variant="secondary"
						aria-label="Brightness leading icon"
						className="flex-1"
					/>
				</div>
			</div>

			{/* Trailing Icon only */}
			<div className="flex flex-col gap-2">
				<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
					Trailing Icon with Tertiary Color
				</span>
				<div className="flex items-center gap-4">
					<Slider
						defaultValue={40}
						variant="tertiary"
						aria-label="Filter intensity trailing icon"
						className="flex-1"
						showValueIndicator
					/>
					<Icon
						name="filter_vintage"
						size={24}
						className="text-(--md-sys-color-tertiary)"
					/>
				</div>
			</div>
		</div>
	);
}
