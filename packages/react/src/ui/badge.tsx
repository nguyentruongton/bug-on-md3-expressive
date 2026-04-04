/**
 * @file badge.tsx
 *
 * MD3 Expressive Badge component.
 *
 * - `Badge`      → A small status indicator. Can be a dot (no content) or labeled (with content).
 * - `BadgedBox`  → Positions a Badge at the top-trailing corner of an anchor element.
 *
 * @remarks
 * Token references (Kotlin source):
 * BadgeTokens — Size=6dp (→ 6px), LargeSize=16dp (→ 16px), Shape=CornerFull, Color=Error,
 * LargeLabelTextFont=LabelSmall, LargeLabelTextColor=OnError
 *
 * BadgedBox offsets:
 * - Small (dot):  BadgeOffset = 6dp             → translate(50%, -50%)
 * - Large (text): HOffset=12dp, VOffset=14dp   → translate(35%, -35%)
 *
 * Architecture:
 * - Styling: `cn` (clsx/tailwind-merge) + static Tailwind classes
 * - Animation: Framer Motion (`LazyMotion` + `domMax`) spring mount/unmount
 * - A11y: `role="status"` with `aria-label`, decorative dots use `aria-hidden="true"`
 *
 * @see https://m3.material.io/components/badge/overview
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// Exclude onDrag-family event handlers that conflict between React's HTMLAttributes
// and Framer Motion's MotionProps (different DragEvent signatures).
type SafeHTMLSpanAttrs = Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	| "onDrag"
	| "onDragStart"
	| "onDragEnd"
	| "onDragEnter"
	| "onDragLeave"
	| "onDragOver"
	| "onDrop"
>;

export interface BadgeProps extends SafeHTMLSpanAttrs {
	/**
	 * The content to display inside the badge.
	 * - Omitted / undefined → renders as a small 6×6px dot (decorative).
	 * - string | number    → renders as a large badge (min 16px height) with label.
	 *
	 * Numbers exceeding `max` are displayed as `{max}+`.
	 * Strings longer than 4 characters are truncated to 4.
	 */
	children?: React.ReactNode;

	/**
	 * Maximum numeric value to display before appending "+".
	 * Only applies when `children` is a number.
	 * @example max={99} + children={150} → "99+"
	 */
	max?: number;

	/**
	 * Override the background (container) color.
	 * Accepts any valid CSS color value.
	 * Defaults to MD3 `error` token — `bg-m3-error`.
	 */
	containerColor?: string;

	/**
	 * Override the text/content color.
	 * Accepts any valid CSS color value.
	 * Defaults to MD3 `on-error` token — `text-m3-on-error`.
	 */
	contentColor?: string;
}

export interface BadgedBoxProps {
	/**
	 * The badge element to overlay on the anchor.
	 * Typically a `<Badge />`.
	 */
	badge: React.ReactNode;

	/**
	 * The anchor content that the badge is attached to.
	 */
	children: React.ReactNode;

	/**
	 * Additional className applied to the outer wrapper `span`.
	 */
	className?: string;

	/**
	 * Explicitly override size detection for badge positioning.
	 * - `'small'` → BadgeOffset = 6dp → translate(50%, -50%)
	 * - `'large'` → HOffset=12dp/VOffset=14dp → translate(35%, -35%)
	 * When omitted, BadgedBox auto-detects by inspecting `badge` children prop.
	 */
	badgeSize?: "small" | "large";
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatBadgeLabel(children: React.ReactNode, max?: number): string {
	if (typeof children === "number") {
		return max !== undefined && children > max ? `${max}+` : String(children);
	}
	if (typeof children === "string") {
		if (max !== undefined) {
			const asNum = Number(children);
			if (!Number.isNaN(asNum) && asNum > max) return `${max}+`;
		}
		return children.length > 4 ? children.slice(0, 4) : children;
	}
	return "";
}

function detectBadgeHasContent(badge: React.ReactNode): boolean {
	return (
		React.isValidElement<{ children?: React.ReactNode }>(badge) &&
		badge.props.children != null
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────

const BadgeImpl = React.forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			children,
			max,
			containerColor,
			contentColor,
			className,
			style,
			"aria-label": ariaLabel,
			...props
		},
		ref,
	) => {
		const hasContent = children != null;
		const label = hasContent ? formatBadgeLabel(children, max) : "";
		const reducedMotion = useReducedMotion();
		const isDecorative = !hasContent && !ariaLabel;

		const springTransition = reducedMotion
			? { duration: 0 }
			: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 };

		const colorStyle: React.CSSProperties = {
			...(containerColor && { backgroundColor: containerColor }),
			...(contentColor && { color: contentColor }),
			...style,
		};

		return (
			<LazyMotion features={domMax} strict>
				<m.span
					ref={ref}
					role={isDecorative ? undefined : "status"}
					aria-hidden={isDecorative ? "true" : undefined}
					aria-label={hasContent ? (ariaLabel ?? label) : ariaLabel}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					transition={springTransition}
					className={cn(
						"rounded-full",
						!containerColor && "bg-m3-error",
						hasContent
							? cn(
									"inline-flex items-center justify-center",
									"min-w-4 h-4 px-1 text-[11px] font-medium leading-none",
									!contentColor && "text-m3-on-error",
								)
							: "inline-block w-1.5 h-1.5",
						className,
					)}
					style={colorStyle}
					// biome-ignore lint/suspicious/noExplicitAny: spread safe subset of HTML attrs
					{...(props as any)}
				>
					{hasContent && label}
				</m.span>
			</LazyMotion>
		);
	},
);

BadgeImpl.displayName = "Badge";

/**
 * MD3 Expressive Badge — dynamic status indicator.
 *
 * @example
 * ```tsx
 * // Small dot badge (no content) — decorative
 * <Badge />
 *
 * // Large badge with number (truncated at max)
 * <Badge max={99}>150</Badge>
 * // → displays "99+"
 *
 * // Large badge with text label
 * <Badge>NEW</Badge>
 *
 * // Custom colors
 * <Badge containerColor="#6750A4" contentColor="#FFFFFF">3</Badge>
 * ```
 *
 * @see https://m3.material.io/components/badge/overview
 */
export const Badge = React.memo(BadgeImpl);

// ─────────────────────────────────────────────────────────────────────────────
// BadgedBox
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MD3 BadgedBox — positions a Badge at the top-trailing corner of an anchor.
 *
 * Implements MD3 offset specs from Badge.kt:
 * - Small badge (dot): `BadgeOffset = 6dp` → translate(50%, -50%)
 * - Large badge (text): `BadgeWithContentHorizontalOffset = 12dp` / `VerticalOffset = 14dp`
 *   → translate(35%, -35%)
 *
 * Auto-detects badge size by inspecting the badge element's children prop,
 * or accepts an explicit `badgeSize` override.
 *
 * @example
 * ```tsx
 * // Small dot on mail icon
 * <BadgedBox badge={<Badge />}>
 *   <Icon name="mail" />
 * </BadgedBox>
 *
 * // Count badge on notification icon
 * <BadgedBox badge={<Badge max={99}>{count}</Badge>}>
 *   <Icon name="notifications" />
 * </BadgedBox>
 * ```
 */
export function BadgedBox({
	badge,
	children,
	className,
	badgeSize,
}: BadgedBoxProps) {
	const isLarge = badgeSize ? badgeSize === "large" : detectBadgeHasContent(badge);

	const badgePositionClass = isLarge
		? "translate-x-[35%] -translate-y-[35%]"
		: "translate-x-[50%] -translate-y-[50%]";

	return (
		<span className={cn("relative inline-flex", className)}>
			{children}
			<span
				className={cn("absolute right-0 top-0", badgePositionClass)}
				aria-hidden="true"
			>
				<AnimatePresence mode="wait">{badge}</AnimatePresence>
			</span>
		</span>
	);
}
