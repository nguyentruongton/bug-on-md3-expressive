"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuDivider,
	MenuItem,
	MenuTrigger,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function MenuIconsDemo() {
	const items = (
		<>
			<MenuItem leadingIcon={<Icon name="format_bold" />} trailingText="⌘B">
				Bold
			</MenuItem>
			<MenuItem leadingIcon={<Icon name="format_italic" />} trailingText="⌘I">
				Italic
			</MenuItem>
			<MenuItem
				leadingIcon={<Icon name="format_underlined" />}
				trailingText="⌘U"
			>
				Underline
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
						<Button colorStyle="elevated">Formatting</Button>
					</MenuTrigger>
					<MenuContent>
						{items}
						<MenuDivider />
						<MenuItem
							leadingIcon={<Icon name="format_clear" />}
							trailingText="⌘\"
						>
							Clear Formatting
						</MenuItem>
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
						<Button colorStyle="elevated">Formatting</Button>
					</MenuTrigger>
					<MenuContent>
						<VerticalMenuGroup>{items}</VerticalMenuGroup>
						<VerticalMenuGroup>
							<MenuItem
								leadingIcon={<Icon name="format_clear" />}
								trailingText="⌘\"
							>
								Clear Formatting
							</MenuItem>
						</VerticalMenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
