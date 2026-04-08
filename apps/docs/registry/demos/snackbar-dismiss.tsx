"use client";

import { Button, useSnackbar } from "@bug-on/md3-react";

export default function SnackbarDismissDemo() {
	const { showSnackbar } = useSnackbar();

	return (
		<div className="flex flex-col gap-4 w-full max-w-sm items-center justify-center">
			<Button
				colorStyle="filled"
				onClick={() =>
					showSnackbar({
						message: "Connecting to server...",
						withDismissAction: true,
						duration: "long",
					})
				}
			>
				Show dismissible snackbar
			</Button>
		</div>
	);
}
