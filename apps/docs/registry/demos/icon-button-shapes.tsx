"use client";

import { Icon, IconButton } from "@bug-on/md3-react";

export default function IconButtonShapesDemo() {
	return (
		<div className="flex flex-col gap-6">
			<p className="text-sm text-m3-on-surface-variant mb-8 max-w-2xl">
				Two base shapes: <strong>round</strong> (CornerFull = height/2) and{" "}
				<strong>square</strong> (CornerMedium to CornerExtraLarge depending on
				size). Both morph with spring animation on press.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
				<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
					<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
						Round (CornerFull)
					</p>
					<div className="flex flex-wrap items-end gap-4">
						{(["xs", "sm", "md", "lg"] as const).map((size) => (
							<IconButton
								key={size}
								aria-label={`Round ${size}`}
								colorStyle="filled"
								shape="round"
								size={size}
							>
								<Icon name="star" />
							</IconButton>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
					<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
						Square (CornerMedium–ExtraLarge)
					</p>
					<div className="flex flex-wrap items-end gap-4">
						{(["xs", "sm", "md", "lg"] as const).map((size) => (
							<IconButton
								key={size}
								aria-label={`Square ${size}`}
								colorStyle="filled"
								shape="square"
								size={size}
							>
								<Icon name="star" />
							</IconButton>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
