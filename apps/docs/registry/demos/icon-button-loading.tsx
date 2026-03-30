"use client";

import type { BaseIconButtonProps } from "@bug-on/md3-react";
import { IconButton } from "@bug-on/md3-react";
import { Loader2, Plus, Search, Settings } from "lucide-react";
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
						<code>loadingVariant=&quot;loading-indicator&quot;</code> — hiển thị
						loading indicator morphing 7 hình MD3 Expressive đặc trưng.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<LoadingIconButtonDemo
						aria-label="Tải lên"
						colorStyle="filled"
						loadingVariant="loading-indicator"
						icon={<Plus />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Tìm kiếm"
						colorStyle="tonal"
						loadingVariant="loading-indicator"
						icon={<Search />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Cài đặt"
						colorStyle="outlined"
						loadingVariant="loading-indicator"
						icon={<Settings />}
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
						<code>loadingVariant=&quot;circular&quot;</code> — dùng circular
						progress indicator. Phù hợp sync data, submit form.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<LoadingIconButtonDemo
						aria-label="Tải lên"
						colorStyle="filled"
						loadingVariant="circular"
						icon={<Loader2 />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Tìm kiếm"
						colorStyle="tonal"
						loadingVariant="circular"
						icon={<Search />}
						size="md"
					/>
					<LoadingIconButtonDemo
						aria-label="Standard loading"
						colorStyle="standard"
						loadingVariant="circular"
						icon={<Settings />}
						size="md"
					/>
				</div>
			</div>
		</div>
	);
}
