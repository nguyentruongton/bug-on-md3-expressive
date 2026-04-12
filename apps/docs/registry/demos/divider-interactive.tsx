"use client";

import { Card, Divider, Slider } from "@bug-on/md3-react";
import { useState } from "react";

export default function DividerInteractive() {
	const [variant, setVariant] = useState<
		"full-bleed" | "inset" | "middle-inset" | "subheader"
	>("full-bleed");
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);
	const [shape, setShape] = useState<"flat" | "wavy">("flat");
	const [insetStart, setInsetStart] = useState<"standard" | "icon">("standard");
	const [animate, setAnimate] = useState(true);
	const [decorative, setDecorative] = useState(false);
	const [amplitude, setAmplitude] = useState(2);
	const [wavelength, setWavelength] = useState(32);
	const [strokeWidth, setStrokeWidth] = useState(1);
	const [key, setKey] = useState(0);

	const replayAnimation = () => setKey(key + 1);

	return (
		<Card
			variant="outlined"
			className="p-6 md:p-8 flex flex-col xl:flex-row gap-8 bg-m3-surface-container-lowest"
		>
			{/* Controls Panel */}
			<div className="flex-1 flex flex-col gap-6 xl:max-w-md bg-m3-surface-container p-6 rounded-2xl">
				<h3 className="text-lg font-medium text-m3-on-surface mb-2">
					Interactive Playground
				</h3>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="variant-select"
							className="text-sm font-medium text-m3-on-surface mb-2 block"
						>
							Variant
						</label>
						<select
							id="variant-select"
							className="w-full p-2.5 rounded-xl bg-m3-surface-container-highest border border-m3-outline-variant text-m3-on-surface focus:border-m3-primary transition-colors"
							value={variant}
							onChange={(e) =>
								setVariant(
									e.target.value as
										| "full-bleed"
										| "inset"
										| "middle-inset"
										| "subheader",
								)
							}
						>
							<option value="full-bleed">Full-bleed</option>
							<option value="inset">Inset</option>
							<option value="middle-inset">Middle-inset</option>
							<option value="subheader">Subheader</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="orientation-select"
							className="text-sm font-medium text-m3-on-surface mb-2 block"
						>
							Orientation
						</label>
						<select
							id="orientation-select"
							className="w-full p-2.5 rounded-xl bg-m3-surface-container-highest border border-m3-outline-variant text-m3-on-surface focus:border-m3-primary transition-colors"
							value={orientation}
							onChange={(e) =>
								setOrientation(e.target.value as "horizontal" | "vertical")
							}
						>
							<option value="horizontal">Horizontal</option>
							<option value="vertical">Vertical</option>
						</select>
					</div>
				</div>

				{variant === "inset" && (
					<div>
						<span className="text-sm font-medium text-m3-on-surface mb-2 block">
							Inset Start
						</span>
						<div className="flex bg-m3-surface-container-highest rounded-full p-1 border border-m3-outline-variant">
							<button
								type="button"
								onClick={() => setInsetStart("standard")}
								className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${insetStart === "standard" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
							>
								Standard (16px)
							</button>
							<button
								type="button"
								onClick={() => setInsetStart("icon")}
								className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${insetStart === "icon" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
							>
								Icon (72px)
							</button>
						</div>
					</div>
				)}

				<div>
					<span className="text-sm font-medium text-m3-on-surface mb-2 block">
						Shape
					</span>
					<div className="flex bg-m3-surface-container-highest rounded-full p-1 border border-m3-outline-variant">
						<button
							type="button"
							disabled={orientation === "vertical"}
							onClick={() => setShape("flat")}
							className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${shape === "flat" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
						>
							Flat
						</button>
						<button
							type="button"
							disabled={orientation === "vertical"}
							onClick={() => setShape("wavy")}
							className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${shape === "wavy" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
						>
							Wavy
						</button>
					</div>
					{orientation === "vertical" && (
						<p className="text-[10px] text-m3-error mt-1 ml-1 font-medium">
							Wavy is not supported in vertical orientation.
						</p>
					)}
				</div>

				{shape === "wavy" && orientation === "horizontal" && (
					<div className="pt-2 border-t border-m3-outline-variant/30 flex flex-col gap-4">
						<h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface-variant">
							Wave Customization
						</h4>
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span
									id="amplitude-label"
									className="font-medium text-m3-on-surface-variant"
								>
									Amplitude
								</span>
								<span className="text-m3-primary font-mono">{amplitude}px</span>
							</div>
							<Slider
								aria-labelledby="amplitude-label"
								min={1}
								max={10}
								step={0.5}
								value={amplitude}
								onValueChange={setAmplitude}
							/>
						</div>
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span
									id="wavelength-label"
									className="font-medium text-m3-on-surface-variant"
								>
									Wavelength
								</span>
								<span className="text-m3-primary font-mono">
									{wavelength}px
								</span>
							</div>
							<Slider
								aria-labelledby="wavelength-label"
								min={8}
								max={64}
								step={1}
								value={wavelength}
								onValueChange={setWavelength}
							/>
						</div>
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span
									id="stroke-width-label"
									className="font-medium text-m3-on-surface-variant"
								>
									Stroke Width
								</span>
								<span className="text-m3-primary font-mono">
									{strokeWidth}px
								</span>
							</div>
							<Slider
								aria-labelledby="stroke-width-label"
								min={1}
								max={6}
								step={0.5}
								value={strokeWidth}
								onValueChange={setStrokeWidth}
							/>
						</div>
					</div>
				)}

				<div className="pt-2 border-t border-m3-outline-variant/30 grid grid-cols-2 gap-4">
					<label className="flex items-center gap-3 cursor-pointer group">
						<div className="relative flex items-center">
							<input
								type="checkbox"
								className="sr-only"
								checked={animate}
								onChange={(e) => setAnimate(e.target.checked)}
							/>
							<div
								className={`w-10 h-6 rounded-full transition-colors ${animate ? "bg-m3-primary" : "bg-m3-surface-container-highest"}`}
							/>
							<div
								className={`absolute left-1 w-4 h-4 rounded-full bg-white transition-transform ${animate ? "translate-x-4" : ""}`}
							/>
						</div>
						<span className="text-sm font-medium text-m3-on-surface">
							Animate
						</span>
					</label>

					<label className="flex items-center gap-3 cursor-pointer group">
						<div className="relative flex items-center">
							<input
								type="checkbox"
								className="sr-only"
								checked={decorative}
								onChange={(e) => setDecorative(e.target.checked)}
							/>
							<div
								className={`w-10 h-6 rounded-full transition-colors ${decorative ? "bg-m3-primary" : "bg-m3-surface-container-highest"}`}
							/>
							<div
								className={`absolute left-1 w-4 h-4 rounded-full bg-white transition-transform ${decorative ? "translate-x-4" : ""}`}
							/>
						</div>
						<span className="text-sm font-medium text-m3-on-surface">
							Decorative
						</span>
					</label>
				</div>

				<button
					type="button"
					onClick={replayAnimation}
					className="w-full py-2.5 px-4 rounded-xl bg-m3-primary text-m3-on-primary font-medium hover:bg-m3-primary/90 transition-colors shadow-sm active:scale-[0.98]"
				>
					Re-play Entrance Animation
				</button>
			</div>

			{/* Preview Panel */}
			<div className="flex-2 flex flex-col items-center justify-center p-8 min-h-75 border-t xl:border-t-0 xl:border-l border-m3-outline-variant/30">
				<div className="flex-1 flex w-full items-center justify-center relative">
					<div
						className={`flex items-center justify-center ${orientation === "horizontal" ? "w-full flex-col gap-4" : "h-full flex-row gap-4"}`}
					>
						<div className="text-xs text-m3-on-surface-variant font-medium opacity-60">
							{orientation === "horizontal" ? "Content Above" : "Content Left"}
						</div>
						<div
							className={`${orientation === "horizontal" ? "w-full" : "h-32"}`}
						>
							<Divider
								key={key}
								variant={variant}
								orientation={orientation}
								shape={shape}
								insetStart={insetStart}
								animate={animate}
								decorative={decorative}
								waveConfig={{
									amplitude,
									wavelength,
									strokeWidth,
								}}
							/>
						</div>
						<div className="text-xs text-m3-on-surface-variant font-medium opacity-60">
							{orientation === "horizontal" ? "Content Below" : "Content Right"}
						</div>
					</div>
				</div>

				<div className="mt-8 w-full">
					<div className="bg-m3-surface-container-low border border-m3-outline-variant/50 p-4 rounded-xl font-mono text-xs text-m3-on-surface-variant overflow-x-auto whitespace-pre">
						<span className="text-m3-primary">{"<Divider"}</span>
						{variant !== "full-bleed" && (
							<>
								<br />
								{"  "}variant=
								<span className="text-green-600 dark:text-green-400">
									"{variant}"
								</span>
							</>
						)}
						{orientation !== "horizontal" && (
							<>
								<br />
								{"  "}orientation=
								<span className="text-green-600 dark:text-green-400">
									"{orientation}"
								</span>
							</>
						)}
						{shape !== "flat" && (
							<>
								<br />
								{"  "}shape=
								<span className="text-green-600 dark:text-green-400">
									"{shape}"
								</span>
							</>
						)}
						{variant === "inset" && insetStart !== "standard" && (
							<>
								<br />
								{"  "}insetStart=
								<span className="text-green-600 dark:text-green-400">
									"{insetStart}"
								</span>
							</>
						)}
						{shape === "wavy" &&
							(amplitude !== 2 || wavelength !== 32 || strokeWidth !== 1) && (
								<>
									<br />
									{"  "}waveConfig={"{{"} amplitude: {amplitude}, wavelength:{" "}
									{wavelength}, strokeWidth: {strokeWidth} {"}}"}{" "}
								</>
							)}
						{!animate && (
							<>
								<br />
								{"  "}animate={"{"}
								<span className="text-blue-600 dark:text-blue-400">false</span>
								{"}"}
							</>
						)}
						{decorative && (
							<>
								<br />
								{"  "}decorative
							</>
						)}
						<br />
						<span className="text-m3-primary">{" />"}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
