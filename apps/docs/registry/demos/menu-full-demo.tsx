"use client";

import {
	Button,
	Icon,
	Menu,
	MenuContent,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuTrigger,
	SubMenu,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function MenuFullDemo() {
	const baselineContent = (
		<>
			<MenuGroup label="Actions">
				<MenuItem
					leadingIcon={<Icon name="edit" size={20} />}
					trailingText="⌘E"
				>
					Edit
				</MenuItem>
				<MenuItem
					leadingIcon={<Icon name="content_copy" size={20} />}
					trailingText="⌘C"
				>
					Copy
				</MenuItem>
			</MenuGroup>
			<MenuDivider />
			<MenuGroup label="Selection">
				<MenuItem selected>Selected Item</MenuItem>
				<SubMenu
					trigger={
						<MenuItem
							leadingIcon={<Icon name="share" size={20} />}
							trailingIcon={<Icon name="chevron_right" size={20} />}
						>
							Share via...
						</MenuItem>
					}
				>
					<MenuGroup>
						<MenuItem leadingIcon={<Icon name="mail" size={20} />}>
							Email
						</MenuItem>
						<MenuItem leadingIcon={<Icon name="link" size={20} />}>
							Copy Link
						</MenuItem>
					</MenuGroup>
				</SubMenu>
			</MenuGroup>
			<MenuDivider />
			<MenuGroup>
				<MenuItem
					supportingText="Move to trash"
					leadingIcon={<Icon name="delete" size={20} />}
					className="text-error"
				>
					Delete
				</MenuItem>
			</MenuGroup>
		</>
	);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-12 py-12 lg:flex-row lg:items-start">
			{/* Baseline Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Baseline (Standard)
				</span>
				<Menu variant="baseline">
					<MenuTrigger asChild>
						<Button colorStyle="filled">Full Menu Demo</Button>
					</MenuTrigger>
					<MenuContent hasOverflow>{baselineContent}</MenuContent>
				</Menu>
			</div>

			{/* Expressive Popup Variant */}
			<div className="flex flex-col items-center gap-6">
				<span className="text-label-small uppercase tracking-wider text-m3-on-surface-variant">
					Vertical (Expressive)
				</span>
				<Menu variant="expressive">
					<MenuTrigger asChild>
						<Button colorStyle="tonal">Full Menu Demo</Button>
					</MenuTrigger>
					<MenuContent>
						<VerticalMenuGroup label="Actions">
							<MenuItem
								leadingIcon={<Icon name="edit" size={20} />}
								trailingText="⌘E"
							>
								Edit
							</MenuItem>
							<MenuItem
								leadingIcon={<Icon name="content_copy" size={20} />}
								trailingText="⌘C"
							>
								Copy
							</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup label="Selection">
							<MenuItem selected>Selected Item</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup label="Share via...">
							<MenuItem leadingIcon={<Icon name="mail" size={20} />}>
								Email
							</MenuItem>
							<MenuItem leadingIcon={<Icon name="link" size={20} />}>
								Copy Link
							</MenuItem>
						</VerticalMenuGroup>
						<VerticalMenuGroup>
							<MenuItem
								supportingText="Move to trash"
								leadingIcon={<Icon name="delete" size={20} />}
								className="text-error"
							>
								Delete
							</MenuItem>
						</VerticalMenuGroup>
					</MenuContent>
				</Menu>
			</div>
		</div>
	);
}
