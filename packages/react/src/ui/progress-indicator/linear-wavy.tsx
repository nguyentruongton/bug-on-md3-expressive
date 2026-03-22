import { animate, useAnimationFrame, useMotionValue } from "motion/react";
import * as React from "react";
import { useContainerWidth } from "./hooks";
import { easeInOutCubic, getSinePath } from "./utils";

export const WavyLinearTrack = React.memo<{
	trackHeight: number;
	svgHeight: number;
	amplitude: number;
	wavelength: number;
	indeterminateWavelength: number;
	activeColor: string;
	trackColor: string;
	value?: number;
	isRtl: boolean;
	gapSize: number;
	waveSpeed: number;
	crawlerSpeed: number;
	determinateAnimation: "md3" | "continuous";
	indeterminateAnimation: "md3" | "continuous";
	trackShape: "flat" | "wavy";
}>(function WavyLinearTrack({
	trackHeight,
	svgHeight,
	amplitude,
	wavelength,
	indeterminateWavelength,
	activeColor,
	trackColor,
	value,
	isRtl,
	gapSize,
	waveSpeed,
	crawlerSpeed,
	determinateAnimation,
	indeterminateAnimation,
	trackShape,
}) {
	const isDeterminate = typeof value === "number";
	const clampedValue = isDeterminate ? Math.max(0, Math.min(100, value)) : 100;
	const titleId = React.useId();

	const [containerRef, width] = useContainerWidth();

	const activePathRef = React.useRef<SVGPathElement>(null);
	const trackPathRef = React.useRef<SVGPathElement>(null);

	const amplitudeMV = useMotionValue(amplitude);
	const fractionMV = useMotionValue(isDeterminate ? clampedValue / 100 : 1);

	React.useEffect(() => {
		if (isDeterminate) {
			const fraction = clampedValue / 100;
			
			// Xử lý Flattening Logic dựa trên prop determinateAnimation
			let targetAmp = amplitude;
			if (determinateAnimation === "md3") {
				targetAmp = fraction <= 0.1 || fraction >= 0.95 ? 0 : amplitude;
			}
			
			animate(amplitudeMV, targetAmp, { type: "spring", bounce: 0, duration: 0.5 });
			animate(fractionMV, fraction, { duration: 0.4, ease: [0.2, 0, 0, 1] });
		}
	}, [clampedValue, isDeterminate, amplitude, amplitudeMV, fractionMV, determinateAnimation]);

	const activeWavelength = Math.max(1, isDeterminate ? wavelength : indeterminateWavelength);
	const trackAmp = trackShape === "wavy" ? amplitude : 0;

	useAnimationFrame((time) => {
		if (width === 0) return;

		const currentAmp = amplitudeMV.get();
		const phase = (time / 1000) * waveSpeed * activeWavelength;
		const capWidth = trackHeight / 2;

		let activePathD = "";
		let trackD = "";
		const totalGap = gapSize + trackHeight;

		// 1. CHẾ ĐỘ CÓ XÁC ĐỊNH (DETERMINATE)
		if (isDeterminate) {
			const fraction = fractionMV.get();
			const barHead = fraction * width;
			
			const adjHead = Math.max(capWidth, Math.min(width - capWidth, barHead));
			const adjTail = capWidth;

			if (fraction > 0 && adjHead - adjTail > 0.1) {
				activePathD = getSinePath(adjTail, adjHead, phase, activeWavelength, currentAmp);
			} else if (fraction === 0) {
				activePathD = `M ${capWidth} 0 L ${capWidth + 0.01} 0`;
			}

			const trackStart = adjHead + totalGap;
			if (trackStart < width - capWidth) {
				trackD = getSinePath(trackStart, width - capWidth, phase, activeWavelength, trackAmp);
			}
		} 
		// 2. CHẾ ĐỘ KHÔNG XÁC ĐỊNH (INDETERMINATE)
		else {
			const safeCrawlerSpeed = Math.max(0.1, crawlerSpeed);
			const activeLines: { tail: number, head: number }[] = [];

			if (indeterminateAnimation === "continuous") {
				const cycle = 2000 / safeCrawlerSpeed;
				const fraction = (time % cycle) / cycle;
				activeLines.push({
					tail: easeInOutCubic(Math.max(0, fraction * 1.5 - 0.5)),
					head: easeInOutCubic(Math.min(1, fraction * 1.5))
				});
			} else {
				const cycle = 1750 / safeCrawlerSpeed;
				const t = (time % cycle) * safeCrawlerSpeed;
				
				const l1H = easeInOutCubic(Math.max(0, Math.min(1, t / 1000)));
				const l1T = easeInOutCubic(Math.max(0, Math.min(1, (t - 250) / 1000)));
				const l2H = easeInOutCubic(Math.max(0, Math.min(1, (t - 650) / 850)));
				const l2T = easeInOutCubic(Math.max(0, Math.min(1, (t - 900) / 850)));

				activeLines.push({ tail: l1T, head: l1H });
				activeLines.push({ tail: l2T, head: l2H });
			}

			const segments = activeLines.map(line => {
				const barTail = line.tail * width;
				const barHead = line.head * width;
				const adjTail = Math.max(capWidth, Math.min(width - capWidth, barTail));
				const adjHead = Math.max(capWidth, Math.min(width - capWidth, barHead));
				return { adjTail, adjHead };
			}).filter(seg => seg.adjHead - seg.adjTail > 0.1);

			activePathD = segments.map(seg => getSinePath(seg.adjTail, seg.adjHead, phase, activeWavelength, currentAmp)).join(" ");

			let currentTrackX = capWidth;
			for (const seg of segments) {
				const trackEnd = seg.adjTail - totalGap;
				if (trackEnd > currentTrackX) {
					trackD += getSinePath(currentTrackX, trackEnd, phase, activeWavelength, trackAmp) + " ";
				}
				currentTrackX = Math.max(currentTrackX, seg.adjHead + totalGap);
			}
			if (currentTrackX < width - capWidth) {
				trackD += getSinePath(currentTrackX, width - capWidth, phase, activeWavelength, trackAmp);
			}
		}

		if (activePathRef.current) activePathRef.current.setAttribute("d", activePathD);
		if (trackPathRef.current) trackPathRef.current.setAttribute("d", trackD.trim());
	});

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden"
			style={{ height: svgHeight }}
		>
			{width > 0 && (
				<svg
					className="absolute inset-0 w-full h-full"
					style={{
						overflow: "visible", 
						transform: isRtl ? "scaleX(-1)" : undefined,
					}}
					aria-labelledby={titleId}
				>
					<title id={titleId}>
						{isDeterminate ? `Progress: ${clampedValue}%` : "Indeterminate loading progress"}
					</title>
					<g transform={`translate(0, ${svgHeight / 2})`}>
						<path
							ref={trackPathRef}
							fill="none"
							stroke={trackColor}
							strokeWidth={trackHeight}
							strokeLinecap="round"
						/>
						<path
							ref={activePathRef}
							fill="none"
							stroke={activeColor}
							strokeWidth={trackHeight}
							strokeLinecap="round"
						/>
					</g>
				</svg>
			)}
		</div>
	);
});
