"use client";

import * as React from "react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogIcon,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@bug-on/md3-react";
import { AlertTriangle } from "lucide-react";

export default function DialogIcon_() {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button colorStyle="tonal">Open Warning Dialog</Button>
			</DialogTrigger>
			<DialogPortal open={open}>
				<DialogOverlay />
				<DialogContent>
					<DialogIcon>
						<AlertTriangle className="w-6 h-6 text-m3-error" />
					</DialogIcon>
					<DialogTitle>Delete all cached data?</DialogTitle>
					<DialogDescription>
						History, cookies and offline records will be cleared from this
						device. You will be logged out of most sites.
					</DialogDescription>
					<DialogFooter>
						<Button colorStyle="text" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button colorStyle="text" onClick={() => setOpen(false)}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
