"use client";

import { Card, ProgressIndicator } from "@bug-on/md3-react";
import { useState } from "react";

export default function ProgressPlaygroundDemo() {
	const [variant, setVariant] = useState<"linear" | "circular">("linear");
	const [isDeterminate, setIsDeterminate] = useState(false);
	const [value, setValue] = useState(50);
	const [shape, setShape] = useState<"flat" | "wavy">("wavy");
	const [trackShape, setTrackShape] = useState<"flat" | "wavy">("flat");

	const [amplitude, setAmplitude] = useState(4);
	const [wavelength, setWavelength] = useState(20);
	const [gapSize, setGapSize] = useState(4);
	const [waveSpeed, setWaveSpeed] = useState(1);
	const [crawlerSpeed, setCrawlerSpeed] = useState(1);
	const [trackHeight, setTrackHeight] = useState(4); // Default linear height is 4, circular is 4
	const [size, setSize] = useState(48);

	const [determinateAnimation, setDeterminateAnimation] = useState<
		"md3" | "continuous"
	>("md3");
	const [indeterminateAnimation, setIndeterminateAnimation] = useState<
		"md3" | "continuous"
	>("md3");

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
							className="w-full p-2.5 rounded-xl bg-m3-surface-container-highest border border-m3-outline-variant text-m3-on-surface focus:border-m3-primary focus:outline-none transition-colors"
							value={variant}
							onChange={(e) =>
								setVariant(e.target.value as "linear" | "circular")
							}
						>
							<option value="linear">Linear</option>
							<option value="circular">Circular</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="type-select"
							className="text-sm font-medium text-m3-on-surface mb-2 block"
						>
							Type
						</label>
						<select
							id="type-select"
							className="w-full p-2.5 rounded-xl bg-m3-surface-container-highest border border-m3-outline-variant text-m3-on-surface focus:border-m3-primary focus:outline-none transition-colors"
							value={isDeterminate ? "determinate" : "indeterminate"}
							onChange={(e) =>
								setIsDeterminate(e.target.value === "determinate")
							}
						>
							<option value="indeterminate">Indeterminate</option>
							<option value="determinate">Determinate</option>
						</select>
					</div>
				</div>

				{isDeterminate && (
					<div>
						<div className="flex justify-between text-sm mb-1">
							<span className="font-medium text-m3-on-surface">Value</span>
							<span className="text-m3-primary font-mono">{value}%</span>
						</div>
						<input
							aria-label="Value"
							type="range"
							min="0"
							max="100"
							value={value}
							onChange={(e) => setValue(Number(e.target.value))}
							className="w-full accent-m3-primary cursor-pointer"
						/>
					</div>
				)}

				<div className="grid grid-cols-2 gap-4">
					<div>
						<span className="text-sm font-medium text-m3-on-surface mb-2 block">
							Shape
						</span>
						<div className="flex bg-m3-surface-container-highest rounded-full p-1 border border-m3-outline-variant">
							<button
								type="button"
								onClick={() => setShape("flat")}
								className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${shape === "flat" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
							>
								Flat
							</button>
							<button
								type="button"
								onClick={() => setShape("wavy")}
								className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${shape === "wavy" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
							>
								Wavy
							</button>
						</div>
					</div>

					{variant === "linear" && (
						<div>
							<span className="text-sm font-medium text-m3-on-surface mb-2 block">
								Track Shape
							</span>
							<div className="flex bg-m3-surface-container-highest rounded-full p-1 border border-m3-outline-variant">
								<button
									type="button"
									onClick={() => setTrackShape("flat")}
									className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${trackShape === "flat" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
								>
									Flat
								</button>
								<button
									type="button"
									onClick={() => setTrackShape("wavy")}
									className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${trackShape === "wavy" ? "bg-m3-secondary-container text-m3-on-secondary-container shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}
								>
									Wavy
								</button>
							</div>
						</div>
					)}
				</div>

				{(shape === "wavy" ||
					(variant === "linear" && trackShape === "wavy")) && (
					<div className="pt-2 border-t border-m3-outline-variant/30">
						<h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface-variant mb-4">
							Wave Customization
						</h4>
						<div className="flex flex-col gap-4">
							{variant === "linear" && (
								<div>
									<div className="flex justify-between text-sm mb-1">
										<label
											htmlFor="wave-speed"
											className="font-medium text-m3-on-surface-variant"
										>
											Wave Speed
										</label>
										<span className="text-m3-primary font-mono">
											{waveSpeed}x
										</span>
									</div>
									<input
										id="wave-speed"
										type="range"
										min="0.1"
										max="3"
										step="0.1"
										value={waveSpeed}
										onChange={(e) => setWaveSpeed(Number(e.target.value))}
										className="w-full accent-m3-primary"
									/>
								</div>
							)}
							<div>
								<div className="flex justify-between text-sm mb-1">
									<label
										htmlFor="amplitude"
										className="font-medium text-m3-on-surface-variant"
									>
										Amplitude
									</label>
									<span className="text-m3-primary font-mono">{amplitude}</span>
								</div>
								<input
									id="amplitude"
									type="range"
									min="1"
									max="10"
									step="1"
									value={amplitude}
									onChange={(e) => setAmplitude(Number(e.target.value))}
									className="w-full accent-m3-primary"
								/>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-1">
									<label
										htmlFor="wavelength"
										className="font-medium text-m3-on-surface-variant"
									>
										Wavelength
									</label>
									<span className="text-m3-primary font-mono">
										{wavelength}
									</span>
								</div>
								<input
									id="wavelength"
									type="range"
									min="10"
									max="100"
									step="1"
									value={wavelength}
									onChange={(e) => setWavelength(Number(e.target.value))}
									className="w-full accent-m3-primary"
								/>
							</div>
						</div>
					</div>
				)}

				<div className="pt-2 border-t border-m3-outline-variant/30">
					<h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface-variant mb-4">
						Appearance
					</h4>
					<div className="flex flex-col gap-4">
						{variant === "circular" && (
							<div>
								<div className="flex justify-between text-sm mb-1">
									<label
										htmlFor="size"
										className="font-medium text-m3-on-surface-variant"
									>
										Size
									</label>
									<span className="text-m3-primary font-mono">{size}px</span>
								</div>
								<input
									id="size"
									type="range"
									min="24"
									max="120"
									step="4"
									value={size}
									onChange={(e) => setSize(Number(e.target.value))}
									className="w-full accent-m3-primary"
								/>
							</div>
						)}
						<div>
							<div className="flex justify-between text-sm mb-1">
								<label
									htmlFor="gap-size"
									className="font-medium text-m3-on-surface-variant"
								>
									Gap Size
								</label>
								<span className="text-m3-primary font-mono">{gapSize}px</span>
							</div>
							<input
								id="gap-size"
								type="range"
								min="0"
								max="12"
								step="1"
								value={gapSize}
								onChange={(e) => setGapSize(Number(e.target.value))}
								className="w-full accent-m3-primary"
							/>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<label
									htmlFor="track-height"
									className="font-medium text-m3-on-surface-variant"
								>
									Track Height
								</label>
								<span className="text-m3-primary font-mono">
									{trackHeight}px
								</span>
							</div>
							<input
								id="track-height"
								type="range"
								min="2"
								max="16"
								step="1"
								value={trackHeight}
								onChange={(e) => setTrackHeight(Number(e.target.value))}
								className="w-full accent-m3-primary"
							/>
						</div>

						{!isDeterminate && (
							<div>
								<div className="flex justify-between text-sm mb-1">
									<label
										htmlFor="crawler-speed"
										className="font-medium text-m3-on-surface-variant"
									>
										Crawler Speed
									</label>
									<span className="text-m3-primary font-mono">
										{crawlerSpeed}x
									</span>
								</div>
								<input
									id="crawler-speed"
									type="range"
									min="0.1"
									max="3"
									step="0.1"
									value={crawlerSpeed}
									onChange={(e) => setCrawlerSpeed(Number(e.target.value))}
									className="w-full accent-m3-primary"
								/>
							</div>
						)}

						{variant === "linear" && !isDeterminate && (
							<div>
								<label
									htmlFor="indeterminate-animation"
									className="text-sm font-medium text-m3-on-surface-variant mb-2 block"
								>
									Indeterminate Animation
								</label>
								<select
									id="indeterminate-animation"
									className="w-full p-2.5 rounded-xl bg-m3-surface-container-highest border border-m3-outline-variant text-m3-on-surface focus:border-m3-primary focus:outline-none transition-colors"
									value={indeterminateAnimation}
									onChange={(e) =>
										setIndeterminateAnimation(
											e.target.value as "md3" | "continuous",
										)
									}
								>
									<option value="md3">MD3 (Google Standard)</option>
									<option value="continuous">Continuous</option>
								</select>
							</div>
						)}

						{variant === "linear" && isDeterminate && shape === "wavy" && (
							<div>
								<label
									htmlFor="determinate-animation"
									className="text-sm font-medium text-m3-on-surface-variant mb-2 block"
								>
									Determinate Animation
								</label>
								<select
									id="determinate-animation"
									className="w-full p-2.5 rounded-xl bg-m3-surface-container-highest border border-m3-outline-variant text-m3-on-surface focus:border-m3-primary focus:outline-none transition-colors"
									value={determinateAnimation}
									onChange={(e) =>
										setDeterminateAnimation(
											e.target.value as "md3" | "continuous",
										)
									}
								>
									<option value="md3">MD3 (Smooth edges)</option>
									<option value="continuous">Continuous (Never flat)</option>
								</select>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Preview Panel */}
			<div className="flex-2 flex flex-col items-center justify-center p-8 min-h-100 border-t xl:border-t-0 xl:border-l border-m3-outline-variant/30">
				<div className="flex-1 flex w-full items-center justify-center relative">
					{variant === "linear" ? (
						<div className="w-full max-w-sm">
							<ProgressIndicator
								variant="linear"
								value={isDeterminate ? value : undefined}
								shape={shape}
								trackShape={trackShape}
								amplitude={amplitude}
								wavelength={wavelength}
								waveSpeed={waveSpeed}
								crawlerSpeed={crawlerSpeed}
								gapSize={gapSize}
								trackHeight={trackHeight}
								determinateAnimation={determinateAnimation}
								indeterminateAnimation={indeterminateAnimation}
								aria-label="Playground Progress"
							/>
						</div>
					) : (
						<ProgressIndicator
							variant="circular"
							value={isDeterminate ? value : undefined}
							shape={shape}
							amplitude={amplitude}
							wavelength={wavelength}
							crawlerSpeed={crawlerSpeed}
							gapSize={gapSize}
							trackHeight={trackHeight}
							size={size}
							aria-label="Playground Progress Circular"
						/>
					)}
				</div>

				<div className="mt-auto w-full pt-8">
					<div className="bg-m3-surface-container-low border border-m3-outline-variant/50 p-4 rounded-xl font-mono text-sm text-m3-on-surface-variant overflow-x-auto whitespace-pre">
						<span className="text-m3-primary">{"<ProgressIndicator"}</span>
						<br />
						{"  "}variant=
						<span className="text-green-600 dark:text-green-400">
							"{variant}"
						</span>
						{isDeterminate && (
							<>
								<br />
								{"  "}value={"{"}
								<span className="text-blue-600 dark:text-blue-400">
									{value}
								</span>
								{"}"}
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
						{variant === "linear" && trackShape !== "flat" && (
							<>
								<br />
								{"  "}trackShape=
								<span className="text-green-600 dark:text-green-400">
									"{trackShape}"
								</span>
							</>
						)}
						{(shape === "wavy" ||
							(variant === "linear" && trackShape === "wavy")) &&
							waveSpeed !== 1 &&
							variant === "linear" && (
								<>
									<br />
									{"  "}waveSpeed={"{"}
									<span className="text-blue-600 dark:text-blue-400">
										{waveSpeed}
									</span>
									{"}"}
								</>
							)}
						{(shape === "wavy" ||
							(variant === "linear" && trackShape === "wavy")) &&
							amplitude !== 4 && (
								<>
									<br />
									{"  "}amplitude={"{"}
									<span className="text-blue-600 dark:text-blue-400">
										{amplitude}
									</span>
									{"}"}
								</>
							)}
						{(shape === "wavy" ||
							(variant === "linear" && trackShape === "wavy")) &&
							wavelength !== 20 && (
								<>
									<br />
									{"  "}wavelength={"{"}
									<span className="text-blue-600 dark:text-blue-400">
										{wavelength}
									</span>
									{"}"}
								</>
							)}
						{gapSize !== 4 && (
							<>
								<br />
								{"  "}gapSize={"{"}
								<span className="text-blue-600 dark:text-blue-400">
									{gapSize}
								</span>
								{"}"}
							</>
						)}
						{trackHeight !== 4 && (
							<>
								<br />
								{"  "}trackHeight={"{"}
								<span className="text-blue-600 dark:text-blue-400">
									{trackHeight}
								</span>
								{"}"}
							</>
						)}
						{!isDeterminate && crawlerSpeed !== 1 && (
							<>
								<br />
								{"  "}crawlerSpeed={"{"}
								<span className="text-blue-600 dark:text-blue-400">
									{crawlerSpeed}
								</span>
								{"}"}
							</>
						)}
						{variant === "circular" && size !== 48 && (
							<>
								<br />
								{"  "}size={"{"}
								<span className="text-blue-600 dark:text-blue-400">{size}</span>
								{"}"}
							</>
						)}
						{!isDeterminate &&
							indeterminateAnimation !== "md3" &&
							variant === "linear" && (
								<>
									<br />
									{"  "}indeterminateAnimation=
									<span className="text-green-600 dark:text-green-400">
										"{indeterminateAnimation}"
									</span>
								</>
							)}
						{isDeterminate &&
							determinateAnimation !== "md3" &&
							variant === "linear" &&
							shape === "wavy" && (
								<>
									<br />
									{"  "}determinateAnimation=
									<span className="text-green-600 dark:text-green-400">
										"{determinateAnimation}"
									</span>
								</>
							)}
						<br />
						{"  "}aria-label=
						<span className="text-green-600 dark:text-green-400">
							"Loading..."
						</span>
						<br />
						<span className="text-m3-primary">{`/>`}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
