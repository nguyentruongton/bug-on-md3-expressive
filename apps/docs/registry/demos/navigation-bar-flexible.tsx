"use client";

import { Icon, NavigationBar, NavigationBarItem } from "@bug-on/md3-react";
import { useState } from "react";

export default function NavigationBarFlexibleDemo() {
	const [active, setActive] = useState("home");

	return (
		<div className="relative w-full h-100 border border-m3-outline-variant rounded-xl overflow-hidden bg-m3-surface flex flex-col justify-end">
			<NavigationBar variant="flexible" fixed={false}>
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
					badge=""
				/>
				<NavigationBarItem
					selected={active === "subscriptions"}
					onClick={() => setActive("subscriptions")}
					icon={<Icon name="subscriptions" />}
					label="Subscriptions"
					badge="3"
				/>
				<NavigationBarItem
					selected={active === "library"}
					onClick={() => setActive("library")}
					icon={<Icon name="video_library" />}
					label="Library"
				/>
			</NavigationBar>
		</div>
	);
}
