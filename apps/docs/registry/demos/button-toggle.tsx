"use client";

import { Button, Icon } from "@bug-on/md3-react";
import * as React from "react";

export default function ButtonToggle() {
	const [bookmarked, setBookmarked] = React.useState(false);

	return (
		<div className="flex flex-wrap items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-3">
				<Button
					colorStyle="outlined"
					variant="toggle"
					selected={bookmarked}
					onClick={() => setBookmarked(!bookmarked)}
					icon={
						bookmarked ? (
							<Icon name="bookmark" size={20} fill={1} />
						) : (
							<Icon name="bookmark" size={20} />
						)
					}
				>
					{bookmarked ? "Saved" : "Save"}
				</Button>
				<span className="text-xs text-m3-on-surface-variant">
					{bookmarked ? "Selected — Square radius" : "Default — Round radius"}
				</span>
			</div>
		</div>
	);
}
