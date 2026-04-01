/**
 * @file checkbox.tsx
 * MD3 Expressive Checkbox — 2-state and tri-state support.
 * Spec: https://m3.material.io/components/checkbox/overview
 */

import {
	AnimatePresence,
	domMax,
	LazyMotion,
	m,
	useReducedMotion,
} from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, type RippleOrigin } from "./ripple";

// ─── Constants ────────────────────────────────────────────────────────────────

/** MD3 Standard easing: checkmark draw and path morph. */
const MD3_STANDARD = [0.2, 0, 0, 1] as const;

/** MD3 FastEffects easing: container fill (emphasizedAccelerate). */
const MD3_FAST_EFFECTS = [0.3, 0, 1, 1] as const;

/**
 * SVG paths share the same command count (M→L→L) for Framer Motion d-morph.
 * viewBox: 18×18
 */
const CHECKMARK_PATH = "M 4.5 9.5 L 7.5 12.5 L 13.5 5.5";
const DASH_PATH = "M 4.5 9 L 9 9 L 13.5 9";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Tri-state value: `"unchecked"` | `"checked"` | `"indeterminate"`.
 */
export type CheckboxState = "unchecked" | "checked" | "indeterminate";

/**
 * Props for `Checkbox`. Supports boolean (`checked`/`onCheckedChange`)
 * and tri-state (`state`/`onStateChange`) modes.
 */
export interface CheckboxProps {
	/** Controlled checked value (2-state mode). */
	checked?: boolean;
	/** Initial value for uncontrolled mode. @default false */
	defaultChecked?: boolean;
	/** Forces indeterminate rendering regardless of `checked`. */
	indeterminate?: boolean;
	/** Fired on checked change (simple mode). Not called when disabled. */
	onCheckedChange?: (checked: boolean) => void;

	/** Controlled tri-state value. Takes priority over `checked`/`indeterminate`. */
	state?: CheckboxState;
	/** Fired on tri-state change. Cycles: unchecked → checked → indeterminate. */
	onStateChange?: (state: CheckboxState) => void;

	/** Disables interaction and applies 0.38 opacity. */
	disabled?: boolean;
	/** Error state — changes colors to `m3-error` and sets `aria-invalid`. */
	error?: boolean;

	/** Adjacent label text. Wraps checkbox + span in `<label>`. */
	label?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	"aria-required"?: boolean;

	/** Passed to the hidden `<input>` for form submission. */
	name?: string;
	/** Passed to the hidden `<input>` for form submission. */
	value?: string;
	/** ID for the hidden `<input>`. Auto-generated when `label` is set. */
	id?: string;

	/** Extra class names on the outermost wrapper. */
	className?: string;
	/** Ref pointing to the hidden `<input type="checkbox">`. */
	ref?: React.Ref<HTMLInputElement>;
}

/**
 * `TriStateCheckbox` props — requires `state` + `onStateChange`.
 */
export interface TriStateCheckboxProps
	extends Omit<CheckboxProps, "checked" | "defaultChecked" | "onCheckedChange"> {
	state: CheckboxState;
	onStateChange: (state: CheckboxState) => void;
}

// ─── State helpers ────────────────────────────────────────────────────────────

/** Priority: `state` prop > `indeterminate` > `checked`. @internal */
function resolveState(
	checked?: boolean,
	indeterminate?: boolean,
	state?: CheckboxState,
): CheckboxState {
	if (state !== undefined) return state;
	if (indeterminate) return "indeterminate";
	return checked ? "checked" : "unchecked";
}

/** Tri-state cycle: unchecked → checked → indeterminate → unchecked. */
const NEXT_STATE: Record<CheckboxState, CheckboxState> = {
	unchecked: "checked",
	checked: "indeterminate",
	indeterminate: "unchecked",
};

// ─── Internal subcomponents ───────────────────────────────────────────────────

interface CheckboxVisualProps {
	isSelected: boolean;
	isIndeterminate: boolean;
	containerBg: string;
	containerBorderColor: string;
	containerBorderWidth: number;
	iconColor: string;
	svgPath: string;
	pathLength: number;
	fillDuration: number;
	drawDuration: number;
	morphDuration: number;
	prefersReduced: boolean;
}

/** Animated 18×18dp checkbox box (container + SVG icon). @internal */
const CheckboxVisual = React.memo(function CheckboxVisual({
	isSelected,
	isIndeterminate,
	containerBg,
	containerBorderColor,
	containerBorderWidth,
	iconColor,
	svgPath,
	pathLength,
	fillDuration,
	drawDuration,
	morphDuration,
	prefersReduced,
}: CheckboxVisualProps) {
	return (
		<m.div
			aria-hidden="true"
			className="relative flex items-center justify-center w-4.5 h-4.5 rounded-sm overflow-hidden"
			animate={{
				backgroundColor: containerBg,
				borderColor: containerBorderColor,
				borderWidth: containerBorderWidth,
			}}
			transition={{
				backgroundColor: {
					duration: fillDuration,
					ease: isSelected ? MD3_FAST_EFFECTS : "easeOut",
				},
				borderColor: { duration: fillDuration, ease: "easeOut" },
				borderWidth: { duration: fillDuration, ease: "easeOut" },
			}}
			style={{ borderStyle: "solid" }}
		>
			<AnimatePresence>
				{isSelected && (
					<m.svg
						key="icon"
						viewBox="0 0 18 18"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						width={18}
						height={18}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: prefersReduced ? 0 : 0.1 }}
						aria-hidden="true"
					>
						<m.path
							d={svgPath}
							stroke={iconColor}
							strokeWidth={2}
							animate={{
								d: svgPath,
								pathLength: isIndeterminate ? 1 : pathLength,
							}}
							initial={{ pathLength: 0 }}
							transition={{
								d: { duration: morphDuration, ease: MD3_STANDARD },
								pathLength: { duration: drawDuration, ease: MD3_STANDARD },
							}}
						/>
					</m.svg>
				)}
			</AnimatePresence>
		</m.div>
	);
});

// ─── useMergedRef ─────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

const CheckboxComponent = React.forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			checked,
			defaultChecked = false,
			indeterminate = false,
			onCheckedChange,
			state: stateProp,
			onStateChange,
			disabled = false,
			error = false,
			label,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledby,
			"aria-describedby": ariaDescribedby,
			"aria-required": ariaRequired,
			name,
			value,
			id: idProp,
			className,
		},
		ref,
	) => {
		const prefersReduced = useReducedMotion() ?? false;

		const generatedId = React.useId();
		const inputId = idProp ?? (label ? `checkbox-${generatedId}` : undefined);

		const [internalState, setInternalState] = React.useState<CheckboxState>(
			() => (defaultChecked ? "checked" : "unchecked"),
		);

		// `state` and `checked` determine controlled vs uncontrolled.
		// `indeterminate` is visual-only and always overrides.
		const isControlled = stateProp !== undefined || checked !== undefined;
		const baseState = isControlled
			? resolveState(checked, false, stateProp)
			: internalState;
		const effectiveState: CheckboxState = indeterminate ? "indeterminate" : baseState;

		// ── Ripple ──────────────────────────────────────────────────────────
		const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);
		const removeRipple = React.useCallback(
			(id: number) => setRipples((prev) => prev.filter((r) => r.id !== id)),
			[],
		);

		const onPointerDown = React.useCallback(
			(e: React.PointerEvent<HTMLElement>) => {
				if (disabled) return;
				const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
				// Ripple origin offset by 4px to simulate a 40×40 state layer inside 48×48 touch target.
				const x = e.clientX - rect.left - 4;
				const y = e.clientY - rect.top - 4;
				const rippleSize = Math.hypot(40, 40) * 2;
				setRipples((prev) => [...prev, { id: Date.now(), x, y, size: rippleSize }]);
			},
			[disabled],
		);

		// ── Change handler ───────────────────────────────────────────────────
		const handleChange = React.useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				if (disabled) return;

				if (stateProp !== undefined) {
					onStateChange?.(NEXT_STATE[effectiveState]);
				} else if (checked !== undefined) {
					onCheckedChange?.(e.target.checked);
				} else {
					const next = NEXT_STATE[effectiveState];
					setInternalState(next);
					if (next === "indeterminate") {
						onStateChange?.(next);
					} else {
						onCheckedChange?.(next === "checked");
					}
				}
			},
			[disabled, stateProp, checked, effectiveState, onStateChange, onCheckedChange],
		);

		// ── Sync indeterminate DOM property ──────────────────────────────────
		const inputRef = React.useRef<HTMLInputElement>(null);
		const mergedRef = useMergedRef(ref, inputRef);

		React.useEffect(() => {
			if (inputRef.current) {
				inputRef.current.indeterminate = effectiveState === "indeterminate";
			}
		}, [effectiveState]);

		// ── Derived visual state ─────────────────────────────────────────────
		const isChecked = effectiveState === "checked";
		const isIndeterminate = effectiveState === "indeterminate";
		const isSelected = isChecked || isIndeterminate;
		const ariaChecked = isIndeterminate ? ("mixed" as const) : isChecked;

		// ── Animation values ─────────────────────────────────────────────────
		const accentColor = error ? "var(--color-m3-error)" : "var(--color-m3-primary)";
		const onAccentColor = error ? "var(--color-m3-on-error)" : "var(--color-m3-on-primary)";
		
		// MD3 Outline color (on-surface with 38% opacity)
		// We use a CSS variable or a static RGBA to ensure Framer Motion can animate it.
		// Since color-mix is not animatable, we'll use the variable directly if it's a plain color,
		// or use a fallback. Better yet, we can use the style prop for static colors 
		// and only animate opacity if needed, but here we want to animate the color itself.
		const outlineColor = error
			? "var(--color-m3-error)"
			: "rgba(0, 0, 0, 0.38)"; // Standard fallback for on-surface 38%

		const containerBg = isSelected ? accentColor : "rgba(0, 0, 0, 0)";
		const containerBorderColor = isSelected ? "rgba(0, 0, 0, 0)" : outlineColor;
		const containerBorderWidth = isSelected ? 0 : 2;
		const iconColor = isSelected ? onAccentColor : "rgba(0, 0, 0, 0)";

		const svgPath = isIndeterminate ? DASH_PATH : CHECKMARK_PATH;
		const pathLength = isSelected ? 1 : 0;

		const fillDuration = prefersReduced ? 0 : isSelected ? 0.15 : 0.1;
		const drawDuration = prefersReduced ? 0 : isSelected ? 0.2 : 0.1;
		const morphDuration = prefersReduced ? 0 : 0.2;

		// ── State layer classes ──────────────────────────────────────────────
		const stateLayerBg = isSelected
			? error ? "before:bg-m3-error" : "before:bg-m3-primary"
			: error ? "before:bg-m3-error" : "before:bg-m3-on-surface";

		const stateLayerClass = cn(
			"before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
			"before:transition-opacity before:duration-150 before:opacity-0",
			"group-hover/cbx:before:opacity-[0.08]",
			"group-focus-within/cbx:before:opacity-[0.10]",
			"group-active/cbx:before:opacity-[0.10]",
			stateLayerBg,
		);

		// ── Shared visual props ──────────────────────────────────────────────
		const visualProps: CheckboxVisualProps = {
			isSelected,
			isIndeterminate,
			containerBg,
			containerBorderColor,
			containerBorderWidth,
			iconColor,
			svgPath,
			pathLength,
			fillDuration,
			drawDuration,
			morphDuration,
			prefersReduced,
		};

		const touchTargetClass = cn(
			"relative inline-flex items-center justify-center outline-none shrink-0",
			"w-12 h-12 group/cbx",
			disabled && "pointer-events-none",
		);

		// ── Render ───────────────────────────────────────────────────────────
		const stateLayerAndRipple = (
			<div
				className={cn(
					"absolute flex items-center justify-center w-10 h-10 m-auto inset-0 rounded-full overflow-hidden pointer-events-none",
					stateLayerClass,
				)}
				aria-hidden="true"
			>
				<Ripple ripples={ripples} onRippleDone={removeRipple} disabled={disabled} />
			</div>
		);

		const hiddenInput = (
			<input
				ref={mergedRef}
				type="checkbox"
				id={inputId}
				name={name}
				value={value}
				checked={isChecked}
				disabled={disabled}
				aria-checked={ariaChecked}
				aria-disabled={disabled || undefined}
				aria-invalid={error || undefined}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-describedby={ariaDescribedby}
				aria-required={ariaRequired}
				onChange={handleChange}
				className="sr-only"
			/>
		);

		if (label) {
			return (
				<LazyMotion features={domMax} strict>
					<label
						htmlFor={inputId}
						className={cn(
							"inline-flex items-center gap-2 cursor-pointer select-none",
							disabled && "cursor-not-allowed opacity-[0.38] pointer-events-none",
							className,
						)}
					>
						<div className={touchTargetClass} onPointerDown={onPointerDown}>
							{stateLayerAndRipple}
							{hiddenInput}
							<CheckboxVisual {...visualProps} />
						</div>
						<span className="text-sm leading-none text-m3-on-surface">{label}</span>
					</label>
				</LazyMotion>
			);
		}

		return (
			<LazyMotion features={domMax} strict>
				<label
					htmlFor={inputId}
					className={cn(touchTargetClass, "cursor-pointer", className)}
					onPointerDown={onPointerDown}
				>
					{stateLayerAndRipple}
					{hiddenInput}
					<CheckboxVisual {...visualProps} />
				</label>
			</LazyMotion>
		);
	},
);

CheckboxComponent.displayName = "Checkbox";

/**
 * MD3 Expressive Checkbox component.
 *
 * Supports 2-state and tri-state patterns. Fully animated per MD3 spec:
 * checkmark draw, indeterminate dash morph, container fill, state layer, and ripple.
 *
 * @example
 * ```tsx
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} label="Accept terms" />
 * <Checkbox state={parentState} onStateChange={setParentState} label="Select all" />
 * <Checkbox error label="Required field" aria-describedby="err-msg" />
 * ```
 * @see https://m3.material.io/components/checkbox/overview
 */
export const Checkbox = React.memo(CheckboxComponent);

// ─── TriStateCheckbox ─────────────────────────────────────────────────────────

const TriStateCheckboxComponent = React.forwardRef<
	HTMLInputElement,
	TriStateCheckboxProps
>(({ state, onStateChange, ...rest }, ref) => (
	<Checkbox ref={ref} state={state} onStateChange={onStateChange} {...rest} />
));

TriStateCheckboxComponent.displayName = "TriStateCheckbox";

/**
 * MD3 Expressive Tri-State Checkbox.
 *
 * Convenience wrapper around `Checkbox` that enforces `state` + `onStateChange`.
 * Ideal for parent-child selection patterns.
 *
 * @example
 * ```tsx
 * <TriStateCheckbox state={parentState} onStateChange={setParentState} label="Select all" />
 * ```
 */
export const TriStateCheckbox = React.memo(TriStateCheckboxComponent);
