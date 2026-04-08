/**
 * @file switch-icons.tsx
 * Switch with icons demo for the documentation.
 */

"use client";

import { Switch } from "@bug-on/md3-react";
import * as React from "react";

export default function SwitchIcons() {
	const [checked, setChecked] = React.useState(false);

	const CheckIcon = () => (
		<svg
			viewBox="0 0 16 16"
			width={16}
			height={16}
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="3,8 6.5,11.5 13,5" />
		</svg>
	);

	const CloseIcon = () => (
		<svg
			viewBox="0 0 16 16"
			width={16}
			height={16}
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			aria-hidden="true"
		>
			<line x1="4" y1="4" x2="12" y2="12" />
			<line x1="12" y1="4" x2="4" y2="12" />
		</svg>
	);

	return (
		<Switch
			checked={checked}
			onCheckedChange={setChecked}
			icons
			thumbContent={checked ? <CheckIcon /> : <CloseIcon />}
			label="Thông báo"
		/>
	);
}
