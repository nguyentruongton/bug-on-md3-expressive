import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

// ─── MD3 Expressive Drawer Animation ─────────────────────────────────────────
// Slide từ dưới lên, spring physics giống Google Material's "Emphasized" easing
const MD3_DRAWER_SPRING = {
	type: "spring" as const,
	stiffness: 350,
	damping: 35,
	mass: 0.9,
};

const MD3_DRAWER_ANIM = {
	initial: { y: "100%", opacity: 0.6 },
	animate: {
		y: 0,
		opacity: 1,
		transition: MD3_DRAWER_SPRING,
	},
	exit: {
		y: "100%",
		opacity: 0,
		transition: { duration: 0.22, ease: "easeIn" as const },
	},
};

const MD3_SCRIM_ANIM = {
	initial: { opacity: 0 },
	animate: {
		opacity: 1,
		transition: { duration: 0.2, ease: "easeOut" as const },
	},
	exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" as const } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DrawerProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

export interface DrawerContentProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof RadixDialog.Content>,
		"asChild"
	> {
	/** Chiều cao tối đa (vh). Mặc định 90vh */
	maxHeight?: string;
	/** Ẩn drag handle */
	hideHandle?: boolean;
	/** Ẩn nút đóng */
	hideCloseButton?: boolean;
	className?: string;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const Drawer = ({ open, onOpenChange, children }: DrawerProps) => (
	<RadixDialog.Root open={open} onOpenChange={onOpenChange}>
		{children}
	</RadixDialog.Root>
);
Drawer.displayName = "Drawer";

const DrawerTrigger = RadixDialog.Trigger;
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerClose = RadixDialog.Close;

// ─── Portal wrapper với AnimatePresence ───────────────────────────────────────
const DrawerPortal = ({
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

// ─── Scrim overlay ────────────────────────────────────────────────────────────
const DrawerOverlay = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Overlay>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
	<RadixDialog.Overlay ref={ref} asChild {...props}>
		<motion.div
			aria-hidden="true"
			className={cn("fixed inset-0 z-50 bg-black/40", className)}
			{...MD3_SCRIM_ANIM}
		/>
	</RadixDialog.Overlay>
));
DrawerOverlay.displayName = "DrawerOverlay";

// ─── Content ─────────────────────────────────────────────────────────────────
const DrawerContent = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Content>,
	DrawerContentProps
>(
	(
		{
			className,
			children,
			maxHeight = "90vh",
			hideHandle = false,
			hideCloseButton = false,
			style,
			...props
		},
		ref,
	) => (
		<RadixDialog.Content ref={ref} asChild {...props}>
			<motion.div
				className={cn(
					// MD3 Bottom Sheet shape: chỉ bo góc trên
					"fixed bottom-0 left-0 right-0 z-50",
					"rounded-t-[28px] bg-m3-surface-container-low",
					"flex flex-col overflow-hidden",
					"outline-none",
					// focus-visible ring — a11y
					"focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-inset",
					className,
				)}
				style={{ maxHeight, ...style }}
				{...MD3_DRAWER_ANIM}
			>
				{/* Drag handle — decorative hint */}
				{!hideHandle && (
					<div
						aria-hidden="true"
						className="mx-auto mt-3 h-1 w-9 rounded-full bg-m3-on-surface-variant/40 shrink-0"
					/>
				)}

				{/* Close button */}
				{!hideCloseButton && (
					<RadixDialog.Close
						className={cn(
							"absolute right-4 top-3 rounded-full p-2",
							"text-m3-on-surface-variant",
							"hover:bg-m3-on-surface/8",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary",
							"transition-colors duration-200",
						)}
						aria-label="Đóng bảng điều khiển"
					>
						<Icon name="close" size={20} aria-hidden="true" />
					</RadixDialog.Close>
				)}

				{/* Scrollable content area */}
				<div className="flex-1 overflow-y-auto overscroll-contain p-6">
					{children}
				</div>
			</motion.div>
		</RadixDialog.Content>
	),
);
DrawerContent.displayName = "DrawerContent";

// ─── Sub-components ───────────────────────────────────────────────────────────
const DrawerHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col gap-1 mb-4", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col gap-2 mt-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Title>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
	<RadixDialog.Title
		ref={ref}
		className={cn(
			"text-[22px] leading-7 font-medium text-m3-on-surface",
			className,
		)}
		{...props}
	/>
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
	React.ComponentRef<typeof RadixDialog.Description>,
	React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
	<RadixDialog.Description
		ref={ref}
		className={cn("text-sm text-m3-on-surface-variant leading-5", className)}
		{...props}
	/>
));
DrawerDescription.displayName = "DrawerDescription";

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
};

// ─── Usage:
//   <Drawer open={open} onOpenChange={setOpen}>
//     <DrawerTrigger asChild><Button>Mở Drawer</Button></DrawerTrigger>
//     <DrawerPortal open={open}>
//       <DrawerOverlay />
//       <DrawerContent maxHeight="80vh">
//         <DrawerHeader>
//           <DrawerTitle>Chi tiết đơn hàng</DrawerTitle>
//           <DrawerDescription>Xem thông tin đơn hàng #1234</DrawerDescription>
//         </DrawerHeader>
//         <p>Nội dung drawer...</p>
//         <DrawerFooter>
//           <Button colorStyle="filled" className="w-full">Xác nhận</Button>
//         </DrawerFooter>
//       </DrawerContent>
//     </DrawerPortal>
//   </Drawer>
