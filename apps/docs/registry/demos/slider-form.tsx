"use client"; // Updated to force server-side refresh and resolve hydration mismatch
import { Button, Icon, Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderFormDemo() {
	const [brightness, setBrightness] = React.useState(70);
	const [nightLight, setNightLight] = React.useState(0);

	return (
		<div className="flex w-full max-w-sm flex-col gap-8 rounded-2xl bg-(--md-sys-color-surface-container-low) p-6 shadow-sm">
			<div className="flex flex-col gap-1">
				<h3 className="text-lg font-bold text-(--md-sys-color-on-surface)">
					Display & Brightness
				</h3>
				<p className="text-sm text-(--md-sys-color-on-surface-variant)">
					Customize your viewing experience
				</p>
			</div>

			{/* Brightness */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Icon
							name="wb_sunny"
							size={24}
							className="text-(--md-sys-color-primary)"
						/>
						<div className="flex flex-col">
							<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
								Manual Brightness
							</span>
							<span className="text-xs text-(--md-sys-color-on-surface-variant)">
								Adapts to ambient light
							</span>
						</div>
					</div>
					<span className="text-sm font-bold text-(--md-sys-color-primary)">
						{Math.round(brightness)}%
					</span>
				</div>
				<Slider
					value={brightness}
					onValueChange={setBrightness}
					showValueIndicator
					aria-label="Screen brightness"
				/>
			</div>

			{/* Night Light */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Icon
							name="nightlight"
							size={24}
							className="text-(--md-sys-color-tertiary)"
						/>
						<div className="flex flex-col">
							<span className="text-sm font-bold text-(--md-sys-color-on-surface)">
								Night Light Intensity
							</span>
							<span className="text-xs text-(--md-sys-color-on-surface-variant)">
								Reduces eye strain at night
							</span>
						</div>
					</div>
					<span className="text-sm font-bold text-(--md-sys-color-tertiary)">
						{Math.round(nightLight)}%
					</span>
				</div>
				<Slider
					value={nightLight}
					onValueChange={setNightLight}
					variant="tertiary"
					showValueIndicator
					aria-label="Night light intensity"
				/>
				{nightLight > 80 && (
					<div className="flex items-center gap-2 rounded-lg bg-(--md-sys-color-error-container) p-3 text-(--md-sys-color-on-error-container)">
						<Icon name="warning" size={18} />
						<span className="text-xs font-medium">
							High night light levels may significantly change display colors.
						</span>
					</div>
				)}
			</div>

			<div className="flex justify-end gap-2">
				<Button
					colorStyle="text"
					size="sm"
					onClick={() => {
						setBrightness(70);
						setNightLight(0);
					}}
				>
					Reset
				</Button>
			</div>
		</div>
	);
}
