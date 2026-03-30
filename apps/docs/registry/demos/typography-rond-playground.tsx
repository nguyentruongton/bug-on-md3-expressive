"use client";

import { Card } from "@bug-on/md3-react";
import { useState } from "react";

export default function TypographyRondPlaygroundDemo() {
	const [rond, setRond] = useState(100);

	const previewStyle: React.CSSProperties = {
		fontFamily: "'Google Sans Flex', system-ui, sans-serif",
		fontVariationSettings: `"ROND" ${rond}`,
		fontSize: "2rem",
		fontWeight: 400,
		lineHeight: 1.3,
		transition: "font-variation-settings 0.2s ease",
	};

	return (
		<Card
			variant="outlined"
			className="p-6 md:p-8 flex flex-col gap-8 bg-m3-surface-container-lowest"
		>
			<div className="max-w-2xl">
				<p className="text-sm text-m3-on-surface-variant leading-relaxed">
					Google Sans Flex is a variable font. The <code>ROND</code> axis
					controls corner roundness — from <strong>sharp (0)</strong> to{" "}
					<strong>fully rounded (100)</strong>. The{" "}
					<code>TypographyProvider</code> applies this globally via{" "}
					<code>fontVariationAxes</code>.
				</p>
			</div>

			<div className="flex flex-col gap-3 max-w-sm">
				<div className="flex items-center justify-between">
					<label
						htmlFor="rond-slider"
						className="text-sm font-medium text-m3-on-surface"
					>
						ROND axis
					</label>
					<span className="font-mono text-sm font-semibold text-m3-primary">
						{rond}
					</span>
				</div>
				<input
					id="rond-slider"
					type="range"
					min={0}
					max={100}
					step={1}
					value={rond}
					onChange={(e) => setRond(Number(e.target.value))}
					className="w-full accent-m3-primary"
				/>
				<div className="flex justify-between text-xs text-m3-on-surface-variant">
					<span>0 — Sharp</span>
					<span>100 — Fully Rounded</span>
				</div>
			</div>

			<div className="p-6 bg-m3-surface-container rounded-m3-xl">
				<p className="text-m3-on-surface" style={previewStyle}>
					The quick brown fox jumps over the lazy dog
				</p>
				<p
					className="mt-2 text-m3-on-surface"
					style={{
						...previewStyle,
						fontSize: "1.5rem",
						fontWeight: 700,
					}}
				>
					Almost before we knew it, we had left the ground.
				</p>
			</div>
		</Card>
	);
}
