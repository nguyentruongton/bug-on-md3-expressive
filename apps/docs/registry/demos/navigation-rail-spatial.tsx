"use client";

import {
	FAB,
	Icon,
	NavigationRail,
	NavigationRailItem,
} from "@bug-on/md3-react";
import * as React from "react";

export default function NavigationRailSpatialDemo() {
	const [active, setActive] = React.useState("home");

	return (
		<div className="flex h-120 w-full rounded-xl overflow-hidden bg-m3-surface-container-low border border-m3-outline-variant/30 relative shadow-inner">
			{/* Simulated Window/Depth Area — Visual only */}
			<div className="absolute inset-0 bg-linear-to-b from-m3-primary/5 via-transparent to-m3-tertiary/5" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 blur-3xl rounded-full" />

			<div className="relative z-10 flex h-full w-full items-center pl-10">
				{/* 
					The Spatial Rail — xr="spatialized"
					In spatialized mode, the Rail and FAB are detached from the edge 
					and from each other if narrow=true 
				*/}
				<NavigationRail
					variant="xr"
					fabPlacement="spatialized"
					narrow
					fab={
						<FAB
							icon={<Icon name="add" />}
							colorStyle="primary"
							size="md"
							lowered
						/>
					}
				>
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
						icon={<Icon name="account_circle" />}
						label="Profile"
						selected={active === "profile"}
						onClick={() => setActive("profile")}
					/>
				</NavigationRail>

				{/* Dummy XR Info Area */}
				<div className="flex flex-col flex-1 items-center justify-center p-8">
					<div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[48px] shadow-2xl border border-white/10 max-w-sm w-full text-center">
						<div className="inline-flex items-center justify-center size-14 rounded-2xl bg-m3-surface-container-highest mb-4 shadow-sm border border-white/5">
							<Icon
								name="spatial_audio_off"
								className="size-8 text-m3-primary"
							/>
						</div>
						<h2 className="text-2xl font-semibold text-m3-on-surface mb-2 tracking-tight">
							Spatialized Layout
						</h2>
						<p className="text-m3-on-surface-variant text-sm balance leading-relaxed opacity-80">
							In <code>spatialized</code> mode, the navigation rail is elevated
							further from the canvas. The FAB is detached from the rail
							container, creating an ergonomic "island" architecture suitable
							for XR/Spatial interfaces.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
