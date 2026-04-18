"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuDivider,
	MenuItem,
	MenuTrigger,
	SubMenu,
} from "@bug-on/md3-react";
import * as React from "react";

export default function MenuSubmenuDemo() {
	const [theme, setTheme] = React.useState("system");

	return (
		<div className="flex h-80 items-center justify-center">
			<Menu>
				<MenuTrigger asChild>
					<Button colorStyle="tonal">Display Settings</Button>
				</MenuTrigger>
				<MenuContent hasOverflow>
					<MenuItem leadingIcon={<Icon name="zoom_in" />}>Zoom In</MenuItem>
					<MenuItem leadingIcon={<Icon name="zoom_out" />}>Zoom Out</MenuItem>

					<MenuDivider />

					<SubMenu
						trigger={
							<MenuItem leadingIcon={<Icon name="palette" />}>Theme</MenuItem>
						}
					>
						<MenuItem
							selected={theme === "light"}
							onClick={() => setTheme("light")}
						>
							Light
						</MenuItem>
						<MenuItem
							selected={theme === "dark"}
							onClick={() => setTheme("dark")}
						>
							Dark
						</MenuItem>
						<MenuItem
							selected={theme === "system"}
							onClick={() => setTheme("system")}
						>
							System Default
						</MenuItem>
					</SubMenu>

					<SubMenu
						trigger={
							<MenuItem leadingIcon={<Icon name="share" />}>Share</MenuItem>
						}
					>
						<MenuItem leadingIcon={<Icon name="mail" />}>Email</MenuItem>
						<MenuItem leadingIcon={<Icon name="link" />}>Copy Link</MenuItem>
					</SubMenu>
				</MenuContent>
			</Menu>
		</div>
	);
}
