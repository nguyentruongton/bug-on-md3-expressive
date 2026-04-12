"use client";

import { Slider, type SliderTrackSize } from "@bug-on/md3-react";

const SIZES: { size: SliderTrackSize; label: string; desc: string }[] = [
	{ size: "xs", label: "Extra Small", desc: "4px — Minimal footprint" },
	{ size: "s", label: "Small", desc: "8px — Compact UI" },
	{ size: "m", label: "Medium", desc: "12px — Default size" },
	{ size: "l", label: "Large", desc: "16px — Prominent control" },
	{ size: "xl", label: "Extra Large", desc: "32px — Maximum emphasis" },
];

export default function SliderSizesDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-5">
			{SIZES.map(({ size, label, desc }) => (
				<div key={size} className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<span className="text-sm font-medium text-(--md-sys-color-on-surface)">
							{label}
						</span>
						<span className="text-xs text-(--md-sys-color-on-surface-variant)">
							{desc}
						</span>
					</div>
					<Slider
						defaultValue={50}
						trackSize={size}
						aria-label={label}
						showValueIndicator
					/>
				</div>
			))}
		</div>
	);
}
