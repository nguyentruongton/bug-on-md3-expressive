"use client";

import { Button, LoadingIndicator } from "@bug-on/md3-react";

export default function LoadingIndicatorUseCasesDemo() {
	return (
		<div className="flex flex-col gap-12">
			{/* Inside a Button */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Inside a Button
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						Used to indicate that an action is ongoing, such as validating a
						form or checking for updates.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4 justify-center min-w-50">
					<Button colorStyle="filled">
						<LoadingIndicator
							aria-label="Saving"
							size={20}
							color="currentColor"
						/>
						<span className="ml-2">Saving...</span>
					</Button>
					<Button colorStyle="tonal">
						<LoadingIndicator
							aria-label="Loading"
							size={20}
							color="currentColor"
						/>
						<span className="ml-2">Loading</span>
					</Button>
				</div>
			</div>

			{/* Pull to refresh mock */}
			<div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-4">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Pull-to-refresh
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						The container variant should be visible when the loading indicator
						is placed over other content to provide extra contrast.
					</p>
				</div>
				<div className="flex items-center justify-center min-w-50 w-full sm:w-auto">
					<div className="relative w-64 h-48 bg-m3-surface-container rounded-xl overflow-hidden shadow-sm border border-m3-surface-variant flex items-start justify-center pt-6">
						<LoadingIndicator
							variant="contained"
							size={38}
							aria-label="Refreshing content"
							className="z-10 shadow-md rounded-full"
						/>
						<div className="absolute inset-0 p-4 pt-20 flex flex-col gap-3 opacity-50">
							<div className="h-4 bg-m3-surface-variant rounded w-3/4"></div>
							<div className="h-4 bg-m3-surface-variant rounded w-full"></div>
							<div className="h-4 bg-m3-surface-variant rounded w-5/6"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
