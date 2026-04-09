import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import {
	cloneElement,
	type ReactElement,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import type { TooltipBoxProps } from "./tooltip.types";
import { useTooltipPosition } from "./use-tooltip-position";
import { useTooltipState } from "./use-tooltip-state";

type Side = "top" | "bottom" | "left" | "right";

const TRANSFORM_ORIGIN: Record<Side, string> = {
	top: "50% 100%",
	bottom: "50% 0%",
	left: "100% 50%",
	right: "0% 50%",
};

const MOTION_VARIANTS = {
	full: {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				opacity: { duration: 0.1, ease: "easeOut" },
				scale: { type: "spring", stiffness: 900, damping: 90, mass: 0.5 },
			},
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			transition: {
				opacity: { duration: 0.075, ease: "easeIn" },
				scale: { duration: 0.1, ease: "easeIn" },
			},
		},
	},
	reduced: {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.15 } },
		exit: { opacity: 0, transition: { duration: 0.1 } },
	},
} as const;

function clearTimeout(ref: React.MutableRefObject<number | null>) {
	if (ref.current !== null) window.clearTimeout(ref.current);
}

export function TooltipBox({
	children,
	tooltip,
	placement = "top",
	trigger = ["hover", "focus"],
	state: controlledState,
	spacingFromAnchor = 4,
	disabled = false,
	className = "",
	showDelay = 400,
	hideDelay = 200,
	"aria-label": ariaLabel,
}: TooltipBoxProps) {
	const internalState = useTooltipState();
	const state = controlledState ?? internalState;

	const anchorRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const hoverTimeoutRef = useRef<number | null>(null);
	const hideTimeoutRef = useRef<number | null>(null);
	const pressTimeoutRef = useRef<number | null>(null);

	const triggers = Array.isArray(trigger) ? trigger : [trigger];

	const [mounted, setMounted] = useState(false);
	const [hasHoverSupport, setHasHoverSupport] = useState(true);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		setMounted(true);
		setHasHoverSupport(!window.matchMedia("(hover: none)").matches);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);
		const onChange = (e: MediaQueryListEvent) =>
			setPrefersReducedMotion(e.matches);
		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	const position = useTooltipPosition(
		anchorRef,
		tooltipRef,
		placement,
		spacingFromAnchor,
		state.isVisible,
	);

	const canHover = !disabled && hasHoverSupport && triggers.includes("hover");
	const canClick = !disabled && triggers.includes("click");

	const handlePointerEnter = () => {
		if (!canHover) return;
		clearTimeout(hoverTimeoutRef);
		clearTimeout(hideTimeoutRef);
		hoverTimeoutRef.current = window.setTimeout(() => state.show(), showDelay);
	};

	const handlePointerLeave = () => {
		if (!canHover) return;
		clearTimeout(hoverTimeoutRef);
		hideTimeoutRef.current = window.setTimeout(
			() => state.dismiss(),
			hideDelay,
		);
	};

	const handleFocus = () => {
		if (disabled || !triggers.includes("focus")) return;
		state.show();
	};

	const handleBlur = (e: React.FocusEvent) => {
		if (disabled) return;
		const focusMovedInside =
			tooltipRef.current &&
			(e.relatedTarget === tooltipRef.current ||
				tooltipRef.current.contains(e.relatedTarget as Node));
		if (focusMovedInside) return;
		state.dismiss();
	};

	const handlePointerDown = (e: React.PointerEvent) => {
		if (
			disabled ||
			!triggers.includes("long-press") ||
			e.pointerType === "mouse"
		)
			return;
		clearTimeout(pressTimeoutRef);
		pressTimeoutRef.current = window.setTimeout(() => state.show(), 500);
	};

	const handleClick = () => {
		if (!canClick) return;
		if (state.isVisible) state.dismiss();
		else state.show();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled || !canClick) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	const handleContextMenu = (e: React.MouseEvent) => {
		if (triggers.includes("long-press") && state.isVisible) e.preventDefault();
	};

	const handleTooltipPointerEnter = () => {
		if (!canHover) return;
		clearTimeout(hideTimeoutRef);
	};

	const handleTooltipPointerLeave = () => {
		if (!canHover) return;
		hideTimeoutRef.current = window.setTimeout(
			() => state.dismiss(),
			hideDelay,
		);
	};

	useEffect(() => {
		if (!state.isVisible) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				state.dismiss();
				anchorRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [state.isVisible, state]);

	const tooltipId = useId();

	const tooltipWithProps = cloneElement(
		tooltip as ReactElement<{
			"data-side"?: Side;
			id?: string;
			role?: string;
			onBlur?: (e: React.FocusEvent) => void;
		}>,
		{
			"data-side": position.actualSide,
			id: tooltipId,
			role: "tooltip",
			onBlur: handleBlur,
		},
	);

	const variants = prefersReducedMotion
		? MOTION_VARIANTS.reduced
		: MOTION_VARIANTS.full;

	return (
		<>
			<Slot
				ref={anchorRef}
				className={`inline-flex ${className}`}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onPointerDown={handlePointerDown}
				onPointerUp={() => clearTimeout(pressTimeoutRef)}
				onPointerCancel={() => clearTimeout(pressTimeoutRef)}
				onContextMenu={handleContextMenu}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				aria-label={ariaLabel}
				aria-describedby={state.isVisible ? tooltipId : undefined}
			>
				{React.isValidElement(children) ? children : <span>{children}</span>}
			</Slot>

			{mounted &&
				createPortal(
					<AnimatePresence mode="wait">
						{state.isVisible && !disabled && (
							<motion.div
								ref={tooltipRef}
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={variants}
								onPointerEnter={handleTooltipPointerEnter}
								onPointerLeave={handleTooltipPointerLeave}
								style={{
									position: "fixed",
									top: position.top,
									left: position.left,
									transformOrigin: TRANSFORM_ORIGIN[position.actualSide],
									zIndex: 50,
									pointerEvents: "auto",
								}}
							>
								{tooltipWithProps}
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	);
}
