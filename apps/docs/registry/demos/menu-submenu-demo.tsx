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
	VerticalMenuGroup,
} from "@bug-on/md3-react";
import * as React from "react";

export default function MenuSubmenuDemo() {
	const [theme, setTheme] = React.useState("system");

	const submenus = (
		<>
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
				<MenuItem selected={theme === "dark"} onClick={() => setTheme("dark")}>
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
				trigger={<MenuItem leadingIcon={<Icon name="share" />}>Share</MenuItem>}
			>
				<MenuItem leadingIcon={<Icon name="mail" />}>Email</MenuItem>
				<MenuItem leadingIcon={<Icon name="link" />}>Copy Link</MenuItem>
			</SubMenu>
		</>
	);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12 lg:flex-row lg:items-start">
			{/* Baseline Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Baseline (Cascading)
				</span>
				<Menu variant="baseline">
					<MenuTrigger asChild>
						<Button colorStyle="tonal">Display Settings</Button>
					</MenuTrigger>
					<MenuContent hasOverflow>{submenus}</MenuContent>
				</Menu>
			</div>

			{/* Expressive Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Vertical (Expressive Motion)
				</span>
				<Menu variant="expressive">
					<MenuTrigger asChild>
						<Button colorStyle="tonal">Display Settings</Button>
					</MenuTrigger>
					<MenuContent hasOverflow>
						<VerticalMenuGroup>
							<MenuItem leadingIcon={<Icon name="zoom_in" />}>Zoom In</MenuItem>
							<MenuItem leadingIcon={<Icon name="zoom_out" />}>
								Zoom Out
							</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup label="Theme">
							<MenuItem
								selected={theme === "light"}
								onClick={() => setTheme("light")}
								keepOpen
							>
								Light
							</MenuItem>
							<MenuItem
								selected={theme === "dark"}
								onClick={() => setTheme("dark")}
								keepOpen
							>
								Dark
							</MenuItem>
							<MenuItem
								selected={theme === "system"}
								onClick={() => setTheme("system")}
								keepOpen
							>
								System Default
							</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup label="Share">
							<MenuItem leadingIcon={<Icon name="mail" size={20} />}>
								Email
							</MenuItem>
							<MenuItem leadingIcon={<Icon name="link" size={20} />}>
								Copy Link
							</MenuItem>
						</VerticalMenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
