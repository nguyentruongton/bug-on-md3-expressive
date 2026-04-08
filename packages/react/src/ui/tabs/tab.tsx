/**
 * @file tab.tsx
 * MD3 Expressive Tab — Individual tab button with Framer Motion indicator.
 *
 * Design decisions:
 * 1. PRIMARY indicator nested inside content wrapper → width = content width (not full button).
 * 2. SECONDARY indicator outside content wrapper → `inset-x-0` = full button width.
 * 3. ROVING TABINDEX (WAI-ARIA): only focused tab has tabIndex=0; ArrowKey moves focus, Enter/Space selects.
 * 4. DISABLED tabs are skipped in ArrowKey navigation.
 * 5. RTL: ArrowLeft/Right directions are swapped when `direction: rtl` is detected.
 * 6. INLINE ICON: icon beside label, height stays 48dp (stacked = 64dp).
 * 7. AUTO-ACTIVATE: when parent `<Tabs autoActivate>`, ArrowKey also selects.
 *
 * @see https://m3.material.io/components/tabs/overview
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

import { m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { BadgedBox } from "../badge";
import { useTabsContext, useTabsListContext } from "./tabs";
import {
	TABS_COLOR_TRANSITION,
	TABS_INDICATOR_SPRING,
	TabsColors,
	TabsTokens,
} from "./tabs.tokens";
import type { TabProps } from "./tabs.types";

// ─── Constants ──────────────────────────────────────────────────────────────────

/** Minimum indicator width per MD3 spec (24dp). */
const INDICATOR_MIN_WIDTH = 24;

// ─── Tab ───────────────────────────────────────────────────────────────────────

const TabComponent = React.forwardRef<HTMLButtonElement, TabProps>(
	(
		{
			value,
			icon,
			inlineIcon = false,
			disabled = false,
			badge,
			className,
			children,
		},
		ref,
	) => {
		const {
			value: selectedValue,
			onValueChange,
			focusedValue,
			setFocusedValue,
			tabValues,
			registerTab,
			unregisterTab,
			layoutGroupId,
			disabledValues,
			markTabDisabled,
			autoActivate,
		} = useTabsContext();

		const { variant, scrollable } = useTabsListContext();

		const prefersReduced = useReducedMotion() ?? false;

		const isActive = selectedValue === value;
		const isFocused = focusedValue === value;
		const hasIcon = icon != null;
		const isStackedIcon = hasIcon && !inlineIcon;

		// ── Refs ───────────────────────────────────────────────────────────────
		const buttonRef = React.useRef<HTMLButtonElement | null>(null);
		const isFirstMount = React.useRef(true);

		// Merge forwarded ref with internal ref
		const mergedRef = React.useCallback(
			(node: HTMLButtonElement | null) => {
				buttonRef.current = node;
				if (typeof ref === "function") ref(node);
				else if (ref) ref.current = node;
			},
			[ref],
		);

		// ── Register/unregister with parent context on mount/unmount ──────────
		React.useEffect(() => {
			registerTab(value);
			return () => unregisterTab(value);
		}, [value, registerTab, unregisterTab]);

		// ── Sync disabled state with parent context ────────────────────────────
		React.useEffect(() => {
			markTabDisabled(value, disabled);
			return () => markTabDisabled(value, false);
		}, [value, disabled, markTabDisabled]);

		// ── Keyboard navigation ────────────────────────────────────────────────
		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLButtonElement>) => {
				const isRtl = buttonRef.current
					? getComputedStyle(buttonRef.current).direction === "rtl"
					: false;

				const enabledValues = tabValues.filter((v) => !disabledValues.has(v));
				const currentIndex = enabledValues.indexOf(value);

				switch (e.key) {
					case "ArrowRight":
					case "ArrowLeft": {
						e.preventDefault();
						const goForward = isRtl
							? e.key === "ArrowLeft"
							: e.key === "ArrowRight";
						const nextIndex = goForward
							? (currentIndex + 1) % enabledValues.length
							: (currentIndex - 1 + enabledValues.length) %
								enabledValues.length;
						const nextValue = enabledValues[nextIndex];
						if (nextValue) {
							setFocusedValue(nextValue);
							if (autoActivate) onValueChange(nextValue);
						}
						break;
					}
					case "Home": {
						e.preventDefault();
						const firstValue = enabledValues[0];
						if (firstValue) {
							setFocusedValue(firstValue);
							if (autoActivate) onValueChange(firstValue);
						}
						break;
					}
					case "End": {
						e.preventDefault();
						const lastValue = enabledValues[enabledValues.length - 1];
						if (lastValue) {
							setFocusedValue(lastValue);
							if (autoActivate) onValueChange(lastValue);
						}
						break;
					}
					case "Enter":
					case " ": {
						e.preventDefault();
						if (!disabled) onValueChange(value);
						break;
					}
				}
			},
			[
				tabValues,
				disabledValues,
				value,
				disabled,
				setFocusedValue,
				onValueChange,
				autoActivate,
			],
		);

		// Focus DOM node when focusedValue changes via keyboard (skip initial mount)
		React.useEffect(() => {
			if (isFirstMount.current) {
				isFirstMount.current = false;
				return;
			}
			if (isFocused && buttonRef.current) {
				buttonRef.current.focus({ preventScroll: true });
			}
		}, [isFocused]);

		// ── Auto-scroll active tab into view (scrollable mode) ─────────────────
		// Horizontally scrolls the nearest overflow-x container to reveal the
		// active tab. Uses scrollTo (not scrollIntoView) to avoid vertical page jumps.
		React.useEffect(() => {
			if (!isActive || !scrollable || !buttonRef.current) return;

			const btn = buttonRef.current;
			let container: HTMLElement | null = btn.parentElement;
			while (container) {
				const { overflowX } = getComputedStyle(container);
				if (overflowX === "auto" || overflowX === "scroll") break;
				container = container.parentElement;
			}
			if (!container) return;

			const btnRect = btn.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const overflowLeft = containerRect.left - btnRect.left;
			const overflowRight = btnRect.right - containerRect.right;

			if (overflowLeft > 0) {
				container.scrollTo({ left: container.scrollLeft - overflowLeft, behavior: "smooth" });
			} else if (overflowRight > 0) {
				container.scrollTo({ left: container.scrollLeft + overflowRight, behavior: "smooth" });
			}
		}, [isActive, scrollable]);

		// ── Derived tokens ─────────────────────────────────────────────────────
		const containerHeight =
			isStackedIcon
				? TabsTokens.containerHeightWithIcon
				: TabsTokens.containerHeight;

		const activeColor =
			variant === "primary"
				? TabsColors.primaryActiveText
				: TabsColors.secondaryActiveText;

		const inactiveColor =
			variant === "primary"
				? TabsColors.primaryInactiveText
				: TabsColors.secondaryInactiveText;

		const indicatorColor =
			variant === "primary"
				? TabsColors.primaryIndicator
				: TabsColors.secondaryIndicator;

		const indicatorLayoutId = `${layoutGroupId}-indicator`;

		const colorTransition = prefersReduced ? { duration: 0 } : TABS_COLOR_TRANSITION;
		const springTransition = prefersReduced ? { duration: 0 } : TABS_INDICATOR_SPRING;

		// ── IDs for ARIA wiring ────────────────────────────────────────────────
		const tabId = `${layoutGroupId}-tab-${value}`;
		const panelId = `${layoutGroupId}-panel-${value}`;

		// ── Content wrapper layout ─────────────────────────────────────────────
		// inlineIcon → flex-row; stacked icon → flex-col gap-0.5; text only → flex-col
		const contentFlexClass = inlineIcon
			? "flex-row gap-2"
			: isStackedIcon
				? "flex-col gap-0.5"
				: "flex-col gap-0";

		// Badge placement
		const shouldWrapIconWithBadge = isStackedIcon && badge != null;
		const shouldAppendInlineBadge = !isStackedIcon && badge != null;

		return (
			<button
				ref={mergedRef}
				id={tabId}
				type="button"
				role="tab"
				aria-selected={isActive}
				aria-controls={panelId}
				aria-disabled={disabled || undefined}
				disabled={disabled}
				tabIndex={isFocused ? 0 : -1}
				onClick={() => {
					if (!disabled) {
						onValueChange(value);
						setFocusedValue(value);
					}
				}}
				onFocus={() => setFocusedValue(value)}
				onKeyDown={handleKeyDown}
				className={cn(
					"relative inline-flex items-center justify-center",
					"cursor-pointer select-none",
					scrollable ? "shrink-0" : "flex-1",
					"focus-visible:outline-2 focus-visible:outline-offset-2",
					"focus-visible:outline-(--md-sys-color-secondary)",
					"focus-visible:rounded-lg",
					"rounded-none",
					disabled && "pointer-events-none opacity-[0.38]",
					className,
				)}
				style={{
					height: containerHeight,
					zIndex: isActive ? 1 : 0,
					...(scrollable && { minWidth: TabsTokens.scrollableMinTabWidth }),
				}}
			>
				{/*
				 * Content wrapper — PRIMARY INDICATOR TECHNIQUE:
				 * Indicator lives inside this wrapper → width matches content (not button).
				 * inlineIcon: flex-row places icon beside label, height stays 48dp.
				 */}
				<m.div
					className={cn(
						"relative flex h-full items-center justify-center",
						contentFlexClass,
					)}
					animate={{ color: isActive ? activeColor : inactiveColor }}
					transition={colorTransition}
				>
					{/* Icon (optional) — 24dp per MD3 token */}
					{hasIcon && (
						<span
							aria-hidden={!shouldWrapIconWithBadge ? "true" : undefined}
							className={cn("flex shrink-0 items-center justify-center")}
							style={{
								width: TabsTokens.iconSize,
								height: TabsTokens.iconSize,
							}}
						>
							{shouldWrapIconWithBadge ? (
								<BadgedBox badge={badge}>
									<span aria-hidden="true">{icon}</span>
								</BadgedBox>
							) : (
								<span className="size-full" aria-hidden="true">
									{icon}
								</span>
							)}
						</span>
					)}

					{/* Label text — TitleSmall per MD3 typography token */}
					<span className="text-title-sm font-medium whitespace-nowrap">
						{children}
					</span>

					{/* Inline Badge */}
					{shouldAppendInlineBadge && (
						<span className="ml-1 flex items-center justify-center">
							{badge}
						</span>
					)}

					{/*
					 * PRIMARY INDICATOR
					 * Inside content wrapper → width matches content.
					 * `layoutId` enables shared layout animation across tabs.
					 */}
					{variant === "primary" && isActive && (
						<m.div
							layoutId={indicatorLayoutId}
							aria-hidden="true"
							className="absolute bottom-0 left-1/2 -translate-x-1/2"
							style={{
								height: TabsTokens.primaryIndicatorHeight,
								minWidth: INDICATOR_MIN_WIDTH,
								width: "100%",
								borderRadius: TabsTokens.indicatorBorderRadius,
								backgroundColor: indicatorColor,
							}}
							transition={springTransition}
						/>
					)}
				</m.div>

				{/*
				 * SECONDARY INDICATOR
				 * Outside content wrapper → `inset-x-0` = full button width.
				 */}
				{variant === "secondary" && isActive && (
					<m.div
						layoutId={indicatorLayoutId}
						aria-hidden="true"
						className="absolute bottom-0 inset-x-0"
						style={{
							height: TabsTokens.secondaryIndicatorHeight,
							borderRadius: TabsTokens.indicatorBorderRadius,
							backgroundColor: indicatorColor,
						}}
						transition={springTransition}
					/>
				)}
			</button>
		);
	},
);

TabComponent.displayName = "Tab";

/**
 * MD3 Expressive Tab component — individual tab button.
 *
 * Must be a direct child of `<TabsList>`. Implements WAI-ARIA Tabs pattern
 * with roving tabindex keyboard navigation.
 *
 * - **Primary variant**: indicator width = content (text + icon) width.
 * - **Secondary variant**: indicator width = full button hit area.
 * - **Disabled**: Skipped entirely in ArrowKey navigation (cannot be focused).
 * - **inlineIcon**: Icon beside (not above) label; height stays 48dp.
 * - Framer Motion `layoutId` animates indicator with spring physics.
 * - ArrowLeft/Right respect RTL direction automatically.
 *
 * @example
 * ```tsx
 * <Tab value="flights" icon={<Icon name="flight" />}>Flights</Tab>
 * <Tab value="trips">Trips</Tab>
 * <Tab value="explore" disabled>Explore</Tab>
 * <Tab value="hotels" icon={<Icon name="hotel" />} inlineIcon>Hotels</Tab>
 * ```
 *
 * @see https://m3.material.io/components/tabs/overview
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
export const Tab = React.memo(TabComponent);
