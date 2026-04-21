"use client";

import {
	Button,
	Menu,
	MenuContent,
	MenuGroup,
	MenuItem,
	MenuTrigger,
} from "@bug-on/md3-react";

export default function MenuBasicDemo() {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12 md:flex-row md:items-start">
			{/* Baseline Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Baseline (Standard)
				</span>
				<Menu variant="baseline">
					<MenuTrigger asChild>
						<Button colorStyle="filled">Open Baseline</Button>
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

			{/* Expressive Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Vertical (Expressive)
				</span>
				<Menu variant="expressive">
					<MenuTrigger asChild>
						<Button colorStyle="filled">Open Vertical</Button>
					</MenuTrigger>
					<MenuContent>
						<MenuGroup>
							<MenuItem>Edit</MenuItem>
							<MenuItem>Duplicate</MenuItem>
							<MenuItem>Share</MenuItem>
							<MenuItem disabled>Archive</MenuItem>
							<MenuItem>Delete</MenuItem>
						</MenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
