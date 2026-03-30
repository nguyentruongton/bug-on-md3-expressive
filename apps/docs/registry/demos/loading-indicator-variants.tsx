"use client";

import { LoadingIndicator } from "@bug-on/md3-react";

export default function LoadingIndicatorVariantsDemo() {
	return (
		<div className="flex flex-col gap-12">
			{/* Uncontained */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Uncontained
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						The default variant seamlessly blends into its surroundings. Used
						often in pull-to-refresh actions.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-8 justify-center min-w-50">
					<LoadingIndicator aria-label="Loading content" />
				</div>
			</div>

			{/* Contained */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Contained
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						Puts the morphing indicator inside a distinct container, boosting
						visibility across varied backgrounds.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-8 justify-center min-w-50">
					<LoadingIndicator variant="contained" aria-label="Loading securely" />
				</div>
			</div>
		</div>
	);
}
