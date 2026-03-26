/**
 * Chip – Material Design 3 Expressive
 *
 * Implements 4 chip variants as specified in MD3:
 *   - `assist`     → Triggered actions spanning multiple apps. Flat (bordered) or Elevated.
 *   - `filter`     → Toggleable selections. Animated checkmark on select.
 *   - `input`      → Entities/tags with optional avatar and a dedicated remove button.
 *   - `suggestion` → Contextual dynamic recommendations. Flat (bordered) or Elevated.
 *
 * Token references (Kotlin source):
 *   AssistChipTokens, FilterChipTokens, InputChipTokens, SuggestionChipTokens
 *
 * Architecture:
 *   - Styling: cva + cn (clsx/tailwind-merge)
 *   - Animation: Framer Motion (LazyMotion + domMax) for animated checkmark
 *   - Ripple: Ripple component + useRipple hook from ./ripple.tsx
 *   - A11y: role=checkbox (filter), role=button (others); full keyboard support
 *
 * @see https://m3.material.io/components/chips/overview
 */

"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, useRipple } from "./ripple";

// ─────────────────────────────────────────────────────────────────────────────
// Internal Icons (inline SVG – no external icon library dependency)
// ─────────────────────────────────────────────────────────────────────────────

/** MD3 checkmark icon – 18×18px */
function CheckIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={18}
			height={18}
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

/** MD3 close/remove icon – 18×18px */
function CloseIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={18}
			height={18}
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// CVA Variants
// Token mapping:
//   border-m3-outline-variant → FlatOutlineColor (all variants)
//   bg-m3-secondary-container → FlatSelectedContainerColor / SelectedContainerColor
//   text-m3-on-secondary-container → SelectedLabelTextColor
//   text-m3-on-surface          → Assist LabelTextColor
//   text-m3-on-surface-variant  → Filter/Input/Suggestion UnselectedLabelTextColor
//   bg-m3-surface-container-low → ElevatedContainerColor (Assist, Filter, Suggestion)
// ─────────────────────────────────────────────────────────────────────────────

const chipVariants = cva(
	[
		// Base layout
		"inline-flex items-center h-8 rounded-lg",
		// Typography: LabelLarge
		"text-sm font-medium leading-none",
		// Interaction
		"relative overflow-hidden cursor-pointer select-none",
		"transition-all duration-200 ease-in-out",
		// Remove browser default focus; use MD3 focus ring
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
		"focus-visible:ring-m3-secondary",
		// Expressive scale feedback (MD3 "bouncy" press)
		"active:scale-[0.98]",
		// MD3 State Layer (pseudo-element overlay)
		// Use inset-[-1px] to ensure the state layer covers the 1px border perfectly
		"before:absolute before:inset-[-1px] before:pointer-events-none before:rounded-lg",
		"before:transition-opacity before:duration-200 before:opacity-0",
		"hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10]",
	].join(" "),
	{
		variants: {
			/**
			 * Chip variant controlling default colors and border behavior.
			 * Selected/elevated state overrides are applied via `cn()` at runtime.
			 */
			variant: {
				/**
				 * Assist chip – FlatOutlineColor: outline-variant, LabelTextColor: on-surface
				 * Leading icon color: primary (AssistChipTokens.IconColor)
				 */
				assist:
					"border border-m3-outline-variant text-m3-on-surface before:bg-m3-on-surface",
				/**
				 * Filter chip (unselected) – FlatUnselectedOutlineColor: outline-variant
				 * UnselectedLabelTextColor: on-surface-variant
				 */
				filter:
					"border border-m3-outline-variant text-m3-on-surface-variant before:bg-m3-on-surface-variant",
				/**
				 * Input chip (unselected) – UnselectedOutlineColor: outline-variant
				 * UnselectedLabelTextColor: on-surface-variant
				 */
				input:
					"border border-m3-outline-variant text-m3-on-surface-variant before:bg-m3-on-surface-variant",
				/**
				 * Suggestion chip – FlatOutlineColor: outline-variant
				 * LabelTextColor: on-surface-variant (SuggestionChipTokens)
				 */
				suggestion:
					"border border-m3-outline-variant text-m3-on-surface-variant before:bg-m3-on-surface-variant",
			},
		},
		defaultVariants: { variant: "assist" },
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface ChipProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	/**
	 * Chip variant.
	 * - `assist`     → Smart/automated actions. Flat by default, can be elevated.
	 * - `filter`     → Toggleable tag/filter. Shows animated checkmark when selected.
	 * - `input`      → Entity representation (tag, contact). Has optional avatar + remove button.
	 * - `suggestion` → Contextual suggestions. Like assist, flat by default, can be elevated.
	 * @default 'assist'
	 */
	variant?: VariantProps<typeof chipVariants>["variant"];

	/**
	 * Renders with elevation shadow (Level 1) and fills background with `surface-container-low`.
	 * Applicable to `assist`, `filter` (unselected), and `suggestion` variants.
	 * Source: AssistChipTokens.ElevatedContainerColor / SuggestionChipTokens.ElevatedContainerColor
	 */
	elevated?: boolean;

	/**
	 * Toggle/selection state.
	 * - `filter`:  selected → bg `secondary-container`, animated checkmark appears.
	 * - `input`:   selected → bg `secondary-container`.
	 * Used for `role="checkbox"` (filter) / `aria-pressed` (input).
	 */
	selected?: boolean;

	/**
	 * Disables the chip. Applies:
	 * - `pointer-events-none` – no mouse/touch interaction
	 * - `opacity-[0.38]`      – DisabledLabelTextOpacity (0.38) per MD3 tokens
	 * - `aria-disabled="true"`
	 * - `tabIndex={-1}`
	 */
	disabled?: boolean;

	/**
	 * Visible label. Required. Can be a string or ReactNode.
	 */
	label: React.ReactNode;

	/**
	 * Optional leading icon element (18×18px recommended).
	 * For `filter` chips with `selected=true`, this is replaced by an animated checkmark.
	 * For `assist`/`suggestion`: icon color → `primary`
	 * For `input` (unselected): icon color → `on-surface-variant`
	 */
	leadingIcon?: React.ReactNode;

	/**
	 * Optional trailing icon element (18×18px recommended).
	 * Color: `on-surface-variant` (unselected) / `on-secondary-container` (selected).
	 */
	trailingIcon?: React.ReactNode;

	/**
	 * Avatar element for `input` chips. Takes priority over `leadingIcon`.
	 * Rendered as a 24×24px circle (InputChipTokens: AvatarSize = 24.dp, AvatarShape = CornerFull).
	 */
	avatar?: React.ReactNode;

	/**
	 * Callback when the trailing remove (×) button is activated on `input` chips.
	 * When provided, a dedicated tabbable close button with `aria-label="Remove {label}"` is rendered.
	 */
	onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Implementation
// ─────────────────────────────────────────────────────────────────────────────

const ChipImpl = React.forwardRef<HTMLButtonElement, ChipProps>(
	(
		{
			variant = "assist",
			elevated = false,
			selected = false,
			disabled = false,
			label,
			leadingIcon,
			trailingIcon,
			avatar,
			onRemove,
			className,
			onClick,
			...props
		},
		ref,
	) => {
		const { ripples, onPointerDown, removeRipple } = useRipple();

		// ── Derived state ──────────────────────────────────────────────────────

		const isFilter = variant === "filter";
		const isInput = variant === "input";

		/**
		 * For input chips, avatar takes priority over leadingIcon.
		 * Source: leadingContent() in Chip.kt – "An avatar takes precedence"
		 */
		const resolvedLeadingIcon = isInput && avatar ? avatar : leadingIcon;

		/**
		 * Filter chip: when selected, show animated checkmark.
		 * If a leadingIcon is provided, the checkmark replaces it when selected.
		 * Source: Chip.kt – AnimatedVisibility with expandHorizontally + fadeIn
		 */
		const showCheckmark = isFilter && selected;

		/** Trailing slot: custom trailingIcon OR the remove button for input chips */
		const hasTrailingContent = !!trailingIcon || !!onRemove;

		/**
		 * Leading slot: filter chips always have a potential leading slot
		 * (checkmark or leadingIcon). Otherwise depends on resolvedLeadingIcon.
		 */
		const hasLeadingContent = isFilter || !!resolvedLeadingIcon;

		// ── Padding logic ──────────────────────────────────────────────────────
		// Source: AssistChipDefaults.ContentPadding / inputChipPadding in Chip.kt
		// No icons:         px-4   (16px each side)
		// Leading only:     pl-2 pr-4
		// Trailing only:    pl-4 pr-2
		// Both:             px-2

		const paddingClass = cn(
			// Standard chips
			!isInput && !hasLeadingContent && !hasTrailingContent && "px-4",
			!isInput && hasLeadingContent && !hasTrailingContent && "pl-2 pr-4",
			!isInput && !hasLeadingContent && hasTrailingContent && "pl-4 pr-2",
			!isInput && hasLeadingContent && hasTrailingContent && "px-2",
			// Input chips (Spec: 12px or 4px left padding)
			isInput && !hasLeadingContent && !hasTrailingContent && "px-3",
			isInput && hasLeadingContent && !hasTrailingContent && "pl-1 pr-3",
			isInput && !hasLeadingContent && hasTrailingContent && "pl-3 pr-2",
			isInput && hasLeadingContent && hasTrailingContent && "pl-1 pr-2",
		);

		// ── Visual state overrides ─────────────────────────────────────────────

		const stateClass = cn(
			// Filter selected: FlatSelectedContainerColor = SecondaryContainer
			// Source: FilterChipTokens.FlatSelectedContainerColor / FlatSelectedOutlineWidth = 0
			isFilter &&
				selected &&
				"bg-m3-secondary-container text-m3-on-secondary-container border-none before:bg-m3-on-secondary-container",

			// Input selected: SelectedContainerColor = SecondaryContainer
			// Source: InputChipTokens.SelectedContainerColor / SelectedOutlineWidth = 0
			isInput &&
				selected &&
				"bg-m3-secondary-container text-m3-on-secondary-container border-none before:bg-m3-on-secondary-container",

			// Elevated (not selected): ElevatedContainerColor = SurfaceContainerLow
			// Source: AssistChipTokens / SuggestionChipTokens / FilterChipTokens
			elevated &&
				!selected &&
				"bg-m3-surface-container-low border-none elevation-1",

			// Elevated + selected filter chip still gets shadow
			elevated &&
				isFilter &&
				selected &&
				"elevation-1",

			// Disabled state overrides
			// Source: DisabledLabelTextOpacity = 0.38, FlatDisabledOutlineOpacity = 0.12
			disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
			disabled && !selected && "border-m3-outline-variant/[.12]",
			disabled &&
				selected &&
				"bg-m3-on-surface/[.12] text-m3-on-surface border-none",
		);

		// ── Leading icon color class ───────────────────────────────────────────
		// Assist: IconColor = Primary (AssistChipTokens.IconColor)
		// Suggestion: LeadingIconColor = Primary
		// Filter unselected: UnselectedLeadingIconColor = Primary
		// Filter selected: SelectedLeadingIconColor = OnSecondaryContainer (via text-inherit)
		// Input unselected: UnselectedLeadingIconColor = OnSurfaceVariant
		// Input selected: SelectedLeadingIconColor = Primary

		const leadingIconColorClass = cn(
			(variant === "assist" || variant === "suggestion") && "text-m3-primary",
			isFilter && !selected && "text-m3-primary",
			isFilter && selected && "text-m3-on-secondary-container",
			isInput && !selected && "text-m3-on-surface-variant",
			isInput && selected && "text-m3-primary",
		);

		// ── Render ─────────────────────────────────────────────────────────────
		const isCompound = !!onRemove;
		const Root = (isCompound ? "div" : "button") as React.ElementType;

		// Composed class for the root container
		const containerClass = cn(
			chipVariants({ variant }),
			!isCompound && paddingClass,
			!isCompound && "gap-2",
			stateClass,
			// When compound, the root div handles the overall shape but not the main interaction
			// We disable the root's state layer (hover/focus) to avoid the 1px gap issue
			isCompound && "items-stretch cursor-default active:scale-100 before:opacity-0 gap-0",
			className,
		);

		/** Main hit area content (Leading Icon + Label) */
		const mainContent = (
			<>
				<AnimatePresence initial={false} mode="wait">
					{isFilter ? (
						showCheckmark ? (
							<m.span
								key="checkmark"
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: 18, opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								transition={{
									width: { duration: 0.2, ease: [0.2, 0, 0, 1] },
									opacity: { duration: 0.15, ease: "easeOut" },
								}}
								className="flex items-center justify-center shrink-0 overflow-hidden"
								aria-hidden="true"
							>
								<CheckIcon />
							</m.span>
						) : resolvedLeadingIcon ? (
							<m.span
								key="leading-icon"
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: 18, opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								transition={{
									width: { duration: 0.2, ease: [0.2, 0, 0, 1] },
									opacity: { duration: 0.15, ease: "easeOut" },
								}}
								className={cn(
									"flex items-center justify-center shrink-0 overflow-hidden",
									leadingIconColorClass,
								)}
								aria-hidden="true"
							>
								{resolvedLeadingIcon}
							</m.span>
						) : null
					) : resolvedLeadingIcon ? (
						isInput && avatar ? (
							<span
								key="avatar"
								className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full overflow-hidden"
								aria-hidden="true"
							>
								{resolvedLeadingIcon}
							</span>
						) : (
							<span
								key="leading-icon"
								className={cn(
									"flex items-center justify-center shrink-0 w-4.5 h-4.5",
									leadingIconColorClass,
								)}
								aria-hidden="true"
							>
								{resolvedLeadingIcon}
							</span>
						)
					) : null}
				</AnimatePresence>

				<span className="whitespace-nowrap">{label}</span>
			</>
		);

		return (
			<LazyMotion features={domMax} strict>
				<Root
					ref={(!isCompound ? ref : undefined) as React.Ref<HTMLButtonElement>}
					type={!isCompound ? "button" : undefined}
					// Filter chips act as checkboxes; Input chips can be buttons/toggleable; others buttons
					// Source: Material Design 3 Accessibility
					{...(isFilter
						? {
								role: "checkbox" as React.AriaRole,
								"aria-checked": selected,
							}
						: isInput && !isCompound && selected
							? { role: "button", "aria-pressed": true }
							: isCompound
								? { role: "group" }
								: { role: "button" })}
					aria-disabled={disabled || undefined}
					tabIndex={isCompound ? -1 : disabled ? -1 : 0}
					disabled={!isCompound ? disabled : undefined}
					onClick={!isCompound ? onClick : undefined}
					onPointerDown={!isCompound ? onPointerDown : undefined}
					className={containerClass}
					// Filter out props that shouldn't be on a div if isCompound
					{...(isCompound ? {} : props)}
				>
					{/* State Ripple layer */}
					{!isCompound && (
						<Ripple ripples={ripples} onRippleDone={removeRipple} />
					)}

					{/* Main action area: if compound, this is a nested button for a11y & avoids nesting buttons */}
					{isCompound ? (
						<button
							ref={ref}
							type="button"
							tabIndex={disabled ? -1 : 0}
							disabled={disabled}
							onClick={onClick}
							onPointerDown={onPointerDown}
							className={cn(
								"flex items-center h-full grow focus:outline-none appearance-none bg-transparent border-none",
								"text-inherit font-inherit cursor-pointer",
								// Move padding here; keep horizontal padding but remove trailing to fit next to X
								paddingClass,
								"gap-2",
								"pr-0",
								// Re-apply focus ring to internal button instead of root div
								"focus-visible:ring-2 focus-visible:ring-m3-secondary focus-visible:ring-inset",
								"rounded-l-[7px] rounded-r-none",
								// State layer for main area
								"relative overflow-hidden",
								"before:absolute before:-inset-px before:pointer-events-none before:bg-current",
								"before:transition-opacity before:duration-200 before:opacity-0 before:rounded-l-[7px]",
								"hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10]",
							)}
						>
							<Ripple ripples={ripples} onRippleDone={removeRipple} />
							{mainContent}
						</button>
					) : (
						mainContent
					)}

					{/* ── Trailing slot: trailingIcon or remove button ── */}
					{hasTrailingContent && (
						<span className="flex items-center justify-center shrink-0">
							{onRemove ? (
								<button
									type="button"
									tabIndex={disabled ? -1 : 0}
									aria-label={
										typeof label === "string" ? `Remove ${label}` : "Remove"
									}
									onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
										e.stopPropagation();
										onRemove(e);
									}}
									onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) =>
										e.stopPropagation()
									}
									className={cn(
										"flex items-center justify-center w-8.5 h-full", // 18px icon + 8px left + 8px right padding
										"cursor-pointer focus-visible:outline-none",
										"transition-all duration-150",
										"relative overflow-hidden rounded-r-[7px] rounded-l-none",
										"before:absolute before:-inset-px before:pointer-events-none before:bg-current",
										"before:transition-opacity before:duration-200 before:opacity-0 before:rounded-r-[7px]",
										"hover:before:opacity-[0.08] active:before:opacity-[0.12]",
										// TrailingIcon color tokens
										selected
											? "text-m3-on-secondary-container"
											: "text-m3-on-surface-variant",
									)}
								>
									<CloseIcon />
								</button>
							) : trailingIcon ? (
								<span
									className={cn(
										"flex items-center justify-center w-4.5 h-4.5",
										selected
											? "text-m3-on-secondary-container"
											: "text-m3-on-surface-variant",
									)}
									aria-hidden="true"
								>
									{trailingIcon}
								</span>
							) : null}
						</span>
					)}
				</Root>
			</LazyMotion>
		);
	},
);

ChipImpl.displayName = "Chip";

export const Chip = React.memo(ChipImpl);
