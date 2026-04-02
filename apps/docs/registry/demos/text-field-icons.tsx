"use client";

import { Icon, TextField } from "@bug-on/md3-react";

export default function TextFieldIconsDemo() {
	return (
		<div className="flex flex-col gap-6 w-full max-w-sm">
			{/* Leading icon */}
			<TextField
				label="Search"
				leadingIcon={<Icon name="search" />}
				placeholder="Search anything…"
			/>

			{/* Trailing icon — clear button */}
			<TextField
				label="Clearable field"
				trailingIconMode="clear"
				defaultValue="Delete me"
			/>

			{/* Both icons */}
			<TextField
				variant="outlined"
				label="Phone number"
				leadingIcon={<Icon name="phone" />}
				trailingIcon={<Icon name="contact_phone" />}
				trailingIconMode="custom"
				type="tel"
			/>

			{/* Password toggle */}
			<TextField
				label="Password"
				type="password"
				trailingIconMode="password-toggle"
			/>

			{/* Custom interactive icon */}
			<TextField
				label="With info button"
				trailingIconMode="custom"
				trailingIcon={
					<button
						type="button"
						onClick={() => alert("Info clicked!")}
						className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-m3-on-surface/8 transition-colors"
						aria-label="More information"
					>
						<Icon name="info" size={24} />
					</button>
				}
			/>
		</div>
	);
}
