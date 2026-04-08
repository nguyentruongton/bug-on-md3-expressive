/**
 * @file switch-basic.tsx
 * Basic Switch demo for the documentation.
 */

"use client";

import { Switch } from "@bug-on/md3-react";
import * as React from "react";

export default function SwitchBasic() {
	const [checked, setChecked] = React.useState(false);

	return (
		<div className="flex flex-col items-center gap-4">
			<Switch
				checked={checked}
				onCheckedChange={setChecked}
				ariaLabel="Toggle switch"
			/>
			<p className="text-sm font-medium text-m3-on-surface-variant">
				Trạng thái: {checked ? "Bật" : "Tắt"}
			</p>
		</div>
	);
}
