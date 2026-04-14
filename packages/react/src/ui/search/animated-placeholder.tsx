/**
 * @file animated-placeholder.tsx
 * MD3 Expressive Search — Animated placeholder overlay.
 *
 * Replaces the native `::placeholder` with a GPU-accelerated `translateX`
 * animation so the placeholder text can smoothly slide from its alignment
 * position (center / right) to left when the search input is focused.
 *
 * Implementation notes:
 * - Only `transform: translateX` is animated → no layout triggers, no paint.
 * - Container width is measured once via `useLayoutEffect` (before paint) to
 *   avoid a first-render flash, then kept fresh via `ResizeObserver`.
 * - xOffset is stored in `useState` so Framer Motion picks up changes and
 *   re-animates smoothly on container resize.
 * - The span is never unmounted — only opacity-toggled — to preserve the
 *   measurement ref between renders.
 */

import { m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { SEARCH_COLORS, SEARCH_TYPOGRAPHY } from "./search.tokens";

/** Spring tuned to match MD3 Standard Decelerate curve. */
const PLACEHOLDER_SPRING = {
	type: "spring" as const,
	stiffness: 350,
	damping: 30,
	mass: 0.8,
};

interface AnimatedPlaceholderProps {
	/** Placeholder text to display. */
	text: string;
	/** Alignment of the placeholder when idle (not focused). @default "left" */
	textAlign: "left" | "center" | "right";
	/**
	 * Whether the placeholder should be visible.
	 * Pass `!query` — hide when the user has typed something.
	 */
	visible: boolean;
	/**
	 * Whether the search is in an active/focused state.
	 * When `true`, the placeholder snaps to `left` regardless of `textAlign`.
	 */
	focused: boolean;
	/**
	 * The `<input>` element that this component wraps.
	 * It should have `w-full` instead of `flex-1` since this wrapper
	 * takes over the `flex-1` role in the parent flex layout.
	 */
	children: React.ReactNode;
	/** Extra className forwarded to the wrapper div. */
	className?: string;
}

/**
 * Wraps a search `<input>` with an animated placeholder overlay.
 *
 * The wrapper div occupies `flex-1` so it fits seamlessly in the
 * horizontal flex layout used by search bar headers. The children
 * (the `<input>`) should use `w-full` to fill the wrapper.
 *
 * Accessibility: `aria-label` on the `<input>` carries the placeholder
 * text for screen readers; this span is `aria-hidden="true"`.
 */
export function AnimatedPlaceholder({
	text,
	textAlign,
	visible,
	focused,
	children,
	className,
}: AnimatedPlaceholderProps) {
	const shouldReduceMotion = useReducedMotion();
	const containerRef = React.useRef<HTMLDivElement>(null);
	const spanRef = React.useRef<HTMLSpanElement | null>(null);

	// Offset in pixels from left when idle. 0 means no animation (left-aligned).
	const [xOffset, setXOffset] = React.useState(0);

	const recalculate = React.useCallback(() => {
		const container = containerRef.current;
		const span = spanRef.current;
		if (!container || !span || textAlign === "left") {
			setXOffset(0);
			return;
		}
		const containerWidth = container.offsetWidth;
		const textWidth = span.offsetWidth;
		if (textAlign === "center") {
			setXOffset(Math.max(0, (containerWidth - textWidth) / 2));
		} else {
			// right
			setXOffset(Math.max(0, containerWidth - textWidth));
		}
	}, [textAlign]);

	// Measure synchronously before first paint to prevent a position flash.
	React.useLayoutEffect(() => {
		recalculate();
	}, [recalculate]);

	// Keep measurement fresh when the container is resized.
	React.useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new ResizeObserver(recalculate);
		observer.observe(container);
		return () => observer.disconnect();
	}, [recalculate]);

	// When focused or no longer visible (user typed), snap to left (x=0).
	const targetX = focused || !visible ? 0 : xOffset;

	return (
		<div
			ref={containerRef}
			className={cn("relative flex-1 min-w-0", className)}
		>
			{children}

			{/* Animated placeholder — decorative only, aria-hidden */}
			<m.span
				ref={(el) => {
					spanRef.current = el;
				}}
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-y-0 left-0",
					"flex items-center whitespace-nowrap select-none",
					SEARCH_TYPOGRAPHY.bodyLarge,
				)}
				style={{ color: SEARCH_COLORS.supportingText }}
				animate={{
					x: targetX,
					opacity: visible ? 1 : 0,
				}}
				transition={shouldReduceMotion ? { duration: 0 } : PLACEHOLDER_SPRING}
			>
				{text}
			</m.span>
		</div>
	);
}
