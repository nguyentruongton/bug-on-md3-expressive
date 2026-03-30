"use client";

import * as React from "react";
import {
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@bug-on/md3-react";

export default function DialogScrollable() {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button colorStyle="outlined">Reading Policy</Button>
			</DialogTrigger>
			<DialogPortal open={open}>
				<DialogOverlay />
				<DialogContent>
					<DialogTitle>Terms of Service</DialogTitle>
					<DialogDescription asChild>
						<DialogBody className="max-h-75">
							<div className="space-y-4 text-sm text-m3-on-surface-variant">
								<p>
									Welcome to our expressive UI library. By using this component,
									you agree to Material Design 3 guidelines.
								</p>
								<p className="font-bold text-m3-on-surface">
									1. Interaction Principles
								</p>
								<p>
									Spring animations should be used for all expressive elements.
									Damping and stiffness must adhere to the 400/30 spec.
								</p>
								<p className="font-bold text-m3-on-surface">2. Data Privacy</p>
								<p>
									We do not collect any data through these components. They are
									purely for UI representation.
								</p>
								<p className="font-bold text-m3-on-surface">
									3. Implementation
								</p>
								<p>
									Ensure all dialogs have proper ARIA labels. Accessibility is
									not optional. Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Donec vel egestas dolor, ut convallis tellus.
									Nam imperdiet justo eu nisi efficitur, ut porta lorem
									pellentesque.
								</p>
							</div>
						</DialogBody>
					</DialogDescription>
					<DialogFooter>
						<Button colorStyle="text" onClick={() => setOpen(false)}>
							Decline
						</Button>
						<Button colorStyle="text" onClick={() => setOpen(false)}>
							Accept
						</Button>
					</DialogFooter>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
