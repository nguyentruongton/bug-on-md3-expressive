"use client";

import {
	FAB,
	Icon,
	IconButton,
	NavigationRail,
	NavigationRailItem,
} from "@bug-on/md3-react";
import * as React from "react";

export default function NavigationRailCollapseExpandDemo() {
	const [active, setActive] = React.useState("home");
	const [isExpanded, setIsExpanded] = React.useState(false);

	return (
		<div className="flex h-150 w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface-container-lowest">
			{/* The Rail — animates width on collapse/expand */}
			<NavigationRail
				variant={isExpanded ? "expanded" : "collapsed"}
				header={
					<IconButton
						variant="toggle"
						selected={isExpanded}
						aria-label={
							isExpanded ? "Collapse navigation" : "Expand navigation"
						}
						onClick={() => setIsExpanded((v) => !v)}
					>
						<Icon
							name={isExpanded ? "menu_open" : "menu"}
							fill={isExpanded ? 1 : 0}
							animateFill
						/>
					</IconButton>
				}
				fab={
					<FAB
						icon={<Icon name="edit" className="size-6" />}
						colorStyle="tertiary"
						size={isExpanded ? "md" : "sm"}
						extended={isExpanded}
						lowered
					>
						Compose
					</FAB>
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

			{/* Content Area */}
			<div className="flex-1 p-6 border-l border-m3-outline-variant">
				<h2 className="text-2xl font-semibold text-m3-on-surface mb-4">
					Collapse / Expand Rail
				</h2>
				<p className="text-m3-on-surface-variant max-w-xl">
					Click the menu icon in the header to toggle between collapsed and
					expanded states. The active indicator and labels animate smoothly
					during the transition.
				</p>
				<p className="mt-3 text-sm text-m3-on-surface-variant">
					Current state:{" "}
					<span className="font-semibold text-m3-primary">
						{isExpanded ? "Expanded" : "Collapsed"}
					</span>
				</p>
			</div>
		</div>
	);
}
