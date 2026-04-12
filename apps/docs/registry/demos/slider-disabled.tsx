"use client";
import { Slider } from "@bug-on/md3-react";

export default function SliderDisabledDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-6">
			<div className="flex flex-col gap-2">
				<span className="text-sm text-(--md-sys-color-on-surface-variant)">
					Disabled (continuous)
				</span>
				<Slider
					defaultValue={60}
					disabled
					aria-label="Disabled slider"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-sm text-(--md-sys-color-on-surface-variant)">
					Disabled (discrete, step=10)
				</span>
				<Slider
					defaultValue={40}
					disabled
					step={10}
					aria-label="Disabled discrete slider"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-sm text-(--md-sys-color-on-surface-variant)">
					Disabled (large track)
				</span>
				<Slider
					defaultValue={70}
					disabled
					trackSize="l"
					aria-label="Disabled large slider"
				/>
			</div>
		</div>
	);
}
