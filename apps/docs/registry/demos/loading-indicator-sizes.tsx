"use client";

import { LoadingIndicator } from "@bug-on/md3-react";

export default function LoadingIndicatorSizesDemo() {
	return (
		<div className="flex flex-col md:flex-row items-center justify-between gap-6">
			<div className="max-w-sm">
				<p className="text-sm text-m3-on-surface-variant">
					Loading indicators automatically adapt to any size via the{" "}
					<code>size</code> prop (default 24dp), seamlessly scaling bounds and
					container shapes while preserving performance.
				</p>
			</div>
			<div className="flex items-end gap-4 sm:gap-8 flex-wrap justify-center">
				<LoadingIndicator size={24} aria-label="Small load" />
				<LoadingIndicator size={48} aria-label="Medium load" />
				<LoadingIndicator size={96} aria-label="Large load" />
				<LoadingIndicator
					variant="contained"
					size={64}
					aria-label="Contained load"
				/>
			</div>
		</div>
	);
}
