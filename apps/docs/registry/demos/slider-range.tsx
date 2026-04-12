"use client";
import { Icon, RangeSlider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderRangeDemo() {
	const [r1, setR1] = React.useState<[number, number]>([20, 80]);
	const [r2, setR2] = React.useState<[number, number]>([200, 700]);

	const formatPrice = (v: number) => `$${v}`;

	return (
		<div className="flex w-full max-w-sm flex-col gap-10 p-4">
			{/* 1. Basic Range Slider */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between text-sm font-medium">
					<span className="text-(--md-sys-color-on-surface-variant)">Price Range</span>
					<span className="text-(--md-sys-color-primary)">{formatPrice(r1[0])} - {formatPrice(r1[1])}</span>
				</div>
				<RangeSlider
					value={r1}
					onValueChange={setR1}
					min={0}
					max={100}
					aria-label="Price range filter"
				/>
			</div>

			{/* 2. Discrete Range Slider with Ticks */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between text-sm font-medium">
					<div className="flex items-center gap-2">
						<Icon name="tune" size={18} />
						<span className="text-(--md-sys-color-on-surface-variant)">Discrete Interval</span>
					</div>
					<span className="text-(--md-sys-color-secondary)">{r2[0]}ms - {r2[1]}ms</span>
				</div>
				<RangeSlider
					value={r2}
					onValueChange={setR2}
					min={0}
					max={1000}
					step={100}
					showTicks
					variant="secondary"
					showValueIndicator
					formatValue={(v) => `${v}ms`}
					aria-label="Interval range filter"
				/>
			</div>
		</div>
	);
}
