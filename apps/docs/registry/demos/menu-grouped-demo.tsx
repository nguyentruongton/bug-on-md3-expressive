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

export default function MenuGroupedDemo() {
	return (
		<div className="flex h-95 items-center justify-center">
			<Menu>
				<MenuTrigger asChild>
					<Button colorStyle="outlined">Account Menu</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuGroup index={0} count={3}>
						<MenuItem supportingText="john.doe@example.com">John Doe</MenuItem>
					</MenuGroup>

					<MenuDivider />

					<MenuGroup index={1} count={3}>
						<MenuItem>Profile</MenuItem>
						<MenuItem>Settings</MenuItem>
						<MenuItem>Billing</MenuItem>
					</MenuGroup>

					<MenuDivider />

					<MenuGroup index={2} count={3}>
						<MenuItem>Help & Feedback</MenuItem>
						<MenuItem>Sign out</MenuItem>
					</MenuGroup>
				</MenuContent>
			</Menu>
		</div>
	);
}
