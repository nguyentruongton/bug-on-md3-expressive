/**
 * @file radio-button.tsx
 * MD3 Expressive RadioButton — single-select with RadioGroup support.
 * Spec: https://m3.material.io/components/radio-button/overview
 */

import { domMax, LazyMotion, m, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, type RippleOrigin } from "./ripple";

// ─── Constants ────────────────────────────────────────────────────────────────

/** MD3 FastEffects easing: dot grow (emphasizedAccelerate). */
const MD3_FAST_EFFECTS = [0.3, 0, 1, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Color variant for `RadioButton`.
 * - `"primary"` — standard selection (default)
 * - `"error"` — error/invalid state
 */
export type RadioButtonColors = "primary" | "error";

/** Props for `RadioButton`. */
export interface RadioButtonProps {
	/** Whether this radio is selected. */
	selected?: boolean;
	/** Initial selected state (uncontrolled). @default false */
	defaultSelected?: boolean;
	/** Called when user clicks. Pass `null` to disable interaction. */
	onClick?: (() => void) | null;
	/** Disables the radio — visual disabled state + no interaction. @default false */
	disabled?: boolean;
	/** Color variant. @default "primary" */
	color?: RadioButtonColors;
	/** Error state — changes colors to `m3-error`. @default false */
	error?: boolean;
	/** Adjacent label text. Renders a `<label>` wrapper. */
	label?: string;
	/** Value used for form submission. */
	value?: string;
	/** Name for grouping (used in RadioGroup context). */
	name?: string;
	/** ID for the hidden `<input>`. Auto-generated when `label` is set. */
	id?: string;
	/** Extra class names on the outermost wrapper. */
	className?: string;
	/** ARIA label for the radio when no visible label exists. */
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	/** Whether the radio is required for form submission. */
	required?: boolean;
	/** Ref to the hidden `<input type="radio">`. */
	ref?: React.Ref<HTMLInputElement>;
}

/** Props for `RadioGroup`. */
export interface RadioGroupProps {
	/** The name attribute shared across all child RadioButtons. */
	name: string;
	/** The currently selected value (controlled). */
	value?: string;
	/** Default value (uncontrolled). */
	defaultValue?: string;
	/** Called when selection changes. */
	onValueChange?: (value: string) => void;
	/** Disables all radio buttons in the group. */
	disabled?: boolean;
	/** Error state for the entire group. */
	error?: boolean;
	/** Label for the group (renders as visually hidden or visible heading). */
	label?: string;
	/** ID of an external element that labels this group. */
	"aria-labelledby"?: string;
	/** Direction of layout. @default "vertical" */
	orientation?: "horizontal" | "vertical";
	/** Whether at least one radio in the group must be selected. */
	required?: boolean;
	children: React.ReactNode;
	className?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
	name: string;
	selectedValue: string | undefined;
	onValueChange: (value: string) => void;
	disabled: boolean;
	error: boolean;
	required: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
	null,
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Merges external + internal refs into a single callback ref. @internal */
function useMergedRef<T>(
	externalRef: React.Ref<T> | undefined,
	internalRef: React.RefObject<T | null>,
): React.RefCallback<T> {
	return React.useCallback(
		(node: T | null) => {
			(internalRef as React.MutableRefObject<T | null>).current = node;
			if (!externalRef) return;
			if (typeof externalRef === "function") {
				externalRef(node);
			} else {
				(externalRef as React.MutableRefObject<T | null>).current = node;
			}
		},
		[externalRef, internalRef],
	);
}

// ─── RadioVisual ──────────────────────────────────────────────────────────────

interface RadioVisualProps {
	isSelected: boolean;
	disabled: boolean;
	error: boolean;
	isHovered: boolean;
	prefersReduced: boolean;
}

/**
 * Animated 20×20dp radio circle (outer ring + inner dot). @internal
 * Uses `m.circle` for Framer Motion SVG animation.
 */
const RadioVisual = React.memo(function RadioVisual({
	isSelected,
	disabled,
	error,
	isHovered,
	prefersReduced,
}: RadioVisualProps) {
	const accentColor = error
		? "var(--color-m3-error)"
		: "var(--color-m3-primary)";

	const disabledColor = "rgba(0, 0, 0, 0.38)";

	const outerStroke = disabled
		? disabledColor
		: isSelected
			? accentColor
			: isHovered
				? "var(--color-m3-on-surface)"
				: "var(--color-m3-on-surface-variant)";

	const dotFill = disabled
		? disabledColor
		: isSelected
			? accentColor
			: "rgba(0, 0, 0, 0)";

	const ringDuration = prefersReduced ? 0 : 0.15;
	const dotDuration = prefersReduced ? 0 : isSelected ? 0.2 : 0.1;
	const dotEase = isSelected ? MD3_FAST_EFFECTS : ("easeOut" as const);

	return (
		<svg
			viewBox="0 0 20 20"
			width={20}
			height={20}
			fill="none"
			aria-hidden="true"
		>
			<m.circle
				cx={10}
				cy={10}
				r={9}
				strokeWidth={2}
				fill="none"
				animate={{ stroke: outerStroke }}
				transition={{ duration: ringDuration, ease: "easeOut" }}
			/>
			<m.circle
				cx={10}
				cy={10}
				initial={{ r: 0 }}
				animate={{ r: isSelected ? 5 : 0, fill: dotFill }}
				transition={{
					r: { duration: dotDuration, ease: dotEase },
					fill: { duration: ringDuration, ease: "easeOut" },
				}}
				stroke="none"
			/>
		</svg>
	);
});

// ─── RadioButton ──────────────────────────────────────────────────────────────

const RadioButtonComponent = React.forwardRef<
	HTMLInputElement,
	RadioButtonProps
>(
	(
		{
			selected,
			defaultSelected = false,
			onClick,
			disabled: disabledProp = false,
			color,
			error: errorProp = false,
			label,
			value,
			name: nameProp,
			id: idProp,
			className,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledby,
			"aria-describedby": ariaDescribedby,
			required: requiredProp,
		},
		ref,
	) => {
		const group = React.useContext(RadioGroupContext);
		const prefersReduced = useReducedMotion() ?? false;

		const generatedId = React.useId();
		const inputId = idProp ?? (label ? `radio-${generatedId}` : undefined);

		const name = group?.name ?? nameProp;
		const disabled = group?.disabled || disabledProp;
		const error = group?.error || errorProp || color === "error";
		const required = group?.required || requiredProp;

		const [internalSelected, setInternalSelected] =
			React.useState(defaultSelected);

		const isControlled = selected !== undefined;
		const isSelected: boolean = group
			? group.selectedValue === value
			: isControlled
				? (selected ?? false)
				: internalSelected;

		const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);
		const removeRipple = React.useCallback(
			(id: number) => setRipples((prev) => prev.filter((r) => r.id !== id)),
			[],
		);

		const onPointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLElement>) => {
				if (disabled) return;
				const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
				const x = e.clientX - rect.left - 4;
				const y = e.clientY - rect.top - 4;
				const rippleSize = Math.hypot(40, 40) * 2;
				setRipples((prev) => [
					...prev,
					{ id: Date.now(), x, y, size: rippleSize },
				]);
			},
			[disabled],
		);

		const [isHovered, setIsHovered] = React.useState(false);
		const onPointerEnter = React.useCallback(() => {
			if (!disabled) setIsHovered(true);
		}, [disabled]);
		const onPointerLeave = React.useCallback(() => setIsHovered(false), []);

		const handleChange = React.useCallback(
			(_e: React.ChangeEvent<HTMLInputElement>) => {
				if (disabled || onClick === null) return;

				if (group) {
					if (value !== undefined) group.onValueChange(value);
				} else if (!isControlled) {
					setInternalSelected(true);
					onClick?.();
				} else {
					onClick?.();
				}
			},
			[disabled, onClick, group, value, isControlled],
		);

		const inputRef = React.useRef<HTMLInputElement>(null);
		const mergedRef = useMergedRef(ref, inputRef);

		const stateLayerBg = error ? "before:bg-m3-error" : "before:bg-m3-primary";

		const stateLayerClass = cn(
			"before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
			"before:transition-opacity before:duration-150 before:opacity-0",
			"group-hover/radio:before:opacity-[0.08]",
			"group-focus-within/radio:before:opacity-[0.10]",
			"group-active/radio:before:opacity-[0.10]",
			stateLayerBg,
		);

		const touchTargetClass = cn(
			"relative inline-flex items-center justify-center outline-none shrink-0",
			"w-12 h-12 group/radio cursor-pointer",
			disabled && "pointer-events-none",
		);

		const stateLayerAndRipple = (
			<div
				className={cn(
					"absolute flex items-center justify-center w-10 h-10 m-auto inset-0 rounded-full overflow-hidden pointer-events-none",
					stateLayerClass,
				)}
				aria-hidden="true"
			>
				<Ripple
					ripples={ripples}
					onRippleDone={removeRipple}
					disabled={disabled}
				/>
			</div>
		);

		const hiddenInput = (
			<input
				ref={mergedRef}
				type="radio"
				id={inputId}
				name={name}
				value={value}
				checked={isSelected}
				disabled={disabled}
				aria-disabled={disabled || undefined}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-describedby={ariaDescribedby}
				required={required}
				onChange={handleChange}
				className="sr-only"
			/>
		);

		const visual = (
			<RadioVisual
				isSelected={isSelected}
				disabled={disabled}
				error={error}
				isHovered={isHovered}
				prefersReduced={prefersReduced}
			/>
		);

		if (label) {
			return (
				<LazyMotion features={domMax} strict>
					<label
						htmlFor={inputId}
						className={cn(
							"inline-flex items-center gap-2 cursor-pointer select-none",
							disabled &&
								"cursor-not-allowed opacity-[0.38] pointer-events-none",
							className,
						)}
					>
						<div
							className={touchTargetClass}
							onPointerDown={onPointerDown}
							onPointerEnter={onPointerEnter}
							onPointerLeave={onPointerLeave}
						>
							{stateLayerAndRipple}
							{hiddenInput}
							{visual}
						</div>
						<span className="text-sm leading-none text-m3-on-surface">
							{label}
						</span>
					</label>
				</LazyMotion>
			);
		}

		return (
			<LazyMotion features={domMax} strict>
				<label
					htmlFor={inputId}
					className={cn(touchTargetClass, className)}
					onPointerDown={onPointerDown}
					onPointerEnter={onPointerEnter}
					onPointerLeave={onPointerLeave}
				>
					{stateLayerAndRipple}
					{hiddenInput}
					{visual}
				</label>
			</LazyMotion>
		);
	},
);

RadioButtonComponent.displayName = "RadioButton";

/**
 * MD3 Expressive RadioButton component.
 *
 * Single-select control. Supports standalone (controlled/uncontrolled) and
 * `RadioGroup` context. Animated per MD3 spec: inner dot radius morph,
 * outer ring color transition, state layer, and ripple.
 *
 * @example
 * ```tsx
 * <RadioButton selected={isSelected} onClick={() => setSelected(true)} label="Option A" />
 *
 * <RadioGroup name="plan" value={plan} onValueChange={setPlan}>
 *   <RadioButton value="free" label="Free" />
 *   <RadioButton value="pro" label="Pro" />
 * </RadioGroup>
 * ```
 * @see https://m3.material.io/components/radio-button/overview
 */
export const RadioButton = React.memo(RadioButtonComponent);

// ─── RadioGroup ────────────────────────────────────────────────────────────────

const RadioGroupComponent = React.forwardRef<HTMLDivElement, RadioGroupProps>(
	(
		{
			name,
			value: valueProp,
			defaultValue,
			onValueChange,
			disabled = false,
			error = false,
			label,
			"aria-labelledby": ariaLabelledby,
			required = false,
			orientation = "vertical",
			children,
			className,
		},
		ref,
	) => {
		const [internalValue, setInternalValue] = React.useState<
			string | undefined
		>(defaultValue);
		const isControlled = valueProp !== undefined;
		const selectedValue = isControlled ? valueProp : internalValue;

		const handleValueChange = React.useCallback(
			(val: string) => {
				if (!isControlled) setInternalValue(val);
				onValueChange?.(val);
			},
			[isControlled, onValueChange],
		);

		const groupRef = React.useRef<HTMLDivElement>(null);
		const mergedRef = useMergedRef(ref, groupRef);

		const onKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				if (disabled) return;

				const isNext = e.key === "ArrowDown" || e.key === "ArrowRight";
				const isPrev = e.key === "ArrowUp" || e.key === "ArrowLeft";
				if (!isNext && !isPrev) return;

				e.preventDefault();

				const inputs = Array.from(
					groupRef.current?.querySelectorAll<HTMLInputElement>(
						'input[type="radio"]:not(:disabled)',
					) ?? [],
				);
				if (inputs.length === 0) return;

				const currentIdx = inputs.indexOf(
					document.activeElement as HTMLInputElement,
				);

				const nextIdx = isNext
					? currentIdx < inputs.length - 1
						? currentIdx + 1
						: 0
					: currentIdx > 0
						? currentIdx - 1
						: inputs.length - 1;

				const target = inputs[nextIdx];
				target.focus();
				handleValueChange(target.value);
			},
			[disabled, handleValueChange],
		);

		const contextValue = React.useMemo<RadioGroupContextValue>(
			() => ({
				name,
				selectedValue,
				onValueChange: handleValueChange,
				disabled,
				error,
				required,
			}),
			[name, selectedValue, handleValueChange, disabled, error, required],
		);

		return (
			<RadioGroupContext.Provider value={contextValue}>
				<div
					ref={mergedRef}
					role="radiogroup"
					aria-label={label && !ariaLabelledby ? label : undefined}
					aria-labelledby={ariaLabelledby}
					aria-disabled={disabled || undefined}
					aria-required={required || undefined}
					className={cn(
						"flex",
						orientation === "horizontal" ? "flex-row gap-4" : "flex-col gap-1",
						className,
					)}
					onKeyDown={onKeyDown}
				>
					{label && !ariaLabelledby && <span className="sr-only">{label}</span>}
					{children}
				</div>
			</RadioGroupContext.Provider>
		);
	},
);

RadioGroupComponent.displayName = "RadioGroup";

/**
 * MD3 Expressive RadioGroup component.
 *
 * Groups multiple `RadioButton` components under a shared `name` with keyboard
 * navigation (Arrow keys with wrapping) and ARIA `radiogroup` semantics.
 *
 * @example
 * ```tsx
 * <RadioGroup name="theme" value={theme} onValueChange={setTheme} label="Theme">
 *   <RadioButton value="light" label="Light" />
 *   <RadioButton value="dark" label="Dark" />
 *   <RadioButton value="system" label="System" />
 * </RadioGroup>
 * ```
 * @see https://m3.material.io/components/radio-button/overview
 */
export const RadioGroup = React.memo(RadioGroupComponent);
