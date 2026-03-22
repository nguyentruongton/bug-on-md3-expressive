import {
	domMax,
	LazyMotion,
	m,
	useAnimationFrame,
	useMotionValue,
	animate,
} from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Expressive Progress Indicator
// Spec: https://m3.material.io/components/progress-indicators
// ─────────────────────────────────────────────────────────────────────────────

interface ProgressBaseProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	value?: number;
	"aria-label": string;
	trackHeight?: number;
	color?: string;
	trackColor?: string;
}

export interface LinearProgressProps extends ProgressBaseProps {
	variant: "linear";
	shape?: "flat" | "wavy";
	amplitude?: number;
	wavelength?: number;
	indeterminateWavelength?: number;
	space?: number;
	gapSize?: number;
	/**
	 * Tốc độ dao động của sóng (Multiplier). Mặc định là 1.
	 * Lưu ý: waveSpeed chỉ làm sóng "gợn" nhanh hơn. 
	 * Để dải màu chạy nhanh hơn, hãy chỉnh crawlerSpeed.
	 */
	waveSpeed?: number;
	/**
	 * Tốc độ trườn của dải màu (Crawler). Mặc định là 1.
	 */
	crawlerSpeed?: number;
	/**
	 * Kiểu Animation cho trạng thái Indeterminate.
	 * - "md3": Chạy 2 dải màu đuổi nhau (Chuẩn Google)
	 * - "continuous": Chạy 1 dải màu liền mạch (Mượt mà hơn)
	 */
	indeterminateAnimation?: "md3" | "continuous";
	showStopIndicator?: boolean | "auto";
}

export interface CircularProgressProps extends ProgressBaseProps {
	variant: "circular";
	size?: number;
	shape?: "flat" | "wavy";
	amplitude?: number;
	wavelength?: number;
	space?: number;
	crawlerSpeed?: number;
}

export type ProgressIndicatorProps =
	| LinearProgressProps
	| CircularProgressProps;

// ─── Utility Hooks ───────────────────────────────────────────────────────────
function useContainerWidth() {
	const [width, setWidth] = React.useState(0);
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		if (!ref.current) return;
		const obs = new ResizeObserver((entries) => {
			setWidth(entries[0].contentRect.width);
		});
		obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return [ref, width] as const;
}

function useMergedRef<T>(
	...refs: (React.Ref<T> | undefined | null)[]
): React.RefCallback<T> {
	return React.useCallback(
		(node: T | null) => {
			for (const ref of refs) {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref && typeof ref === "object") {
					(ref as React.MutableRefObject<T | null>).current = node;
				}
			}
		},
		[refs],
	);
}

function easeInOutCubic(x: number): number {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ─── Wavy SVG Path generators ────────────────────────────────────────────────
function generateWavyCircularPath(
	center: number,
	radius: number,
	amplitude: number,
	wavelength: number,
): string {
	const circumference = 2 * Math.PI * radius;
	const numWaves = Math.max(3, Math.round(circumference / Math.max(1, wavelength)));
	const steps = numWaves * 4;
	const dt = (2 * Math.PI) / steps;

	const rAt = (t: number) => radius + amplitude * Math.sin(numWaves * t);
	const drAt = (t: number) => amplitude * numWaves * Math.cos(numWaves * t);
	const xAt = (t: number) => center + rAt(t) * Math.cos(t);
	const yAt = (t: number) => center + rAt(t) * Math.sin(t);
	const dxAt = (t: number) => drAt(t) * Math.cos(t) - rAt(t) * Math.sin(t);
	const dyAt = (t: number) => drAt(t) * Math.sin(t) + rAt(t) * Math.cos(t);

	let d = "";
	const tStart = 0;

	for (let i = 0; i < steps; i++) {
		const t0 = tStart + i * dt;
		const t1 = tStart + (i + 1) * dt;

		const scale = dt / 3;
		const cp1x = xAt(t0) + scale * dxAt(t0);
		const cp1y = yAt(t0) + scale * dyAt(t0);
		const cp2x = xAt(t1) - scale * dxAt(t1);
		const cp2y = yAt(t1) - scale * dyAt(t1);

		if (i === 0) d += `M ${xAt(t0).toFixed(2)} ${yAt(t0).toFixed(2)}`;
		d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${xAt(t1).toFixed(2)} ${yAt(t1).toFixed(2)}`;
	}
	d += " Z";
	return d;
}

// ─── Linear Progress ─────────────────────────────────────────────────────────
const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
	(
		{
			value,
			shape = "flat",
			trackHeight = 4,
			amplitude,
			wavelength = 40,
			indeterminateWavelength = 20,
			waveSpeed = 1,
			crawlerSpeed = 1,
			indeterminateAnimation = "continuous",
			space = 4,
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
		const effectiveAmplitude = amplitude ?? 3;
		const svgHeight = isWavy ? trackHeight + effectiveAmplitude * 2 : trackHeight;

		const shouldShowStop =
			isDeterminate &&
			(showStopIndicator === true ||
				(showStopIndicator === "auto" && isDeterminate));

		const stopSize = Math.max(2, trackHeight > 4 ? 4 : trackHeight / 2);
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
							indeterminateAnimation={indeterminateAnimation}
						/>
					) : (
						<FlatLinearTrack
							trackHeight={trackHeight}
							activeColor={activeColor}
							trackColor={bgTrackColor}
							value={isDeterminate ? clampedValue : undefined}
							isRtl={isRtl}
							space={space}
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

// ─── Flat Track ──────────────────────────────────────────────────────────────
function FlatLinearTrack({
	trackHeight,
	activeColor,
	trackColor,
	value,
	isRtl,
	space,
	crawlerSpeed,
}: {
	trackHeight: number;
	activeColor: string;
	trackColor: string;
	value?: number;
	isRtl: boolean;
	space: number;
	crawlerSpeed: number;
}) {
	const isDeterminate = value !== undefined;
	const radius = trackHeight / 2;
	const minActiveWidth = trackHeight;

	return (
		<div
			className="relative w-full overflow-hidden"
			style={{ height: trackHeight, borderRadius: radius }}
		>
			{isDeterminate ? (
				<>
					<m.div
						className="absolute inset-y-0"
						style={{ backgroundColor: trackColor, borderRadius: radius, width: "100%" }}
						initial={{ [isRtl ? "right" : "left"]: `calc(max(${minActiveWidth}px, 0%) + ${space}px)` }}
						animate={{ [isRtl ? "right" : "left"]: `calc(max(${minActiveWidth}px, ${value}%) + ${space}px)` }}
						transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
					/>
					<m.div
						className="absolute inset-y-0"
						style={{ backgroundColor: activeColor, borderRadius: radius, minWidth: minActiveWidth, ...(isRtl ? { right: 0 } : { left: 0 }) }}
						initial={{ width: `${minActiveWidth}px` }}
						animate={{ width: `${value}%` }}
						transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
					/>
				</>
			) : (
				<>
					<div className="absolute inset-0" style={{ backgroundColor: trackColor, borderRadius: radius }} />
					<m.div
						className="absolute inset-y-0"
						style={{ backgroundColor: activeColor, borderRadius: radius }}
						initial={{ left: "-40%", width: "40%" }}
						animate={{ left: ["-40%", "100%"], width: ["40%", "20%", "40%"] }}
						transition={{
							duration: 2 / Math.max(0.1, crawlerSpeed),
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					/>
				</>
			)}
		</div>
	);
}

// ─── Wavy Track ──────────────────────────────────────────────────────────────
function WavyLinearTrack({
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
	indeterminateAnimation,
}: {
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
	indeterminateAnimation: "md3" | "continuous";
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
			const targetAmp = fraction <= 0.1 || fraction >= 0.95 ? 0 : amplitude;
			animate(amplitudeMV, targetAmp, { type: "spring", bounce: 0, duration: 0.5 });
			animate(fractionMV, fraction, { duration: 0.4, ease: [0.2, 0, 0, 1] });
		}
	}, [clampedValue, isDeterminate, amplitude, amplitudeMV, fractionMV]);

	const activeWavelength = Math.max(1, isDeterminate ? wavelength : indeterminateWavelength);

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
			
			// Ép toạ độ an toàn (Clamping) giúp triệt tiêu hiện tượng vỡ dot ở mép
			const adjHead = Math.max(capWidth, Math.min(width - capWidth, barHead));
			const adjTail = capWidth;

			// Chỉ vẽ khi khoảng cách đủ dài
			if (fraction > 0 && adjHead - adjTail > 0.1) {
				activePathD = getSinePath(adjTail, adjHead, phase, activeWavelength, currentAmp);
			} else if (fraction === 0) {
				activePathD = `M ${capWidth} 0 L ${capWidth + 0.01} 0`;
			}

			const trackStart = adjHead + totalGap;
			if (trackStart < width - capWidth) {
				trackD = getSinePath(trackStart, width - capWidth, phase, activeWavelength, currentAmp);
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

			// Chuyển sang toạ độ vật lý và ép toạ độ (Clamp)
			const segments = activeLines.map(line => {
				const barTail = line.tail * width;
				const barHead = line.head * width;
				const adjTail = Math.max(capWidth, Math.min(width - capWidth, barTail));
				const adjHead = Math.max(capWidth, Math.min(width - capWidth, barHead));
				return { adjTail, adjHead };
			}).filter(seg => seg.adjHead - seg.adjTail > 0.1);

			// Gắn các đoạn active lại với nhau
			activePathD = segments.map(seg => getSinePath(seg.adjTail, seg.adjHead, phase, activeWavelength, currentAmp)).join(" ");

			// Vẽ các đoạn track nền nằm trong khoảng trống
			let currentTrackX = capWidth;
			for (const seg of segments) {
				const trackEnd = seg.adjTail - totalGap;
				if (trackEnd > currentTrackX) {
					trackD += getSinePath(currentTrackX, trackEnd, phase, activeWavelength, currentAmp) + " ";
				}
				currentTrackX = Math.max(currentTrackX, seg.adjHead + totalGap);
			}
			if (currentTrackX < width - capWidth) {
				trackD += getSinePath(currentTrackX, width - capWidth, phase, activeWavelength, currentAmp);
			}
		}

		if (activePathRef.current) activePathRef.current.setAttribute("d", activePathD);
		if (trackPathRef.current) trackPathRef.current.setAttribute("d", trackD.trim());
	});

	// Hàm cốt lõi tạo SVG path
	function getSinePath(
		startX: number,
		endX: number,
		phase: number,
		wl: number,
		amp: number,
	) {
		if (startX >= endX) return "";
		let d = "";
		const step = 1;

		const yStart = Math.sin(((startX + phase) / wl) * 2 * Math.PI) * amp;
		d += `M ${startX.toFixed(2)} ${yStart.toFixed(2)}`;

		let nextX = Math.ceil(startX / step) * step;
		if (nextX === startX) nextX += step; 

		while (nextX < endX) {
			const y = Math.sin(((nextX + phase) / wl) * 2 * Math.PI) * amp;
			d += ` L ${nextX.toFixed(2)} ${y.toFixed(2)}`;
			nextX += step;
		}

		const yEnd = Math.sin(((endX + phase) / wl) * 2 * Math.PI) * amp;
		d += ` L ${endX.toFixed(2)} ${yEnd.toFixed(2)}`;

		return d;
	}

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
}

// ─── Circular Progress ───────────────────────────────────────────────────────
const CircularProgress = React.forwardRef<
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
			space = 4,
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
		const effectiveAmplitude = amplitude ?? 1.6 * scaleFactor;
		const effectiveWavelength = wavelength ?? 15 * scaleFactor;

		const wavyActivePath = isWavy
			? generateWavyCircularPath(
					center,
					radius,
					effectiveAmplitude,
					effectiveWavelength,
				)
			: null;

		const circumference = 2 * Math.PI * radius;

		const gapForTrack = (space + trackHeight) / circumference;
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

export const ProgressIndicator = React.forwardRef<
	HTMLDivElement,
	ProgressIndicatorProps
>((props, ref) => {
	if (props.variant === "circular") {
		return <CircularProgress ref={ref} {...props} />;
	}
	return <LinearProgress ref={ref} {...props} />;
});

ProgressIndicator.displayName = "ProgressIndicator";