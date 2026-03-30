"use client";

import * as React from "react";
import { Button } from "@bug-on/md3-react";
import { Bookmark, BookmarkCheck } from "lucide-react";

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
							<BookmarkCheck className="w-5 h-5 fill-current" />
						) : (
							<Bookmark className="w-5 h-5" />
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
