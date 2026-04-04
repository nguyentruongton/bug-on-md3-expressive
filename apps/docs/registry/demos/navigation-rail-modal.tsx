"use client";

import {
	Button,
	FAB,
	Icon,
	NavigationRail,
	NavigationRailItem,
} from "@bug-on/md3-react";
import * as React from "react";

export default function NavigationRailModalDemo() {
	const [active, setActive] = React.useState("home");
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<div className="relative flex h-150 w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface-container-lowest">
			{/* Rail - Modal variant */}
			<NavigationRail
				variant="modal"
				open={isOpen}
				onClose={() => setIsOpen(false)}
				header={
					<div className="px-4 w-full flex items-center justify-between">
						<FAB
							icon={<Icon name="edit" className="size-6" />}
							colorStyle="primary"
							size="md"
							extended
						>
							Compose
						</FAB>
					</div>
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
			<div className="flex-1 flex flex-col p-6 items-start gap-4">
				<h2 className="text-2xl font-semibold text-m3-on-surface">
					Modal Nav Rail
				</h2>
				<p className="text-m3-on-surface-variant max-w-xl">
					For compact screens, you can display a Navigation Rail as a Modal. It
					overlays the content and displays a backdrop. Click outside to
					dismiss.
				</p>
				<Button
					colorStyle="filled"
					icon={<Icon name="menu" />}
					onClick={() => setIsOpen(true)}
				>
					Open Modal Rail
				</Button>
			</div>
		</div>
	);
}
