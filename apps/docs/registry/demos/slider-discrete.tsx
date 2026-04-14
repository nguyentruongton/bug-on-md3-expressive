"use client";
import { Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderDiscreteDemo() {
	const [v1, setV1] = React.useState(40);
	const [v2, setV2] = React.useState(60);

	return (
		<div className="flex w-full max-w-sm flex-col gap-10">
			{/* 1. Discrete with Tick Marks */}
			<div className="flex flex-col gap-3">
				<div className="flex justify-between text-sm font-medium">
					<span className="text-(--md-sys-color-on-surface-variant)">
						Discrete steps (step: 10)
					</span>
					<span className="text-(--md-sys-color-primary)">
						{Math.round(v1)}%
					</span>
				</div>
				<Slider
					value={v1}
					onValueChange={setV1}
					min={0}
					max={100}
					step={10}
					showTicks
					showValueIndicator
					aria-label="Discrete slider with ticks"
					formatValue={(v) => `${v}%`}
				/>
			</div>

			{/* 2. Discrete without Ticks (Clean UI) */}
			<div className="flex flex-col gap-3">
				<div className="flex justify-between text-sm font-medium">
					<span className="text-(--md-sys-color-on-surface-variant)">
						Hidden ticks (Cleaner UI)
					</span>
					<span className="text-(--md-sys-color-secondary)">
						{Math.round(v2)}%
					</span>
				</div>
				<Slider
					value={v2}
					onValueChange={setV2}
					min={0}
					max={100}
					step={5}
					variant="secondary"
					showValueIndicator
					aria-label="Discrete slider without ticks"
				/>
			</div>
		</div>
	);
}
