"use client";
import { RangeSlider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderRangeDiscreteDemo() {
	const [range, setRange] = React.useState<[number, number]>([20, 80]);

	return (
		<div className="flex w-full max-w-sm flex-col gap-8 p-4">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
						Age Range (Discrete)
					</span>
					<span className="text-sm font-bold text-(--md-sys-color-primary)">
						{Math.round(range[0])} - {Math.round(range[1])} years old
					</span>
				</div>
				<RangeSlider
					value={range}
					onValueChange={setRange}
					min={0}
					max={100}
					step={10}
					showTicks
					showValueIndicator
					aria-label="Age range filter"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
						Working Hours (Secondary)
					</span>
					<span className="text-xs font-medium text-(--md-sys-color-secondary)">
						8:00 - 18:00
					</span>
				</div>
				<RangeSlider
					defaultValue={[8, 18]}
					min={0}
					max={24}
					step={1}
					variant="secondary"
					showValueIndicator
					formatValue={(v) => `${v}:00`}
					aria-label="Working hours range"
				/>
			</div>
		</div>
	);
}
