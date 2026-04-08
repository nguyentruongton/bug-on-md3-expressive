"use client";

import { Button, useSnackbar } from "@bug-on/md3-react";

export default function SnackbarActionDemo() {
	const { showSnackbar } = useSnackbar();

	const handleShow = async () => {
		const result = await showSnackbar({
			message: "Message archived.",
			actionLabel: "Undo",
		});

		if (result === "action-performed") {
			// In a real app, you would perform the undo logic here
			showSnackbar({
				message: "Message restored.",
			});
		}
	};

	return (
		<div className="flex flex-col gap-4 w-full max-w-sm items-center justify-center">
			<Button colorStyle="filled" onClick={handleShow}>
				Show snackbar with action
			</Button>
		</div>
	);
}
