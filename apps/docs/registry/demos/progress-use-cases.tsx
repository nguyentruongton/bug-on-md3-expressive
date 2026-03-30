"use client";

import { Button } from "@bug-on/md3-react";

export default function ProgressUseCasesDemo() {
	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4">
			<div className="max-w-sm">
				<h3 className="text-lg font-medium text-m3-on-surface mb-2">
					Progress inside Buttons
				</h3>
				<p className="text-sm text-m3-on-surface-variant">
					To ensure a minimum 3:1 contrast ratio inside buttons, change the
					active indicator color to the button label text color, and remove the
					track color.
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-4 justify-center min-w-50">
				<Button
					colorStyle="filled"
					loading={true}
					loadingVariant="loading-indicator"
				>
					Uploading
				</Button>
				<Button colorStyle="outlined" loading={true} loadingVariant="circular">
					Synchronizing
				</Button>
			</div>
		</div>
	);
}
