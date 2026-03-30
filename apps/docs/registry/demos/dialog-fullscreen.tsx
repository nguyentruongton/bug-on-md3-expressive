"use client";

import {
	Button,
	Dialog,
	DialogDescription,
	DialogFullScreenContent,
	DialogOverlay,
	DialogPortal,
	DialogTrigger,
} from "@bug-on/md3-react";
import { User } from "lucide-react";
import * as React from "react";

export default function DialogFullScreen() {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button colorStyle="filled">Edit Profile</Button>
			</DialogTrigger>
			<DialogPortal open={open}>
				<DialogOverlay />
				<DialogFullScreenContent
					title="Edit profile"
					actionLabel="Save"
					onAction={() => setOpen(false)}
					showDivider
				>
					<div className="p-6 md:p-12 max-w-2xl mx-auto space-y-8">
						<DialogDescription asChild>
							<p className="sr-only">Edit your public profile information.</p>
						</DialogDescription>

						{/* Avatar */}
						<div className="flex flex-col items-center gap-3">
							<div className="w-20 h-20 rounded-full bg-m3-surface-container-highest flex items-center justify-center">
								<User className="w-10 h-10 text-m3-on-surface-variant" />
							</div>
							<span className="text-m3-primary text-sm font-medium">
								Edit photo
							</span>
						</div>

						{/* Form Fields */}
						<div className="space-y-6">
							<div className="space-y-2">
								<label
									htmlFor="fs-full-name"
									className="text-sm font-medium text-m3-on-surface ml-1"
								>
									Full Name
								</label>
								<input
									id="fs-full-name"
									type="text"
									defaultValue="Alex Rivera"
									className="w-full bg-m3-surface-container-lowest border-b border-m3-outline p-4 focus:border-m3-primary focus:border-b-2 outline-none transition-all"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="fs-email"
									className="text-sm font-medium text-m3-on-surface ml-1"
								>
									Email
								</label>
								<input
									id="fs-email"
									type="email"
									defaultValue="alex.rivera@example.com"
									className="w-full bg-m3-surface-container-lowest border-b border-m3-outline p-4 focus:border-m3-primary focus:border-b-2 outline-none transition-all"
								/>
							</div>
						</div>
					</div>
				</DialogFullScreenContent>
			</DialogPortal>
		</Dialog>
	);
}
