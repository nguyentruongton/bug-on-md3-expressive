"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Expressive Ripple
//
// - Origin: pointer-down coordinates (x, y) relative to container
// - Shape: perfectly round circle, expands from origin to diagonally fill btn
// - Color: currentColor at 12% opacity (matches MD3 state layer spec)
// - A11y: fully disabled when `prefers-reduced-motion` is active
// - Clipping: caller wraps in overflow-hidden; border-radius handled on parent
// ─────────────────────────────────────────────────────────────────────────────

export interface RippleOrigin {
	id: number;
	x: number;
	y: number;
	size: number;
}

interface RippleItemProps {
	ripple: RippleOrigin;
	onDone: (id: number) => void;
}

const RippleItem = React.memo(function RippleItem({
	ripple,
	onDone,
}: RippleItemProps) {
	return (
		<m.span
			key={ripple.id}
			aria-hidden="true"
			style={{
				position: "absolute",
				left: ripple.x - ripple.size / 2,
				top: ripple.y - ripple.size / 2,
				width: ripple.size,
				height: ripple.size,
				borderRadius: "50%",
				backgroundColor: "currentColor",
				pointerEvents: "none",
				transformOrigin: "center",
			}}
			initial={{ scale: 0, opacity: 0.12 }}
			animate={{ scale: 1, opacity: 0 }}
			exit={{ opacity: 0 }}
			transition={{
				scale: { duration: 0.5, ease: [0.2, 0, 0, 1] },
				opacity: { duration: 0.4, ease: "easeOut", delay: 0.1 },
			}}
			onAnimationComplete={() => onDone(ripple.id)}
		/>
	);
});

export interface RippleProps {
	ripples: RippleOrigin[];
	onRippleDone: (id: number) => void;
}

export function Ripple({ ripples, onRippleDone }: RippleProps) {
	const prefersReduced = useReducedMotion();

	// When reduced-motion: render nothing — the CSS active state layer provides
	// enough visual feedback without any animation.
	if (prefersReduced) return null;

	return (
		<AnimatePresence>
			{ripples.map((r) => (
				<RippleItem key={r.id} ripple={r} onDone={onRippleDone} />
			))}
		</AnimatePresence>
	);
}
