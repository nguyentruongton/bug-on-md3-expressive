"use client";

import { TextField } from "@bug-on/md3-react";

export default function TextFieldAutoResizeDemo() {
	return (
		<div className="flex flex-col gap-8 w-full max-w-sm">
			<div className="flex flex-col gap-2">
				<p className="text-sm text-m3-on-surface-variant mb-2">
					This field starts as a single line and grows as you type.
				</p>
				<TextField
					label="Adaptive Multi-line"
					type="textarea"
					autoResize={true}
					placeholder="Type a long message..."
				/>
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm text-m3-on-surface-variant mb-2">
					This field is limited to 4 rows before showing a scrollbar.
				</p>
				<TextField
					variant="outlined"
					label="Limited Growth"
					type="textarea"
					autoResize={true}
					maxRows={4}
					placeholder="This will stop growing after 4 lines"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm text-m3-on-surface-variant mb-2">
					You can force scrollbars to be always visible using
					`scrollAreaType="always"`.
				</p>
				<TextField
					label="Always Show Scrollbar"
					type="textarea"
					rows={3}
					scrollAreaType="always"
					defaultValue="Line 1\nLine 2\nLine 3\nLine 4\nLine 5"
				/>
			</div>
		</div>
	);
}
