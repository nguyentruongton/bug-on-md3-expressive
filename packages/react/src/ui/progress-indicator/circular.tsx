import { domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import type { CircularProgressProps } from "./types";
import { generateWavyCircularPath } from "./utils";

export const CircularProgress = React.forwardRef<
	HTMLDivElement,
	CircularProgressProps
>(
	(
		{
			value,
			size = 48,
			trackHeight = 4,
			shape = "flat",
			amplitude,
			wavelength,
			gapSize = 4,
			crawlerSpeed = 1,
			color,
			trackColor,
			className,
			"aria-label": ariaLabel,
			...restProps
		},
		ref,
	) => {
		const isDeterminate = value !== undefined;
		const clampedValue = isDeterminate ? Math.min(100, Math.max(0, value)) : 0;

		const radius = (size - trackHeight) / 2;
		const center = size / 2;

		const activeColor = color || "var(--md-sys-color-indicator-active)";
		const bgTrackColor = trackColor || "var(--md-sys-color-indicator-track)";

		const isWavy = shape === "wavy";

		const BASELINE_SIZE = 48;
		const scaleFactor = size / BASELINE_SIZE;
		const effectiveAmplitude = React.useMemo(
			() => amplitude ?? 1.6 * scaleFactor,
			[amplitude, scaleFactor],
		);
		const effectiveWavelength = React.useMemo(
			() => wavelength ?? 15 * scaleFactor,
			[wavelength, scaleFactor],
		);

		const wavyActivePath = React.useMemo(
			() =>
				isWavy
					? generateWavyCircularPath(
							center,
							radius,
							effectiveAmplitude,
							effectiveWavelength,
						)
					: null,
			[isWavy, center, radius, effectiveAmplitude, effectiveWavelength],
		);

		const circumference = React.useMemo(() => 2 * Math.PI * radius, [radius]);
		const gapForTrack = React.useMemo(
			() => (gapSize + trackHeight) / circumference,
			[gapSize, trackHeight, circumference],
		);
		const activeAngularFraction = isDeterminate ? clampedValue / 100 : 0;

		const trackOffset = isDeterminate ? activeAngularFraction + gapForTrack : 0;
		const trackLength = isDeterminate
			? Math.max(0.001, 1 - activeAngularFraction - 2 * gapForTrack)
			: 1;

		const ActiveCircleElem = m.circle;
		const ActivePathElem = m.path;

		return (
			<div
				ref={ref}
				role="progressbar"
				aria-label={ariaLabel}
				aria-valuenow={isDeterminate ? clampedValue : undefined}
				aria-valuemin={0}
				aria-valuemax={100}
				className={cn(
					"relative inline-flex items-center justify-center shrink-0",
					className,
				)}
				style={{ width: size, height: size }}
				{...restProps}
			>
				<LazyMotion features={domMax} strict>
					<svg
						width={size}
						height={size}
						viewBox={`0 0 ${size} ${size}`}
						aria-hidden="true"
						style={{ transform: "rotate(-90deg)", overflow: "visible" }}
					>
						{isDeterminate ? (
							<m.circle
								cx={center}
								cy={center}
								r={radius}
								fill="none"
								stroke={bgTrackColor}
								strokeWidth={trackHeight}
								initial={{ pathLength: trackLength, pathOffset: trackOffset }}
								animate={{ pathLength: trackLength, pathOffset: trackOffset }}
								transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
								strokeLinecap="round"
							/>
						) : null}

						{isDeterminate &&
							(isWavy ? (
								<ActivePathElem
									d={wavyActivePath ?? ""}
									fill="none"
									stroke={activeColor}
									strokeWidth={trackHeight}
									strokeLinecap="round"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: clampedValue / 100 }}
									transition={{
										duration: 0.4,
										ease: [0.2, 0, 0, 1],
									}}
								/>
							) : (
								<ActiveCircleElem
									cx={center}
									cy={center}
									r={radius}
									fill="none"
									stroke={activeColor}
									strokeWidth={trackHeight}
									strokeLinecap="round"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: clampedValue / 100 }}
									transition={{
										duration: 0.4,
										ease: [0.2, 0, 0, 1],
									}}
								/>
							))}
					</svg>

					{!isDeterminate && (
						<m.svg
							width={size}
							height={size}
							viewBox={`0 0 ${size} ${size}`}
							aria-hidden="true"
							style={{
								position: "absolute",
								inset: 0,
								overflow: "visible",
								rotate: "-90deg",
								transformOrigin: "center",
							}}
							animate={{ rotate: ["-90deg", "270deg"] }}
							transition={{
								rotate: {
									duration: 2 / Math.max(0.1, crawlerSpeed),
									repeat: Number.POSITIVE_INFINITY,
									ease: "linear",
								},
							}}
						>
							<m.circle
								cx={center}
								cy={center}
								r={radius}
								fill="none"
								stroke={bgTrackColor}
								strokeWidth={trackHeight}
								strokeLinecap="round"
								style={{ originX: "50%", originY: "50%" }}
								animate={{
									pathLength: [
										Math.max(0.001, 1 - 0.1 - 2 * gapForTrack),
										Math.max(0.001, 1 - 0.75 - 2 * gapForTrack),
										Math.max(0.001, 1 - 0.1 - 2 * gapForTrack),
									],
									rotate: [
										`${(0.1 + gapForTrack) * 360}deg`,
										`${(1.0 + gapForTrack) * 360}deg`,
										`${(1.1 + gapForTrack) * 360}deg`,
									],
								}}
								transition={{
									duration: 2 / Math.max(0.1, crawlerSpeed),
									repeat: Number.POSITIVE_INFINITY,
									ease: [0.4, 0, 0.2, 1],
								}}
							/>

							{isWavy ? (
								<ActivePathElem
									d={wavyActivePath ?? ""}
									fill="none"
									stroke={activeColor}
									strokeWidth={trackHeight}
									strokeLinecap="round"
									style={{ originX: "50%", originY: "50%" }}
									animate={{
										pathLength: [0.1, 0.75, 0.1],
										rotate: ["0deg", "90deg", "360deg"],
									}}
									transition={{
										duration: 2 / Math.max(0.1, crawlerSpeed),
										repeat: Number.POSITIVE_INFINITY,
										ease: [0.4, 0, 0.2, 1],
									}}
								/>
							) : (
								<ActiveCircleElem
									cx={center}
									cy={center}
									r={radius}
									fill="none"
									stroke={activeColor}
									strokeWidth={trackHeight}
									strokeLinecap="round"
									style={{ originX: "50%", originY: "50%" }}
									animate={{
										pathLength: [0.1, 0.75, 0.1],
										rotate: ["0deg", "90deg", "360deg"],
									}}
									transition={{
										duration: 2 / Math.max(0.1, crawlerSpeed),
										repeat: Number.POSITIVE_INFINITY,
										ease: [0.4, 0, 0.2, 1],
									}}
								/>
							)}
						</m.svg>
					)}
				</LazyMotion>
			</div>
		);
	},
);

CircularProgress.displayName = "CircularProgress";
