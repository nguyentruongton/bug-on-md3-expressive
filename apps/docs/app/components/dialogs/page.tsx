"use client";

import {
	Button,
	CodeBlock,
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogFullScreenContent,
	DialogIcon,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
	Ripple,
	type RippleOrigin,
	TableOfContents,
} from "@bug-on/md3-react";
import {
	AlertTriangle,
	ChevronRight,
	History,
	Info,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

function InteractiveAvatar() {
	const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

	const onPointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLElement>) => {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const size = Math.hypot(rect.width, rect.height) * 2;
			setRipples((prev) => [...prev, { id: Date.now(), x, y, size }]);
		},
		[],
	);

	const removeRipple = React.useCallback((id: number) => {
		setRipples((prev) => prev.filter((r) => r.id !== id));
	}, []);

	return (
		<div
			onPointerDown={onPointerDown}
			className="w-24 h-24 rounded-full bg-m3-surface-container-highest flex items-center justify-center group relative overflow-hidden cursor-pointer"
		>
			<User className="w-12 h-12 text-m3-on-surface-variant" />
			<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
				CHANGE
			</div>
			<Ripple ripples={ripples} onRippleDone={removeRipple} />
		</div>
	);
}

function InteractiveActionItem({
	icon: Icon,
	label,
	className = "",
}: {
	icon: React.ElementType;
	label: string;
	className?: string;
}) {
	const [ripples, setRipples] = React.useState<RippleOrigin[]>([]);

	const onPointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLElement>) => {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const size = Math.hypot(rect.width, rect.height) * 2;
			setRipples((prev) => [...prev, { id: Date.now(), x, y, size }]);
		},
		[],
	);

	const removeRipple = React.useCallback((id: number) => {
		setRipples((prev) => prev.filter((r) => r.id !== id));
	}, []);

	return (
		<div
			onPointerDown={onPointerDown}
			className={`flex items-center gap-4 p-4 hover:bg-m3-on-surface/8 rounded-2xl cursor-pointer relative overflow-hidden transition-colors ${className}`}
		>
			<Icon className="w-5 h-5 text-m3-on-surface-variant" />
			<span className="text-m3-on-surface">{label}</span>
			<Ripple ripples={ripples} onRippleDone={removeRipple} />
		</div>
	);
}

export default function DialogsPage() {
	const [basicOpen, setBasicOpen] = React.useState(false);
	const [iconOpen, setIconOpen] = React.useState(false);
	const [scrollOpen, setScrollOpen] = React.useState(false);
	const [fullOpen, setFullOpen] = React.useState(false);

	const tocItems = [
		{ id: "basic", label: "Basic Dialog" },
		{ id: "icon", label: "Icon Dialog" },
		{ id: "scrollable", label: "Scrollable Content" },
		{ id: "full-screen", label: "Full-screen Dialog" },
	];

	const basicCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button colorStyle="filled">Open basic dialog</Button>
  </DialogTrigger>
  <DialogPortal open={open}>
    <DialogOverlay />
    <DialogContent aria-describedby={undefined}>
      <DialogTitle>Discard draft?</DialogTitle>
      <DialogDescription>
        This will permanently delete your current draft. This action cannot be undone.
      </DialogDescription>
      <DialogFooter>
        <Button colorStyle="text" onClick={() => setOpen(false)}>Cancel</Button>
        <Button colorStyle="text" onClick={() => setOpen(false)}>Discard</Button>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`;

	const iconCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogPortal open={open}>
    <DialogOverlay />
    <DialogContent>
      <DialogIcon>
        <AlertTriangle className="w-6 h-6" />
      </DialogIcon>
      <DialogTitle>Clear history?</DialogTitle>
      <DialogDescription>
        This will clear all your browsing history from this device.
      </DialogDescription>
      <DialogFooter>
        <Button colorStyle="text" onClick={() => setOpen(false)}>Cancel</Button>
        <Button colorStyle="text" onClick={() => setOpen(false)}>Clear</Button>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`;

	const fullScreenCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogPortal open={open}>
    <DialogFullScreenContent 
      title="Edit profile" 
      actionLabel="Save" 
      onAction={handleSave}
    >
      <div className="p-6 space-y-6">
        {/* Profile form fields */}
      </div>
    </DialogFullScreenContent>
  </DialogPortal>
</Dialog>`;

	return (
		<div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12 flex flex-col xl:flex-row gap-12">
			<div className="flex-1 min-w-0">
				{/* Breadcrumbs */}
				<nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
					<Link
						className="text-m3-primary font-medium text-sm hover:underline"
						href="/components"
					>
						Components
					</Link>
					<ChevronRight className="w-4 h-4 text-m3-on-surface-variant" />
					<span className="text-m3-on-surface text-sm font-bold">Dialogs</span>
				</nav>

				{/* Hero */}
				<div id="overview" className="mb-12 scroll-mt-24">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Dialogs
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed max-w-3xl">
						Dialogs provide important prompts in a user flow. They can inform
						users about critical information, require decisions, or involve
						multiple tasks. Expressive dialogs use spring-based motion and clear
						typography to focus attention.
					</p>
				</div>

				{/* ── BASIC ────────────────────────────────────────────────────────────── */}
				<section id="basic" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Basic Dialog
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Standard alert dialog for simple confirmations or messages.
					</p>

					<div className="p-8 border border-m3-outline-variant rounded-3xl bg-m3-surface-container-lowest flex items-center justify-center mb-6">
						<Dialog open={basicOpen} onOpenChange={setBasicOpen}>
							<DialogTrigger asChild>
								<Button colorStyle="filled">Open Alert Dialog</Button>
							</DialogTrigger>
							<DialogPortal open={basicOpen}>
								<DialogOverlay />
								<DialogContent>
									<DialogTitle>Discard draft?</DialogTitle>
									<DialogDescription>
										This will permanently delete your current draft. This action
										cannot be undone.
									</DialogDescription>
									<DialogFooter>
										<Button
											colorStyle="text"
											onClick={() => setBasicOpen(false)}
										>
											Cancel
										</Button>
										<Button
											colorStyle="text"
											onClick={() => setBasicOpen(false)}
										>
											Discard
										</Button>
									</DialogFooter>
								</DialogContent>
							</DialogPortal>
						</Dialog>
					</div>
					<CodeBlock code={basicCode} />
				</section>

				{/* ── ICON ─────────────────────────────────────────────────────────────── */}
				<section id="icon" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Icon Dialog
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Dialogs with icons emphasize the nature of the prompt (e.g.,
						warnings, information).
					</p>

					<div className="p-8 border border-m3-outline-variant rounded-3xl bg-m3-surface-container-lowest flex items-center justify-center mb-6">
						<Dialog open={iconOpen} onOpenChange={setIconOpen}>
							<DialogTrigger asChild>
								<Button colorStyle="tonal">Open Warning Dialog</Button>
							</DialogTrigger>
							<DialogPortal open={iconOpen}>
								<DialogOverlay />
								<DialogContent>
									<DialogIcon>
										<AlertTriangle className="text-m3-error w-6 h-6" />
									</DialogIcon>
									<DialogTitle>Delete all cached data?</DialogTitle>
									<DialogDescription>
										History, cookies and offline records will be cleared from
										this device. You will be logged out of most sites.
									</DialogDescription>
									<DialogFooter>
										<Button
											colorStyle="text"
											onClick={() => setIconOpen(false)}
										>
											Cancel
										</Button>
										<Button
											colorStyle="text"
											onClick={() => setIconOpen(false)}
										>
											Delete
										</Button>
									</DialogFooter>
								</DialogContent>
							</DialogPortal>
						</Dialog>
					</div>
					<CodeBlock code={iconCode} />
				</section>

				{/* ── SCROLLABLE ────────────────────────────────────────────────────────── */}
				<section id="scrollable" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Scrollable Content
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Use `DialogBody` for long content that needs internal scrolling
						while keeping the headline and footer sticky.
					</p>

					<div className="p-8 border border-m3-outline-variant rounded-3xl bg-m3-surface-container-lowest flex items-center justify-center mb-6">
						<Dialog open={scrollOpen} onOpenChange={setScrollOpen}>
							<DialogTrigger asChild>
								<Button colorStyle="outlined">Reading Policy</Button>
							</DialogTrigger>
							<DialogPortal open={scrollOpen}>
								<DialogOverlay />
								<DialogContent>
									<DialogTitle>Terms of Service</DialogTitle>
									<DialogDescription asChild>
										<DialogBody className="max-h-75">
											<div className="space-y-4 text-sm text-m3-on-surface-variant">
												<p>
													Welcome to our expressive UI library. By using this
													component, you agree to Material Design 3 guidelines.
												</p>
												<p className="font-bold text-m3-on-surface">
													1. Interaction Principles
												</p>
												<p>
													Spring animations should be used for all expressive
													elements. Damping and stiffness must adhere to the
													400/30 spec.
												</p>
												<p className="font-bold text-m3-on-surface">
													2. Data Privacy
												</p>
												<p>
													We do not collect any data through these components.
													They are purely for UI representation.
												</p>
												<p className="font-bold text-m3-on-surface">
													3. Implementation
												</p>
												<p>
													Ensure all dialogs have proper ARIA labels.
													Accessibility is not optional.
												</p>
												<p>
													Lorem ipsum dolor sit amet, consectetur adipiscing
													elit. Donec vel egestas dolor, ut convallis tellus.
													Nam imperdiet justo eu nisi efficitur, ut porta lorem
													pellentesque.
												</p>
												<p>
													Sed varius dui nec ultrices lacinia. Nulla non
													elementum nisl. Curabitur et varius dui, ac pharetra
													dui.
												</p>
											</div>
										</DialogBody>
									</DialogDescription>
									<DialogFooter>
										<Button
											colorStyle="text"
											onClick={() => setScrollOpen(false)}
										>
											Decline
										</Button>
										<Button
											colorStyle="text"
											onClick={() => setScrollOpen(false)}
										>
											Accept
										</Button>
									</DialogFooter>
								</DialogContent>
							</DialogPortal>
						</Dialog>
					</div>
				</section>

				{/* ── FULL SCREEN ───────────────────────────────────────────────────────── */}
				<section id="full-screen" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Full-screen Dialog
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Full-screen dialogs cover the entire viewport. They are ideal for
						complex tasks like forms or detailed record editing.
					</p>

					<div className="p-8 border border-m3-outline-variant rounded-3xl bg-m3-surface-container-lowest flex items-center justify-center mb-6">
						<Dialog open={fullOpen} onOpenChange={setFullOpen}>
							<DialogTrigger asChild>
								<Button colorStyle="filled">Edit Profile</Button>
							</DialogTrigger>
							<DialogPortal open={fullOpen}>
								<DialogFullScreenContent
									title="Edit profile"
									actionLabel="Save"
									onAction={() => setFullOpen(false)}
									showDivider
								>
									<div className="p-6 md:p-12 max-w-2xl mx-auto space-y-10">
										<DialogDescription asChild>
											<p className="sr-only">
												Edit your public profile information.
											</p>
										</DialogDescription>

										{/* Avatar Section */}
										<div className="flex flex-col items-center gap-4">
											<InteractiveAvatar />
											<span className="text-m3-primary text-sm font-medium">
												Edit photo
											</span>
										</div>

										{/* Form Fields */}
										<div className="space-y-6">
											<div className="space-y-2">
												<label
													htmlFor="full-name"
													className="text-sm font-medium text-m3-on-surface ml-1"
												>
													Full Name
												</label>
												<input
													id="full-name"
													type="text"
													defaultValue="Alex Rivera"
													className="w-full bg-m3-surface-container-lowest border-b border-m3-outline p-4 focus:border-m3-primary focus:border-b-2 outline-none transition-all"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="bio"
													className="text-sm font-medium text-m3-on-surface ml-1"
												>
													Bio
												</label>
												<textarea
													id="bio"
													rows={3}
													defaultValue="Frontend developer passionate about MD3 and expressive motion systems."
													className="w-full bg-m3-surface-container-lowest border-b border-m3-outline p-4 focus:border-m3-primary focus:border-b-2 outline-none transition-all resize-none"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="email"
													className="text-sm font-medium text-m3-on-surface ml-1"
												>
													Email
												</label>
												<input
													id="email"
													type="email"
													defaultValue="alex.rivera@example.com"
													className="w-full bg-m3-surface-container-lowest border-b border-m3-outline p-4 focus:border-m3-primary focus:border-b-2 outline-none transition-all"
												/>
											</div>
										</div>

										<div className="pt-4 space-y-2">
											<h4 className="text-m3-primary text-sm font-medium uppercase tracking-wider mb-4">
												Account Actions
											</h4>
											{[
												{ label: "Settings", icon: Settings },
												{ label: "Privacy History", icon: History },
												{ label: "Information", icon: Info },
											].map((item) => (
												<InteractiveActionItem
													key={item.label}
													icon={item.icon}
													label={item.label}
												/>
											))}

											<InteractiveActionItem
												icon={LogOut}
												label="Sign out"
												className="text-m3-error hover:bg-m3-error/8 mt-4"
											/>
										</div>
									</div>
								</DialogFullScreenContent>
							</DialogPortal>
						</Dialog>
					</div>
					<CodeBlock code={fullScreenCode} />
				</section>

				{/* ── CODE ─────────────────────────────────────────────────────────────── */}
				<section id="code" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Usage Guide
					</h2>
					<CodeBlock
						code={`import { 
  Dialog, 
  DialogPortal, 
  DialogOverlay, 
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
  DialogFullScreenContent,
  DialogIcon
} from '@bug-on/md3-react';

function MyDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal open={open}>
        <DialogOverlay />
        <DialogContent>
           <DialogIcon><Info /></DialogIcon>
           <DialogTitle>Hello</DialogTitle>
           <DialogBody>Internal scrollable content here</DialogBody>
           <DialogFooter>
             <Button colorStyle="text" onClick={() => setOpen(false)}>Close</Button>
           </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}`}
					/>
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
