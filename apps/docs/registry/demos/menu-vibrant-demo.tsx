"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from "@bug-on/md3-react";

export default function MenuVibrantDemo() {
	return (
		<div className="flex h-64 items-center justify-center">
			<Menu colorVariant="vibrant">
				<MenuTrigger asChild>
					<Button colorStyle="filled">High Emphasis Actions</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem leadingIcon={<Icon name="add" />}>
						Create new item
					</MenuItem>
					<MenuItem leadingIcon={<Icon name="group_add" />}>
						Invite members
					</MenuItem>
					<MenuItem leadingIcon={<Icon name="campaign" />}>
						Start campaign
					</MenuItem>
				</MenuContent>
			</Menu>
		</div>
	);
}
