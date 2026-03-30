"use client";

import { ProgressIndicator } from "@bug-on/md3-react";
import { useEffect, useState } from "react";

export default function ProgressLinearVariantsDemo() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((p) => (p >= 100 ? 0 : p + 10));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col gap-12">
			{/* Wavy */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="md:w-1/3">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Wavy Shape
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						The expressive wavy shape provides an organic, engaging animation
						while users wait. Handled automatically for both indeterminate and
						determinate states.
					</p>
				</div>
				<div className="md:w-1/2 w-full flex flex-col gap-6">
					<div>
						<ProgressIndicator
							variant="linear"
							shape="wavy"
							aria-label="Loading wavy indeterminate"
							waveSpeed={0.5}
							crawlerSpeed={0.2}
							value={100}
							determinateAnimation="continuous"
						/>
						<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
							Indeterminate
						</div>
					</div>
					<div>
						<ProgressIndicator
							variant="linear"
							shape="wavy"
							value={progress}
							aria-label={`Progress ${progress}% wavy`}
						/>
						<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
							Determinate
						</div>
					</div>
					<div>
						<ProgressIndicator
							variant="linear"
							shape="wavy"
							amplitude={10}
							wavelength={40}
							trackHeight={8}
							crawlerSpeed={0.2}
							gapSize={0}
							waveSpeed={0.5}
							value={50}
							aria-label="Loading wavy custom"
						/>
						<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
							Custom Amplitude &amp; Wavelength
						</div>
					</div>
				</div>
			</div>

			{/* Flat */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
				<div className="md:w-1/3">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Flat Shape
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						The classic straight progress bar. Represents both determinate
						timelines and unknown durations.
					</p>
				</div>
				<div className="md:w-1/2 w-full flex flex-col gap-8 justify-center items-center">
					<div className="w-full">
						<ProgressIndicator
							variant="linear"
							aria-label="Loading flat indeterminate"
						/>
						<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
							Indeterminate
						</div>
					</div>
					<div className="w-full">
						<ProgressIndicator
							variant="linear"
							value={progress}
							aria-label={`Progress ${progress}%`}
						/>
						<div className="text-xs text-m3-on-surface-variant/60 font-medium mt-2 text-center">
							Determinate
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
