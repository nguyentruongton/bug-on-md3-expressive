"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";

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
	initial: { opacity: 0, scale: 0.9, y: 16 },
	animate: { opacity: 1, scale: 1, y: 0, transition: MD3_SPRING },
	exit: {
		opacity: 0,
		scale: 0.95,
		y: 8,
		transition: { duration: 0.15, ease: "easeIn" as const },
	},
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
	/** Ẩn nút close mặc định */
	hideCloseButton?: boolean;
	/** Override container width */
	className?: string;
}

// ─── Re-exports wrapper ───────────────────────────────────────────────────────
const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
	<RadixDialog.Root open={open} onOpenChange={onOpenChange}>
		{children}
	</RadixDialog.Root>
);
Dialog.displayName = "Dialog";

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
		<AnimatePresence mode="wait">{open && children}</AnimatePresence>
	</RadixDialog.Portal>
);

const DialogOverlay = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Overlay>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
	<RadixDialog.Overlay ref={ref} asChild {...props}>
		<motion.div
			className={cn(
				"fixed inset-0 z-50 bg-black/32",
				// a11y: screen reader sees this as decorative overlay
				className,
			)}
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
	<RadixDialog.Content ref={ref} asChild {...props}>
		<motion.div
			className={cn(
				// MD3 Dialog shape: rounded-[28px], elevation 3
				"fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
				"w-[calc(100%-2rem)] max-w-[560px]",
				"rounded-[28px] bg-m3-surface-container-high p-6",
				"shadow-lg outline-none",
				// Focus visible ring for keyboard users
				"focus-visible:ring-2 focus-visible:ring-m3-primary",
				className,
			)}
			role="dialog"
			{...MD3_CONTENT_ANIM}
		>
			{children}
			{!hideCloseButton && (
				<RadixDialog.Close
					className={cn(
						"absolute right-4 top-4 rounded-full p-2",
						"text-m3-on-surface-variant",
						"hover:bg-m3-on-surface/8",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
						"transition-colors duration-200",
					)}
					aria-label="Đóng hộp thoại"
				>
					<X className="h-5 w-5" aria-hidden="true" />
				</RadixDialog.Close>
			)}
		</motion.div>
	</RadixDialog.Content>
));
DialogContent.displayName = "DialogContent";

// ─── Title & Description ──────────────────────────────────────────────────────
const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col gap-1 mb-4", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

// RadixDialog.Title surfaces to the accessibility tree — required
const DialogTitle = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Title>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
	<RadixDialog.Title
		ref={ref}
		className={cn(
			"text-[24px] leading-[32px] font-medium text-m3-on-surface tracking-[-0.01em]",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Description>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
	<RadixDialog.Description
		ref={ref}
		className={cn("text-sm text-m3-on-surface-variant leading-5", className)}
		{...props}
	/>
));
DialogDescription.displayName = "DialogDescription";

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

// ─── Composite component ──────────────────────────────────────────────────────
export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};

// ─── Usage pattern
// Sử dụng tại `apps/docs`:
//   <Dialog open={open} onOpenChange={setOpen}>
//     <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
//     <DialogPortal open={open}>
//       <DialogOverlay />
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Xác nhận xóa</DialogTitle>
//           <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <DialogClose asChild><Button colorStyle="text">Hủy</Button></DialogClose>
//           <Button colorStyle="filled">Xác nhận</Button>
//         </DialogFooter>
//       </DialogContent>
//     </DialogPortal>
//   </Dialog>
