import { AnimatePresence, m, useReducedMotion } from "motion/react";
import * as React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MD3 Expressive Ripple
//
// - Origin: pointer-down coordinates (x, y) relative to container
// - Shape: perfectly round circle, expands from origin to diagonally fill btn
// - Color: currentColor at 12% opacity (matches MD3 state layer spec)
// - A11y: disabled when `prefers-reduced-motion` is active (configurable)
// - Clipping: caller wraps in overflow-hidden; border-radius handled on parent
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a single ripple wave instance with position and size metadata.
 *
 * @example
 * ```tsx
 * const ripple: RippleOrigin = { id: Date.now(), x: 50, y: 30, size: 200 };
 * ```
 */
export interface RippleOrigin {
	/** Unique identifier used as React key and for removal. */
	id: number;
	/** X coordinate of the pointer event relative to the container's left edge (px). */
	x: number;
	/** Y coordinate of the pointer event relative to the container's top edge (px). */
	y: number;
	/**
	 * Diameter of the ripple circle (px).
	 * Typically `Math.hypot(width, height) * 2` to ensure it fills the container.
	 */
	size: number;
}

/** @internal Props for a single animated ripple element. */
interface RippleItemProps {
	ripple: RippleOrigin;
	onDone: (id: number) => void;
}

/** @internal Memoized single ripple wave — minimises re-renders. */
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

// ─────────────────────────────────────────────────────────────────────────────
// Ripple Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props for the `Ripple` presentation component.
 */
export interface RippleProps {
	/** Active ripple instances to render. Managed by the parent via `useRipple`. */
	ripples: RippleOrigin[];
	/** Called when a ripple's exit animation completes — remove it from state. */
	onRippleDone: (id: number) => void;
	/**
	 * Completely disables the ripple effect.
	 * Use this when the parent element is disabled or interaction is not desired.
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * When `true`, the ripple respects the user's OS-level
	 * `prefers-reduced-motion` accessibility setting and renders nothing if active.
	 *
	 * Set to `false` to always show ripples regardless of system preference.
	 * @default true
	 */
	respectSystemMotion?: boolean;
}

/**
 * MD3 Expressive Ripple — animated touch-feedback wave layer.
 *
 * Renders absolutely-positioned ripple circles inside an `overflow-hidden`
 * container. Must be placed as a direct child of the interactive element.
 *
 * @remarks
 * - The parent element **must** have `overflow: hidden` and `position: relative`
 *   (or equivalent) for clipping to work correctly.
 * - Set `disabled` to `true` on parent's disabled state to avoid stale ripples.
 * - The ripple color is `currentColor` at 12% opacity — matching MD3 state layer spec.
 *
 * @example
 * ```tsx
 * const { ripples, onPointerDown, removeRipple } = useRippleState();
 *
 * <button onPointerDown={onPointerDown} className="relative overflow-hidden">
 *   <Ripple ripples={ripples} onRippleDone={removeRipple} />
 *   Click me
 * </button>
 * ```
 *
 * @see {@link useRippleState} for the state management hook
 * @see https://m3.material.io/foundations/interaction/states/overview
 */
export function Ripple({
	ripples,
	onRippleDone,
	disabled = false,
	respectSystemMotion = true,
}: RippleProps) {
	const prefersReduced = useReducedMotion();

	// Disabled prop: explicitly turned off by consumer
	if (disabled) return null;

	// Respect system prefers-reduced-motion when opted-in
	if (respectSystemMotion && prefersReduced) return null;

	return (
		<AnimatePresence>
			{ripples.map((r) => (
				<RippleItem key={r.id} ripple={r} onDone={onRippleDone} />
			))}
		</AnimatePresence>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// useRippleState Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for configuring `useRippleState` behaviour.
 */
export interface UseRippleStateOptions {
	/**
	 * When `true`, the ripple is suppressed — `onPointerDown` becomes a no-op.
	 * Use this to sync the ripple with the parent element's `disabled` state.
	 * @default false
	 */
	disabled?: boolean;
}

/**
 * `useRippleState` — state manager for MD3 Expressive ripple waves.
 *
 * Tracks active ripple instances and provides pointer event handlers.
 * Pair with the `<Ripple>` component for rendering.
 *
 * @remarks
 * This hook only manages ripple *state* (coordinates, size, lifecycle).
 * The actual animation is handled by `<Ripple>` via Framer Motion.
 * Respecting `prefers-reduced-motion` is handled by `<Ripple>` itself.
 *
 * @param options - Configuration options. See {@link UseRippleStateOptions}.
 * @returns `{ ripples, onPointerDown, removeRipple }` — bind to the interactive element.
 *
 * @example
 * ```tsx
 * function MyButton({ disabled, children }) {
 *   const { ripples, onPointerDown, removeRipple } = useRippleState({ disabled });
 *
 *   return (
 *     <button
 *       disabled={disabled}
 *       onPointerDown={onPointerDown}
 *       className="relative overflow-hidden"
 *     >
 *       <Ripple ripples={ripples} onRippleDone={removeRipple} disabled={disabled} />
 *       {children}
 *     </button>
 *   );
 * }
 * ```
 *
 * @see {@link Ripple} for the rendering component
 */
export function useRippleState(options: UseRippleStateOptions = {}) {
	const { disabled = false } = options;
	const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

	const onPointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLElement>) => {
			if (disabled) return;
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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

	const removeRipple = React.useCallback((id: number) => {
		setRipples((prev) => prev.filter((r) => r.id !== id));
	}, []);

	return { ripples, onPointerDown, removeRipple };
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy alias — preserved for backward-compatibility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use `useRippleState` instead. This alias will be removed in a future version.
 * @see {@link useRippleState}
 */
export const useRipple = useRippleState;
