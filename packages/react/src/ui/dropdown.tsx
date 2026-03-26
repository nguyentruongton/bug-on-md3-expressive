import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";

// ─── MD3 Dropdown Animation ───────────────────────────────────────────────────
const MD3_MENU_ANIM = {
	initial: { opacity: 0, scale: 0.96, y: -6 },
	animate: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 380,
			damping: 30,
			mass: 0.8,
		},
	},
	exit: { opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.12 } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type DropdownMenuProps = React.ComponentPropsWithoutRef<
	typeof RadixDropdown.Root
>;
export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
	typeof RadixDropdown.Trigger
>;

// ─── Root (re-export) ─────────────────────────────────────────────────────────
const DropdownMenu = RadixDropdown.Root;
DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = RadixDropdown.Trigger;
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuGroup = RadixDropdown.Group;
const DropdownMenuPortal = RadixDropdown.Portal;
const DropdownMenuSub = RadixDropdown.Sub;
const DropdownMenuRadioGroup = RadixDropdown.RadioGroup;

// ─── Content panel ────────────────────────────────────────────────────────────
const DropdownMenuContent = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.Content>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
	<RadixDropdown.Portal>
		<AnimatePresence>
			<RadixDropdown.Content
				ref={ref}
				sideOffset={sideOffset}
				asChild
				{...props}
			>
				<motion.div
					className={cn(
						"z-50 min-w-32 overflow-hidden",
						"rounded-xl bg-m3-surface-container p-1",
						"shadow-md",
						"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-m3-primary",
						className,
					)}
					{...MD3_MENU_ANIM}
				>
					{children}
				</motion.div>
			</RadixDropdown.Content>
		</AnimatePresence>
	</RadixDropdown.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

// ─── Sub-menu Content ─────────────────────────────────────────────────────────
const DropdownMenuSubContent = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.SubContent>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.SubContent>
>(({ className, ...props }, ref) => (
	<RadixDropdown.SubContent
		ref={ref}
		className={cn(
			"z-50 min-w-32 overflow-hidden",
			"rounded-xl bg-m3-surface-container p-1 shadow-md",
			"data-[state=open]:animate-in data-[state=closed]:animate-out",
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
			"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
			"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			className,
		)}
		{...props}
	/>
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// ─── Item ─────────────────────────────────────────────────────────────────────
const DropdownMenuItem = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.Item>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<RadixDropdown.Item
		ref={ref}
		className={cn(
			// MD3 State Layer behavior
			"relative flex cursor-pointer select-none items-center gap-2",
			"rounded-lg px-3 py-2 text-sm text-m3-on-surface",
			"outline-none transition-colors duration-150",
			"hover:bg-m3-on-surface/8",
			"focus:bg-m3-on-surface/12",
			"data-disabled:pointer-events-none data-disabled:opacity-38",
			"focus-visible:ring-0", // Radix gốc handle ring internally
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

// ─── Checkbox Item ────────────────────────────────────────────────────────────
const DropdownMenuCheckboxItem = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<RadixDropdown.CheckboxItem
		ref={ref}
		className={cn(
			"relative flex cursor-pointer select-none items-center gap-2",
			"rounded-lg py-2 pl-8 pr-3 text-sm text-m3-on-surface",
			"outline-none transition-colors duration-150",
			"hover:bg-m3-on-surface/8 focus:bg-m3-on-surface/12",
			"data-disabled:pointer-events-none data-disabled:opacity-38",
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className="absolute left-2 flex h-4 w-4 items-center justify-center">
			<RadixDropdown.ItemIndicator>
				<Check className="h-4 w-4" aria-hidden="true" />
			</RadixDropdown.ItemIndicator>
		</span>
		{children}
	</RadixDropdown.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// ─── Radio Item ───────────────────────────────────────────────────────────────
const DropdownMenuRadioItem = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.RadioItem>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.RadioItem>
>(({ className, children, ...props }, ref) => (
	<RadixDropdown.RadioItem
		ref={ref}
		className={cn(
			"relative flex cursor-pointer select-none items-center gap-2",
			"rounded-lg py-2 pl-8 pr-3 text-sm text-m3-on-surface",
			"outline-none transition-colors duration-150",
			"hover:bg-m3-on-surface/8 focus:bg-m3-on-surface/12",
			"data-disabled:pointer-events-none data-disabled:opacity-38",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-4 w-4 items-center justify-center">
			<RadixDropdown.ItemIndicator>
				<Circle className="h-2 w-2 fill-current" aria-hidden="true" />
			</RadixDropdown.ItemIndicator>
		</span>
		{children}
	</RadixDropdown.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// ─── Separator ────────────────────────────────────────────────────────────────
const DropdownMenuSeparator = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.Separator>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.Separator>
>(({ className, ...props }, ref) => (
	<RadixDropdown.Separator
		ref={ref}
		className={cn("my-1 h-px bg-m3-outline-variant", className)}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// ─── Label ────────────────────────────────────────────────────────────────────
const DropdownMenuLabel = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.Label>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<RadixDropdown.Label
		ref={ref}
		className={cn(
			"px-3 py-1.5 text-xs font-medium text-m3-on-surface-variant uppercase tracking-wider",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// ─── Sub Trigger ──────────────────────────────────────────────────────────────
const DropdownMenuSubTrigger = React.forwardRef<
	React.ComponentRef<typeof RadixDropdown.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof RadixDropdown.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => (
	<RadixDropdown.SubTrigger
		ref={ref}
		className={cn(
			"flex cursor-default select-none items-center gap-2",
			"rounded-lg px-3 py-2 text-sm text-m3-on-surface",
			"outline-none transition-colors duration-150",
			"hover:bg-m3-on-surface/8 focus:bg-m3-on-surface/12",
			"data-[state=open]:bg-m3-on-surface/8",
			inset && "pl-8",
			className,
		)}
		{...props}
	>
		{children}
		<ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
	</RadixDropdown.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// ─── Shortcut ─────────────────────────────────────────────────────────────────
const DropdownMenuShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
	<span
		className={cn(
			"ml-auto text-xs tracking-widest text-m3-on-surface-variant",
			className,
		)}
		{...props}
	/>
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};
