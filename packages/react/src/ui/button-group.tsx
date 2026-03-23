import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";
import type { ButtonProps } from "./button";

export interface ButtonGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
	variant?: "standard" | "connected";
	orientation?: "horizontal" | "vertical";
	/** Đặt thành true nếu bạn muốn Standard Group giãn đều toàn bộ chiều rộng container */
	fullWidth?: boolean;
	/** Áp dụng chung một kích thước cho toàn bộ các nút trong nhóm */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Bật/tắt hiệu ứng Morphing Width khi nhấn nút (mặc định: true) */
	morphingWidth?: boolean;
	/** Hiển thị icon Check khi nút được chọn trong Group */
	showCheck?: boolean;
}

// Bảng ánh xạ padding mặc định tương ứng với từng size trong button.tsx
const SIZE_PADDING_MAP: Record<string, string> = {
	xs: "0.75rem",
	sm: "1rem",
	md: "1.5rem",
	lg: "3rem",
	xl: "3rem",
};

// Bảng ánh xạ Pill Radius (h/2) để animation mượt mà
const PILL_RADIUS_MAP: Record<string, number> = {
	xs: 16,
	sm: 20,
	md: 28,
	lg: 48,
	xl: 68,
};

// ĐỒNG BỘ SPECS MD3: Bảng ánh xạ góc bo bên trong (Inner Radius) của Connected Group
const INNER_RADIUS_MAP: Record<string, number> = {
	xs: 4,
	sm: 8,
	md: 8,
	lg: 16,
	xl: 20,
};

// Bảng ánh xạ Pressed Radius để morphing shape từ pill sang square
const PRESSED_RADIUS_MAP: Record<string, number> = {
	xs: 8,
	sm: 10,
	md: 16,
	lg: 28,
	xl: 40,
};

export const ButtonGroup = React.forwardRef<HTMLFieldSetElement, ButtonGroupProps>(
	(
		{
			className,
			variant = "standard",
			orientation = "horizontal",
			fullWidth = false,
			size,
			morphingWidth = true,
			showCheck = false,
			children,
			...props
		},
		ref,
	) => {
		const [pressedIndex, setPressedIndex] = React.useState<number | null>(null);

		const childrenArray = React.Children.toArray(children).filter(
			React.isValidElement,
		);
		const count = childrenArray.length;

		return (
			<fieldset
				ref={ref}
				className={cn(
					"inline-flex p-0 m-0 border-none max-w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					orientation === "vertical" ? "flex-col items-stretch" : "flex-row",
					// SPECS: Standard = 8px (gap-2), Connected = chính xác 2px
					variant === "standard" ? "gap-2" : "gap-0.5",
					fullWidth && (orientation === "horizontal" ? "w-full" : "h-full"),
					className,
				)}
				onPointerLeave={() => setPressedIndex(null)}
				onPointerUp={() => setPressedIndex(null)}
				{...props}
			>
				{childrenArray.map((child, index) => {
					const isFirst = index === 0;
					const isLast = index === count - 1;

					const element = child as React.ReactElement<ButtonProps>;

					// Lấy kích thước hiện tại để tính toán Specs
					// Ưu tiên prop size của Group, nếu không có thì lấy của nút con, mặc định là "sm"
					const itemSize = size || element.props.size || "sm";
					const basePx = SIZE_PADDING_MAP[itemSize] || "1rem";
					const innerRadius = INNER_RADIUS_MAP[itemSize] || 8;

					// Inject style động
					const dynamicStyle: React.CSSProperties = { 
						...element.props.style,
						"--m3-inner-rad": `${innerRadius}px`,
					} as React.CSSProperties;

					let motionPropsToOverride: Partial<ButtonProps> = {};
					let explicitIcon = element.props.icon;
					const isSelected = element.props.selected === true;

					if (showCheck && isSelected && !explicitIcon) {
						explicitIcon = <Check aria-hidden="true" />;
					}

					// 1. STANDARD GROUP: Xử lý hiệu ứng Morphing Width khi press
					if (variant === "standard" && orientation === "horizontal" && morphingWidth) {
						const isPressed = pressedIndex === index;
						const isNeighbor =
							pressedIndex !== null && Math.abs(pressedIndex - index) === 1;

						if (fullWidth) {
							if (isPressed) {
								dynamicStyle.flex = "1.15";
							} else if (pressedIndex !== null) {
								dynamicStyle.flex = isNeighbor ? "0.925" : "1";
							} else {
								dynamicStyle.flex = "1";
							}
							dynamicStyle.transition = "flex 0.3s cubic-bezier(0.2, 0, 0, 1)";
						} else {
							if (isPressed) {
								dynamicStyle.paddingInline = `calc(${basePx} + 0.6rem)`;
							} else if (isNeighbor) {
								dynamicStyle.paddingInline = `calc(${basePx} - 0.3rem)`;
							} else {
								dynamicStyle.paddingInline = basePx;
							}
							dynamicStyle.transition =
								"padding 0.2s cubic-bezier(0.2, 0, 0, 1)";
						}
						
						const pressedRadius = PRESSED_RADIUS_MAP[itemSize] || 10;

						motionPropsToOverride = {
							whileTap: { 
								scale: 0.98,
								borderRadius: pressedRadius,
							},
							transition: { type: "spring", stiffness: 400, damping: 25 },
						};
					}

					// 2. CONNECTED GROUP: Xử lý trạng thái Selected và Border Radius
					let connectedClasses = "";
					if (variant === "connected") {
						
						// Ưu tiên z-index khi selected/hover để đè viền lên nhau
						if (isSelected) {
							connectedClasses = "z-20";
						}

						const r = PILL_RADIUS_MAP[itemSize] || 20;
						const i = innerRadius;
						let tl = r, tr = r, br = r, bl = r;

						if (!isSelected) {
							if (orientation === "horizontal") {
								if (isFirst && !isLast) { tl = r; tr = i; br = i; bl = r; }
								else if (!isFirst && isLast) { tl = i; tr = r; br = r; bl = i; }
								else if (!isFirst && !isLast) { tl = i; tr = i; br = i; bl = i; }
							} else {
								// vertical
								if (isFirst && !isLast) { tl = r; tr = r; br = i; bl = i; }
								else if (!isFirst && isLast) { tl = i; tr = i; br = r; bl = r; }
								else if (!isFirst && !isLast) { tl = i; tr = i; br = i; bl = i; }
							}
						}

						// Set inline style (fallback/SSR)
						dynamicStyle.borderTopLeftRadius = `${tl}px`;
						dynamicStyle.borderTopRightRadius = `${tr}px`;
						dynamicStyle.borderBottomRightRadius = `${br}px`;
						dynamicStyle.borderBottomLeftRadius = `${bl}px`;
						
						// Transition CSS thuần
						dynamicStyle.transition = "border-top-left-radius 0.25s cubic-bezier(0.2, 0, 0, 1), border-top-right-radius 0.25s cubic-bezier(0.2, 0, 0, 1), border-bottom-right-radius 0.25s cubic-bezier(0.2, 0, 0, 1), border-bottom-left-radius 0.25s cubic-bezier(0.2, 0, 0, 1), padding 0.2s cubic-bezier(0.2, 0, 0, 1), flex 0.2s cubic-bezier(0.2, 0, 0, 1)";

						// VÔ HIỆU HÓA Framer Motion borderRadius trên children Button bằng cách override explicit corners
						const animateProps = 
							typeof element.props.animate === "object" && !Array.isArray(element.props.animate) 
								? element.props.animate 
								: {};
						const whileTapProps = 
							typeof element.props.whileTap === "object" && !Array.isArray(element.props.whileTap) 
								? element.props.whileTap 
								: {};

						// Tính toán corners khi pressed: tất cả corners đều thu về innerRadius hoặc pressedRadius
						// Theo MD3, khi nhấn Segmented Button, nó nên morph về dạng vuông hơn.
						const pr = INNER_RADIUS_MAP[itemSize] || 8;

						motionPropsToOverride.animate = {
							...animateProps,
							borderRadius: undefined,
							borderTopLeftRadius: tl,
							borderTopRightRadius: tr,
							borderBottomRightRadius: br,
							borderBottomLeftRadius: bl,
						} as ButtonProps["animate"];
						motionPropsToOverride.whileTap = {
							...whileTapProps,
							borderRadius: undefined,
							borderTopLeftRadius: pr,
							borderTopRightRadius: pr,
							borderBottomRightRadius: pr,
							borderBottomLeftRadius: pr,
						} as ButtonProps["whileTap"];

						motionPropsToOverride.transition = {
							type: "spring",
							bounce: 0,
							duration: 0.2,
						};
					}

					return React.cloneElement(element, {
						key: element.key ?? index,
						tabIndex: isFirst ? 0 : -1,
						size: size || element.props.size, // Push size group down to children
						icon: explicitIcon, // Override icon if showCheck injected it
						// Automatically apply unselected/selected color semantics for connected group
						...(variant === "connected" && {
							colorStyle: element.props.colorStyle || "tonal",
							selectedColorStyle: element.props.selectedColorStyle || "filled",
						}),
						className: cn(
							element.props.className,
							connectedClasses,
							"focus-visible:z-10 hover:z-10 relative",
						),
						style: dynamicStyle,
						onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
							setPressedIndex(index);
							if (element.props.onPointerDown) {
								element.props.onPointerDown(e);
							}
						},
						...motionPropsToOverride,
					});
				})}
			</fieldset>
		);
	},
);

ButtonGroup.displayName = "ButtonGroup";
