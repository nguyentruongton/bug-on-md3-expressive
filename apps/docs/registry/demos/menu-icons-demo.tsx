"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuDivider,
	MenuItem,
	MenuTrigger,
} from "@bug-on/md3-react";

export default function MenuIconsDemo() {
	return (
		<div className="flex h-72 items-center justify-center">
			<Menu>
				<MenuTrigger asChild>
					<Button colorStyle="elevated">Formatting</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem
						leadingIcon={<Icon name="format_bold" />}
						trailingText="⌘B"
					>
						Bold
					</MenuItem>
					<MenuItem
						leadingIcon={<Icon name="format_italic" />}
						trailingText="⌘I"
					>
						Italic
					</MenuItem>
					<MenuItem
						leadingIcon={<Icon name="format_underlined" />}
						trailingText="⌘U"
					>
						Underline
					</MenuItem>
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
	);
}
