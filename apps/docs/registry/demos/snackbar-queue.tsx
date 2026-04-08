"use client";

import { Button, useSnackbar } from "@bug-on/md3-react";
import { useRef } from "react";

export default function SnackbarQueueDemo() {
	const { showSnackbar } = useSnackbar();
	const countRef = useRef(1);

	const handleShowMultiple = () => {
		const currentCount = countRef.current++;
		showSnackbar({
			message: `Snackbar #${currentCount}`,
			actionLabel: "Close",
			duration: "short",
		});
	};

	return (
		<div className="flex flex-col gap-4 w-full max-w-sm items-center justify-center">
			<Button colorStyle="filled" onClick={handleShowMultiple}>
				Queue another snackbar
			</Button>
			<p className="text-m3-on-surface-variant text-sm text-center">
				Click multiple times rapidly.
			</p>
		</div>
	);
}
