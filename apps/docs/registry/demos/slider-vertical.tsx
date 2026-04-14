"use client";
import { Icon, Slider } from "@bug-on/md3-react";
import * as React from "react";

export default function SliderVerticalDemo() {
	const [v1, setV1] = React.useState(60);
	const [v2, setV2] = React.useState(30);
	const [v3, setV3] = React.useState(75);

	return (
		<div className="flex w-full flex-wrap items-end justify-center gap-12 p-4">
			{/* 1. Basic Vertical */}
			<div className="flex flex-col items-center gap-4">
				<span className="text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					Basic
				</span>
				<div className="h-48">
					<Slider
						value={v1}
						onValueChange={setV1}
						orientation="vertical"
						aria-label="Basic vertical slider"
					/>
				</div>
				<span className="text-sm font-bold text-(--md-sys-color-primary)">
					{Math.round(v1)}%
				</span>
			</div>

			{/* 2. Vertical with External Icons */}
			<div className="flex flex-col items-center gap-4">
				<span className="text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					External Icons
				</span>
				<div className="flex h-48 flex-col items-center gap-2">
					<Icon
						name="volume_up"
						size={20}
						className="text-(--md-sys-color-on-surface-variant)"
					/>
					<Slider
						value={v2}
						onValueChange={setV2}
						orientation="vertical"
						variant="secondary"
						className="flex-1"
						aria-label="Vertical slider with external icons"
					/>
					<Icon
						name="volume_mute"
						size={20}
						className="text-(--md-sys-color-on-surface-variant)"
					/>
				</div>
				<span className="text-sm font-bold text-(--md-sys-color-secondary)">
					{Math.round(v2)}%
				</span>
			</div>

			{/* 3. Vertical with Inset Icons */}
			<div className="flex flex-col items-center gap-4">
				<span className="text-xs font-medium text-(--md-sys-color-on-surface-variant)">
					Inset Icons
				</span>
				<div className="h-48">
					<Slider
						value={v3}
						onValueChange={setV3}
						orientation="vertical"
						trackSize="l"
						variant="tertiary"
						insetIcon={<Icon name="light_mode" size={18} />}
						insetIconAtMin={<Icon name="dark_mode" size={18} />}
						aria-label="Vertical slider with inset icons"
					/>
				</div>
				<span className="text-sm font-bold text-(--md-sys-color-tertiary)">
					{Math.round(v3)}%
				</span>
			</div>
		</div>
	);
}
