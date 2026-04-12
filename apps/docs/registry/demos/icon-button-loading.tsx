"use client";

import type { BaseIconButtonProps } from "@bug-on/md3-react";
import { Icon, IconButton } from "@bug-on/md3-react";
import { useEffect, useState } from "react";

function LoadingIconButtonDemo(
	props: Omit<BaseIconButtonProps, "children"> & {
		icon: React.ReactNode;
	},
) {
	const [isLoading, setIsLoading] = useState(false);
	const { icon, ...rest } = props;

	useEffect(() => {
		if (isLoading) {
			const timer = setTimeout(() => setIsLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	return (
		<IconButton
			loading={isLoading}
			onClick={() => setIsLoading(true)}
			{...rest}
		>
			{icon}
		</IconButton>
	);
}

export default function IconButtonLoadingDemo() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Morphing Shape (Default)
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						<code>loadingVariant=&quot;loading-indicator&quot;</code> — displays
						the morphing loading indicator across 7 distinct MD3 Expressive shapes.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<LoadingIconButtonDemo
						aria-label="Upload"
						colorStyle="filled"
						loadingVariant="loading-indicator"
						icon={<Icon name="add" />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Search"
						colorStyle="tonal"
						loadingVariant="loading-indicator"
						icon={<Icon name="search" />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Settings"
						colorStyle="outlined"
						loadingVariant="loading-indicator"
						icon={<Icon name="settings" />}
						size="md"
					/>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Circular Spinner
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						<code>loadingVariant=&quot;circular&quot;</code> — utilizes the standard
						circular progress indicator. Best for data synchronization or form submissions.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<LoadingIconButtonDemo
						aria-label="Upload"
						colorStyle="filled"
						loadingVariant="circular"
						icon={<Icon name="progress_activity" />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Search"
						colorStyle="tonal"
						loadingVariant="circular"
						icon={<Icon name="search" />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Standard loading"
						colorStyle="standard"
						loadingVariant="circular"
						icon={<Icon name="settings" />}
						size="md"
					/>
				</div>
			</div>
		</div>
	);
}
