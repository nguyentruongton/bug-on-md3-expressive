"use client";

import {
	Icon,
	MenuItem,
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuGroup,
} from "@bug-on/md3-react";

export default function VerticalMenuVibrantDemo() {
	return (
		<div className="flex items-center justify-center p-8">
			<VerticalMenu colorVariant="vibrant">
				<VerticalMenuContent separatorStyle="gap">
					<VerticalMenuGroup label="Actions">
						<MenuItem leadingIcon={<Icon name="star" size={20} />}>
							Item 1
						</MenuItem>
						<MenuItem
							leadingIcon={<Icon name="favorite" size={20} />}
							trailingText="⌘F"
						>
							Item 2
						</MenuItem>
						<MenuItem
							selected
							leadingIcon={<Icon name="bookmark" size={20} />}
						>
							Item 3
						</MenuItem>
					</VerticalMenuGroup>
					<VerticalMenuGroup label="More">
						<MenuItem
							leadingIcon={<Icon name="share" size={20} />}
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
