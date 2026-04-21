"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function MenuSupportingTextDemo() {
	const content = (
		<>
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
		</>
	);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12 md:flex-row md:items-start">
			{/* Baseline Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Baseline (Standard)
				</span>
				<Menu variant="baseline">
					<MenuTrigger asChild>
						<Button colorStyle="text">Choose Option</Button>
					</MenuTrigger>
					<MenuContent>{content}</MenuContent>
				</Menu>
			</div>

			{/* Expressive Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Vertical (Expressive)
				</span>
				<Menu variant="expressive">
					<MenuTrigger asChild>
						<Button colorStyle="text">Choose Option</Button>
					</MenuTrigger>
					<MenuContent>
						<VerticalMenuGroup>{content}</VerticalMenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
