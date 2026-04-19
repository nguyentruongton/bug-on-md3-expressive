"use client";

import {
	Icon,
	MenuItem,
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function VerticalMenuLabelDemo() {
	return (
		<div className="flex items-center justify-center p-8">
			<VerticalMenu colorVariant="standard">
				<VerticalMenuContent separatorStyle="gap">
					<VerticalMenuGroup label="Edit">
						<MenuItem
							leadingIcon={<Icon name="undo" size={20} />}
							trailingText="⌘Z"
						>
							Undo
						</MenuItem>
						<MenuItem
							leadingIcon={<Icon name="redo" size={20} />}
							trailingText="⇧⌘Z"
						>
							Redo
						</MenuItem>
					</VerticalMenuGroup>
					
					<VerticalMenuGroup label="Format">
						<MenuItem
							leadingIcon={<Icon name="format_bold" size={20} />}
							trailingText="⌘B"
						>
							Bold
						</MenuItem>
						<MenuItem
							leadingIcon={<Icon name="format_italic" size={20} />}
							trailingText="⌘I"
						>
							Italic
						</MenuItem>
						<MenuItem
							leadingIcon={<Icon name="format_underlined" size={20} />}
							trailingText="⌘U"
						>
							Underline
						</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>
		</div>
	);
}
