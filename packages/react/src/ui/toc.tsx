import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

interface ToCItem {
	id: string;
	label: string;
}

interface TableOfContentsProps {
	items: ToCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{ rootMargin: "-100px 0% -80% 0%" },
		);

		for (const item of items) {
			const element = document.getElementById(item.id);
			if (element) observer.observe(element);
		}

		return () => observer.disconnect();
	}, [items]);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			const offset = 100;
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	return (
		<nav className="hidden xl:block sticky top-24 self-start w-64 ml-12 border-l border-m3-surface-variant pl-6">
			<h4 className="text-xs font-bold text-m3-on-surface-variant uppercase tracking-widest mb-4">
				On this page
			</h4>
			<ul className="space-y-4">
				{items.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							onClick={(e) => handleClick(e, item.id)}
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
