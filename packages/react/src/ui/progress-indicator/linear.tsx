import { domMax, LazyMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { useMergedRef } from "./hooks";
import { FlatLinearTrack } from "./linear-flat";
import { WavyLinearTrack } from "./linear-wavy";
import type { LinearProgressProps } from "./types";

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
	(
		{
			value,
			shape = "flat",
			trackShape,
			trackHeight = 4,
			amplitude,
			wavelength = 40,
			indeterminateWavelength = 20,
			waveSpeed = 1,
			crawlerSpeed = 1,
			determinateAnimation = "md3",
			indeterminateAnimation = "continuous",
			gapSize = 4,
			showStopIndicator = "auto",
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

		const containerRef = React.useRef<HTMLDivElement>(null);
		const mergedRef = useMergedRef(ref, containerRef);
		const [isRtl, setIsRtl] = React.useState(false);

		React.useEffect(() => {
			if (containerRef.current) {
				const dir = getComputedStyle(containerRef.current).direction;
				setIsRtl(dir === "rtl");
			}
		}, []);

		const isWavy = shape === "wavy";
		const resolvedTrackShape = trackShape ?? shape;
		
		const effectiveAmplitude = React.useMemo(() => amplitude ?? 3, [amplitude]);
		const svgHeight = React.useMemo(() => 
			isWavy ? trackHeight + effectiveAmplitude * 2 : trackHeight
		, [isWavy, trackHeight, effectiveAmplitude]);

		const shouldShowStop = React.useMemo(() => 
			isDeterminate &&
			resolvedTrackShape === "flat" &&
			(showStopIndicator === true ||
				(showStopIndicator === "auto" && isDeterminate))
		, [isDeterminate, resolvedTrackShape, showStopIndicator]);

		const stopSize = React.useMemo(() => 
			Math.max(2, trackHeight > 4 ? 4 : trackHeight / 2)
		, [trackHeight]);
		
		const stopOffset = (trackHeight - stopSize) / 2;

		const activeColor = color || "var(--md-sys-color-indicator-active)";
		const bgTrackColor = trackColor || "var(--md-sys-color-indicator-track)";

		return (
			<LazyMotion features={domMax} strict>
				<div
					ref={mergedRef}
					role="progressbar"
					aria-label={ariaLabel}
					aria-valuenow={isDeterminate ? clampedValue : undefined}
					aria-valuemin={0}
					aria-valuemax={100}
					className={cn(
						"relative flex w-full flex-col justify-center",
						className,
					)}
					style={{ height: svgHeight }}
					{...restProps}
				>
					{isWavy ? (
						<WavyLinearTrack
							trackHeight={trackHeight}
							svgHeight={svgHeight}
							amplitude={effectiveAmplitude}
							wavelength={wavelength}
							indeterminateWavelength={indeterminateWavelength}
							activeColor={activeColor}
							trackColor={bgTrackColor}
							value={isDeterminate ? clampedValue : undefined}
							isRtl={isRtl}
							gapSize={gapSize}
							waveSpeed={waveSpeed}
							crawlerSpeed={crawlerSpeed}
							determinateAnimation={determinateAnimation}
							indeterminateAnimation={indeterminateAnimation}
							trackShape={resolvedTrackShape}
						/>
					) : (
						<FlatLinearTrack
							trackHeight={trackHeight}
							activeColor={activeColor}
							trackColor={bgTrackColor}
							value={isDeterminate ? clampedValue : undefined}
							isRtl={isRtl}
							gapSize={gapSize}
							crawlerSpeed={crawlerSpeed}
						/>
					)}

					{shouldShowStop && (
						<div
							aria-hidden="true"
							className="absolute rounded-full"
							style={{
								width: stopSize,
								height: stopSize,
								backgroundColor: "var(--md-sys-color-indicator-stop)",
								top: svgHeight / 2 - stopSize / 2,
								...(isRtl ? { left: stopOffset } : { right: stopOffset }),
							}}
						/>
					)}
				</div>
			</LazyMotion>
		);
	},
);

LinearProgress.displayName = "LinearProgress";
