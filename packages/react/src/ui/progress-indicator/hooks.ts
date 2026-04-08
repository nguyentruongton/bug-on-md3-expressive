import * as React from "react";

export function useContainerWidth() {
	const [width, setWidth] = React.useState(0);
	const observerRef = React.useRef<ResizeObserver | null>(null);

	const ref = React.useCallback((node: HTMLDivElement | null) => {
		if (observerRef.current) {
			observerRef.current.disconnect();
			observerRef.current = null;
		}

		if (node) {
			const obs = new ResizeObserver((entries) => {
				const contentRect = entries[0].contentRect;
				setWidth(contentRect.width);
			});
			obs.observe(node);
			observerRef.current = obs;
		}
	}, []);

	// Cleanup on unmount
	React.useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	return [ref, width] as const;
}

export function useMergedRef<T>(
	...refs: (React.Ref<T> | undefined | null)[]
): React.RefCallback<T> {
	return React.useCallback(
		(node: T | null) => {
			for (const ref of refs) {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref && typeof ref === "object") {
					(ref as React.MutableRefObject<T | null>).current = node;
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[refs],
	);
}
