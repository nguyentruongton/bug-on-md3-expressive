/**
 * @file dialog.tsx
 *
 * Sub-system Component Dialog theo phong cách hiển thị MD3 Expressive.
 *
 * Được kế thừa trên nền lõi của hệ mã Radix UI Dialog primitives đi kèm gói kén Framer Motion dùng vào việc bổ sung
 * nhip điệu đẩy Spring ở hướng hiện vào (Entrance) cũng như bay lên (Exit); ăn liền với bản thiết kế specs MD3 Expressive siêu quyến rũ.
 * Phục vụ cả ở chế độ Standard (Tiêu chuẩn lọt thỏm) và phiên bản Full-Screen tràn viền toàn diện.
 *
 * @see https://m3.material.io/components/dialogs/overview
 */

import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { ScrollArea } from "./scroll-area";

// ─── MD3 Spring Config (Expressive) ──────────────────────────────────────────
const MD3_SPRING = {
	type: "spring" as const,
	stiffness: 400,
	damping: 30,
	mass: 1,
};

const MD3_OVERLAY_ANIM = {
	initial: { opacity: 0 },
	animate: {
		opacity: 1,
		transition: { duration: 0.2, ease: "easeOut" as const },
	},
	exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" as const } },
};

const MD3_CONTENT_ANIM = {
	initial: { opacity: 0, scale: 0.85, y: 24 },
	animate: { opacity: 1, scale: 1, y: 0, transition: MD3_SPRING },
	exit: {
		opacity: 0,
		scale: 0.95,
		y: 8,
		transition: { duration: 0.15, ease: "easeIn" as const },
	},
};

const MD3_FULLSCREEN_ANIM = {
	initial: { y: "100%" },
	animate: { y: 0, transition: MD3_SPRING },
	exit: { y: "100%", transition: { duration: 0.2, ease: "easeIn" as const } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Thuộc tính của cội gốc Root `Dialog`. Chức năng làm gương phản hồi của Radix `Dialog.Root` qua dạng controlled state đóng hay mở.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger asChild>
 *      <Button>Bấm Mở Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *        <DialogTitle>Bạn có muốn phiêu lưu không?</DialogTitle>
 *     </DialogHeader>
 *     <DialogBody>Chuẩn bị lên đồ rời khỏi hang nào.</DialogBody>
 *     <DialogFooter>
 *        <Button onClick={() => setOpen(false)} variant="text">Đóng</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export interface DialogProps {
	/** Whether the dialog is open (controlled). Omit for uncontrolled. */
	open?: boolean;
	/** Called when the open state should change. */
	onOpenChange?: (open: boolean) => void;
	/** Dialog trigger + content. */
	children: React.ReactNode;
}

/**
 * Các props được tiêm vào component bao ngoài Container `DialogContent` thuộc dạng Normal Standard.
 *
 * @see {@link DialogContent}
 */
export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
	/** Vô hình đi đi nút Close dấu (X) góc phải trên. @default false */
	hideCloseButton?: boolean;
	className?: string;
}

/**
 * Thuộc tính Props của biến thể `DialogFullScreenContent` chuyên dụng dành riêng cho Mode Full-Screen tràn màn hình.
 *
 * @remarks
 * Những hộp thoại Full-screen có biệt tài tự nới rộng và xâm chiếm cả bề ngang dọc nguyên thiết bị. Nó còn thiết lập một đường Top App bar (thanh ngang đỉnh)
 * kẹp chung cả 1 nhãn title mô tả đỉnh, một nút icon X dẹp ở rìa, thêm luôn hẳn cái nút Confirm cực xịn xò.
 *
 * @see {@link DialogFullScreenContent}
 * @see https://m3.material.io/components/dialogs/guidelines#full-screen
 */
export interface DialogFullScreenContentProps
	extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
	/** Nhãn Title nằm vùng khu vực thanh ngang Top Bar. */
	title?: string;
	/** Chữ viết đính kèm bên trong cục Nút nhấn thao tác ngay trên góc Top App bar đó (VD: "Lưu lại", "Save"). */
	actionLabel?: string;
	/** Hàm handler phát động cờ để kích chạy tính năng lưu, xác nhận kia. */
	onAction?: () => void;
	/** Rạch một làn kẻ chia cách thân body nội dung cuộn bên dưới và dòng App bar cố thủ bên trên. @default false */
	showDivider?: boolean;
	className?: string;
}

// ─── Re-exports wrapper ───────────────────────────────────────────────────────

/**
 * Gốc rễ Root của Component Dialog — trạc lấp lên cái module `Dialog.Root` của nhà Radix.
 *
 * @remarks Cơ năng hoạt động ở chế độ Controlled (kiểm soát vòng đời ở Client) xài mảng `open`/`onOpenChange`.
 *  Tuy thế bạn nếu không thích thì đừng có xài truyền mấy cái Props tay đôi trên, mà bỏ xài kiểu Untracked thông qua cái cục `DialogTrigger` là đủ.
 */
const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
	<RadixDialog.Root open={open} onOpenChange={onOpenChange}>
		{children}
	</RadixDialog.Root>
);
Dialog.displayName = "Dialog";

/** Bộ Trigger gieo phát đà giúp tắt bật cờ State đóng mở của Dialog con, dùng kèm kĩ năng nhét thông qua cái cầu `asChild`. */
const DialogTrigger = RadixDialog.Trigger;
DialogTrigger.displayName = "DialogTrigger";

// ─── Portal + Overlay + Content ───────────────────────────────────────────────
const DialogPortal = ({
	open,
	children,
}: {
	open?: boolean;
	children: React.ReactNode;
}) => (
	<RadixDialog.Portal forceMount>
		<AnimatePresence>
			{open ? React.Children.toArray(children) : null}
		</AnimatePresence>
	</RadixDialog.Portal>
);
DialogPortal.displayName = "DialogPortal";

const DialogOverlay = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Overlay>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
	<RadixDialog.Overlay ref={ref} asChild {...props}>
		<m.div
			className={cn("fixed inset-0 z-50 bg-black/32", className)}
			aria-hidden="true"
			{...MD3_OVERLAY_ANIM}
		/>
	</RadixDialog.Overlay>
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Content>,
	DialogContentProps
>(({ className, children, hideCloseButton = false, ...props }, ref) => (
	<RadixDialog.Content
		ref={ref}
		asChild
		aria-describedby={undefined}
		{...props}
	>
		<m.div
			className={cn(
				"fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
				"w-[calc(100%-2rem)] max-w-140",
				"rounded-[28px] bg-m3-surface-container-high p-6",
				"shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-m3-primary",
				className,
			)}
			role="dialog"
			{...MD3_CONTENT_ANIM}
		>
			{children}
			{!hideCloseButton && (
				<RadixDialog.Close asChild aria-label="Close dialog">
					<IconButton
						size="sm"
						colorStyle="filled"
						className="absolute right-4 top-4"
						aria-label="Close"
					>
						<Icon name="close" aria-hidden="true" />
					</IconButton>
				</RadixDialog.Close>
			)}
		</m.div>
	</RadixDialog.Content>
));
DialogContent.displayName = "DialogContent";

// ─── Header & Related ────────────────────────────────────────────────────────
const DialogIcon = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex justify-center mb-4 text-m3-secondary", className)}
		aria-hidden="true"
		{...props}
	>
		{children}
	</div>
));
DialogIcon.displayName = "DialogIcon";

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col gap-2 mb-4", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

// RadixDialog.Title surfaces to the accessibility tree — required
const DialogTitle = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Title>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, asChild, ...props }, ref) => (
	<RadixDialog.Title
		ref={ref}
		asChild={asChild}
		className={cn(
			"text-[24px] leading-8 font-normal text-m3-on-surface tracking-[0em]",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Description>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, asChild, ...props }, ref) => (
	<RadixDialog.Description
		ref={ref}
		asChild={asChild}
		className={cn("text-sm text-m3-on-surface-variant leading-5", className)}
		{...props}
	/>
));
DialogDescription.displayName = "DialogDescription";

// ─── Body & Footer ───────────────────────────────────────────────────────────
const DialogBody = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, dir, ...props }, ref) => (
	<ScrollArea
		ref={ref}
		type="hover"
		dir={dir as "ltr" | "rtl" | undefined}
		className={cn("max-h-[calc(85dvh-200px)] -mx-6", className)}
		viewportClassName="px-6"
		{...props}
	>
		{children}
	</ScrollArea>
));
DialogBody.displayName = "DialogBody";

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-row justify-end gap-2 mt-6", className)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogClose = RadixDialog.Close;

// ─── Full Screen Content Variant ──────────────────────────────────────────────
const DialogFullScreenContent = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Content>,
	DialogFullScreenContentProps
>(
	(
		{
			className,
			children,
			title,
			actionLabel,
			onAction,
			showDivider,
			...props
		},
		ref,
	) => (
		<RadixDialog.Content
			ref={ref}
			asChild
			aria-describedby={undefined}
			{...props}
		>
			<m.div
				className={cn(
					"fixed inset-0 z-50 w-full h-full bg-m3-surface flex flex-col",
					"outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-m3-primary",
					className,
				)}
				role="dialog"
				{...MD3_FULLSCREEN_ANIM}
			>
				<div className="flex shrink-0 items-center px-4 h-14 gap-2 bg-m3-surface">
					<RadixDialog.Close asChild aria-label="Close dialog">
						<IconButton size="sm" colorStyle="filled" aria-label="Close">
							<Icon name="close" aria-hidden="true" />
						</IconButton>
					</RadixDialog.Close>

					{title && (
						<DialogTitle className="flex-1 text-[22px] leading-7 font-medium truncate pr-2">
							{title}
						</DialogTitle>
					)}

					{actionLabel && onAction && (
						<button
							type="button"
							onClick={onAction}
							className="text-sm font-medium text-m3-primary px-3 py-2 rounded-full hover:bg-m3-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary transition-colors whitespace-nowrap"
						>
							{actionLabel}
						</button>
					)}
				</div>

				{showDivider && (
					<hr className="border-m3-outline-variant w-full shrink-0 m-0" />
				)}

				<ScrollArea
					type="hover"
					className="flex-1 w-full"
					viewportClassName="p-6"
				>
					{children}
				</ScrollArea>
			</m.div>
		</RadixDialog.Content>
	),
);
DialogFullScreenContent.displayName = "DialogFullScreenContent";

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogFullScreenContent,
	DialogHeader,
	DialogIcon,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
