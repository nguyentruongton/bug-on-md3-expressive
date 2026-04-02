/**
 * @file text-field.tsx
 * MD3 Expressive TextField — Filled & Outlined variants.
 *
 * Features:
 * - Floating label animation (Framer Motion)
 * - Filled (active indicator) and Outlined (notch border) variants
 * - Controlled & uncontrolled value handling
 * - Built-in clear button, password toggle
 * - Prefix / suffix text
 * - Supporting text, error text, character counter
 * - Leading & trailing icon slots
 * - Textarea support
 * - Native form validation + imperative handle
 * - Full WCAG AA accessibility
 * - prefers-reduced-motion support
 *
 * @see https://m3.material.io/components/text-fields/overview
 */

"use client";

import { domMax, LazyMotion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../scroll-area";
import { ActiveIndicator } from "./subcomponents/active-indicator";
import { FloatingLabel } from "./subcomponents/floating-label";
import { LeadingIcon } from "./subcomponents/leading-icon";
import { OutlineContainer } from "./subcomponents/outline-container";
import { PrefixSuffix } from "./subcomponents/prefix-suffix";
import { SupportingText } from "./subcomponents/supporting-text";
import { TrailingIcon } from "./subcomponents/trailing-icon";
import { TF_SIZE } from "./text-field.tokens";
import type { TextFieldHandle, TextFieldProps } from "./text-field.types";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Textarea line height in px — matches leading-6 (1.5rem at 16px base). */
const LINE_HEIGHT_PX = 24;

// ─── Component ────────────────────────────────────────────────────────────────

const TextFieldComponent = React.forwardRef<TextFieldHandle, TextFieldProps>(
	(
		{
			// Core
			variant = "filled",
			label,
			value: valueProp,
			defaultValue = "",
			onChange,
			// Input config
			type = "text",
			placeholder,
			name,
			id: idProp,
			autoComplete,
			inputMode,
			autoResize = false,
			maxRows,
			rows = autoResize ? 1 : 2,
			cols,
			textDirection,
			// Validation
			required = false,
			noAsterisk = false,
			error: errorProp = false,
			errorText,
			minLength,
			maxLength,
			min,
			max,
			step,
			pattern,
			multiple,
			// Supporting text
			supportingText,
			// Decorators
			prefixText,
			suffixText,
			leadingIcon,
			trailingIcon,
			trailingIconMode = "none",
			// States
			disabled = false,
			readOnly = false,
			noSpinner = false,
			// Form
			form,
			// Accessibility
			"aria-label": ariaLabel,
			"aria-describedby": ariaDescribedby,
			"aria-labelledby": ariaLabelledby,
			// Layout
			className,
			fullWidth = true,
			dense = false,
			// ScrollArea
			scrollAreaType = "hover",
			// Callbacks
			onFocus,
			onBlur,
			onKeyDown,
			onKeyUp,
		},
		ref,
	) => {
		const prefersReduced = useReducedMotion() ?? false;

		// ── IDs ───────────────────────────────────────────────────────────────
		const generatedId = React.useId();
		const inputId = idProp ?? `tf-${generatedId}`;
		const supportingId = `${inputId}-supporting`;

		// ── Value state ───────────────────────────────────────────────────────
		const isControlled = valueProp !== undefined;
		const [internalValue, setInternalValue] = React.useState(defaultValue);
		const currentValue = isControlled ? (valueProp as string) : internalValue;

		// ── Interaction state ─────────────────────────────────────────────────
		const [isFocused, setIsFocused] = React.useState(false);
		// Hover color changes are handled by CSS (group-hover/tf) for a11y compliance.

		// ── Password toggle ───────────────────────────────────────────────────
		const [showPassword, setShowPassword] = React.useState(false);
		const resolvedInputType =
			type === "password" && showPassword ? "text" : type;

		// ── Native validation error ───────────────────────────────────────────
		const [nativeError, setNativeError] = React.useState("");

		// ── Label width for outlined notch ────────────────────────────────────
		const [labelWidth, setLabelWidth] = React.useState(0);

		// ── Derived state ─────────────────────────────────────────────────────
		const hasValue = currentValue.length > 0;
		/** Label is floated when focused OR when there is a value. */
		const isFloated = isFocused || hasValue;
		const isError =
			errorProp ||
			!!nativeError ||
			(maxLength !== undefined && currentValue.length > maxLength);
		const containerHeight = dense ? TF_SIZE.denseHeight : TF_SIZE.height;
		const showAsterisk = required && !noAsterisk;

		// ── Refs ──────────────────────────────────────────────────────────────
		const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
		const labelSpanRef = React.useRef<HTMLSpanElement>(null);

		// Measure label span width for outlined notch (once on mount)
		React.useLayoutEffect(() => {
			if (labelSpanRef.current) {
				setLabelWidth(labelSpanRef.current.offsetWidth);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []); // mount only — label text changes are rare in production

		// ── Auto-resize textarea ──────────────────────────────────────────────
		React.useLayoutEffect(() => {
			if (type !== "textarea" || !inputRef.current) return;
			const textarea = inputRef.current as HTMLTextAreaElement;

			if (autoResize) {
				// currentValue in deps triggers re-measure on each keystroke
				void currentValue;
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;

				if (maxRows) {
					textarea.style.maxHeight = `${maxRows * LINE_HEIGHT_PX}px`;
				}
			}

			// Hide native scrollbar — ScrollArea handles it
			textarea.style.overflowY = "hidden";
		}, [type, autoResize, maxRows, currentValue]);

		// ── Handlers ──────────────────────────────────────────────────────────

		const handleValueChange = React.useCallback(
			(newValue: string) => {
				if (!isControlled) setInternalValue(newValue);
				// Clear native validation error when user types
				setNativeError("");
				(inputRef.current as HTMLInputElement)?.setCustomValidity?.("");
			},
			[isControlled],
		);

		const handleChange = React.useCallback(
			(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				const newVal = e.target.value;
				handleValueChange(newVal);
				onChange?.(newVal, e);
			},
			[handleValueChange, onChange],
		);

		const handleFocus = React.useCallback(
			(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				setIsFocused(true);
				onFocus?.(e);
			},
			[onFocus],
		);

		const handleBlur = React.useCallback(
			(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				setIsFocused(false);
				// Run native validation on blur
				const el = inputRef.current as HTMLInputElement;
				if (el && !el.validity.valid) {
					setNativeError(el.validationMessage);
				} else {
					setNativeError("");
				}
				onBlur?.(e);
			},
			[onBlur],
		);

		const handleClear = React.useCallback(() => {
			handleValueChange("");
			onChange?.("", {
				target: { value: "" },
			} as React.ChangeEvent<HTMLInputElement>);
			inputRef.current?.focus();
		}, [handleValueChange, onChange]);

		const handlePasswordToggle = React.useCallback(() => {
			setShowPassword((prev) => !prev);
			inputRef.current?.focus();
		}, []);

		// ── Imperative Handle ─────────────────────────────────────────────────
		React.useImperativeHandle(
			ref,
			() => ({
				focus: () => inputRef.current?.focus(),
				blur: () => inputRef.current?.blur(),
				select: () => (inputRef.current as HTMLInputElement)?.select?.(),
				clear: () => handleValueChange(""),
				setCustomValidity: (msg: string) =>
					(inputRef.current as HTMLInputElement)?.setCustomValidity?.(msg),
				checkValidity: () =>
					(inputRef.current as HTMLInputElement)?.checkValidity?.() ?? true,
				reportValidity: () => {
					const el = inputRef.current as HTMLInputElement;
					const valid = el?.reportValidity?.() ?? true;
					if (!valid) setNativeError(el?.validationMessage ?? "");
					return valid;
				},
				getValue: () => currentValue,
				getInputElement: () => inputRef.current,
			}),
			[currentValue, handleValueChange],
		);

		// ── ARIA describedby ──────────────────────────────────────────────────
		const hasSupporting = !!(
			supportingText ||
			errorText ||
			maxLength !== undefined
		);
		const computedDescribedby =
			[hasSupporting ? supportingId : "", ariaDescribedby ?? ""]
				.filter(Boolean)
				.join(" ") || undefined;

		// ── Input classes ─────────────────────────────────────────────────────
		const inputClass = cn(
			"bg-transparent outline-none w-full self-end",
			"text-base leading-6 text-m3-on-surface",
			"caret-[var(--color-m3-primary)]",
			"placeholder:text-m3-on-surface-variant/60",
			noSpinner &&
				type === "number" &&
				"[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
			disabled && "cursor-not-allowed",
		);

		// Shared input element props
		const inputProps = {
			id: inputId,
			name,
			value: currentValue,
			placeholder: isFloated ? (placeholder ?? "") : "",
			disabled,
			readOnly,
			required,
			minLength,
			maxLength,
			autoComplete,
			inputMode,
			form,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledby,
			"aria-describedby": computedDescribedby,
			"aria-invalid": isError || undefined,
			"aria-required": required || undefined,
			onChange: handleChange,
			onFocus: handleFocus,
			onBlur: handleBlur,
			onKeyDown,
			onKeyUp,
		};

		// ── Container classes ─────────────────────────────────────────────────
		const hasLeading = !!leadingIcon;
		// ALWAYS 16px gap between text and container/icons
		const paddingStart = "pl-4";
		const paddingEnd = "pr-4";

		const containerClass = cn(
			"relative flex items-center",
			variant === "filled"
				? "bg-[var(--color-m3-surface-container-highest)] rounded-tl-sm rounded-tr-sm"
				: "bg-transparent rounded-sm",
			fullWidth ? "w-full" : "w-fit",
		);

		const innerClass = cn(
			"relative flex flex-col flex-1 min-w-0",
			paddingStart,
			paddingEnd,
			variant === "filled"
				? dense
					? "pt-5 pb-2"
					: "pt-6 pb-2"
				: dense
					? "py-3"
					: "py-4",
		);

		const wrapperClass = cn(
			"group/tf inline-flex flex-col",
			fullWidth ? "w-full" : "w-fit",
			disabled && "opacity-[0.38] pointer-events-none",
			className,
		);

		const containerHeightClass = dense ? "h-12" : "h-14";

		// ── Render ────────────────────────────────────────────────────────────
		return (
			<LazyMotion features={domMax} strict>
				<div className={wrapperClass}>
					{/* Main container */}
					<div
						className={cn(
							containerClass,
							type !== "textarea" && containerHeightClass,
						)}
					>
						{/* Outlined border with animated notch */}
						{variant === "outlined" && (
							<OutlineContainer
								isFloated={isFloated}
								isFocused={isFocused}
								isError={isError}
								isDisabled={disabled}
								isHovered={false}
								labelWidth={labelWidth}
								prefersReduced={prefersReduced}
							/>
						)}

						{/* Hover state layer (filled only) */}
						{variant === "filled" && (
							<div
								aria-hidden="true"
								className={cn(
									"absolute inset-0 pointer-events-none rounded-[inherit] bg-m3-on-surface",
									"opacity-0 transition-opacity duration-150",
									"group-hover/tf:opacity-[0.08]",
								)}
							/>
						)}

						{/* Leading icon */}
						{leadingIcon && (
							<LeadingIcon isError={isError} isDisabled={disabled}>
								{leadingIcon}
							</LeadingIcon>
						)}

						{/* Inner column: floating label + input row */}
						<div className={innerClass}>
							{/* Floating label — absolutely positioned over the inner region */}
							{label && (
								<FloatingLabel
									text={label}
									isFloated={isFloated}
									isFocused={isFocused}
									isError={isError}
									isDisabled={disabled}
									variant={variant}
									containerHeight={containerHeight}
									prefersReduced={prefersReduced}
									showAsterisk={showAsterisk}
									htmlFor={inputId}
									labelRef={labelSpanRef}
									hasLeading={hasLeading}
								/>
							)}

							{/* Input row: prefix + input/textarea + suffix */}
							<div className="flex items-center w-full">
								{prefixText && (
									<PrefixSuffix
										text={prefixText}
										type="prefix"
										visible={isFloated}
										prefersReduced={prefersReduced}
									/>
								)}

								{type === "textarea" ? (
									<ScrollArea
										type={scrollAreaType}
										className="w-full flex-1"
										style={{
											height: !autoResize ? rows * LINE_HEIGHT_PX : undefined,
											maxHeight:
												autoResize && maxRows
													? maxRows * LINE_HEIGHT_PX
													: undefined,
										}}
										viewportClassName="max-h-[inherit]"
									>
										<textarea
											ref={inputRef as React.Ref<HTMLTextAreaElement>}
											rows={rows}
											cols={cols}
											className={cn(
												inputClass,
												"resize-none mt-2",
												autoResize ? "h-auto" : "h-full",
											)}
											style={{ direction: textDirection || undefined }}
											{...inputProps}
										/>
									</ScrollArea>
								) : (
									<input
										ref={inputRef as React.Ref<HTMLInputElement>}
										type={type === "password" ? resolvedInputType : type}
										min={min}
										max={max}
										step={step}
										pattern={pattern}
										multiple={multiple}
										className={inputClass}
										style={{ direction: textDirection || undefined }}
										{...inputProps}
									/>
								)}

								{suffixText && (
									<PrefixSuffix
										text={suffixText}
										type="suffix"
										visible={isFloated}
										prefersReduced={prefersReduced}
									/>
								)}
							</div>
						</div>

						{/* Trailing icon: clear, password-toggle, or custom */}
						{(trailingIconMode !== "none" || trailingIcon) && (
							<TrailingIcon
								mode={trailingIcon ? "custom" : trailingIconMode}
								value={currentValue}
								showPassword={showPassword}
								onClear={handleClear}
								onPasswordToggle={handlePasswordToggle}
								isError={isError}
								isDisabled={disabled}
								prefersReduced={prefersReduced}
							>
								{trailingIcon}
							</TrailingIcon>
						)}

						{/* Active indicator: bottom border line (filled variant only) */}
						{variant === "filled" && (
							<ActiveIndicator
								isFocused={isFocused}
								isError={isError}
								isDisabled={disabled}
								isHovered={false}
								prefersReduced={prefersReduced}
							/>
						)}
					</div>

					{/* Supporting text area: helper text + character counter */}
					{hasSupporting && (
						<SupportingText
							supportingText={supportingText}
							errorText={errorText ?? (nativeError || undefined)}
							isError={isError}
							charCount={
								maxLength !== undefined ? currentValue.length : undefined
							}
							maxLength={maxLength}
							id={supportingId}
							prefersReduced={prefersReduced}
						/>
					)}
				</div>
			</LazyMotion>
		);
	},
);

TextFieldComponent.displayName = "TextField";

/**
 * MD3 Expressive TextField.
 *
 * Supports `filled` and `outlined` variants, floating label animation,
 * prefix/suffix, leading/trailing icons, supporting text, character counter,
 * textarea mode, clear button, password toggle, and native form validation.
 *
 * @example
 * ```tsx
 * // Filled (default)
 * <TextField label="Email" type="email" />
 *
 * // Outlined with error
 * <TextField variant="outlined" label="Username" error errorText="Already taken" />
 *
 * // With clear button
 * <TextField label="Search" trailingIconMode="clear" />
 *
 * // Password with toggle
 * <TextField label="Password" type="password" trailingIconMode="password-toggle" />
 *
 * // With character counter
 * <TextField label="Bio" maxLength={140} supportingText="Describe yourself" />
 * ```
 *
 * @see https://m3.material.io/components/text-fields/overview
 */
export const TextField = React.memo(TextFieldComponent);
