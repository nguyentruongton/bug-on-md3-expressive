/**
 * @file switch.tsx
 * MD3 Expressive Switch — ARIA switch pattern with Framer Motion animations.
 * Spec: https://m3.material.io/components/switch/overview
 *
 * Key decisions:
 * - Uses `<button role="switch">` (no <input>) per MD3 accessibility spec
 * - Framer Motion for ALL animations (thumb x, size morph, state layer, icons)
 * - Hover state via useState (required for Framer Motion color animate)
 * - Disabled colors via rgba() literals (color-mix() not animatable by FM)
 */

import {
	AnimatePresence,
	domMax,
	LazyMotion,
	m,
	useReducedMotion,
} from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Ripple, type RippleOrigin } from "../ripple";
import { SwitchColors, SwitchTokens } from "./switch.tokens";
import type { SwitchProps } from "./switch.types";

// ─── Animation constants ───────────────────────────────────────────────────────

/**
 * FastSpatial spring — equivalent to MotionSchemeKeyTokens.FastSpatial.
 * Used for thumb translation and size morph on checked state change.
 */
const FAST_SPATIAL_SPRING = {
	type: "spring",
	stiffness: 500,
	damping: 40,
} as const;

/** Instant transition (SnapSpec equivalent) — used when thumb is pressed. */
const SNAP_TRANSITION = { duration: 0 } as const;

/** Color transition for track/thumb color changes. */
const COLOR_TRANSITION = { duration: 0.2, ease: "easeInOut" } as const;

/** State layer spring — for hover/focus overlay. */
const STATE_LAYER_SPRING = {
	type: "spring",
	stiffness: 400,
	damping: 30,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computes thumb size in px based on current interaction state.
 * @internal
 */
function resolveThumbSize(
	isPressed: boolean,
	checked: boolean,
	hasIcon: boolean,
): number {
	if (isPressed) return SwitchTokens.pressedHandleSize;
	if (checked || hasIcon) return SwitchTokens.selectedHandleSize;
	return SwitchTokens.unselectedHandleSize;
}

/**
 * Computes thumb X offset. Mirrors ThumbNode.measure() from Switch.kt.
 * @internal
 */
function resolveThumbX(
	checked: boolean,
	isPressed: boolean,
	thumbSize: number,
): number {
	const { trackHeight, trackWidth, trackOutlineWidth, selectedHandleSize } =
		SwitchTokens;
	const thumbPaddingStart = (trackHeight - thumbSize) / 2;
	const thumbPadding = (trackHeight - selectedHandleSize) / 2;
	const maxBound = trackWidth - selectedHandleSize - thumbPadding;

	if (isPressed && checked) return maxBound - trackOutlineWidth;
	if (isPressed) return thumbPaddingStart + trackOutlineWidth;
	if (checked) return maxBound;
	return thumbPaddingStart;
}

/**
 * Resolves the thumb background color based on interaction state.
 * @internal
 */
function resolveThumbColor(
	checked: boolean,
	disabled: boolean,
	isInteracting: boolean,
	checkedThumbColor?: string,
	uncheckedThumbColor?: string,
): string {
	if (disabled) {
		return checked
			? SwitchColors.disabledCheckedThumb
			: "rgba(28, 27, 31, 0.38)";
	}
	if (checked) {
		return isInteracting
			? (checkedThumbColor ?? SwitchColors.hoverCheckedThumb)
			: (checkedThumbColor ?? SwitchColors.checkedThumb);
	}
	return isInteracting
		? (uncheckedThumbColor ?? SwitchColors.hoverUncheckedThumb)
		: (uncheckedThumbColor ?? SwitchColors.uncheckedThumb);
}

/**
 * Determines if the thumb icon should be visible.
 * @internal
 */
function isIconVisible(
	thumbContent: React.ReactNode | undefined,
	icons: boolean,
	showOnlySelectedIcon: boolean,
	checked: boolean,
): boolean {
	if (thumbContent == null) return false;
	if (icons) return true;
	return showOnlySelectedIcon && checked;
}

// ─── SwitchVisual ──────────────────────────────────────────────────────────────

interface ColorOverrides {
	checkedTrackColor?: string;
	uncheckedTrackColor?: string;
	checkedThumbColor?: string;
	uncheckedThumbColor?: string;
}

interface SwitchVisualProps extends ColorOverrides {
	checked: boolean;
	disabled: boolean;
	isPressed: boolean;
	isHovered: boolean;
	isFocused: boolean;
	thumbContent: React.ReactNode | undefined;
	icons: boolean;
	showOnlySelectedIcon: boolean;
	prefersReduced: boolean;
}

/** Animated switch visual (track + state layer + thumb + icon). @internal */
const SwitchVisual = React.memo(function SwitchVisual({
	checked,
	disabled,
	isPressed,
	isHovered,
	isFocused,
	thumbContent,
	icons,
	showOnlySelectedIcon,
	prefersReduced,
	checkedTrackColor,
	uncheckedTrackColor,
	checkedThumbColor,
	uncheckedThumbColor,
}: SwitchVisualProps) {
	const hasIcon = icons && thumbContent != null;
	const thumbSize = resolveThumbSize(isPressed, checked, hasIcon);
	const thumbX = resolveThumbX(checked, isPressed, thumbSize);

	// ── Track colors ──────────────────────────────────────────────────────────
	const trackBg = checked
		? (checkedTrackColor ?? SwitchColors.checkedTrack)
		: (uncheckedTrackColor ?? SwitchColors.uncheckedTrack);

	const trackBorderColor = checked
		? "rgba(0, 0, 0, 0)"
		: SwitchColors.uncheckedTrackOutline;

	const trackBorderWidth = checked ? 0 : SwitchTokens.trackOutlineWidth;

	// Disabled track: use rgba literals (color-mix not animatable)
	// Light: on-surface = #1c1b1f → rgba(28,27,31,0.12)
	// We use CSS custom property approach with opacity wrapper instead
	const trackOpacity = disabled ? SwitchTokens.disabledTrackOpacity : 1;

	// ── Thumb colors ──────────────────────────────────────────────────────────
	const isInteracting = isHovered || isFocused || isPressed;
	const thumbBg = resolveThumbColor(
		checked,
		disabled,
		isInteracting,
		checkedThumbColor,
		uncheckedThumbColor,
	);

	// ── Icon color ────────────────────────────────────────────────────────────
	const iconColor = disabled
		? checked
			? "rgba(28, 27, 31, 0.38)"
			: "rgba(230, 225, 229, 0.38)"
		: checked
			? SwitchColors.checkedIcon
			: SwitchColors.uncheckedIcon;

	// ── State layer ───────────────────────────────────────────────────────────
	const stateLayerColor = checked
		? SwitchColors.checkedStateLayer
		: SwitchColors.uncheckedStateLayer;
	const stateLayerOpacity = isPressed || isFocused ? 0.12 : isHovered ? 0.08 : 0;
	const stateLayerX = thumbX + thumbSize / 2 - SwitchTokens.stateLayerSize / 2;

	// ── Icon visibility ───────────────────────────────────────────────────────
	const showIcon = isIconVisible(thumbContent, icons, showOnlySelectedIcon, checked);

	// ── Motion: no animation when reduced ─────────────────────────────────────
	const colorTransition = prefersReduced ? { duration: 0 } : COLOR_TRANSITION;

	const stateLayerTransition = prefersReduced
		? { duration: 0 }
		: STATE_LAYER_SPRING;

	return (
		<div
			className="relative"
			style={{
				width: SwitchTokens.trackWidth,
				height: SwitchTokens.trackHeight,
			}}
			aria-hidden="true"
		>
			{/* Track */}
			<m.div
				className="absolute inset-0 rounded-full"
				style={{ borderStyle: "solid", opacity: trackOpacity }}
				animate={{
					backgroundColor: trackBg,
					borderColor: trackBorderColor,
					borderWidth: trackBorderWidth,
				}}
				transition={colorTransition}
			/>

			{/* State layer — 40dp circle centered on thumb */}
			<m.div
				className="absolute rounded-full pointer-events-none"
				style={{
					width: SwitchTokens.stateLayerSize,
					height: SwitchTokens.stateLayerSize,
					top: (SwitchTokens.trackHeight - SwitchTokens.stateLayerSize) / 2,
					backgroundColor: stateLayerColor,
				}}
				animate={{ x: stateLayerX, opacity: stateLayerOpacity }}
				transition={stateLayerTransition}
			/>

			{/* Thumb */}
			<m.div
				className="absolute rounded-full flex items-center justify-center overflow-hidden"
				style={{ top: "50%", left: 0, y: "-50%" }}
				animate={{
					x: thumbX,
					width: thumbSize,
					height: thumbSize,
					backgroundColor: thumbBg,
				}}
				transition={
					prefersReduced
						? { duration: 0 }
						: isPressed
							? SNAP_TRANSITION
							: {
									x: FAST_SPATIAL_SPRING,
									width: FAST_SPATIAL_SPRING,
									height: FAST_SPATIAL_SPRING,
									backgroundColor: colorTransition,
								}
				}
			>
				{/* Icon cross-fade */}
				<AnimatePresence mode="wait">
					{showIcon && (
						<m.span
							key={checked ? "icon-on" : "icon-off"}
							className="flex items-center justify-center"
							style={{
								width: SwitchTokens.iconSize,
								height: SwitchTokens.iconSize,
								color: iconColor,
								fontSize: SwitchTokens.iconSize,
							}}
							initial={prefersReduced ? false : { opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={prefersReduced ? {} : { opacity: 0, scale: 0.5 }}
							transition={prefersReduced ? { duration: 0 } : { duration: 0.15 }}
						>
							{thumbContent}
						</m.span>
					)}
				</AnimatePresence>
			</m.div>
		</div>
	);
});

// ─── Switch ────────────────────────────────────────────────────────────────────

const SwitchComponent = React.forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{
			checked,
			onCheckedChange,
			disabled = false,
			thumbContent,
			icons = false,
			showOnlySelectedIcon = false,
			label,
			ariaLabel,
			className,
			checkedTrackColor,
			uncheckedTrackColor,
			checkedThumbColor,
			uncheckedThumbColor,
		},
		ref,
	) => {
		const prefersReduced = useReducedMotion() ?? false;

		const [isPressed, setIsPressed] = React.useState(false);
		const [isHovered, setIsHovered] = React.useState(false);
		const [isFocused, setIsFocused] = React.useState(false);
		const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

		const generatedId = React.useId();
		const switchId = label ? `switch-${generatedId}` : undefined;

		// ── Event handlers ────────────────────────────────────────────────────
		const handleClick = React.useCallback(() => {
			if (!disabled) onCheckedChange(!checked);
		}, [disabled, checked, onCheckedChange]);

		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLButtonElement>) => {
				if (disabled) return;
				if (e.key === " " || e.key === "Enter") {
					e.preventDefault();
					onCheckedChange(!checked);
				}
			},
			[disabled, checked, onCheckedChange],
		);

		const handlePointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLButtonElement>) => {
				if (disabled) return;
				setIsPressed(true);
				// Ripple
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const rippleSize = Math.hypot(rect.width, rect.height) * 2;
				setRipples((prev) => [
					...prev,
					{ id: Date.now(), x, y, size: rippleSize },
				]);
			},
			[disabled],
		);

		const handlePointerUp = React.useCallback(() => {
			setIsPressed(false);
		}, []);

		const handlePointerEnter = React.useCallback(() => {
			if (!disabled) setIsHovered(true);
		}, [disabled]);

		const handlePointerLeave = React.useCallback(() => {
			setIsHovered(false);
			setIsPressed(false);
		}, []);

		const handleFocus = React.useCallback(() => setIsFocused(true), []);
		const handleBlur = React.useCallback(() => setIsFocused(false), []);

		const removeRipple = React.useCallback(
			(id: number) => setRipples((prev) => prev.filter((r) => r.id !== id)),
			[],
		);

		// ── Shared accessible label ───────────────────────────────────────────
		// When visible label wraps, aria-label is redundant (label text is
		// announced via htmlFor linkage). Apply aria-label only when no label.
		const buttonAriaLabel = label ? undefined : ariaLabel;

		// ── Switch button ─────────────────────────────────────────────────────
		const switchButton = (
			<button
				ref={ref}
				id={switchId}
				type="button"
				role="switch"
				aria-checked={checked}
				aria-disabled={disabled || undefined}
				aria-label={buttonAriaLabel}
				tabIndex={disabled ? -1 : 0}
				disabled={disabled}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerLeave}
				onPointerEnter={handlePointerEnter}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={cn(
					"relative inline-flex items-center justify-center cursor-pointer select-none",
					// Touch target: 48×48 minimum (pad around 32px track)
					"min-w-12 min-h-12",
					// Focus ring — MD3 FocusIndicatorColor = secondary
					"focus-visible:outline-2 focus-visible:outline-offset-2 rounded-full",
					"focus-visible:outline-(--md-sys-color-secondary)",
					// Disabled
					disabled && "pointer-events-none cursor-not-allowed",
					!label && className,
				)}
			>
				{/* Overflow clip wrapper for ripple */}
				<div className="relative overflow-hidden rounded-full">
					<SwitchVisual
						checked={checked}
						disabled={disabled}
						isPressed={isPressed}
						isHovered={isHovered}
						isFocused={isFocused}
						thumbContent={thumbContent}
						icons={icons}
						showOnlySelectedIcon={showOnlySelectedIcon}
						prefersReduced={prefersReduced}
						checkedTrackColor={checkedTrackColor}
						uncheckedTrackColor={uncheckedTrackColor}
						checkedThumbColor={checkedThumbColor}
						uncheckedThumbColor={uncheckedThumbColor}
					/>
					<Ripple
						ripples={ripples}
						onRippleDone={removeRipple}
						disabled={disabled}
					/>
				</div>
			</button>
		);

		// ── With label ────────────────────────────────────────────────────────
		const content = label ? (
			<label
				htmlFor={switchId}
				className={cn(
					"inline-flex items-center gap-3 cursor-pointer select-none",
					disabled && "cursor-not-allowed pointer-events-none opacity-[0.38]",
					className,
				)}
			>
				{switchButton}
				<span className="text-sm leading-none text-(--md-sys-color-on-surface)">
					{label}
				</span>
			</label>
		) : (
			switchButton
		);

		return (
			<LazyMotion features={domMax} strict>
				{content}
			</LazyMotion>
		);
	},
);

SwitchComponent.displayName = "Switch";

/**
 * MD3 Expressive Switch component.
 *
 * Toggles a single item on or off. Implements the ARIA switch pattern
 * (`role="switch"`) without `<input>`. Fully animated per MD3 spec:
 * thumb translation, size morph (16→24→28px), state layer, and icon cross-fade.
 *
 * @example
 * ```tsx
 * <Switch checked={isOn} onCheckedChange={setIsOn} label="Wi-Fi" />
 * <Switch checked={isOn} onCheckedChange={setIsOn} icons thumbContent={<CheckIcon />} />
 * <Switch checked={isOn} onCheckedChange={setIsOn} disabled />
 * ```
 *
 * @see https://m3.material.io/components/switch/overview
 */
export const Switch = React.memo(SwitchComponent);
