"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, domMax, LazyMotion, m, type Transition } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Ripple, useRippleState } from "./ripple";
import { SPRING_TRANSITION_EXPRESSIVE } from "./shared/constants";
import { TouchTarget } from "./shared/touch-target";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Layout styling for navigation bar items.
 * - vertical: Icon above label (default for mobile)
 * - horizontal: Icon beside label (forced)
 */
export type NavigationBarItemLayout = "vertical" | "horizontal";

/**
 * Visual variant of the Navigation Bar.
 * - flexible: Default MD3 behavior (h-16), becomes horizontal on desktop.
 * - baseline: Taller MD3 behavior (h-20), always vertical.
 * - xr: Floating orbiter variant for spatial interfaces (detached from bottom).
 */
export type NavigationBarVariant = "flexible" | "baseline" | "xr";

export interface NavigationBarItemProps {
	selected: boolean;
	icon: React.ReactNode;
	label: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	badge?: React.ReactNode;
	"aria-label"?: string;
	className?: string;
}

export interface NavigationBarProps {
	/** Visual variant of the Navigation Bar */
	variant?: NavigationBarVariant;
	/** Forces a specific item layout (horizontal/vertical) */
	itemLayout?: NavigationBarItemLayout;
	/** Whether the bar should hide when scrolling down */
	hideOnScroll?: boolean;
	/** Whether the bar should have an elevation shadow */
	elevated?: boolean;
	/** Whether the bar is fixed to the viewport (default) or absolute */
	fixed?: boolean;
	/** Container ref to track scrolling for hideOnScroll */
	scrollContainerRef?: React.RefObject<HTMLElement | null>;
	/** Transition for the active indicator pill */
	activeIndicatorTransition?: Transition;
	/** Navigation items */
	children: React.ReactNode;
	/** Optional additional classes */
	className?: string;
	/** Optional inline styles */
	style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const NavigationBarContext = React.createContext<{
	variant: NavigationBarVariant;
	itemLayout?: NavigationBarItemLayout;
	activeIndicatorTransition?: Transition;
}>({ variant: "flexible" });

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

// ─────────────────────────────────────────────────────────────────────────────
// NavigationBarItem Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ActivePill() {
	const { activeIndicatorTransition } = React.useContext(NavigationBarContext);

	return (
		<m.div
			className="absolute inset-0 bg-m3-secondary-container pointer-events-none"
			style={{
				borderRadius: 9999,
				zIndex: 0,
			}}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5 }}
			transition={activeIndicatorTransition || SPRING_TRANSITION_EXPRESSIVE}
		/>
	);
}

function HoverStateLayer() {
	return (
		<div className="absolute inset-0 rounded-full bg-m3-on-surface opacity-0 group-hover:opacity-[0.08] group-focus-visible:opacity-[0.10] active:opacity-[0.10] transition-opacity duration-200 pointer-events-none z-0" />
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
				"relative flex items-center justify-center size-6 transition-colors duration-200 shrink-0",
				selected
					? "text-m3-on-secondary-container"
					: "text-m3-on-surface-variant",
			)}
		>
			{children}
			{badge && (
				<span className="absolute -top-1 -right-1 flex min-w-3 h-3 items-center justify-center rounded-full bg-m3-error px-1 text-[10px] font-medium leading-none tracking-normal text-m3-on-error ring-[1.5px] ring-m3-surface">
					{badge}
				</span>
			)}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// NavigationBarItem
// ─────────────────────────────────────────────────────────────────────────────

const NavigationBarItemComponent = React.forwardRef<
	HTMLButtonElement,
	NavigationBarItemProps
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
		const { variant, itemLayout } = React.useContext(NavigationBarContext);

		const isForcedHorizontal = itemLayout === "horizontal";
		const isResponsiveHorizontal =
			(variant === "flexible" || variant === "xr") && itemLayout === undefined;

		const { ripples, onPointerDown, removeRipple } = useRippleState({
			disabled,
		});

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				if (disabled) {
					e.preventDefault();
					return;
				}
				if (selected) {
					if (typeof window !== "undefined" && window.scrollY > 0) {
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
					return;
				}
				onClick?.();
			},
			[disabled, selected, onClick],
		);

		const filledIcon = cloneIconWithFill(icon, selected);

		return (
			<m.button
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
					"group relative flex flex-1 cursor-pointer transition-colors duration-200 outline-none select-none h-full",
					variant === "xr"
						? "items-center justify-center max-[599px]:min-w-28 max-[599px]:max-w-28 max-[599px]:items-start max-[599px]:pt-3 max-[599px]:pb-4"
						: "items-center justify-center",
					disabled && "pointer-events-none opacity-[0.38]",
					className,
				)}
			>
				<div
					className={cn(
						"relative flex items-center justify-center flex-col gap-y-1 w-full",
						isResponsiveHorizontal &&
							"min-[600px]:flex-row min-[600px]:gap-y-0 min-[600px]:gap-x-1 min-[600px]:h-10 min-[600px]:px-4 min-[600px]:rounded-full min-[600px]:w-auto min-[600px]:max-w-42",
						isForcedHorizontal &&
							"flex-row gap-y-0 gap-x-1 h-10 px-4 rounded-full w-auto max-w-42",
					)}
				>
					{/* Horizontal active indicator — covers icon + label */}
					<div
						className={cn(
							"absolute inset-0 z-0 hidden",
							isResponsiveHorizontal && "min-[600px]:block",
							isForcedHorizontal && "block!",
						)}
					>
						<AnimatePresence initial={false}>
							{selected && <ActivePill />}
						</AnimatePresence>
						<HoverStateLayer />
						<RippleLayer ripples={ripples} onRippleDone={removeRipple} />
					</div>

					{/* Icon pill — background visible only in vertical layout */}
					<div
						className={cn(
							"relative flex items-center justify-center shrink-0 z-10",
							"h-8 w-16 mx-auto rounded-full",
							isResponsiveHorizontal &&
								"min-[600px]:size-6 min-[600px]:w-auto min-[600px]:h-auto",
							isForcedHorizontal && "size-6 w-auto h-auto",
						)}
					>
						<div
							className={cn(
								"absolute inset-0 z-0",
								isResponsiveHorizontal && "min-[600px]:hidden",
								isForcedHorizontal && "hidden",
							)}
						>
							<AnimatePresence initial={false}>
								{selected && <ActivePill />}
							</AnimatePresence>
							<HoverStateLayer />
							<RippleLayer ripples={ripples} onRippleDone={removeRipple} />
						</div>

						<div className="relative z-10 flex size-6 items-center justify-center text-current">
							<IconContainer selected={selected} badge={badge}>
								{filledIcon}
							</IconContainer>
						</div>
					</div>

					<AnimatePresence mode="popLayout">
						<span
							key="nav-label"
							className={cn(
								"z-10 transition-all duration-200 truncate px-1",
								selected ? "text-m3-on-surface" : "text-m3-on-surface-variant",
								"font-medium text-[12px] leading-4 tracking-[0.5px]",
							)}
						>
							{label}
						</span>
					</AnimatePresence>
				</div>
				<TouchTarget />
			</m.button>
		);
	},
);

NavigationBarItemComponent.displayName = "NavigationBarItem";
export const NavigationBarItem = React.memo(NavigationBarItemComponent);

// ─────────────────────────────────────────────────────────────────────────────
// NavigationBar Container
// ─────────────────────────────────────────────────────────────────────────────

const navContainerVariants = cva(
	"flex items-center justify-center select-none transition-transform duration-300 z-50",
	{
		variants: {
			variant: {
				flexible: "bottom-0 left-0 right-0 w-full h-16 pb-safe",
				baseline: "bottom-0 left-0 right-0 w-full h-20 pb-safe",
				xr: "bottom-6 left-1/2 -translate-x-1/2 w-auto max-w-fit h-20 min-[600px]:h-16 rounded-[48px] px-2",
			},
			position: {
				fixed: "fixed",
				absolute: "absolute",
			},
			elevated: {
				true: "shadow-[0_-1px_3px_rgba(0,0,0,0.1)]",
				false: "shadow-none",
			},
		},
		defaultVariants: {
			variant: "flexible",
			position: "fixed",
			elevated: false,
		},
	},
);

export const NavigationBarComponent = React.forwardRef<
	HTMLElement,
	NavigationBarProps
>(
	(
		{
			variant = "flexible",
			itemLayout,
			hideOnScroll = false,
			elevated = false,
			fixed = true,
			scrollContainerRef,
			activeIndicatorTransition,
			children,
			className,
			style,
		},
		ref,
	) => {
		const [isVisible, setIsVisible] = React.useState(true);
		const lastScrollY = React.useRef(
			typeof window !== "undefined" ? window.scrollY : 0,
		);

		React.useEffect(() => {
			if (typeof window === "undefined" || !hideOnScroll) {
				setIsVisible(true);
				return;
			}

			// Do not hide if screen reader or reduced motion is active
			const prefersReducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches;
			if (prefersReducedMotion) {
				setIsVisible(true);
				return;
			}

			let ticking = false;

			const handleScroll = () => {
				if (ticking) return;
				ticking = true;
				window.requestAnimationFrame(() => {
					const currentScrollY = scrollContainerRef?.current
						? scrollContainerRef.current.scrollTop
						: window.scrollY;

					if (currentScrollY <= 0 || currentScrollY < lastScrollY.current) {
						setIsVisible(true);
					} else if (currentScrollY > lastScrollY.current) {
						setIsVisible(false);
					}

					lastScrollY.current = currentScrollY;
					ticking = false;
				});
			};

			const target = scrollContainerRef?.current || window;

			target.addEventListener("scroll", handleScroll, { passive: true });
			return () => target.removeEventListener("scroll", handleScroll);
		}, [hideOnScroll, scrollContainerRef]);

		const navBaseClasses = cn(
			navContainerVariants({
				variant,
				elevated,
				position: fixed ? "fixed" : "absolute",
			}),
			variant === "xr"
				? "bg-m3-surface border border-white/5 shadow-xl"
				: "bg-m3-surface-container",
			className,
		);

		return (
			<LazyMotion features={domMax} strict>
				<NavigationBarContext.Provider value={{ variant, itemLayout, activeIndicatorTransition }}>
					<m.nav
						ref={ref}
						role="navigation"
						aria-label="Main navigation"
						className={navBaseClasses}
						style={style}
						initial={false}
						animate={{ y: isVisible ? "0%" : "100%" }}
						transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
					>
						<div
							role="menubar"
							aria-orientation="horizontal"
							className={cn(
								"flex w-full h-full mx-auto",
								variant === "xr" ? "gap-0 min-[600px]:gap-1.5" : "max-w-7xl gap-1.5",
							)}
						>
							{children}
						</div>
					</m.nav>
				</NavigationBarContext.Provider>
			</LazyMotion>
		);
	},
);

NavigationBarComponent.displayName = "NavigationBar";
export const NavigationBar = React.memo(NavigationBarComponent);
