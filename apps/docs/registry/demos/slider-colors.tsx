"use client"; // Updated to force server-side refresh and resolve hydration mismatch
import { Slider, type SliderVariant } from "@bug-on/md3-react";

const VARIANTS: { id: SliderVariant; label: string; desc: string }[] = [
	{ id: "primary", label: "Primary", desc: "Main brand color (default)" },
	{ id: "secondary", label: "Secondary", desc: "Less prominent tasks" },
	{ id: "tertiary", label: "Tertiary", desc: "Accent or neutral actions" },
	{ id: "error", label: "Error", desc: "Alert or critical states" },
];

export default function SliderColorsDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-6 p-4">
			{VARIANTS.map(({ id, label, desc }) => (
				<div key={id} className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
							{label}
						</span>
						<span className="text-xs text-(--md-sys-color-on-surface-variant)">
							{desc}
						</span>
					</div>
					<Slider
						defaultValue={id === "error" ? 80 : 50}
						variant={id}
						showValueIndicator
						aria-label={`${label} color variant`}
					/>
				</div>
			))}
		</div>
	);
}
