"use client";

import * as React from "react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@bug-on/md3-react";

export default function DialogBasic() {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button colorStyle="filled">Open Alert Dialog</Button>
			</DialogTrigger>
			<DialogPortal open={open}>
				<DialogOverlay />
				<DialogContent>
					<DialogTitle>Discard draft?</DialogTitle>
					<DialogDescription>
						This will permanently delete your current draft. This action cannot
						be undone.
					</DialogDescription>
					<DialogFooter>
						<Button colorStyle="text" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button colorStyle="text" onClick={() => setOpen(false)}>
							Discard
						</Button>
					</DialogFooter>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
