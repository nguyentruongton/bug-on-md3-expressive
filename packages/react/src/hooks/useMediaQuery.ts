"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — Responsive hook chuẩn SSR-safe
 *
 * Tránh hydration mismatch bằng cách khởi tạo với `false`.
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(query);
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

		setMatches(mql.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, [query]);

	return matches;
}
