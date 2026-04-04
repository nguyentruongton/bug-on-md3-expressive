"use client";

import {
	Icon,
	NavigationRail,
	NavigationRailItem,
	type NavigationRailLabelVisibility,
} from "@bug-on/md3-react";
import * as React from "react";

export default function NavigationRailLabelVisibilityDemo() {
	const [active, setActive] = React.useState("home");
	const [visibility, setVisibility] =
		React.useState<NavigationRailLabelVisibility>("labeled");

	return (
		<div className="flex h-150 w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface-container-lowest">
			{/* The Rail */}
			<NavigationRail variant="collapsed" labelVisibility={visibility}>
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
					icon={<Icon name="group" />}
					label="People"
					selected={active === "people"}
					onClick={() => setActive("people")}
					badge="3"
				/>
				<NavigationRailItem
					icon={<Icon name="settings" />}
					label="Settings"
					selected={active === "settings"}
					onClick={() => setActive("settings")}
				/>
			</NavigationRail>

			{/* Content Area with Controls */}
			<div className="flex-1 p-6 border-l border-m3-outline-variant">
				<h2 className="text-2xl font-semibold text-m3-on-surface mb-4">
					Label Visibility
				</h2>
				<p className="text-m3-on-surface-variant mb-6">
					In collapsed mode, you can control how labels are displayed. This is
					useful for balancing clarity and space efficiency.
				</p>

				<div className="space-y-4">
					<p className="text-sm font-medium text-m3-on-surface">
						Select Visibility Mode:
					</p>
					<div className="flex flex-wrap gap-2">
						{(["labeled", "auto", "unlabeled"] as const).map((mode) => (
							<button
								key={mode}
								type="button"
								onClick={() => setVisibility(mode)}
								className={`
									px-4 py-2 rounded-full text-sm font-medium transition-colors
									${
										visibility === mode
											? "bg-m3-primary text-m3-on-primary shadow-sm"
											: "bg-m3-surface-container-high text-m3-on-surface-variant hover:bg-m3-surface-container-highest"
									}
								`}
							>
								{mode.charAt(0).toUpperCase() + mode.slice(1)}
							</button>
						))}
					</div>
				</div>

				<div className="mt-8 p-4 bg-m3-surface-container rounded-2xl border border-m3-outline-variant/30">
					<h3 className="text-sm font-bold text-m3-primary mb-2 uppercase tracking-wider">
						Behavior:
					</h3>
					<ul className="text-sm text-m3-on-surface-variant space-y-2 list-disc pl-4">
						{visibility === "labeled" && (
							<li>
								<strong>Labeled</strong>: Text labels are always visible for all
								items. Most accessible but takes more vertical space.
							</li>
						)}
						{visibility === "auto" && (
							<li>
								<strong>Auto</strong>: Only the selected item shows its label.
								This provides immediate context for the current destination
								while saving vertical space.
							</li>
						)}
						{visibility === "unlabeled" && (
							<li>
								<strong>Unlabeled</strong>: Icons only. Best used when icons are
								highly recognizable (e.g., standard symbols).
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
