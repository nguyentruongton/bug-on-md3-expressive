"use client";

import { Icon, NavigationBar, NavigationBarItem } from "@bug-on/md3-react";
import { useState } from "react";

export default function NavigationBarBaselineDemo() {
	const [active, setActive] = useState("home");

	return (
		<div className="relative w-full h-100 border border-m3-outline-variant rounded-xl overflow-hidden bg-m3-surface flex flex-col justify-end">
			<NavigationBar variant="baseline" elevated fixed={false}>
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
					selected={active === "library"}
					onClick={() => setActive("library")}
					icon={<Icon name="video_library" />}
					label="Library"
				/>
			</NavigationBar>
		</div>
	);
}
