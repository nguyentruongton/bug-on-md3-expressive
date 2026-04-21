"use client";

import { Text } from "@bug-on/md3-react";

export default function TextBasicDemo() {
	return (
		<div className="flex flex-col gap-4">
			<Text variant="display-lg">Display Large</Text>
			<Text variant="headline-md" as="h3">
				Headline Medium (as h3)
			</Text>
			<Text variant="title-sm" className="text-m3-primary">
				Title Small (Primary Color)
			</Text>
			<Text variant="body-md">
				Body Medium - The quick brown fox jumps over the lazy dog. This
				component automatically selects the correct HTML tag based on the
				variant if not provided.
			</Text>
			<Text
				variant="label-sm"
				className="bg-m3-surface-variant p-2 rounded-m3-sm"
			>
				LABEL SMALL (In a box)
			</Text>
		</div>
	);
}
