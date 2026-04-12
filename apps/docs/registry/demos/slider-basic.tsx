"use client";
import { Icon, Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderBasicDemo() {
	const [value, setValue] = React.useState(40);

	return (
		<div className="flex w-full max-w-sm flex-col gap-6 p-4">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-(--md-sys-color-on-surface)">
						<Icon name="volume_up" size={20} />
						<span className="text-sm font-medium">System Volume</span>
					</div>
					<span className="text-sm font-bold text-(--md-sys-color-primary)">
						{Math.round(value)}%
					</span>
				</div>
				<Slider
					value={value}
					onValueChange={setValue}
					min={0}
					max={100}
					aria-label="Volume slider"
					formatValue={(v) => `${v}%`}
				/>
			</div>

			<p className="text-xs text-(--md-sys-color-on-surface-variant)">
				Drag to adjust the volume. The value indicator tooltip will appear when you interact with the slider.
			</p>
		</div>
	);
}
