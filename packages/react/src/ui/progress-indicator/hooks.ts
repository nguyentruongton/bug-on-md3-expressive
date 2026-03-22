import * as React from "react";

export function useContainerWidth() {
	const [width, setWidth] = React.useState(0);
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		if (!ref.current) return;
		const obs = new ResizeObserver((entries) => {
			setWidth(entries[0].contentRect.width);
		});
		obs.observe(ref.current);
		return () => obs.disconnect();
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
