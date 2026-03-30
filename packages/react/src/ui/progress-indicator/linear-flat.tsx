import { m } from "motion/react";
import * as React from "react";

export const FlatLinearTrack = React.memo<{
	trackHeight: number;
	activeColor: string;
	trackColor: string;
	value?: number;
	isRtl: boolean;
	gapSize: number;
	crawlerSpeed: number;
}>(function FlatLinearTrack({
	trackHeight,
	activeColor,
	trackColor,
	value,
	isRtl,
	gapSize,
	crawlerSpeed,
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
						style={{
							backgroundColor: trackColor,
							borderRadius: radius,
							width: "100%",
						}}
						initial={{
							[isRtl ? "right" : "left"]:
								`calc(max(${minActiveWidth}px, 0%) + ${gapSize}px)`,
						}}
						animate={{
							[isRtl ? "right" : "left"]:
								`calc(max(${minActiveWidth}px, ${value}%) + ${gapSize}px)`,
						}}
						transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
					/>
					<m.div
						className="absolute inset-y-0"
						style={{
							backgroundColor: activeColor,
							borderRadius: radius,
							minWidth: minActiveWidth,
							...(isRtl ? { right: 0 } : { left: 0 }),
						}}
						initial={{ width: `${minActiveWidth}px` }}
						animate={{ width: `${value}%` }}
						transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
					/>
				</>
			) : (
				<>
					<div
						className="absolute inset-0"
						style={{ backgroundColor: trackColor, borderRadius: radius }}
					/>
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
});
