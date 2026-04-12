/**
 * @file switch-labeled.tsx
 * Labeled Switch demo for the documentation.
 */

"use client";

import { Switch } from "@bug-on/md3-react";
import * as React from "react";

export default function SwitchLabeled() {
	const [checked, setChecked] = React.useState(true);

	return (
		<Switch checked={checked} onCheckedChange={setChecked} label="Wi-Fi" />
	);
}
