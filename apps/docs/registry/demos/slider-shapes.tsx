"use client";
import { Slider } from "@bug-on/md3-react";

export default function SliderShapesDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-10 p-4">
			{/* 1. Default MD3 Shape (Rounded ends based on height) */}
			<div className="flex flex-col gap-2">
				<span className="text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					MD3 Default (Size-specific radius)
				</span>
				<Slider
					defaultValue={30}
					trackShape="md3"
					aria-label="MD3 default track shape"
				/>
			</div>

			{/* 2. Full Pill Shape */}
			<div className="flex flex-col gap-2">
				<span className="text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					Full Pill (Half-height radius)
				</span>
				<Slider
					defaultValue={50}
					variant="secondary"
					trackShape="full"
					aria-label="Full pill track shape"
				/>
			</div>

			{/* 3. Custom Radius */}
			<div className="flex flex-col gap-2">
				<span className="text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					Custom Radius (4px)
				</span>
				<Slider
					defaultValue={70}
					variant="tertiary"
					trackShape={4}
					aria-label="Custom track radius"
				/>
			</div>
		</div>
	);
}
