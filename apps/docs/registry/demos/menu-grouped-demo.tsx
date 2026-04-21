"use client";

import {
	Button,
	Menu,
	MenuContent,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuTrigger,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function MenuGroupedDemo() {
	const baselineContent = (
		<>
			<MenuGroup label="Account">
				<MenuItem supportingText="john.doe@example.com">John Doe</MenuItem>
			</MenuGroup>
			<MenuDivider />
			<MenuGroup label="General">
				<MenuItem>Profile</MenuItem>
				<MenuItem>Settings</MenuItem>
				<MenuItem>Billing</MenuItem>
			</MenuGroup>
			<MenuDivider />
			<MenuGroup>
				<MenuItem>Help &amp; Feedback</MenuItem>
				<MenuItem>Sign out</MenuItem>
			</MenuGroup>
		</>
	);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12 lg:flex-row lg:items-start">
			{/* Baseline Popup Variant (using Dividers) */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Baseline (Dividers)
				</span>
				<Menu variant="baseline">
					<MenuTrigger asChild>
						<Button colorStyle="outlined">Account Menu</Button>
					</MenuTrigger>
					<MenuContent>{baselineContent}</MenuContent>
				</Menu>
			</div>

			{/* Expressive Popup Variant (Gap Variant) */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Vertical (Expressive Gaps)
				</span>
				<Menu variant="expressive">
					<MenuTrigger asChild>
						<Button colorStyle="outlined">Account Menu</Button>
					</MenuTrigger>
					<MenuContent>
						<VerticalMenuGroup label="Account">
							<MenuItem supportingText="john.doe@example.com">
								John Doe
							</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup label="General">
							<MenuItem>Profile</MenuItem>
							<MenuItem>Settings</MenuItem>
							<MenuItem>Billing</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup>
							<MenuItem>Help &amp; Feedback</MenuItem>
							<MenuItem>Sign out</MenuItem>
						</VerticalMenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
