"use client";
import { Slider } from "@bug-on/md3-react";

export default function SliderStepCustomDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-8 p-4">
			{/* Decimals for Scaling */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
						Zoom Scale (Decimals)
					</span>
					<span className="text-xs font-medium text-(--md-sys-color-secondary)">
						Step: 0.1x
					</span>
				</div>
				<Slider
					defaultValue={1.0}
					min={0.5}
					max={3.0}
					step={0.1}
					variant="secondary"
					showTicks
					showValueIndicator
					formatValue={(v) => `${v.toFixed(1)}x`}
					aria-label="Zoom scale selection"
				/>
			</div>

			{/* Intervals for Ratings */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
						Ratings (Intervals)
					</span>
					<span className="text-xs font-medium text-(--md-sys-color-tertiary)">
						Step: 0.5
					</span>
				</div>
				<Slider
					defaultValue={4}
					min={0}
					max={5}
					step={0.5}
					variant="tertiary"
					showTicks
					showValueIndicator
					aria-label="Rating selection"
				/>
			</div>

			{/* Large Jumps for Percentages */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
						Large Jumps
					</span>
					<span className="text-xs font-medium text-(--md-sys-color-primary)">
						Step: 25%
					</span>
				</div>
				<Slider
					defaultValue={50}
					min={0}
					max={100}
					step={25}
					showTicks
					showValueIndicator
					formatValue={(v) => `${v}%`}
					aria-label="Percentage jump selection"
				/>
			</div>
		</div>
	);
}
