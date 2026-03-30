"use client";

import { Icon } from "@bug-on/md3-react";
import { useState } from "react";

export default function IconAxes() {
	const [fill, setFill] = useState<0 | 1>(0);
	const [weight, setWeight] = useState<100 | 200 | 300 | 400 | 500 | 600 | 700>(
		400,
	);
	const [grade, setGrade] = useState<-50 | -25 | 0 | 100 | 200>(0);
	const [opticalSize, setOpticalSize] = useState<20 | 24 | 40 | 48>(48);

	return (
		<div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl bg-m3-surface p-6 rounded-m3-xl shadow-m3-elevation-1">
			{/* Preview Box */}
			<div className="flex-1 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-m3-outline-variant rounded-m3-lg bg-m3-surface-container-lowest">
				<Icon
					variant="outlined"
					fill={fill}
					weight={weight}
					grade={grade}
					opticalSize={opticalSize}
					size={96}
					className="text-m3-primary"
					name="settings"
				/>
			</div>

			{/* Controls */}
			<div className="flex-1 flex flex-col gap-6">
				{/* Fill Control */}
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center text-sm font-medium text-m3-on-surface">
						<label htmlFor="fill-control">Fill (FILL)</label>
						<span className="font-mono text-m3-primary">{fill}</span>
					</div>
					<input
						id="fill-control"
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={fill}
						onChange={(e) =>
							setFill(Number.parseFloat(e.target.value) as unknown as 0 | 1)
						}
						className="w-full h-2 bg-m3-surface-container-highest rounded-full appearance-none cursor-pointer accent-m3-primary"
					/>
				</div>

				{/* Weight Control */}
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center text-sm font-medium text-m3-on-surface">
						<label htmlFor="weight-control">Weight (wght)</label>
						<span className="font-mono text-m3-primary">{weight}</span>
					</div>
					<input
						id="weight-control"
						type="range"
						min="100"
						max="700"
						step="100"
						value={weight}
						onChange={(e) =>
							setWeight(
								Number.parseInt(e.target.value, 10) as unknown as
									| 100
									| 200
									| 300
									| 400
									| 500
									| 600
									| 700,
							)
						}
						className="w-full h-2 bg-m3-surface-container-highest rounded-full appearance-none cursor-pointer accent-m3-primary"
					/>
				</div>

				{/* Grade Control */}
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center text-sm font-medium text-m3-on-surface">
						<label htmlFor="grade-control">Grade (GRAD)</label>
						<span className="font-mono text-m3-primary">{grade}</span>
					</div>
					<input
						id="grade-control"
						type="range"
						min="-50"
						max="200"
						step="50"
						value={grade}
						onChange={(e) =>
							setGrade(
								Number.parseInt(e.target.value, 10) as unknown as
									| -50
									| -25
									| 0
									| 100
									| 200,
							)
						}
						className="w-full h-2 bg-m3-surface-container-highest rounded-full appearance-none cursor-pointer accent-m3-primary"
					/>
				</div>

				{/* Optical Size Control */}
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center text-sm font-medium text-m3-on-surface">
						<label htmlFor="opsz-control">Optical Size (opsz)</label>
						<span className="font-mono text-m3-primary">{opticalSize}px</span>
					</div>
					<input
						id="opsz-control"
						type="range"
						min="20"
						max="48"
						step="4"
						value={opticalSize}
						onChange={(e) =>
							setOpticalSize(
								Number.parseInt(e.target.value, 10) as unknown as
									| 20
									| 24
									| 40
									| 48,
							)
						}
						className="w-full h-2 bg-m3-surface-container-highest rounded-full appearance-none cursor-pointer accent-m3-primary"
					/>
				</div>
			</div>
		</div>
	);
}
