"use client";
import { Icon, Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderCenteredDemo() {
	const [value, setValue] = React.useState(0);

	return (
		<div className="flex w-full max-w-sm flex-col gap-6 p-4">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-(--md-sys-color-on-surface)">
						<Icon name="settings_input_component" size={20} />
						<span className="text-sm font-medium">Audio Balance</span>
					</div>
					<span className="text-sm font-bold text-(--md-sys-color-primary)">
						{Math.round(value) === 0 ? "Center" : Math.round(value) > 0 ? `R +${Math.round(value)}` : `L +${Math.abs(Math.round(value))}`}
					</span>
				</div>
				<Slider
					value={value}
					onValueChange={setValue}
					min={-50}
					max={50}
					step={1}
					isCentered
					showValueIndicator
					formatValue={(v) => (v === 0 ? "0" : v > 0 ? `R${v}` : `L${Math.abs(v)}`)}
					aria-label="Audio balance selection"
				/>
			</div>
			<p className="text-xs text-(--md-sys-color-on-surface-variant)">
				Centered mode: the active track grows from the center outward. Ideal for panning and exposure controls. 
			</p>
		</div>
	);
}
