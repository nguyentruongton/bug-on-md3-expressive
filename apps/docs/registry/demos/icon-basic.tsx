"use client";

import { Icon } from "@bug-on/md3-react";

export default function IconBasic() {
	return (
		<div className="flex flex-col gap-8 p-6 items-center">
			<div className="flex gap-8 items-center text-m3-primary">
				{/* Outlined variant */}
				<div className="flex flex-col items-center gap-2">
					<Icon variant="outlined" size={48} name="favorite" />
					<span className="text-sm text-m3-on-surface-variant">Outlined</span>
				</div>

				{/* Rounded variant */}
				<div className="flex flex-col items-center gap-2">
					<Icon variant="rounded" size={48} name="favorite" />
					<span className="text-sm text-m3-on-surface-variant">Rounded</span>
				</div>

				{/* Sharp variant */}
				<div className="flex flex-col items-center gap-2">
					<Icon variant="sharp" size={48} name="favorite" />
					<span className="text-sm text-m3-on-surface-variant">Sharp</span>
				</div>
			</div>

			<p className="text-sm text-m3-on-surface-variant max-w-[300px] text-center">
				The icon variant directly queries different variable font files (if
				separated) or different subsets, providing 3 distinct geometrical
				stylings for your app.
			</p>
		</div>
	);
}
