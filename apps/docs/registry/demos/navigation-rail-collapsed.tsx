import {
	FAB,
	Icon,
	NavigationRail,
	NavigationRailItem,
} from "@bug-on/md3-react";
import * as React from "react";

export default function NavigationRailCollapsedDemo() {
	const [active, setActive] = React.useState("home");

	return (
		<div className="flex h-150 w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface-container-lowest">
			{/* The Rail */}
			<NavigationRail
				variant="collapsed"
				fab={
					<FAB
						icon={<Icon name="edit" className="size-6" />}
						colorStyle="tertiary"
						size="sm"
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

			{/* Dummy Content Area */}
			<div className="flex-1 p-6">
				<h2 className="text-2xl font-semibold text-m3-on-surface mb-4">
					Collapsed Rail
				</h2>
				<p className="text-m3-on-surface-variant">
					The collapsed Navigation Rail displays items as icons. Labels appear
					only when selected or explicitly focused.
				</p>
			</div>
		</div>
	);
}
