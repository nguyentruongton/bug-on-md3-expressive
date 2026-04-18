"use client";

import {
	Icon,
	MenuItem,
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function VerticalMenuDividerDemo() {
	return (
		<div className="flex items-center justify-center p-8">
			<VerticalMenu colorVariant="standard">
				<VerticalMenuContent separatorStyle="divider">
					<VerticalMenuGroup>
						<MenuItem leadingIcon={<Icon name="visibility" size={20} />}>
							Item 1
						</MenuItem>
						<MenuItem
							leadingIcon={<Icon name="content_copy" size={20} />}
							trailingText="⌘C"
						>
							Item 2
						</MenuItem>
						<MenuItem
							selected
							leadingIcon={<Icon name="edit" size={20} />}
						>
							Item 3
						</MenuItem>
					</VerticalMenuGroup>
					<VerticalMenuGroup>
						<MenuItem
							leadingIcon={<Icon name="cloud" size={20} />}
							trailingIcon={<Icon name="chevron_right" size={20} />}
						>
							Item 4
						</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>
		</div>
	);
}
