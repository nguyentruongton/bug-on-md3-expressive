import * as React from "react";

/**
 * Focuses `inputRef` when `active` becomes true, using a double-rAF
 * to wait for Framer Motion's layout animation to finish painting.
 */
export function useSearchViewFocus(
	inputRef: React.RefObject<HTMLInputElement | null>,
	active: boolean,
): void {
	React.useEffect(() => {
		if (!active) return;
		let raf2: number;
		const raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		});
		return () => {
			cancelAnimationFrame(raf1);
			if (raf2) cancelAnimationFrame(raf2);
		};
	}, [active, inputRef]);
}
