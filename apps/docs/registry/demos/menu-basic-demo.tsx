"use client";

import {
	Button,
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from "@bug-on/md3-react";

export default function MenuBasicDemo() {
	return (
		<div className="flex h-64 items-center justify-center">
			<Menu>
				<MenuTrigger asChild>
					<Button colorStyle="filled">Open Menu</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem>Edit</MenuItem>
					<MenuItem>Duplicate</MenuItem>
					<MenuItem>Share</MenuItem>
					<MenuItem disabled>Archive</MenuItem>
					<MenuItem>Delete</MenuItem>
				</MenuContent>
			</Menu>
		</div>
	);
}
