import { cva } from "class-variance-authority";
import { AnimatePresence, domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Ripple, useRippleState } from "./ripple";
import { SPRING_TRANSITION } from "./shared/constants";
import { TouchTarget } from "./shared/touch-target";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

export type NavigationRailVariant = "collapsed" | "expanded" | "modal";
export type NavigationRailLabelVisibility = "labeled" | "auto" | "unlabeled";

export interface NavigationRailItemProps {
	selected: boolean;
	icon: React.ReactNode;
	label?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	badge?: React.ReactNode;
	"aria-label"?: string;
	className?: string;
}

export interface NavigationRailProps {
	variant?: NavigationRailVariant;
	labelVisibility?: NavigationRailLabelVisibility;
	header?: React.ReactNode;
	fab?: React.ReactNode;
	footer?: React.ReactNode;
	narrow?: boolean;
	open?: boolean;
	xr?: boolean | "contained" | "spatialized";
	onClose?: () => void;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const NavigationRailContext = React.createContext<{
	variant: NavigationRailVariant;
	labelVisibility: NavigationRailLabelVisibility;
	xr: boolean;
}>({ variant: "collapsed", labelVisibility: "labeled", xr: false });

const MD3_MODAL_TRANSITION = {
	type: "tween",
	ease: [0.05, 0.7, 0.1, 1],
	duration: 0.3,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CVA Variants
// ─────────────────────────────────────────────────────────────────────────────

const railContainerVariants = cva(
	"flex flex-col overflow-y-auto overflow-x-hidden select-none transition-colors duration-300",
	{
		variants: {
			variant: {
				collapsed: "items-center",
				expanded: "items-start",
				modal:
					"bg-m3-surface shadow-lg rounded-r-[var(--m3-shape-corner-large)]",
			},
			narrow: {
				true: "w-20",
				false: "w-24",
			},
			xr: {
				true: "h-fit py-5 rounded-[48px] shadow-xl bg-m3-surface border border-white/5",
				false: "h-full pt-11 pb-4 shadow-none bg-m3-surface rounded-none",
			},
		},
		compoundVariants: [
			{ variant: "expanded", className: "min-w-[13.75rem] max-w-[22.5rem]" },
			{ variant: "modal", className: "min-w-[13.75rem] max-w-[22.5rem]" },
		],
		defaultVariants: {
			variant: "collapsed",
			narrow: false,
			xr: false,
		},
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cloneIconWithFill(
	icon: React.ReactNode,
	selected: boolean,
): React.ReactNode {
	if (!React.isValidElement(icon)) return icon;
	if ((icon.type as unknown) === Icon) {
		return React.cloneElement(
			icon as React.ReactElement<{ fill?: 0 | 1; animateFill?: boolean }>,
			{ fill: selected ? 1 : 0, animateFill: true },
		);
	}
	return icon;
}

function getMenuItems(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(
			'[role="menuitem"]:not([aria-disabled="true"])',
		),
	);
}

function setFocusedItem(items: HTMLElement[], index: number) {
	for (const item of items) item.tabIndex = -1;
	const target = items[index];
	if (target) {
		target.tabIndex = 0;
		target.focus();
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// NavigationRailItem Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface ActivePillProps {
	layoutId: string;
	disableInitial?: boolean;
}

function ActivePill({ layoutId, disableInitial = false }: ActivePillProps) {
	return (
		<m.div
			layoutId={layoutId}
			className="absolute inset-0 bg-m3-secondary-container pointer-events-none"
			style={{ borderRadius: 9999, zIndex: 0 }}
			initial={disableInitial ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={SPRING_TRANSITION}
		/>
	);
}

function HoverStateLayer() {
	return (
		<div className="absolute inset-0 rounded-full bg-m3-on-surface opacity-0 group-hover:opacity-[0.08] transition-opacity duration-200 pointer-events-none z-0" />
	);
}

interface RippleLayerProps {
	ripples: ReturnType<typeof useRippleState>["ripples"];
	onRippleDone: ReturnType<typeof useRippleState>["removeRipple"];
}

function RippleLayer({ ripples, onRippleDone }: RippleLayerProps) {
	return (
		<div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
			<Ripple ripples={ripples} onRippleDone={onRippleDone} />
		</div>
	);
}

interface IconContainerProps {
	selected: boolean;
	badge?: React.ReactNode;
	children: React.ReactNode;
}

function IconContainer({ selected, badge, children }: IconContainerProps) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"relative flex items-center justify-center size-6 transition-colors duration-200",
				selected
					? "text-m3-on-secondary-container"
					: "text-m3-on-surface-variant",
			)}
		>
			{children}
			{badge && (
				<span className="absolute -top-1 -right-1 flex min-w-3 h-3 items-center justify-center rounded-full bg-m3-error px-1 text-[10px] font-medium leading-none tracking-normal text-m3-on-error">
					{badge}
				</span>
			)}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// NavigationRailItem
// ─────────────────────────────────────────────────────────────────────────────

const NavigationRailItemComponent = React.forwardRef<
	HTMLButtonElement,
	NavigationRailItemProps
>(
	(
		{
			selected,
			icon,
			label,
			onClick,
			disabled = false,
			badge,
			className,
			"aria-label": ariaLabelProp,
		},
		ref,
	) => {
		const { variant, labelVisibility } = React.useContext(
			NavigationRailContext,
		);
		const isExpanded = variant === "expanded" || variant === "modal";
		const isModal = variant === "modal";
		const enableLayout = !isModal;

		const activePillId = `rail-pill-${React.useId()}`;
		const { ripples, onPointerDown, removeRipple } = useRippleState({
			disabled,
		});

		const showLabel =
			isExpanded ||
			labelVisibility === "labeled" ||
			(labelVisibility === "auto" && selected);

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				if (disabled) {
					e.preventDefault();
					return;
				}
				onClick?.();
			},
			[disabled, onClick],
		);

		const filledIcon = cloneIconWithFill(icon, selected);

		const labelInitial = isModal
			? false
			: { opacity: 0, x: isExpanded ? -12 : 0, y: isExpanded ? 0 : -8 };

		return (
			<LazyMotion features={domMax} strict>
				<m.button
					layout={enableLayout}
					ref={ref}
					type="button"
					role="menuitem"
					aria-current={selected ? "page" : undefined}
					aria-disabled={disabled ? true : undefined}
					aria-label={
						ariaLabelProp || (typeof label === "string" ? label : undefined)
					}
					onClick={handleClick}
					onPointerDown={onPointerDown}
					className={cn(
						"group relative flex cursor-pointer transition-colors duration-200 outline-none select-none",
						"focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2 rounded-full",
						disabled && "pointer-events-none opacity-[0.38]",
						isExpanded
							? "w-full flex-row items-center px-3 h-14"
							: "w-full flex-col justify-center h-14",
						className,
					)}
					tabIndex={-1}
				>
					{/* Pill container - adapts layout for expanded vs collapsed */}
					<m.div
						layout={enableLayout}
						className={cn(
							"relative flex z-10",
							isExpanded
								? "flex-row items-center w-fit h-14 px-4 gap-x-3 rounded-full"
								: "flex-col items-center justify-center w-full gap-y-1 rounded-full",
						)}
					>
						{isExpanded && (
							<AnimatePresence initial={false}>
								{selected && (
									<ActivePill
										layoutId={activePillId}
										disableInitial={isModal}
									/>
								)}
							</AnimatePresence>
						)}
						{isExpanded && <HoverStateLayer />}
						{isExpanded && (
							<RippleLayer ripples={ripples} onRippleDone={removeRipple} />
						)}

						{/* Icon pill - collapsed mode */}
						<m.div
							layout={enableLayout}
							className={cn(
								"relative flex items-center justify-center shrink-0 z-10",
								isExpanded ? "size-6" : "h-8 w-14 mx-auto",
							)}
							style={{ borderRadius: 9999 }}
						>
							{!isExpanded && (
								<AnimatePresence initial={false}>
									{selected && <ActivePill layoutId={activePillId} />}
								</AnimatePresence>
							)}
							{!isExpanded && <HoverStateLayer />}
							{!isExpanded && (
								<RippleLayer ripples={ripples} onRippleDone={removeRipple} />
							)}

							<m.div
								layout={enableLayout ? "position" : false}
								className="relative z-10 flex size-6 items-center justify-center text-current"
							>
								<IconContainer selected={selected} badge={badge}>
									{filledIcon}
								</IconContainer>
							</m.div>
						</m.div>

						<AnimatePresence mode="popLayout">
							{showLabel && label && (
								<m.span
									key="rail-label"
									layout={enableLayout ? "position" : false}
									initial={labelInitial}
									animate={{ opacity: 1, x: 0, y: 0 }}
									exit={{ opacity: 0, transition: { duration: 0.1 } }}
									transition={SPRING_TRANSITION}
									className={cn(
										"z-10 transition-colors duration-200 whitespace-nowrap",
										selected
											? "text-m3-on-surface"
											: "text-m3-on-surface-variant",
										isExpanded
											? "text-sm font-medium tracking-wide text-left"
											: "text-xs font-medium tracking-wide",
									)}
								>
									{label}
								</m.span>
							)}
						</AnimatePresence>
					</m.div>

					<TouchTarget />
				</m.button>
			</LazyMotion>
		);
	},
);

NavigationRailItemComponent.displayName = "NavigationRailItem";
export const NavigationRailItem = React.memo(NavigationRailItemComponent);

// ─────────────────────────────────────────────────────────────────────────────
// NavigationRail Container
// ─────────────────────────────────────────────────────────────────────────────

function useRoving(navRef: React.RefObject<HTMLElement | null>) {
	React.useEffect(() => {
		if (!navRef.current) return;
		const items = getMenuItems(navRef.current);
		const selected = items.find(
			(el) => el.getAttribute("aria-current") === "page",
		);

		for (const item of items) item.tabIndex = -1;
		const firstFocusable = selected ?? items[0];
		if (firstFocusable) firstFocusable.tabIndex = 0;
	}, [navRef]);

	return React.useCallback(
		(e: React.KeyboardEvent<HTMLElement>) => {
			if (!navRef.current) return;
			const items = getMenuItems(navRef.current);
			if (items.length === 0) return;

			const currentIndex = items.indexOf(document.activeElement as HTMLElement);

			const keyMap: Record<string, () => number> = {
				ArrowDown: () =>
					currentIndex < items.length - 1 ? currentIndex + 1 : 0,
				ArrowRight: () =>
					currentIndex < items.length - 1 ? currentIndex + 1 : 0,
				ArrowUp: () => (currentIndex > 0 ? currentIndex - 1 : items.length - 1),
				ArrowLeft: () =>
					currentIndex > 0 ? currentIndex - 1 : items.length - 1,
				Home: () => 0,
				End: () => items.length - 1,
			};

			const getNextIndex = keyMap[e.key];

			if (getNextIndex) {
				e.preventDefault();
				setFocusedItem(items, getNextIndex());
				return;
			}

			if (
				(e.key === " " || e.key === "Enter") &&
				items.includes(document.activeElement as HTMLElement)
			) {
				e.preventDefault();
				(document.activeElement as HTMLElement).click();
			}
		},
		[navRef],
	);
}

const NavigationRailComponent = React.forwardRef<
	HTMLElement,
	NavigationRailProps
>(
	(
		{
			variant = "collapsed",
			labelVisibility = "labeled",
			header,
			fab,
			footer,
			narrow = false,
			open = false,
			xr = false,
			onClose,
			children,
			className,
			style,
		},
		ref,
	) => {
		const isModal = variant === "modal";
		const isXr = xr === true || xr === "contained" || xr === "spatialized";
		const xrMode = xr === "spatialized" ? "spatialized" : "contained";
		const isSpatial = isXr && xrMode === "spatialized";
		const applyAnimation = !isXr || !isSpatial;

		const navRef = React.useRef<HTMLElement>(null);
		const handleKeyDown = useRoving(navRef);

		const setRefs = React.useCallback(
			(node: HTMLElement | null) => {
				navRef.current = node;
				if (typeof ref === "function") ref(node);
				else if (ref) ref.current = node;
			},
			[ref],
		);

		const navBaseClasses = cn(
			railContainerVariants({ variant, narrow, xr: isXr }),
		);
		const modalPositioning = isModal ? "fixed left-0 top-0 z-[100]" : "";

		const navHeaderSpacing = (() => {
			if (!isXr) return "mb-6 min-h-10";
			if (xrMode === "contained") return fab ? "mb-10" : "mb-5";
			return "mb-5";
		})();

		const navElement = (
			<m.nav
				key="md3-nav-rail"
				layout={!isModal}
				ref={isSpatial ? undefined : setRefs}
				role="navigation"
				aria-label="Main navigation"
				className={cn(
					navBaseClasses,
					!isSpatial && modalPositioning,
					!isSpatial && isModal && applyAnimation && "will-change-transform",
					!isSpatial && className,
				)}
				style={isSpatial ? undefined : style}
				onKeyDown={handleKeyDown}
				initial={isModal && applyAnimation ? { x: "-100%" } : false}
				animate={isModal && applyAnimation ? { x: 0 } : false}
				exit={isModal && applyAnimation ? { x: "-100%" } : undefined}
				transition={isModal ? MD3_MODAL_TRANSITION : SPRING_TRANSITION}
			>
				{(header || (fab && !isSpatial)) && (
					<div
						className={cn(
							"flex w-full flex-col items-center justify-start shrink-0 empty:hidden",
							navHeaderSpacing,
						)}
					>
						{header}
						{header && fab && !isSpatial && (
							<div className={isXr ? "h-1" : "h-4"} />
						)}
						{!isSpatial && fab}
					</div>
				)}

				<div
					role="menubar"
					aria-orientation="vertical"
					className="flex flex-col flex-1 w-full gap-y-5"
				>
					{children}
				</div>

				{footer && (
					<div className="flex w-full flex-col items-center justify-end mt-auto shrink-0 pt-4 empty:hidden">
						{footer}
					</div>
				)}
			</m.nav>
		);

		const spatialFabSize = narrow
			? "size-20 rounded-[40px]"
			: "size-24 rounded-[48px]";

		const spatialWrapper = (
			<m.div
				key="md3-nav-wrapper"
				ref={setRefs}
				className={cn(
					"flex flex-col items-center gap-y-5 pointer-events-none",
					modalPositioning,
					"m-6",
					isModal && "will-change-transform",
					className,
				)}
				style={style}
				initial={isModal ? { x: "-100%" } : false}
				animate={isModal ? { x: 0 } : false}
				exit={isModal ? { x: "-100%" } : undefined}
				transition={isModal ? MD3_MODAL_TRANSITION : SPRING_TRANSITION}
			>
				{fab && (
					<div
						className={cn(
							"flex shrink-0 items-center justify-center pointer-events-auto",
							spatialFabSize,
						)}
					>
						{fab}
					</div>
				)}
				{React.cloneElement(
					navElement as React.ReactElement<{ className?: string }>,
					{
						className: cn(navBaseClasses, "pointer-events-auto"),
					},
				)}
			</m.div>
		);

		const finalNavElement = isSpatial ? spatialWrapper : navElement;

		const contextValue = { variant, labelVisibility, xr: isXr };

		if (isModal) {
			if (typeof document === "undefined") return null;

			return createPortal(
				<LazyMotion features={domMax} strict>
					<NavigationRailContext.Provider value={contextValue}>
						<AnimatePresence>
							{open && (
								<m.div
									key="md3-nav-backdrop"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2, ease: "linear" }}
									className="fixed inset-0 bg-black/40 z-40 will-change-[opacity]"
									onClick={onClose}
									aria-hidden="true"
								/>
							)}
							{open && finalNavElement}
						</AnimatePresence>
					</NavigationRailContext.Provider>
				</LazyMotion>,
				document.body,
			);
		}

		return (
			<LazyMotion features={domMax} strict>
				<NavigationRailContext.Provider value={contextValue}>
					{finalNavElement}
				</NavigationRailContext.Provider>
			</LazyMotion>
		);
	},
);

NavigationRailComponent.displayName = "NavigationRail";
export const NavigationRail = React.memo(NavigationRailComponent);
