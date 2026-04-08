"use client";

import { Button, useSnackbar } from "@bug-on/md3-react";

export default function SnackbarNewlineDemo() {
	const { showSnackbar } = useSnackbar();

	return (
		<div className="flex flex-col gap-4 w-full max-w-sm items-center justify-center">
			<Button
				colorStyle="filled"
				onClick={() =>
					showSnackbar({
						message:
							"This is a very long message that spans across multiple lines to demonstrate the need for the action button to be placed on a new line.",
						actionLabel: "Action",
						actionOnNewLine: true,
						duration: "long",
					})
				}
			>
				Show action on new line
			</Button>
		</div>
	);
}
