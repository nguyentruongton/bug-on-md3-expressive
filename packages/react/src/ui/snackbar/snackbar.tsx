/**
 * @file snackbar.tsx
 *
 * MD3 Expressive Snackbar component.
 *
 * Architecture:
 * - `Snackbar`         → Pure display component (motion.div, role="status", aria-live="polite")
 * - `SnackbarHost`     → AnimatePresence container + queue flush (place once in layout)
 * - `SnackbarProvider` → Context provider that wires SnackbarHost + exposes `useSnackbar`
 * - `useSnackbarState` → Low-level ref-based queue hook (mutex pattern)
 * - `useSnackbar`      → Consumer hook for imperative `showSnackbar(visuals)` calls
 *
 * Queue strategy:
 * - One snackbar visible at a time (MD3 spec).
 * - Subsequent `showSnackbar()` calls are enqueued, shown as soon as current one dismisses.
 * - Cleanup: on unmount, all pending promises resolve as 'dismissed'.
 *
 * @see https://m3.material.io/components/snackbar/overview
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
import { Icon } from "../icon";
import { IconButton } from "../icon-button";

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_MAP = {
	short: 4000,
	long: 7000,
} as const;

const RESULT = {
	ACTION: "action-performed",
	DISMISSED: "dismissed",
} as const satisfies Record<string, SnackbarResult>;

// ─── Animation Config (Framer Motion — NOT CSS transitions) ──────────────────

const SNACKBAR_SPRING = {
	type: "spring" as const,
	bounce: 0.15,
	duration: 0.4,
};

const SNACKBAR_ANIM = {
	initial: { opacity: 0, y: 56, scale: 0.9 },
	animate: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: SNACKBAR_SPRING,
	},
	exit: {
		opacity: 0,
		y: 24,
		scale: 0.95,
		transition: { duration: 0.2, ease: "easeIn" as const },
	},
} as const;

const REDUCED_MOTION_ANIM = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Duration preset for the snackbar auto-dismiss timer.
 * - `'short'` → 4 000 ms (default, MD3 spec)
 * - `'long'`  → 7 000 ms
 * - `number`  → custom milliseconds
 */
export type SnackbarDuration = "short" | "long" | number;

/**
 * Resolution value returned by the `showSnackbar()` promise.
 * - `'action-performed'` → user clicked the action button
 * - `'dismissed'`        → auto-dismissed or close button clicked
 */
export type SnackbarResult = "action-performed" | "dismissed";

/**
 * Visual configuration for a single snackbar instance.
 */
export interface SnackbarVisuals {
	/** Main message text. */
	message: string;
	/** Label for the optional action button. */
	actionLabel?: string;
	/** When `true`, renders a close (X) icon button. @default false */
	withDismissAction?: boolean;
	/**
	 * When `true`, renders the action button below the message (Column layout).
	 * Use when both message and actionLabel are long.
	 * @default false
	 */
	actionOnNewLine?: boolean;
	/**
	 * Auto-dismiss duration.
	 * @default 'short' (4 000 ms)
	 */
	duration?: SnackbarDuration;
	/** Additional className applied to the snackbar container. */
	className?: string;
}

/**
 * Internal runtime data for a currently-displayed snackbar.
 * Includes the resolve callback to settle the caller's promise.
 */
export interface SnackbarData {
	/** Unique key for AnimatePresence element diffing. */
	id: string;
	/** Visual configuration. */
	visuals: SnackbarVisuals;
	/** Settles the promise returned by `showSnackbar()`. */
	resolve: (result: SnackbarResult) => void;
}

/** Props for the pure `Snackbar` display component. */
export interface SnackbarProps {
	/** Runtime data including message, actions, and resolve callback. */
	data: SnackbarData;
	/** Additional className merged onto the snackbar container. */
	className?: string;
}

/** Props for the `SnackbarHost` component. */
export interface SnackbarHostProps {
	/** State returned by `useSnackbarState()`. */
	state: UseSnackbarStateReturn;
	/** Additional className applied to the fixed host wrapper. */
	className?: string;
}

// ─── Internal Queue Item ──────────────────────────────────────────────────────

interface QueueItem {
	visuals: SnackbarVisuals;
	resolve: (result: SnackbarResult) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveDuration(duration: SnackbarDuration | undefined): number {
	if (duration === undefined) return DURATION_MAP.short;
	if (typeof duration === "number") return duration;
	return DURATION_MAP[duration];
}

function generateId(): string {
	return typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2);
}

function toSnackbarData(item: QueueItem): SnackbarData {
	return { id: generateId(), visuals: item.visuals, resolve: item.resolve };
}

// ─── useSnackbarState hook ────────────────────────────────────────────────────

/** Return type of `useSnackbarState`. */
export interface UseSnackbarStateReturn {
	/** Currently visible snackbar data, or `null` when idle. */
	current: SnackbarData | null;
	/**
	 * Show a snackbar with the given visuals.
	 * Returns a promise that resolves when the snackbar is dismissed or the action is triggered.
	 */
	showSnackbar: (visuals: SnackbarVisuals) => Promise<SnackbarResult>;
	/** Internal dismiss handler — called by `SnackbarHost`. */
	_dismiss: (result: SnackbarResult) => void;
}

/**
 * Low-level hook that manages the snackbar queue and current state.
 *
 * Uses a `ref`-based queue (mutex pattern) so that enqueueing never
 * triggers a re-render storm — only the state transition does.
 *
 * @example
 * ```tsx
 * // Used internally by SnackbarProvider
 * const state = useSnackbarState();
 * return <SnackbarHost state={state} />;
 * ```
 */
export function useSnackbarState(): UseSnackbarStateReturn {
	const [current, setCurrent] = React.useState<SnackbarData | null>(null);
	const queueRef = React.useRef<QueueItem[]>([]);

	const showSnackbar = React.useCallback(
		(visuals: SnackbarVisuals): Promise<SnackbarResult> => {
			return new Promise<SnackbarResult>((resolve) => {
				const item: QueueItem = { visuals, resolve };
				setCurrent((prev) => {
					if (prev === null) return toSnackbarData(item);
					queueRef.current.push(item);
					return prev;
				});
			});
		},
		[],
	);

	const _dismiss = React.useCallback((result: SnackbarResult) => {
		setCurrent((prev) => {
			if (prev) prev.resolve(result);
			const next = queueRef.current.shift();
			return next ? toSnackbarData(next) : null;
		});
	}, []);

	React.useEffect(() => {
		return () => {
			for (const item of queueRef.current) {
				item.resolve(RESULT.DISMISSED);
			}
			queueRef.current = [];
		};
	}, []);

	return { current, showSnackbar, _dismiss };
}

// ─── Snackbar (Pure Display Component) ───────────────────────────────────────

/**
 * MD3 Expressive Snackbar — pure display component.
 *
 * Renders a single snackbar with message, optional action button, and
 * optional dismiss icon button. Handles its own auto-dismiss timer.
 *
 * @remarks
 * - Uses `role="status"` + `aria-live="polite"` for screen reader announcements.
 * - All entrance/exit animation is handled by the parent `SnackbarHost` via
 *   `AnimatePresence` + `SNACKBAR_ANIM`.
 * - Do NOT render this component directly — use `SnackbarHost`.
 *
 * @example
 * ```tsx
 * // Internal usage inside SnackbarHost — not for direct use
 * <Snackbar data={currentSnackbarData} />
 * ```
 */
export const Snackbar = React.memo(function Snackbar({
	data,
	className,
}: SnackbarProps) {
	const { visuals, resolve } = data;
	const {
		message,
		actionLabel,
		withDismissAction = false,
		actionOnNewLine = false,
		duration,
	} = visuals;

	const reducedMotion = useReducedMotion();
	const durationMs = resolveDuration(duration);

	React.useEffect(() => {
		const timer = setTimeout(() => resolve(RESULT.DISMISSED), durationMs);
		return () => clearTimeout(timer);
	}, [resolve, durationMs]);

	const handleAction = React.useCallback(
		() => resolve(RESULT.ACTION),
		[resolve],
	);

	const handleDismiss = React.useCallback(
		() => resolve(RESULT.DISMISSED),
		[resolve],
	);

	const hasActions = actionLabel || withDismissAction;
	const anim = reducedMotion ? REDUCED_MOTION_ANIM : SNACKBAR_ANIM;

	return (
		<m.div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			{...anim}
			className={cn(
				"flex items-center gap-2",
				"min-w-72 max-w-142 w-max",
				"rounded-sm px-4 py-3 shadow-md",
				"text-m3-inverse-on-surface bg-m3-inverse-surface",
				actionOnNewLine ? "flex-col items-start" : "flex-row",
				className,
				visuals.className,
			)}
		>
			<span className="flex-1 text-sm leading-5 font-normal">{message}</span>

			{hasActions && (
				<div
					className={cn(
						"flex shrink-0 items-center gap-1",
						actionOnNewLine && "self-end",
					)}
				>
					{actionLabel && (
						<button
							type="button"
							onClick={handleAction}
							className={cn(
								"text-sm font-medium",
								"px-2 py-1 rounded-sm",
								"focus-visible:outline-none focus-visible:ring-2",
								"transition-colors whitespace-nowrap",
								"text-m3-inverse-primary",
							)}
						>
							{actionLabel}
						</button>
					)}

					{withDismissAction && (
						<IconButton
							size="sm"
							colorStyle="filled"
							aria-label="Dismiss notification"
							onClick={handleDismiss}
							className="text-m3-inverse-on-surface bg-m3-inverse-surface"
						>
							<Icon name="close" aria-hidden="true" />
						</IconButton>
					)}
				</div>
			)}
		</m.div>
	);
});

Snackbar.displayName = "Snackbar";

// ─── SnackbarHost ─────────────────────────────────────────────────────────────

/**
 * MD3 SnackbarHost — renders the AnimatePresence container for snackbar queue.
 *
 * Place this once in your app layout. It will show snackbars one at a time,
 * dequeuing the next one as each dismisses.
 *
 * @example
 * ```tsx
 * // Typically used inside SnackbarProvider — not directly
 * const state = useSnackbarState();
 * <SnackbarHost state={state} />
 * ```
 */
export function SnackbarHost({ state, className }: SnackbarHostProps) {
	const { current, _dismiss } = state;

	const wrappedData = React.useMemo<SnackbarData | null>(() => {
		if (!current) return null;
		return { ...current, resolve: _dismiss };
	}, [current, _dismiss]);

	return (
		<LazyMotion features={domMax} strict>
			<section
				aria-label="Snackbar notifications"
				className={cn(
					"fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
					"flex flex-col items-center pointer-events-none",
					className,
				)}
			>
				<AnimatePresence mode="wait">
					{wrappedData && (
						<div key={wrappedData.id} className="pointer-events-auto">
							<Snackbar data={wrappedData} />
						</div>
					)}
				</AnimatePresence>
			</section>
		</LazyMotion>
	);
}

SnackbarHost.displayName = "SnackbarHost";

// ─── Context ──────────────────────────────────────────────────────────────────

interface SnackbarContextValue {
	showSnackbar: (visuals: SnackbarVisuals) => Promise<SnackbarResult>;
}

export const SnackbarContext = React.createContext<SnackbarContextValue | null>(null);

// ─── SnackbarProvider ─────────────────────────────────────────────────────────

/**
 * MD3 SnackbarProvider — context provider for imperative snackbar API.
 *
 * Wrap your application (or a section of it) with this provider.
 * Then use `useSnackbar()` in any descendant to show snackbars.
 *
 * @example
 * ```tsx
 * // In your root layout:
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 *
 * // In any component:
 * const { showSnackbar } = useSnackbar();
 * await showSnackbar({ message: 'Saved!', actionLabel: 'Undo' });
 * ```
 */
export function SnackbarProvider({ children }: { children: React.ReactNode }) {
	const state = useSnackbarState();

	const contextValue = React.useMemo<SnackbarContextValue>(
		() => ({ showSnackbar: state.showSnackbar }),
		[state.showSnackbar],
	);

	return (
		<SnackbarContext.Provider value={contextValue}>
			{children}
			<SnackbarHost state={state} />
		</SnackbarContext.Provider>
	);
}

SnackbarProvider.displayName = "SnackbarProvider";

// ─── useSnackbar hook ─────────────────────────────────────────────────────────

/**
 * Hook that returns the `showSnackbar` function from the nearest `SnackbarProvider`.
 *
 * @throws {Error} if used outside of a `SnackbarProvider`.
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { showSnackbar } = useSnackbar();
 *
 *   const handleSave = async () => {
 *     const result = await showSnackbar({
 *       message: 'Changes saved',
 *       actionLabel: 'Undo',
 *     });
 *     if (result === 'action-performed') undoSave();
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useSnackbar(): SnackbarContextValue {
	const ctx = React.useContext(SnackbarContext);
	if (!ctx) {
		throw new Error("useSnackbar must be used within a <SnackbarProvider>.");
	}
	return ctx;
}
