"use client";

import { Icon, NavigationBar, NavigationBarItem } from "@bug-on/md3-react";
import { useState } from "react";

export default function NavigationBarXrDemo() {
	const [active, setActive] = useState("home");

	return (
		<div className="relative w-full h-100 border border-m3-outline-variant rounded-xl overflow-hidden bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center flex flex-col justify-end p-4">
			{/* Simulated Spatial Panel Content */}
			<div className="absolute inset-0 bg-black/20" />
			<div className="relative z-0 h-full flex items-center justify-center pointer-events-none">
				<div className="bg-m3-surface/80 backdrop-blur-md px-8 py-4 rounded-3xl text-m3-on-surface text-center">
					<h3 className="text-xl font-bold mb-2">Immersive Mode</h3>
					<p className="opacity-80">Spatial orbiter navigation</p>
				</div>
			</div>

			<NavigationBar
				variant="xr"
				fixed={false}
				elevated
				className="backdrop-blur-xl bg-m3-surface/80"
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
