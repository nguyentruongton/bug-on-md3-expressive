"use client";

import * as React from "react";
import type { BaseButtonProps } from "@bug-on/md3-react";
import { Button } from "@bug-on/md3-react";

type LoadingDemoProps = { label: string } & Partial<
	Omit<BaseButtonProps, "loading" | "children">
>;

function LoadingDemo({ label, ...props }: LoadingDemoProps) {
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		if (loading) {
			const timer = setTimeout(() => setLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [loading]);

	return (
		<Button loading={loading} onClick={() => setLoading(true)} {...props}>
			{label}
		</Button>
	);
}

export default function ButtonLoading() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<LoadingDemo
				label="Upload"
				colorStyle="filled"
				loadingVariant="loading-indicator"
			/>
			<LoadingDemo
				label="Generate"
				colorStyle="tonal"
				loadingVariant="loading-indicator"
			/>
			<LoadingDemo
				label="Submit"
				colorStyle="elevated"
				loadingVariant="circular"
			/>
			<LoadingDemo
				label="Sync"
				colorStyle="outlined"
				loadingVariant="circular"
			/>
		</div>
	);
}
