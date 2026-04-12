"use client";
import { Slider } from "@bug-on/md3-react";

export default function SliderLabelsDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-12 p-4">
			{/* 1. Category Labels */}
			<div className="flex flex-col gap-3">
				<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
					Priority Level
				</span>
				<div className="flex flex-col">
					<Slider
						defaultValue={50}
						min={0}
						max={100}
						step={25}
						showTicks
						aria-label="Priority level selection"
					/>
					<div className="flex justify-between px-1 mt-1">
						<span className="text-[10px] font-bold text-(--md-sys-color-on-surface-variant)">
							LOW
						</span>
						<span className="text-[10px] font-bold text-(--md-sys-color-on-surface-variant)">
							MEDIUM
						</span>
						<span className="text-[10px] font-bold text-(--md-sys-color-on-surface-variant)">
							HIGH
						</span>
					</div>
				</div>
			</div>

			{/* 2. Numeric Range Labels */}
			<div className="flex flex-col gap-3">
				<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
					Search Radius
				</span>
				<div className="flex flex-col">
					<Slider
						defaultValue={5}
						min={1}
						max={10}
						step={1}
						variant="secondary"
						showTicks
						aria-label="Search radius selection"
					/>
					<div className="flex justify-between px-1 mt-1">
						<span className="text-[10px] font-bold text-(--md-sys-color-secondary)">
							1 KM
						</span>
						{["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"].map((id) => (
							<span
								key={id}
								className="text-[10px] font-bold text-(--md-sys-color-on-surface-variant)"
							>
								|
							</span>
						))}
						<span className="text-[10px] font-bold text-(--md-sys-color-secondary)">
							10 KM
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
