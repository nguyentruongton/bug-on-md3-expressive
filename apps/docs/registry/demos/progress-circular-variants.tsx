"use client";

import { ProgressIndicator } from "@bug-on/md3-react";
import { useEffect, useState } from "react";

export default function ProgressCircularVariantsDemo() {
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
						An expressive circular indicator that uses radial waves to
						communicate progress. Handled automatically for both indeterminate
						and determinate states.
					</p>
				</div>
				<div className="md:w-1/2 w-full flex flex-col gap-8 justify-center items-center">
					<div className="flex flex-wrap items-center gap-6 sm:gap-12 justify-center w-full">
						<div className="flex flex-col items-center gap-4 min-w-25">
							<ProgressIndicator
								variant="circular"
								shape="wavy"
								aria-label="Indeterminate circular wavy"
							/>
							<span className="text-xs text-m3-on-surface-variant">
								Indeterminate
							</span>
						</div>
						<div className="flex flex-col items-center gap-4">
							<ProgressIndicator
								variant="circular"
								shape="wavy"
								value={progress}
								aria-label={`Determinate ${progress}% wavy`}
							/>
							<span className="text-xs text-m3-on-surface-variant">
								Determinate
							</span>
						</div>
						<div className="flex flex-col items-center gap-4 pt-2">
							<ProgressIndicator
								variant="circular"
								shape="wavy"
								value={progress}
								size={52}
								trackHeight={8}
								aria-label={`Thick wavy ${progress}%`}
							/>
							<span className="text-xs text-m3-on-surface-variant text-center max-w-25">
								Thick (8dp)
							</span>
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
						Circular indicators display progress around a classic circle.
						Default size is 48dp, and thickness is adjustable via tracked
						height.
					</p>
				</div>
				<div className="md:w-1/2 w-full flex flex-col gap-8 justify-center items-center">
					<div className="flex flex-wrap items-center gap-6 sm:gap-12 justify-center w-full">
						<div className="flex flex-col items-center gap-4 min-w-25">
							<ProgressIndicator
								variant="circular"
								aria-label="Indeterminate circular flat"
							/>
							<span className="text-xs text-m3-on-surface-variant">
								Indeterminate
							</span>
						</div>
						<div className="flex flex-col items-center gap-4">
							<ProgressIndicator
								variant="circular"
								value={progress}
								aria-label={`Determinate ${progress}% flat`}
							/>
							<span className="text-xs text-m3-on-surface-variant">
								Determinate
							</span>
						</div>
						<div className="flex flex-col items-center gap-4">
							<ProgressIndicator
								variant="circular"
								value={progress}
								size={80}
								aria-label={`Determinate Large ${progress}% flat`}
							/>
							<span className="text-xs text-m3-on-surface-variant text-center max-w-25">
								Large (80dp)
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
