"use client";
import { Icon, Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderInsetIconDemo() {
	const [v1, setV1] = React.useState(25);
	const [v2, setV2] = React.useState(75);
	const [v3, setV3] = React.useState(50);

	return (
		<div className="flex w-full max-w-lg flex-col gap-12 p-4">
			{/* 1. Leading Inset Icon (Size L) */}
			<div className="flex flex-col gap-3">
				<div className="flex justify-between text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					<span>Leading Inset with swap at min</span>
					<span className="font-bold tabular-nums text-(--md-sys-color-primary)">
						{Math.round(v1)}
					</span>
				</div>
				<Slider
					value={v1}
					onValueChange={setV1}
					trackSize="l"
					insetIcon={<Icon name="volume_up" size={18} />}
					insetIconAtMin={<Icon name="volume_off" size={18} />}
					aria-label="Leading inset icon demo"
				/>
			</div>

			{/* 2. Trailing Inset Icon (Size L) */}
			<div className="flex flex-col gap-3">
				<div className="flex justify-between text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					<span>Trailing Inset with swap at max</span>
					<span className="font-bold tabular-nums text-(--md-sys-color-secondary)">
						{Math.round(v2)}
					</span>
				</div>
				<Slider
					value={v2}
					onValueChange={setV2}
					trackSize="l"
					variant="secondary"
					insetIconTrailing={<Icon name="notifications_active" size={18} />}
					insetIconAtMax={<Icon name="notifications_off" size={18} />}
					aria-label="Trailing inset icon demo"
				/>
			</div>

			{/* 3. Combined Inset Icons (Size XL) */}
			<div className="flex flex-col gap-3">
				<div className="flex justify-between text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					<span>Dual Insets (Size XL)</span>
					<span className="font-bold tabular-nums text-(--md-sys-color-tertiary)">
						{Math.round(v3)}
					</span>
				</div>
				<Slider
					value={v3}
					onValueChange={setV3}
					trackSize="xl"
					variant="tertiary"
					insetIcon={<Icon name="brightness_low" size={24} />}
					insetIconTrailing={<Icon name="brightness_high" size={24} />}
					aria-label="Dual inset icons demo"
				/>
			</div>
		</div>
	);
}
