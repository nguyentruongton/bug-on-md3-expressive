"use client";

import {
	Icon,
	NavigationBar,
	NavigationBarItem,
	ScrollArea,
} from "@bug-on/md3-react";
import { useRef, useState } from "react";

export default function NavigationBarHideOnScrollDemo() {
	const [active, setActive] = useState("home");
	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative w-full h-100 border border-m3-outline-variant rounded-xl bg-m3-surface overflow-hidden">
			<ScrollArea
				viewportRef={scrollRef}
				className="h-full"
				viewportClassName="p-4 flex flex-col gap-4 pb-20"
			>
				<h3 className="text-xl font-bold">Scroll down to hide</h3>
				<p>
					The navigation bar will hide when scrolling down, and appear when
					scrolling up. Screen reader users will always see it.
				</p>
				{["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id) => (
					<div
						key={id}
						className="h-20 bg-m3-surface-container rounded-xl w-full mb-1"
					/>
				))}
			</ScrollArea>

			<NavigationBar
				variant="flexible"
				hideOnScroll
				fixed={false}
				scrollContainerRef={scrollRef}
			>
				<NavigationBarItem
					selected={active === "home"}
					onClick={() => setActive("home")}
					icon={<Icon name="home" />}
					label="Home"
				/>
				<NavigationBarItem
					selected={active === "explore"}
					onClick={() => setActive("explore")}
					icon={<Icon name="explore" />}
					label="Explore"
				/>
				<NavigationBarItem
					selected={active === "subscriptions"}
					onClick={() => setActive("subscriptions")}
					icon={<Icon name="subscriptions" />}
					label="Subscriptions"
				/>
			</NavigationBar>
		</div>
	);
}
