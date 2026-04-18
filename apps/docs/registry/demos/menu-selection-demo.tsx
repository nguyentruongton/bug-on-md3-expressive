"use client";

import {
	Button,
	Menu,
	MenuContent,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuTrigger,
} from "@bug-on/md3-react";
import * as React from "react";

export default function MenuSelectionDemo() {
	const [sortBy, setSortBy] = React.useState("date");
	const [showHidden, setShowHidden] = React.useState(false);
	const [showExtensions, setShowExtensions] = React.useState(true);

	return (
		<div className="flex h-80 items-center justify-center">
			<Menu>
				<MenuTrigger asChild>
					<Button colorStyle="tonal">View Options</Button>
				</MenuTrigger>
				<MenuContent>
					{/* Single Select Group */}
					<MenuGroup label="Sort by">
						<MenuItem
							selected={sortBy === "name"}
							onClick={() => setSortBy("name")}
						>
							Name
						</MenuItem>
						<MenuItem
							selected={sortBy === "date"}
							onClick={() => setSortBy("date")}
						>
							Date Modified
						</MenuItem>
						<MenuItem
							selected={sortBy === "size"}
							onClick={() => setSortBy("size")}
						>
							Size
						</MenuItem>
					</MenuGroup>

					<MenuDivider />

					{/* Multi Select Group */}
					<MenuGroup label="View">
						<MenuItem
							selected={showHidden}
							onClick={() => setShowHidden((prev) => !prev)}
							keepOpen
						>
							Show hidden files
						</MenuItem>
						<MenuItem
							selected={showExtensions}
							onClick={() => setShowExtensions((prev) => !prev)}
							keepOpen
						>
							Show file extensions
						</MenuItem>
					</MenuGroup>
				</MenuContent>
			</Menu>
		</div>
	);
}
