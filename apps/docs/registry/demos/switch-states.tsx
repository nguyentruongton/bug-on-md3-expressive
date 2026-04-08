/**
 * @file switch-states.tsx
 * Switch states demo for the documentation.
 */

"use client";

import { Switch } from "@bug-on/md3-react";

export default function SwitchStates() {
	return (
		<div className="flex flex-col gap-6">
			<Switch
				checked={false}
				onCheckedChange={() => {}}
				disabled
				label="Vô hiệu hóa (Tắt)"
			/>
			<Switch
				checked={true}
				onCheckedChange={() => {}}
				disabled
				label="Vô hiệu hóa (Bật)"
			/>
		</div>
	);
}
