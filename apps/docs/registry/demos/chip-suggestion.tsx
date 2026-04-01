"use client";

import { Chip, Icon } from "@bug-on/md3-react";
import { useState } from "react";

export default function ChipSuggestionDemo() {
	const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
		null,
	);

	return (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Search context — click to select
				</p>
				<div className="flex flex-wrap gap-2">
					{[
						"Nearby restaurants",
						"Coffee shops",
						"Open now",
						"Highly rated",
						"Free parking",
					].map((s) => (
						<Chip
							key={s}
							variant="suggestion"
							label={s}
							leadingIcon={<Icon name="search" className="w-4.5 h-4.5" />}
							onClick={() =>
								setSelectedSuggestion(s === selectedSuggestion ? null : s)
							}
							className={
								s === selectedSuggestion
									? "bg-m3-secondary-container text-m3-on-secondary-container border-transparent"
									: ""
							}
						/>
					))}
				</div>
				{selectedSuggestion && (
					<p className="mt-3 text-sm text-m3-on-surface-variant">
						Selected:{" "}
						<span className="font-medium text-m3-on-surface">
							{selectedSuggestion}
						</span>
					</p>
				)}
			</div>

			<div>
				<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
					Elevated
				</p>
				<div className="flex flex-wrap gap-2">
					<Chip variant="suggestion" elevated label="Add a subject" />
					<Chip variant="suggestion" elevated label="Set a date" />
					<Chip variant="suggestion" elevated label="Add location" />
				</div>
			</div>
		</div>
	);
}
