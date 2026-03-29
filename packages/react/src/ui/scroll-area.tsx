"use client";

import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import * as React from "react";
import { cn } from "../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
/** Radix accepts hover/scroll/always/auto. We add 'none' as a UI-only hide. */
export type ScrollAreaType = "hover" | "scroll" | "always" | "none";
type RadixScrollAreaType = "hover" | "scroll" | "always" | "auto";
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof RadixScrollArea.Root>,
		"type"
	> {
	/**
	 * Controls when the scrollbars are visible.
	 * - `hover`: Show on hover (default, recommended for desktop)
	 * - `scroll`: Show only while scrolling (recommended for mobile)
	 * - `always`: Always visible
	 * - `none`: Never visible
	 */
	type?: ScrollAreaType;
	/**
	 * The scrollbar orientation to render.
	 * @default "vertical"
	 */
	orientation?: ScrollAreaOrientation;
	/** Delay in ms before scrollbars hide when `type` is `hover` or `scroll`. */
	scrollHideDelay?: number;
	/** Extra classes applied to the inner viewport element. */
	viewportClassName?: string;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const ScrollArea = React.forwardRef<
	React.ElementRef<typeof RadixScrollArea.Root>,
	ScrollAreaProps
>(
	(
		{
			className,
			viewportClassName,
			children,
			type = "hover",
			orientation = "vertical",
			scrollHideDelay = 600,
			...props
		},
		ref,
	) => {
		const radixType: RadixScrollAreaType =
			type === "none" ? "always" : type;

		return (
			<RadixScrollArea.Root
				ref={ref}
				type={radixType}
				scrollHideDelay={scrollHideDelay}
				className={cn("relative overflow-hidden flex flex-col", className)}
				{...props}
			>
				<RadixScrollArea.Viewport
					className={cn(
						"h-full w-full flex-1 min-h-0 rounded-[inherit]",
						"outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-1",
						viewportClassName,
					)}
				>
					{children}
				</RadixScrollArea.Viewport>

				{(orientation === "vertical" || orientation === "both") && (
					<ScrollAreaScrollbar
						orientation="vertical"
						className={type === "none" ? "hidden" : undefined}
					/>
				)}

				{(orientation === "horizontal" || orientation === "both") && (
					<ScrollAreaScrollbar
						orientation="horizontal"
						className={type === "none" ? "hidden" : undefined}
					/>
				)}

				<RadixScrollArea.Corner className="bg-m3-surface-container" />
			</RadixScrollArea.Root>
		);
	},
);
ScrollArea.displayName = "ScrollArea";

// ─── Scrollbar ────────────────────────────────────────────────────────────────
const ScrollAreaScrollbar = React.forwardRef<
	React.ElementRef<typeof RadixScrollArea.Scrollbar>,
	React.ComponentPropsWithoutRef<typeof RadixScrollArea.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<RadixScrollArea.Scrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			"flex touch-none select-none transition-all duration-300 ease-in-out",
			"absolute z-50",
			orientation === "vertical" &&
				"right-0 top-0 bottom-0 w-2.5 border-l border-l-transparent p-px",
			orientation === "horizontal" &&
				"bottom-0 left-0 right-0 h-2.5 flex-col border-t border-t-transparent p-px",
			"data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
			className,
		)}
		{...props}
	>
		<RadixScrollArea.Thumb
			className={cn(
				"relative flex-1 rounded-full bg-m3-on-surface/25 transition-colors duration-200",
				"hover:bg-m3-on-surface/40 active:bg-m3-on-surface/55",
				"before:absolute before:left-1/2 before:top-1/2 before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2",
			)}
		/>
	</RadixScrollArea.Scrollbar>
));
ScrollAreaScrollbar.displayName = RadixScrollArea.Scrollbar.displayName;

// ─── Corner ───────────────────────────────────────────────────────────────────
const ScrollAreaCorner = React.forwardRef<
	React.ComponentRef<typeof RadixScrollArea.Corner>,
	React.ComponentPropsWithoutRef<typeof RadixScrollArea.Corner>
>(({ className, ...props }, ref) => (
	<RadixScrollArea.Corner
		ref={ref}
		className={cn("bg-m3-surface-container", className)}
		{...props}
	/>
));
ScrollAreaCorner.displayName = "ScrollAreaCorner";

export {
	ScrollArea,
	ScrollAreaScrollbar,
};
