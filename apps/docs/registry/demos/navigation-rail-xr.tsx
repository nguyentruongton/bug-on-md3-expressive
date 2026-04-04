import { Icon, NavigationRail, NavigationRailItem } from "@bug-on/md3-react";
import * as React from "react";

export default function NavigationRailXRDemo() {
	const [active, setActive] = React.useState("home");

	return (
		<div className="flex h-100 w-full rounded-xl overflow-hidden bg-linear-to-br from-m3-primary/20 via-m3-surface-container-lowest to-m3-tertiary/20 relative shadow-inner">
			{/* Simulated Spatial Background Pattern */}
			<div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-m3-on-surface via-m3-surface to-transparent" />

			<div className="relative z-10 flex h-full w-full">
				{/* The XR Rail */}
				<NavigationRail variant="collapsed" xr="contained">
					<NavigationRailItem
						icon={<Icon name="home" />}
						label="Home"
						selected={active === "home"}
						onClick={() => setActive("home")}
					/>
					<NavigationRailItem
						icon={<Icon name="search" />}
						label="Search"
						selected={active === "search"}
						onClick={() => setActive("search")}
					/>
					<NavigationRailItem
						icon={<Icon name="widgets" />}
						label="Apps"
						selected={active === "apps"}
						onClick={() => setActive("apps")}
					/>
					<NavigationRailItem
						icon={<Icon name="settings" />}
						label="Settings"
						selected={active === "settings"}
						onClick={() => setActive("settings")}
					/>
				</NavigationRail>

				{/* Dummy Content Area */}
				<div className="flex flex-col flex-1 items-center justify-center p-8">
					<div className="bg-m3-surface/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-m3-outline-variant/30 max-w-sm w-full text-center">
						<Icon
							name="view_in_ar"
							className="size-16 mx-auto text-m3-primary mb-4"
						/>
						<h2 className="text-2xl font-semibold text-m3-on-surface mb-2">
							Spatial UI Layout
						</h2>
						<p className="text-m3-on-surface-variant text-sm balance">
							The XR rail is an elevated, floating pill that detaches from the
							screen edges, offering an ergonomic and immersive spatial
							navigation experience.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
