import { useEffect, useRef } from "react";

/**
 * Hook to detect clicks outside of a specified element.
 *
 * @param handler - Callback function to execute when a click outside occurs.
 * @param enabled - Whether the listener is active.
 * @returns A RefObject to be attached to the target element.
 */
export function useClickOutside<T extends HTMLElement>(
	handler: () => void,
	enabled = true,
) {
	const ref = useRef<T>(null);

	useEffect(() => {
		if (!enabled) return;

		const listener = (event: MouseEvent | TouchEvent) => {
			const el = ref.current;
			if (!el || el.contains(event.target as Node)) {
				return;
			}
			handler();
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [handler, enabled]);

	return ref;
}
