/**
 * @file fab-menu.tsx
 *
 * MD3 Expressive FAB Menu component.
 *
 * Provides a toggleable FAB that reveals a staggered list of action items.
 * Implements the MD3 FloatingActionButtonMenu pattern with full accessibility
 * support (keyboard navigation, focus management, ARIA roles).
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */

import {
	AnimatePresence,
	domMax,
	LazyMotion,
	m,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Ripple, useRippleState } from "./ripple";
import { SPRING_TRANSITION, SPRING_TRANSITION_FAST } from "./shared/constants";
import { TouchTarget } from "./shared/touch-target";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens — MD3 FAB Menu Spec
// ─────────────────────────────────────────────────────────────────────────────

const SPRING_NORMAL = { stiffness: 700, damping: 40 } as const;
const SPRING_REDUCED = { stiffness: 10000, damping: 100 } as const;
const FOCUS_DELAY_MS = 50;

const TOGGLE_FAB_COLORS: Record<
	string,
	{
		containerBg: string;
		containerText: string;
		checkedBg: string;
		checkedText: string;
	}
> = {
	primary: {
		containerBg: "bg-m3-primary-container",
		containerText: "text-m3-on-primary-container",
		checkedBg: "bg-m3-primary",
		checkedText: "text-m3-on-primary",
	},
	secondary: {
		containerBg: "bg-m3-secondary-container",
		containerText: "text-m3-on-secondary-container",
		checkedBg: "bg-m3-secondary",
		checkedText: "text-m3-on-secondary",
	},
	tertiary: {
		containerBg: "bg-m3-tertiary-container",
		containerText: "text-m3-on-tertiary-container",
		checkedBg: "bg-m3-tertiary",
		checkedText: "text-m3-on-tertiary",
	},
};

/**
 * Size tokens for ToggleFAB.
 *
 * MD3 Kotlin reference:
 *  - Baseline: 56dp, cornerRadius 16dp → 28dp (fully round)
 *  - Medium: ~80dp (FabMediumTokens.ContainerHeight), cornerRadius 20dp → 40dp
 *  - Large: 96dp, cornerRadius 28dp → 48dp
 * @internal
 */
const TOGGLE_FAB_SIZES: Record<
	string,
	{
		sizeClass: string;
		initialRadius: number;
		finalRadius: number;
	}
> = {
	baseline: { sizeClass: "h-14 w-14", initialRadius: 16, finalRadius: 28 },
	medium: { sizeClass: "h-20 w-20", initialRadius: 20, finalRadius: 40 },
	large: { sizeClass: "h-24 w-24", initialRadius: 28, finalRadius: 48 },
};

const MENU_ITEM_STYLES = {
	padding: "ps-4 pe-6",
	gap: "gap-3",
	size: "h-14 min-w-14",
	cornerRadius: 999,
} as const;

const MENU_ITEM_COLORS: Record<string, { bg: string; text: string }> = {
	primary: {
		bg: "bg-m3-primary-container",
		text: "text-m3-on-primary-container",
	},
	secondary: {
		bg: "bg-m3-secondary-container",
		text: "text-m3-on-secondary-container",
	},
	tertiary: {
		bg: "bg-m3-tertiary-container",
		text: "text-m3-on-tertiary-container",
	},
};

const ALIGNMENT_CONTAINER_CLASSES: Record<string, string> = {
	end: "items-end bottom-4 right-4 sm:bottom-6 sm:right-6",
	start: "items-start bottom-4 left-4 sm:bottom-6 sm:left-6",
	center: "items-center bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
};

const ALIGNMENT_ITEMS_CLASSES: Record<string, string> = {
	end: "items-end",
	start: "items-start",
	center: "items-center",
};

const ALIGNMENT_TRANSFORM_ORIGIN: Record<string, string> = {
	end: "right",
	start: "left",
	center: "bottom",
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Data shape for a single FAB menu item entry.
 *
 * When `label` is omitted the item renders as a square icon-only tile.
 */
export interface FABMenuItemData {
	/** Unique identifier for React key and focus management. */
	id: string;
	/** Optional text label rendered beside the icon. Omit for icon-only items. */
	label?: string;
	/** Icon node — typically a single SVG icon component. */
	icon: React.ReactNode;
	/** Called when the item is activated (click or keyboard Enter/Space). */
	onClick: () => void;
	/**
	 * When `true`, the item is visually and functionally disabled.
	 * Uses `aria-disabled` instead of HTML `disabled` so the item stays focusable.
	 * @default false
	 */
	disabled?: boolean;
	/** Additional class names applied to the item container. */
	className?: string;
}

/**
 * Props for the `FABMenu` orchestration component.
 *
 * @remarks
 * FABMenu manages the open/close state, focus lifecycle, keyboard navigation,
 * and animation orchestration. The `expanded` state is controlled externally
 * so it can be driven by route changes, business logic, etc.
 */
export interface FABMenuProps {
	/** Whether the FAB Menu is currently open/expanded. */
	expanded: boolean;
	/** Callback invoked when the toggle FAB is clicked. */
	onToggle: (expanded: boolean) => void;
	/** List of action items (2–6 recommended by MD3 spec). */
	items: FABMenuItemData[];
	/**
	 * MD3 color container role for the FAB and menu items.
	 * @default "primary"
	 */
	colorVariant?: "primary" | "secondary" | "tertiary";
	/**
	 * Initial size of the ToggleFAB (collapses to a circular close button when open).
	 * @default "baseline"
	 */
	fabSize?: "baseline" | "medium" | "large";
	/**
	 * Horizontal alignment of menu items relative to the FAB.
	 * - `"end"`: items align to the right (trailing edge, default for RTL-aware layouts)
	 * - `"start"`: items align to the left
	 * - `"center"`: items are centered over the FAB
	 * @default "end"
	 */
	alignment?: "start" | "end" | "center";
	/** Additional class names for the outermost container div. */
	className?: string;
	/**
	 * When `true`, clicking the backdrop/scrim behind the menu closes it.
	 * @default true
	 */
	closeOnBackdropClick?: boolean;
	/**
	 * When `true`, focus moves to the LAST item (closest to FAB) when menu opens.
	 * When `false`, focus moves to the FIRST item (top of list).
	 * @default true
	 */
	focusLast?: boolean;
	/** `aria-label` for the ToggleFAB. Required for accessibility. */
	"aria-label"?: string;
}

/**
 * Props for the standalone `ToggleFAB` component.
 */
export interface ToggleFABProps {
	/** Whether the FAB is in the checked (open/expanded) state. */
	expanded: boolean;
	/** Called when the FAB is clicked. */
	onToggle: (expanded: boolean) => void;
	/**
	 * Icon render prop — receives the current checked progress (0→1)
	 * so the icon can morph (e.g., from Add to Close).
	 *
	 * @example
	 * ```tsx
	 * icon={(progress) => progress > 0.5 ? <CloseIcon /> : <AddIcon />}
	 * ```
	 */
	icon: (progress: number) => React.ReactNode;
	/** MD3 color container role. @default "primary" */
	colorVariant?: "primary" | "secondary" | "tertiary";
	/** Initial FAB size (morphs to circle when expanded). @default "baseline" */
	fabSize?: "baseline" | "medium" | "large";
	/** Additional class names. */
	className?: string;
	/** `aria-label` for the button. Required. */
	"aria-label"?: string;
	/** Controls `aria-expanded` attribute. */
	"aria-controls"?: string;
	/** Passed through to the underlying button element. */
	id?: string;
}

/**
 * Props for the `FABMenuItem` component.
 */
export interface FABMenuItemProps {
	/** Icon node. */
	icon: React.ReactNode;
	/** Optional text label. If omitted, renders as an icon-only square tile. */
	label?: string;
	/** Called when the item is activated. */
	onClick: () => void;
	/** Disables interaction while keeping the item focusable. @default false */
	disabled?: boolean;
	/** MD3 color container role. @default "primary" */
	colorVariant?: "primary" | "secondary" | "tertiary";
	/** Additional class names. */
	className?: string;
	/** Index within the menu (used for stagger animation `custom` prop). */
	index?: number;
	/** Total number of items (used to compute stagger order). */
	totalItems?: number;
	/** `tabIndex` driven by focus management logic. */
	tabIndex?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────────────────────

const ITEM_SPRING = { type: "spring" as const, stiffness: 700, damping: 25 };

const MENU_CONTAINER_VARIANTS = {
	open: { transition: { staggerChildren: 0.033, staggerDirection: 1 } },
	closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
} as const;

const MENU_ITEM_VARIANTS = {
	open: { scaleX: 1, opacity: 1, transition: ITEM_SPRING },
	closed: { scaleX: 0, opacity: 0, transition: ITEM_SPRING },
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal Icon Components
// ─────────────────────────────────────────────────────────────────────────────

function AddIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="currentColor"
			width="24"
			height="24"
		>
			<title>Add</title>
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="currentColor"
			width="24"
			height="24"
		>
			<title>Close</title>
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
		</svg>
	);
}

function defaultFabIcon(progress: number) {
	return progress > 0.5 ? <CloseIcon /> : <AddIcon />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ToggleFAB Component
// ─────────────────────────────────────────────────────────────────────────────

const ToggleFABComponent = React.forwardRef<HTMLButtonElement, ToggleFABProps>(
	(
		{
			expanded,
			onToggle,
			icon,
			colorVariant = "primary",
			fabSize = "baseline",
			className,
			id,
			"aria-label": ariaLabel,
			"aria-controls": ariaControls,
		},
		ref,
	) => {
		const prefersReduced = useReducedMotion();
		const colors = TOGGLE_FAB_COLORS[colorVariant] ?? TOGGLE_FAB_COLORS.primary;
		const sizeTokens = TOGGLE_FAB_SIZES[fabSize] ?? TOGGLE_FAB_SIZES.baseline;

		const springConfig = prefersReduced ? SPRING_REDUCED : SPRING_NORMAL;
		const checkedProgress = useSpring(expanded ? 1 : 0, springConfig);

		React.useEffect(() => {
			checkedProgress.set(expanded ? 1 : 0);
		}, [expanded, checkedProgress]);

		const borderRadius = useTransform(
			checkedProgress,
			[0, 1],
			[`${sizeTokens.initialRadius}px`, `${sizeTokens.finalRadius}px`],
		);

		const [iconProgress, setIconProgress] = React.useState(expanded ? 1 : 0);

		React.useEffect(() => {
			return checkedProgress.on("change", setIconProgress);
		}, [checkedProgress]);

		const { ripples, onPointerDown, removeRipple } = useRippleState();

		const handleClick = React.useCallback(() => {
			onToggle(!expanded);
		}, [expanded, onToggle]);

		return (
			<m.button
				ref={ref}
				id={id}
				type="button"
				aria-expanded={expanded}
				aria-haspopup="menu"
				aria-label={ariaLabel ?? (expanded ? "Close menu" : "Open menu")}
				aria-controls={ariaControls}
				data-expanded={expanded ? "true" : "false"}
				onClick={handleClick}
				onPointerDown={onPointerDown}
				style={{ borderRadius }}
				animate={{
					boxShadow: expanded
						? "0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)"
						: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
				}}
				whileTap={{ scale: 0.95, transition: SPRING_TRANSITION_FAST }}
				transition={{ boxShadow: SPRING_TRANSITION }}
				className={cn(
					"relative shrink-0 inline-flex items-center justify-center",
					"select-none cursor-pointer overflow-hidden",
					"transition-colors duration-200",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2",
					sizeTokens.sizeClass,
					expanded ? colors.checkedBg : colors.containerBg,
					expanded ? colors.checkedText : colors.containerText,
					className,
				)}
			>
				<TouchTarget />
				<Ripple ripples={ripples} onRippleDone={removeRipple} />
				<span
					aria-hidden="true"
					className="relative z-10 flex items-center justify-center size-6 pointer-events-none"
				>
					{icon(iconProgress)}
				</span>
			</m.button>
		);
	},
);

ToggleFABComponent.displayName = "ToggleFAB";

/**
 * Toggleable FAB for use with `FABMenu` or as a standalone toggle button.
 *
 * Animates container size, corner radius (square → circle), and background color
 * as `expanded` transitions from false → true.
 *
 * @example
 * ```tsx
 * <ToggleFAB
 *   expanded={open}
 *   onToggle={setOpen}
 *   aria-label="Toggle actions"
 *   icon={(progress) => progress > 0.5 ? <CloseIcon /> : <AddIcon />}
 * />
 * ```
 */
export const ToggleFAB = React.memo(ToggleFABComponent);

// ─────────────────────────────────────────────────────────────────────────────
// FABMenuItem Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single action item within a `FABMenu`.
 *
 * Renders as a pill-shaped chip with icon and optional label.
 * When `label` is omitted, renders as an icon-only square tile.
 * Includes MD3 Ripple press feedback and WCAG 2.5.5 compliant 48dp touch target.
 *
 * @remarks
 * Disabled items use `aria-disabled="true"` instead of HTML `disabled` so
 * they remain keyboard-focusable (MD3 accessibility requirement).
 */
export function FABMenuItem({
	icon,
	label,
	onClick,
	disabled = false,
	colorVariant = "primary",
	className,
	tabIndex = 0,
}: FABMenuItemProps) {
	const colors = MENU_ITEM_COLORS[colorVariant] ?? MENU_ITEM_COLORS.primary;

	const { ripples, onPointerDown, removeRipple } = useRippleState({ disabled });

	const handleClick = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (disabled) {
				e.preventDefault();
				return;
			}
			onClick();
		},
		[disabled, onClick],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		},
		[disabled, onClick],
	);

	return (
		<m.div
			role="menuitem"
			tabIndex={tabIndex}
			aria-disabled={disabled ? "true" : undefined}
			data-disabled={disabled ? "true" : undefined}
			onClick={handleClick}
			onPointerDown={onPointerDown}
			onKeyDown={handleKeyDown}
			variants={MENU_ITEM_VARIANTS}
			style={{
				transformOrigin: "right",
				borderRadius: `${MENU_ITEM_STYLES.cornerRadius}px`,
			}}
			className={cn(
				"relative inline-flex flex-row items-center",
				"select-none cursor-pointer overflow-hidden",
				"whitespace-nowrap",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-1",
				MENU_ITEM_STYLES.size,
				MENU_ITEM_STYLES.gap,
				label ? MENU_ITEM_STYLES.padding : "px-4",
				!label && "justify-center",
				colors.bg,
				colors.text,
				disabled && "opacity-[0.38] pointer-events-none",
				className,
			)}
		>
			<TouchTarget />
			<Ripple ripples={ripples} onRippleDone={removeRipple} />
			<span
				aria-hidden="true"
				className="relative z-10 flex items-center justify-center size-6 shrink-0 [&>svg]:w-full [&>svg]:h-full pointer-events-none"
			>
				{icon}
			</span>
			{label && (
				<span className="relative z-10 text-base font-medium leading-none pointer-events-none">
					{label}
				</span>
			)}
		</m.div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// FABMenu Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MD3 Expressive FAB Menu.
 *
 * A toggleable FAB that reveals a staggered list of action items above it.
 * Implements full MD3 accessibility:
 *  - `role="menu"` on the items container
 *  - `role="menuitem"` on each item
 *  - Focus management: open → first/last item; close → ToggleFAB
 *  - Keyboard: Escape closes, Arrow Up/Down navigates, Tab/Shift+Tab cycles
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false)
 *
 * <FABMenu
 *   expanded={open}
 *   onToggle={setOpen}
 *   aria-label="Actions"
 *   items={[
 *     { id: 'share', icon: <ShareIcon />, label: 'Share', onClick: handleShare },
 *     { id: 'edit', icon: <EditIcon />, label: 'Edit', onClick: handleEdit },
 *   ]}
 * />
 * ```
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
export function FABMenu({
	expanded,
	onToggle,
	items,
	colorVariant = "primary",
	fabSize = "baseline",
	alignment = "end",
	className,
	closeOnBackdropClick = true,
	focusLast = true,
	"aria-label": ariaLabel,
}: FABMenuProps) {
	const fabId = React.useId();
	const menuId = React.useId();
	const toggleRef = React.useRef<HTMLButtonElement>(null);
	const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
	const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

	const reversedItems = React.useMemo(() => [...items].reverse(), [items]);

	const focusItem = React.useCallback((index: number) => {
		const clampedIndex = Math.max(
			0,
			Math.min(index, itemRefs.current.length - 1),
		);
		setFocusedIndex(clampedIndex);
		itemRefs.current[clampedIndex]?.focus();
	}, []);

	// Track whether menu was previously open so we only return focus
	// to the toggle button after a user-initiated close, not on initial mount.
	const wasExpandedRef = React.useRef(false);

	React.useEffect(() => {
		if (expanded) {
			wasExpandedRef.current = true;
			const timer = setTimeout(() => {
				focusItem(focusLast ? items.length - 1 : 0);
			}, FOCUS_DELAY_MS);
			return () => clearTimeout(timer);
		}

		if (wasExpandedRef.current) {
			toggleRef.current?.focus();
		}
		wasExpandedRef.current = false;
		setFocusedIndex(-1);
	}, [expanded, focusLast, items.length, focusItem]);

	const handleMenuKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (!expanded) return;

			const lastIndex = items.length - 1;

			switch (e.key) {
				case "Escape":
					e.preventDefault();
					onToggle(false);
					break;

				case "ArrowUp": {
					e.preventDefault();
					focusItem(focusedIndex <= 0 ? lastIndex : focusedIndex - 1);
					break;
				}

				case "ArrowDown": {
					e.preventDefault();
					focusItem(focusedIndex >= lastIndex ? 0 : focusedIndex + 1);
					break;
				}

				case "Tab": {
					e.preventDefault();
					if (e.shiftKey) {
						focusItem(focusedIndex <= 0 ? lastIndex : focusedIndex - 1);
					} else {
						focusItem(focusedIndex >= lastIndex ? 0 : focusedIndex + 1);
					}
					break;
				}
			}
		},
		[expanded, focusedIndex, items.length, focusItem, onToggle],
	);

	return (
		<LazyMotion features={domMax} strict>
			{expanded && closeOnBackdropClick && (
				<div
					aria-hidden="true"
					className="fixed inset-0 z-40"
					onClick={() => onToggle(false)}
				/>
			)}

			{/* biome-ignore lint/a11y/useSemanticElements: FAB menu container needs div, not fieldset — this is not a form group */}
			<div
				role="group"
				aria-label={ariaLabel ?? "Actions menu"}
				className={cn(
					"fixed z-50 flex flex-col gap-2",
					ALIGNMENT_CONTAINER_CLASSES[alignment],
					"*:shrink-0",
					className,
				)}
				onKeyDown={handleMenuKeyDown}
			>
				<AnimatePresence>
					{expanded && (
						<m.div
							id={menuId}
							role="menu"
							aria-labelledby={fabId}
							aria-orientation="vertical"
							variants={MENU_CONTAINER_VARIANTS}
							initial="closed"
							animate="open"
							exit="closed"
							className={cn(
								"flex flex-col-reverse gap-2",
								ALIGNMENT_ITEMS_CLASSES[alignment],
							)}
						>
							{reversedItems.map((item, reversedIndex) => {
								const originalIndex = items.length - 1 - reversedIndex;
								return (
									<m.div
										key={item.id}
										variants={MENU_ITEM_VARIANTS}
										style={{
											transformOrigin:
												ALIGNMENT_TRANSFORM_ORIGIN[alignment] ?? "right",
										}}
										ref={(el) => {
											itemRefs.current[originalIndex] = el;
										}}
									>
										<FABMenuItem
											icon={item.icon}
											label={item.label}
											onClick={() => {
												if (!item.disabled) {
													item.onClick();
													onToggle(false);
												}
											}}
											disabled={item.disabled}
											colorVariant={colorVariant}
											className={item.className}
											tabIndex={expanded ? 0 : -1}
										/>
									</m.div>
								);
							})}
						</m.div>
					)}
				</AnimatePresence>

				<ToggleFAB
					ref={toggleRef}
					id={fabId}
					expanded={expanded}
					onToggle={onToggle}
					colorVariant={colorVariant}
					fabSize={fabSize}
					aria-label={
						ariaLabel ?? (expanded ? "Close actions menu" : "Open actions menu")
					}
					aria-controls={menuId}
					icon={defaultFabIcon}
				/>
			</div>
		</LazyMotion>
	);
}
