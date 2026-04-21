"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuTrigger,
	VerticalMenuGroup,
} from "@bug-on/md3-react";
import * as React from "react";

export default function MenuSelectionDemo() {
	const [sortBy, setSortBy] = React.useState("date");
	const [showHidden, setShowHidden] = React.useState(false);
	const [showExtensions, setShowExtensions] = React.useState(true);

	const baselineContent = (
		<>
			<MenuGroup label="Sort by">
				<MenuItem
					selected={sortBy === "name"}
					onClick={() => setSortBy("name")}
					leadingIcon={<Icon name="label" size={20} />}
					keepOpen
				>
					Name
				</MenuItem>
				<MenuItem
					selected={sortBy === "date"}
					onClick={() => setSortBy("date")}
					leadingIcon={<Icon name="calendar_today" size={20} />}
					keepOpen
				>
					Date Modified
				</MenuItem>
				<MenuItem
					selected={sortBy === "size"}
					onClick={() => setSortBy("size")}
					leadingIcon={<Icon name="straighten" size={20} />}
					keepOpen
				>
					Size
				</MenuItem>
			</MenuGroup>
			<MenuDivider />
			<MenuGroup label="View">
				<MenuItem
					selected={showHidden}
					onClick={() => setShowHidden((prev) => !prev)}
					leadingIcon={<Icon name="visibility" size={20} />}
					keepOpen
				>
					Show hidden files
				</MenuItem>
				<MenuItem
					selected={showExtensions}
					onClick={() => setShowExtensions((prev) => !prev)}
					leadingIcon={<Icon name="description" size={20} />}
					keepOpen
				>
					Show file extensions
				</MenuItem>
			</MenuGroup>
		</>
	);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12 lg:flex-row lg:items-start">
			{/* Baseline Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Baseline (Standard)
				</span>
				<Menu variant="baseline">
					<MenuTrigger asChild>
						<Button colorStyle="tonal">View Options</Button>
					</MenuTrigger>
					<MenuContent>{baselineContent}</MenuContent>
				</Menu>
			</div>

			{/* Expressive Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Vertical (Expressive)
				</span>
				<Menu variant="expressive">
					<MenuTrigger asChild>
						<Button colorStyle="tonal">View Options</Button>
					</MenuTrigger>
					<MenuContent>
						<VerticalMenuGroup label="Sort by">
							<MenuItem
								selected={sortBy === "name"}
								onClick={() => setSortBy("name")}
								leadingIcon={<Icon name="label" size={20} />}
								keepOpen
							>
								Name
							</MenuItem>
							<MenuItem
								selected={sortBy === "date"}
								onClick={() => setSortBy("date")}
								leadingIcon={<Icon name="calendar_today" size={20} />}
								keepOpen
							>
								Date Modified
							</MenuItem>
							<MenuItem
								selected={sortBy === "size"}
								onClick={() => setSortBy("size")}
								leadingIcon={<Icon name="straighten" size={20} />}
								keepOpen
							>
								Size
							</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup label="View">
							<MenuItem
								selected={showHidden}
								onClick={() => setShowHidden((prev) => !prev)}
								leadingIcon={<Icon name="visibility" size={20} />}
								keepOpen
							>
								Show hidden files
							</MenuItem>
							<MenuItem
								selected={showExtensions}
								onClick={() => setShowExtensions((prev) => !prev)}
								leadingIcon={<Icon name="description" size={20} />}
								keepOpen
							>
								Show file extensions
							</MenuItem>
						</VerticalMenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
