import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../lib/utils";

interface ToCItem {
	id: string;
	label: string;
}

interface TableOfContentsProps {
	items: ToCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState("");

	// Stabilize dependency to avoid re-subscribing on every render
	const itemIds = useMemo(() => items.map((i) => i.id), [items]);

	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveId(entry.target.id);
				}
			},
			{ rootMargin: "-100px 0% -80% 0%" },
		);

		for (const id of itemIds) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, [itemIds]);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<nav
			aria-label="On this page"
			className="hidden xl:block sticky top-24 self-start w-64 ml-12 border-l border-m3-surface-variant pl-6"
		>
			<h4 className="text-xs font-bold text-m3-on-surface-variant uppercase tracking-widest mb-4">
				On this page
			</h4>
			<ul className="space-y-4">
				{items.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							onClick={(e) => handleClick(e, item.id)}
							aria-current={activeId === item.id ? "true" : undefined}
							className={cn(
								"text-sm transition-colors hover:text-m3-primary block",
								activeId === item.id
									? "text-m3-primary font-bold"
									: "text-m3-on-surface-variant font-medium",
							)}
						>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
