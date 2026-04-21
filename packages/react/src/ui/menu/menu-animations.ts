// ─── MD3 Expressive Menu — Framer Motion Animation Variants ──────────────────
// FastSpatial: mirrors MotionSchemeKeyTokens.FastSpatial
//   Android: spring(stiffness=380, dampingRatio=0.7)
//   Framer:  damping = 2 × 0.7 × √(380 × 1) ≈ 27.3 → use 28
// FastEffects: mirrors MotionSchemeKeyTokens.FastEffects
//   Android: duration=150ms, FastOutLinearIn
//   Framer:  duration=0.15, ease=[0.4, 0, 1, 1]

import type { Transition, Variants } from "motion/react";

// ─── Shared spring/easing specs ───────────────────────────────────────────────

/** FastSpatial spring — used for shape morphing and spatial enter animations */
export const FAST_SPATIAL_SPRING: Transition = {
	type: "spring",
	stiffness: 380,
	damping: 28,
	mass: 1,
};

/** FastEffects transition — used for opacity and exit animations */
export const FAST_EFFECTS_TRANSITION: Transition = {
	duration: 0.15,
	ease: [0.4, 0, 1, 1], // FastOutLinearIn
};

// ─── Menu popup container ─────────────────────────────────────────────────────

/**
 * Enter/exit animation for the menu popup container.
 * Scale from 0.8→1.0 with FastSpatial spring.
 * Transform-origin is driven by the Radix CSS variable
 * `--radix-dropdown-menu-content-transform-origin`.
 */
export const MENU_CONTAINER_VARIANTS: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: FAST_SPATIAL_SPRING,
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		transition: FAST_EFFECTS_TRANSITION,
	},
};

// ─── Selected check icon ──────────────────────────────────────────────────────

/** Size of the check icon in px (20dp per SegmentedMenuTokens.ItemLeadingIconSize) */
export const MENU_CHECK_ICON_SIZE = 20;

/**
 * Expand/collapse animation for the check icon that appears when a MenuItem is
 * selected. Uses horizontal expansion (width + marginInlineEnd) with FastSpatial.
 *
 * ONLY used for the animated check ↔ selectedIcon swap in selectable items.
 * Regular (static) leading icons should NOT use these variants.
 */
export const CHECK_ICON_VARIANTS: Variants = {
	hidden: {
		opacity: 0,
		width: 0,
	},
	visible: {
		opacity: 1,
		width: MENU_CHECK_ICON_SIZE,
		transition: FAST_SPATIAL_SPRING,
	},
	exit: {
		opacity: 0,
		width: 0,
		transition: FAST_EFFECTS_TRANSITION,
	},
};

// ─── SubMenu content ──────────────────────────────────────────────────────────

/** SubMenu popup uses the same FastSpatial/FastEffects pattern as root menu */
export const SUBMENU_CONTAINER_VARIANTS: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.9,
		x: -4,
	},
	visible: {
		opacity: 1,
		scale: 1,
		x: 0,
		transition: FAST_SPATIAL_SPRING,
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		x: -4,
		transition: FAST_EFFECTS_TRANSITION,
	},
};
