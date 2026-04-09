export interface TooltipCaretProps {
	side: "top" | "bottom" | "left" | "right";
	width?: number;
	height?: number;
	color?: string;
	customPath?: string;
	className?: string;
}

type Side = TooltipCaretProps["side"];

const CENTER_H = "left-1/2 -translate-x-1/2";
const CENTER_V = "top-1/2 -translate-y-1/2 flex items-center justify-center";

const POSITION_BY_SIDE: Record<Side, (h: number) => string> = {
	top: (h) => `bottom-[calc(-1*${h}px)] ${CENTER_H}`,
	bottom: (h) => `top-[calc(-1*${h}px)] ${CENTER_H}`,
	left: (h) => `right-[calc(-1*${h}px)] ${CENTER_V}`,
	right: (h) => `left-[calc(-1*${h}px)] ${CENTER_V}`,
};

const ROTATION: Record<Side, string> = {
	top: "180deg",
	bottom: "0deg",
	left: "90deg",
	right: "-90deg",
};

export function TooltipCaretShape({
	side,
	width = 16,
	height = 8,
	color,
	customPath,
	className = "",
}: TooltipCaretProps) {
	const isHorizontal = side === "left" || side === "right";
	const path =
		customPath ?? `M 0,${height} L ${width / 2},0 L ${width},${height} Z`;

	return (
		<div
			className={`absolute pointer-events-none z-[-1] ${POSITION_BY_SIDE[side](height)} ${className}`}
			style={{
				width: isHorizontal ? height : width,
				height: isHorizontal ? width : height,
				color,
			}}
			aria-hidden="true"
		>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				style={{
					transform: `rotate(${ROTATION[side]})`,
					display: "block",
					transformOrigin: "center",
				}}
			>
				<path d={path} />
			</svg>
		</div>
	);
}
