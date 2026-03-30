"use client";

import { useEffect } from "react";
import { useToc } from "@/lib/toc-context";

interface TocRegistrarProps {
	items: { id: string; label: string }[];
}

/**
 * Client component that registers TOC items with the global TocContext.
 * Clears items on unmount (route change), so pages without TOC show nothing.
 */
export function TocRegistrar({ items }: TocRegistrarProps) {
	const { setItems } = useToc();

	useEffect(() => {
		setItems(items);
		return () => setItems([]);
	}, [items, setItems]);

	return null;
}
