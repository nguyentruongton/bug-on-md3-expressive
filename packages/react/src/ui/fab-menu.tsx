/**
 * @file fab-menu.tsx
 *
 * Component FAB Menu theo phong cách MD3 Expressive.
 *
 * Cung cấp một Floating Action Button (FAB) dạng toggle để mở một danh sách các hành động có hiệu ứng stagger (xếp tầng).
 * Tuân thủ mô hình FloatingActionButtonMenu của MD3 với sự hỗ trợ tiếp cận (accessibility) đầy đủ
 * (điều hướng bàn phím, quản lý focus, các vai trò ARIA).
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */

import {
	AnimatePresence,
	domMax,
	LazyMotion,
	m,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, useRippleState } from "./ripple";
import { SPRING_TRANSITION, SPRING_TRANSITION_FAST } from "./shared/constants";
import { TouchTarget } from "./shared/touch-target";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens — MD3 FAB Menu Spec
// ─────────────────────────────────────────────────────────────────────────────

const SPRING_NORMAL = { stiffness: 700, damping: 40 } as const;
const SPRING_REDUCED = { stiffness: 10000, damping: 100 } as const;
const FOCUS_DELAY_MS = 50;

const TOGGLE_FAB_COLORS: Record<
	string,
	{
		containerBg: string;
		containerText: string;
		checkedBg: string;
		checkedText: string;
	}
> = {
	primary: {
		containerBg: "bg-m3-primary-container",
		containerText: "text-m3-on-primary-container",
		checkedBg: "bg-m3-primary",
		checkedText: "text-m3-on-primary",
	},
	secondary: {
		containerBg: "bg-m3-secondary-container",
		containerText: "text-m3-on-secondary-container",
		checkedBg: "bg-m3-secondary",
		checkedText: "text-m3-on-secondary",
	},
	tertiary: {
		containerBg: "bg-m3-tertiary-container",
		containerText: "text-m3-on-tertiary-container",
		checkedBg: "bg-m3-tertiary",
		checkedText: "text-m3-on-tertiary",
	},
};

/**
 * Size tokens for ToggleFAB.
 *
 * MD3 Kotlin reference:
 *  - Baseline: 56dp, cornerRadius 16dp → 28dp (fully round)
 *  - Medium: ~80dp (FabMediumTokens.ContainerHeight), cornerRadius 20dp → 40dp
 *  - Large: 96dp, cornerRadius 28dp → 48dp
 * @internal
 */
const TOGGLE_FAB_SIZES: Record<
	string,
	{
		sizeClass: string;
		initialRadius: number;
		finalRadius: number;
	}
> = {
	baseline: { sizeClass: "h-14 w-14", initialRadius: 16, finalRadius: 28 },
	medium: { sizeClass: "h-20 w-20", initialRadius: 20, finalRadius: 40 },
	large: { sizeClass: "h-24 w-24", initialRadius: 28, finalRadius: 48 },
};

const MENU_ITEM_STYLES = {
	padding: "ps-4 pe-6",
	gap: "gap-3",
	size: "h-14 min-w-14",
	cornerRadius: 999,
} as const;

const MENU_ITEM_COLORS: Record<string, { bg: string; text: string }> = {
	primary: {
		bg: "bg-m3-primary-container",
		text: "text-m3-on-primary-container",
	},
	secondary: {
		bg: "bg-m3-secondary-container",
		text: "text-m3-on-secondary-container",
	},
	tertiary: {
		bg: "bg-m3-tertiary-container",
		text: "text-m3-on-tertiary-container",
	},
};

const ALIGNMENT_CONTAINER_CLASSES: Record<string, string> = {
	end: "items-end bottom-4 right-4 sm:bottom-6 sm:right-6",
	start: "items-start bottom-4 left-4 sm:bottom-6 sm:left-6",
	center: "items-center bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
};

const ALIGNMENT_ITEMS_CLASSES: Record<string, string> = {
	end: "items-end",
	start: "items-start",
	center: "items-center",
};

const ALIGNMENT_TRANSFORM_ORIGIN: Record<string, string> = {
	end: "right",
	start: "left",
	center: "bottom",
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Định dạng dữ liệu cho từng hành động (item) trong biểu mẫu menu của FAB.
 *
 * Nếu bỏ qua thuộc tính `label`, item sẽ render dạng ô vuông chỉ có icon.
 */
export interface FABMenuItemData {
	/** Một ID duy nhất để dùng cho key react và quản lý focus. */
	id: string;
	/** Label hiển thị cạnh icon (tuỳ chọn). Không thêm thuộc tính này nếu muốn hiển thị chỉ có icon (icon-only). */
	label?: string;
	/** Node của Icon — thường là một component SVG Icon duy nhất. */
	icon: React.ReactNode;
	/** Gọi hàm ngay lập tức khi item được kích hoạt (click hoặc nhấn Enter/Phím cách). */
	onClick: () => void;
	/**
	 * Khi `true`, vô hiệu hoá item về mặt hình thức lẫn tương tác rẽ nhánh.
	 * Vẫn dùng `aria-disabled` thay vì HTML `disabled` nhằm giữ nó lấy được focus phục vụ cho accessibility.
	 * @default false
	 */
	disabled?: boolean;
	/** Thêm CSS classes bổ sung dùng cho wrapper chính của item. */
	className?: string;
}

/**
 * Các props điều khiển Component chính `FABMenu`.
 *
 * @remarks
 * FABMenu quản lý vòng đời trạng thái mở/đóng menu (open/close), quản lý focus, điều khiển phím,
 * và điều hướng hiệu ứng chuyển động. Trạng thái `expanded` được truyền từ ngoài (controlled state),
 * do đó bạn có thể quản lý qua react state, hoặc dùng router hay business logic khác.
 */
export interface FABMenuProps {
	/** FAB Menu có đang mở (mở rộng)/hiển thị hay không. */
	expanded: boolean;
	/** Hàm handler kích hoạt khi Toggle FAB được người dùng tương tác, hoặc khi dismiss backdrop. */
	onToggle: (expanded: boolean) => void;
	/** Danh sách các action items (Spec MD3 đề nghị 2-6 item là hoàn hảo). */
	items: FABMenuItemData[];
	/**
	 * Vai trò màu (color role container) MD3 cho cái nút FAB lẫn các menu items.
	 * @default "primary"
	 */
	colorVariant?: "primary" | "secondary" | "tertiary";
	/**
	 * Kích cỡ khởi tạo cho cái ToggleFAB (FAB biến hình thành cục đóng dấu X khi nó expanded).
	 * @default "baseline"
	 */
	fabSize?: "baseline" | "medium" | "large";
	/**
	 * Căn lề của danh sách menu items tương quan với cái Toggle FAB.
	 * - `"end"`: Các items dồn hết theo lề phía tay phải (trailing edge, default cực hữu hiệu đối với RTL design).
	 * - `"start"`: Các items dồn hết dọc theo lề trái.
	 * - `"center"`: Các item sẽ được căn ra giữa chiều dọc, căn giữa tâm khối với cái FAB.
	 * @default "end"
	 */
	alignment?: "start" | "end" | "center";
	/** Thuộc tính cho CSS component root để đè. */
	className?: string;
	/**
	 * Nếu `true`, khi menu đang hiện ra, click chuột ra phía sau (màn xám mờ backdrop) để đóng menu.
	 * @default true
	 */
	closeOnBackdropClick?: boolean;
	/**
	 * Nếu `true`, focus sẽ tự động chạy xuống item CUỐI (sát bên trên cái nút FAB) khi menu vừa loé mờ ra.
	 * Nếu `false`, focus sẽ bay lên item ĐẦU TIÊN của danh sách (cao nhất trên màn hình).
	 * @default true
	 */
	focusLast?: boolean;
	/** Bắt buộc truyền `aria-label` cho ToggleFAB để đáp ứng Accessibility. */
	"aria-label"?: string;
}

/**
 * Props thuộc component `ToggleFAB` đứng độc lập.
 */
export interface ToggleFABProps {
	/** Nút có đang trong trạng thái được kích hoạt check (expanded). */
	expanded: boolean;
	/** Gọi khi xảy ra sự kiện Toggle nút. */
	onToggle: (expanded: boolean) => void;
	/**
	 * Function sinh Icon - nhận về tiến độ `progress` trong khoảng `0` -> `1` (Từ Chưa Expanded -> Đã Expanded)
	 * Dùng cho các hiệu ứng morphing Icon khi animtion render (VD: Từ Cộng thành Đóng).
	 *
	 * @example
	 * ```tsx
	 * icon={(progress) => progress > 0.5 ? <Icon name="close" /> : <Icon name="add" />}
	 * ```
	 */
	icon: (progress: number) => React.ReactNode;
	/** Vai trò màu container chuẩn MD3. @default "primary" */
	colorVariant?: "primary" | "secondary" | "tertiary";
	/** Kích thước của cục FAB ban đầu (Sau khi nhấn sẽ thu tròn). @default "baseline" */
	fabSize?: "baseline" | "medium" | "large";
	/** CSS Class linh tinh bổ sung thêm. */
	className?: string;
	/** Thuộc tính đọc thẻ accessibility. Bắt buộc có. */
	"aria-label"?: string;
	/** Kiểm soát giá trị của ID để link với menu qua aria-controls. */
	"aria-controls"?: string;
	/** Trỏ id component. */
	id?: string;
}

/**
 * Props thuộc component một món item đơn lẻ `FABMenuItem`.
 */
export interface FABMenuItemProps {
	/** Node của icon hiện. */
	icon: React.ReactNode;
	/** Tên nhãn mô tả kế bên icon cho item này. Hoặc ẩn nó đi nếu không mong đợi. */
	label?: string;
	/** Hàm bắn ra khi item được kích. */
	onClick: () => void;
	/** Vô hiệu hóa hành vi tương tác item mà vẫn cho phép bàn phím tab bấm dính lấy focus. @default false */
	disabled?: boolean;
	/** Container tông màu. @default "primary" */
	colorVariant?: "primary" | "secondary" | "tertiary";
	/** Custom CSS className. */
	className?: string;
	/** Số index liệt kê trong mảng dùng tính render delay (Dành cho animation cấu trúc `custom`). */
	index?: number;
	/** Tổng danh sách items có mảng. */
	totalItems?: number;
	/** Giá trị logic `tabIndex` dùng điều khiển thao tác phím Tab thủ công. */
	tabIndex?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────────────────────

const ITEM_SPRING = { type: "spring" as const, stiffness: 700, damping: 25 };

const MENU_CONTAINER_VARIANTS = {
	open: { transition: { staggerChildren: 0.033, staggerDirection: 1 } },
	closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
} as const;

const MENU_ITEM_VARIANTS = {
	open: { scaleX: 1, opacity: 1, transition: ITEM_SPRING },
	closed: { scaleX: 0, opacity: 0, transition: ITEM_SPRING },
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal Icon Components
// ─────────────────────────────────────────────────────────────────────────────

function AddIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="currentColor"
			width="24"
			height="24"
		>
			<title>Add</title>
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="currentColor"
			width="24"
			height="24"
		>
			<title>Close</title>
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
		</svg>
	);
}

function defaultFabIcon(progress: number) {
	return progress > 0.5 ? <CloseIcon /> : <AddIcon />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ToggleFAB Component
// ─────────────────────────────────────────────────────────────────────────────

const ToggleFABComponent = React.forwardRef<HTMLButtonElement, ToggleFABProps>(
	(
		{
			expanded,
			onToggle,
			icon,
			colorVariant = "primary",
			fabSize = "baseline",
			className,
			id,
			"aria-label": ariaLabel,
			"aria-controls": ariaControls,
		},
		ref,
	) => {
		const prefersReduced = useReducedMotion();
		const colors = TOGGLE_FAB_COLORS[colorVariant] ?? TOGGLE_FAB_COLORS.primary;
		const sizeTokens = TOGGLE_FAB_SIZES[fabSize] ?? TOGGLE_FAB_SIZES.baseline;

		const springConfig = prefersReduced ? SPRING_REDUCED : SPRING_NORMAL;
		const checkedProgress = useSpring(expanded ? 1 : 0, springConfig);

		React.useEffect(() => {
			checkedProgress.set(expanded ? 1 : 0);
		}, [expanded, checkedProgress]);

		const borderRadius = useTransform(
			checkedProgress,
			[0, 1],
			[`${sizeTokens.initialRadius}px`, `${sizeTokens.finalRadius}px`],
		);

		const [iconProgress, setIconProgress] = React.useState(expanded ? 1 : 0);

		React.useEffect(() => {
			return checkedProgress.on("change", setIconProgress);
		}, [checkedProgress]);

		const { ripples, onPointerDown, removeRipple } = useRippleState();

		const handleClick = React.useCallback(() => {
			onToggle(!expanded);
		}, [expanded, onToggle]);

		return (
			<m.button
				ref={ref}
				id={id}
				type="button"
				aria-expanded={expanded}
				aria-haspopup="menu"
				aria-label={ariaLabel ?? (expanded ? "Close menu" : "Open menu")}
				aria-controls={ariaControls}
				data-expanded={expanded ? "true" : "false"}
				onClick={handleClick}
				onPointerDown={onPointerDown}
				style={{ borderRadius }}
				animate={{
					boxShadow: expanded
						? "0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)"
						: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
				}}
				whileTap={{ scale: 0.95, transition: SPRING_TRANSITION_FAST }}
				transition={{ boxShadow: SPRING_TRANSITION }}
				className={cn(
					"relative shrink-0 inline-flex items-center justify-center",
					"select-none cursor-pointer overflow-hidden",
					"transition-colors duration-200",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
					sizeTokens.sizeClass,
					expanded ? colors.checkedBg : colors.containerBg,
					expanded ? colors.checkedText : colors.containerText,
					className,
				)}
			>
				<TouchTarget />
				<Ripple ripples={ripples} onRippleDone={removeRipple} />
				<span
					aria-hidden="true"
					className="relative z-10 flex items-center justify-center size-6 pointer-events-none"
				>
					{icon(iconProgress)}
				</span>
			</m.button>
		);
	},
);

ToggleFABComponent.displayName = "ToggleFAB";

/**
 * Nút Toggle FAB (Biến hình) có thể được dùng độc lập đứng một mình (standalone) hoặc kết nối để kích hoạt mở cả nùi Menu ở dưới con `FABMenu`.
 *
 * Sức ép hiệu ứng kích thước khung nền sẽ chuyển từ vuôn/vát cạnh sang hình tròn hẵn (square → circle), chuyển biến cả màu sắc
 * khi mà cờ `expanded` chuyển tiếp từ false sang → true.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 * <ToggleFAB
 *   expanded={open}
 *   onToggle={setOpen}
 *   colorVariant="primary"
 *   aria-label="Toggle actions"
 *   icon={(progress) => progress > 0.5 ? <Icon name="close" /> : <Icon name="add" />}
 * />
 * ```
 */
export const ToggleFAB = React.memo(ToggleFABComponent);

// ─────────────────────────────────────────────────────────────────────────────
// FABMenuItem Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Một item thực hiện một loại hành động duy nhất trong `FABMenu`.
 *
 * Render hình dạng viên thuốc bao quanh icon cùng với label diễn giải.
 * Khi `label` bỏ trống, nó sẽ render thành một cục thẻ gạch ốp màu vuông vức chứa chữ mỗi cái icon.
 * Component chứa gợn sóng MD3 Ripple cùng 48dp chuẩn vùng target đụng diện chuẩn WCAG 2.5.5 cho cảm ứng.
 *
 * @remarks
 * Những thành phần khi bị tắt (vô hiệu tương tác) thì chỉ được dùng role `aria-disabled="true"` ở lớp div bề mặt thay vì lấy
 *  thuộc tính gốc `disabled` của HTML. Nhờ đó, item tuy xám mờ không bấm được phím chuột vẫn sẽ có khả năng focus qua vòng đời tab phím bàn phím
 * (quy chuẩn chặt chẽ của Material Design 3).
 */
export function FABMenuItem({
	icon,
	label,
	onClick,
	disabled = false,
	colorVariant = "primary",
	className,
	tabIndex = 0,
}: FABMenuItemProps) {
	const colors = MENU_ITEM_COLORS[colorVariant] ?? MENU_ITEM_COLORS.primary;

	const { ripples, onPointerDown, removeRipple } = useRippleState({ disabled });

	const handleClick = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (disabled) {
				e.preventDefault();
				return;
			}
			onClick();
		},
		[disabled, onClick],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		},
		[disabled, onClick],
	);

	return (
		<m.div
			role="menuitem"
			tabIndex={tabIndex}
			aria-disabled={disabled ? "true" : undefined}
			data-disabled={disabled ? "true" : undefined}
			onClick={handleClick}
			onPointerDown={onPointerDown}
			onKeyDown={handleKeyDown}
			variants={MENU_ITEM_VARIANTS}
			style={{
				transformOrigin: "right",
				borderRadius: `${MENU_ITEM_STYLES.cornerRadius}px`,
			}}
			className={cn(
				"relative inline-flex flex-row items-center",
				"select-none cursor-pointer overflow-hidden",
				"whitespace-nowrap",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-1",
				MENU_ITEM_STYLES.size,
				MENU_ITEM_STYLES.gap,
				label ? MENU_ITEM_STYLES.padding : "px-4",
				!label && "justify-center",
				colors.bg,
				colors.text,
				disabled && "opacity-[0.38] pointer-events-none",
				className,
			)}
		>
			<TouchTarget />
			<Ripple ripples={ripples} onRippleDone={removeRipple} />
			<span
				aria-hidden="true"
				className="relative z-10 flex items-center justify-center size-6 shrink-0 [&>svg]:w-full [&>svg]:h-full pointer-events-none"
			>
				{icon}
			</span>
			{label && (
				<span className="relative z-10 text-base font-medium leading-none pointer-events-none">
					{label}
				</span>
			)}
		</m.div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// FABMenu Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MD3 Expressive FAB Menu.
 *
 * Bộ mở rộng Floating Action Button. Khi tương tác bật vào toggle-button (FAB con lai), sẽ trút ra mớ tác vụ menu ở xếp dọc (hoặc lan ra) từ trên đè ngược xuống trên nó.
 *
 * Accessibility thực thi chuẩn MD3 toàn phần:
 *  - thẻ `role="menu"` trang bị cho thẻ hộp div làm luống container
 *  - trang bị thẻ `role="menuitem"` trên mảng items thành phần con
 *  - Lifecycle Focus cho trải nghiệm hoàn mỹ: Mở phím bật -> Focus thẳng lên item cao/thấp đầu/cuối cùng menu; Đóng tắt menu -> Focus trả về ngược lại ToggleFAB
 *  - Tính năng Bàn Phím: Lách Escape nhấn tắt nhắm, Nhấn phím hướng lên-xuống(ArrowUp/Down) để di chuyển, Móc Tab(hoặc là Shift+Tab) nhảy lăng quăng qua các item.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * const items = [
 *   { id: 'share', icon: <Icon name="share" />, label: 'Chia sẻ', onClick: () => console.log('Share') },
 *   { id: 'edit', icon: <Icon name="edit" />, label: 'Chỉnh sửa', onClick: () => console.log('Edit') },
 *   { id: 'delete', icon: <Icon name="delete" />, label: 'Xóa bớt', disabled: true, onClick: () => {} }
 * ];
 *
 * <FABMenu
 *   expanded={open}
 *   onToggle={setOpen}
 *   aria-label="Các công cụ thao tác nhanh"
 *   alignment="center"
 *   colorVariant="tertiary"
 *   items={items}
 * />
 * ```
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
export function FABMenu({
	expanded,
	onToggle,
	items,
	colorVariant = "primary",
	fabSize = "baseline",
	alignment = "end",
	className,
	closeOnBackdropClick = true,
	focusLast = true,
	"aria-label": ariaLabel,
}: FABMenuProps) {
	const fabId = React.useId();
	const menuId = React.useId();
	const toggleRef = React.useRef<HTMLButtonElement>(null);
	const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
	const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

	const reversedItems = React.useMemo(() => [...items].reverse(), [items]);

	const focusItem = React.useCallback((index: number) => {
		const clampedIndex = Math.max(
			0,
			Math.min(index, itemRefs.current.length - 1),
		);
		setFocusedIndex(clampedIndex);
		itemRefs.current[clampedIndex]?.focus();
	}, []);

	// Track whether menu was previously open so we only return focus
	// to the toggle button after a user-initiated close, not on initial mount.
	const wasExpandedRef = React.useRef(false);

	React.useEffect(() => {
		if (expanded) {
			wasExpandedRef.current = true;
			const timer = setTimeout(() => {
				focusItem(focusLast ? items.length - 1 : 0);
			}, FOCUS_DELAY_MS);
			return () => clearTimeout(timer);
		}

		if (wasExpandedRef.current) {
			toggleRef.current?.focus();
		}
		wasExpandedRef.current = false;
		setFocusedIndex(-1);
	}, [expanded, focusLast, items.length, focusItem]);

	const handleMenuKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (!expanded) return;

			const lastIndex = items.length - 1;

			switch (e.key) {
				case "Escape":
					e.preventDefault();
					onToggle(false);
					break;

				case "ArrowUp": {
					e.preventDefault();
					focusItem(focusedIndex <= 0 ? lastIndex : focusedIndex - 1);
					break;
				}

				case "ArrowDown": {
					e.preventDefault();
					focusItem(focusedIndex >= lastIndex ? 0 : focusedIndex + 1);
					break;
				}

				case "Tab": {
					e.preventDefault();
					if (e.shiftKey) {
						focusItem(focusedIndex <= 0 ? lastIndex : focusedIndex - 1);
					} else {
						focusItem(focusedIndex >= lastIndex ? 0 : focusedIndex + 1);
					}
					break;
				}
			}
		},
		[expanded, focusedIndex, items.length, focusItem, onToggle],
	);

	return (
		<LazyMotion features={domMax} strict>
			{expanded && closeOnBackdropClick && (
				<div
					aria-hidden="true"
					className="fixed inset-0 z-40"
					onClick={() => onToggle(false)}
				/>
			)}

			{/* biome-ignore lint/a11y/useSemanticElements: FAB menu container needs div, not fieldset — this is not a form group */}
			<div
				role="group"
				aria-label={ariaLabel ?? "Actions menu"}
				className={cn(
					"fixed z-50 flex flex-col gap-2",
					ALIGNMENT_CONTAINER_CLASSES[alignment],
					"*:shrink-0",
					className,
				)}
				onKeyDown={handleMenuKeyDown}
			>
				<AnimatePresence>
					{expanded && (
						<m.div
							id={menuId}
							role="menu"
							aria-labelledby={fabId}
							aria-orientation="vertical"
							variants={MENU_CONTAINER_VARIANTS}
							initial="closed"
							animate="open"
							exit="closed"
							className={cn(
								"flex flex-col-reverse gap-2",
								ALIGNMENT_ITEMS_CLASSES[alignment],
							)}
						>
							{reversedItems.map((item, reversedIndex) => {
								const originalIndex = items.length - 1 - reversedIndex;
								return (
									<m.div
										key={item.id}
										variants={MENU_ITEM_VARIANTS}
										style={{
											transformOrigin:
												ALIGNMENT_TRANSFORM_ORIGIN[alignment] ?? "right",
										}}
										ref={(el) => {
											itemRefs.current[originalIndex] = el;
										}}
									>
										<FABMenuItem
											icon={item.icon}
											label={item.label}
											onClick={() => {
												if (!item.disabled) {
													item.onClick();
													onToggle(false);
												}
											}}
											disabled={item.disabled}
											colorVariant={colorVariant}
											className={item.className}
											tabIndex={expanded ? 0 : -1}
										/>
									</m.div>
								);
							})}
						</m.div>
					)}
				</AnimatePresence>

				<ToggleFAB
					ref={toggleRef}
					id={fabId}
					expanded={expanded}
					onToggle={onToggle}
					colorVariant={colorVariant}
					fabSize={fabSize}
					aria-label={
						ariaLabel ?? (expanded ? "Close actions menu" : "Open actions menu")
					}
					aria-controls={menuId}
					icon={defaultFabIcon}
				/>
			</div>
		</LazyMotion>
	);
}
