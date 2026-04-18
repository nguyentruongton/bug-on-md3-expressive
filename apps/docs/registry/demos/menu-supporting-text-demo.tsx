"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from "@bug-on/md3-react";

export default function MenuSupportingTextDemo() {
	return (
		<div className="flex h-64 items-center justify-center">
			<Menu>
				<MenuTrigger asChild>
					<Button colorStyle="text">Choose Option</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem
						leadingIcon={<Icon name="cloud_upload" />}
						supportingText="Save to Google Drive"
					>
						Upload to Cloud
					</MenuItem>
					<MenuItem
						leadingIcon={<Icon name="hard_drive" />}
						supportingText="Save to your device"
					>
						Download Local
					</MenuItem>
				</MenuContent>
			</Menu>
		</div>
	);
}
