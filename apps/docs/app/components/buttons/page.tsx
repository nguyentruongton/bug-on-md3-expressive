"use client";

import type { BaseButtonProps } from "@bug-on/md3-react";
import { Button, Card, CodeBlock, TableOfContents } from "@bug-on/md3-react";
import {
	Bookmark,
	BookmarkCheck,
	ChevronRight,
	Edit,
	Plus,
	Send,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function LoadingButtonDemo({
	label,
	...props
}: { label: string } & Partial<BaseButtonProps>) {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isLoading) {
			const timer = setTimeout(() => setIsLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	return (
		<Button loading={isLoading} onClick={() => setIsLoading(true)} {...props}>
			{label}
		</Button>
	);
}

export default function ButtonsPage() {
	const [isIconBookmarked, setIsIconBookmarked] = useState(false);
	const [isSizeBookmarked, setIsSizeBookmarked] = useState(false);

	const buttonCode = `import { Button } from '@bug-on/md3-react';
import { Plus, Send } from 'lucide-react';

export function ButtonExamples() {
  return (
    <div className="flex gap-4">
      <Button colorStyle="elevated">Elevated</Button>
      <Button colorStyle="filled">Filled</Button>
      <Button colorStyle="tonal">Tonal</Button>
      <Button colorStyle="outlined">Outlined</Button>
      <Button colorStyle="text">Text</Button>
      
      {/* With Icon */}
      <Button colorStyle="filled" icon={<Plus className="w-5 h-5" />}>
        Add Item
      </Button>

      {/* Trailing Icon */}
      <Button colorStyle="text" icon={<Send className="w-5 h-5" />} iconPosition="trailing">
        Send
      </Button>

      {/* Toggle Button */}
      <Button 
        colorStyle="outlined" 
        variant="toggle" 
        selected={true}
      >
        Saved
      </Button>

      {/* Loading Button */}
      <Button loading loadingVariant="loading-indicator">
        Uploading
      </Button>
      
      <Button loading loadingVariant="circular" colorStyle="tonal">
        Synchronizing
      </Button>
    </div>
  );
}`;

	const tocItems = [
		{ id: "button-types", label: "Button Types" },
		{ id: "loading-state", label: "Loading State" },
		{ id: "sizes-shapes", label: "Sizes & Shapes" },
		{ id: "usage-guidelines", label: "Usage Guidelines" },
		{ id: "code-example", label: "Code Example" },
	];

	return (
		<div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12 flex flex-col xl:flex-row gap-12">
			<div className="flex-1 min-w-0">
				{/* Breadcrumbs */}
				<nav className="flex items-center gap-2 mb-8">
					<Link
						className="text-m3-primary font-medium text-sm hover:underline"
						href="/components"
					>
						Components
					</Link>
					<ChevronRight className="w-4 h-4 text-m3-on-surface-variant" />
					<span className="text-m3-on-surface text-sm font-bold">Buttons</span>
				</nav>

				{/* Content Section */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Buttons
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Buttons let people take action and make choices with one tap. They
						communicate actions that users can take.
					</p>
				</div>

				{/* Interactive Playground */}
				<section id="button-types" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Button Types
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-12 min-h-75 bg-m3-surface-container-lowest"
					>
						{/* Elevated Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Elevated Button
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Elevated buttons are essentially filled buttons with a lighter
									background color and a shadow. To prevent shadow creep, only
									use them when absolutely necessary, such as when the button
									requires visual separation from a patterned background.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button colorStyle="elevated">Elevated</Button>
								<Button
									colorStyle="elevated"
									icon={<Plus className="w-5 h-5" />}
								>
									Icon
								</Button>
								<Button colorStyle="elevated" disabled>
									Disabled
								</Button>
							</div>
						</div>

						{/* Filled Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Filled Button
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Filled buttons have the most visual impact after the FAB, and
									should be used for important, final actions that complete a
									flow, like Save, Join now, or Confirm.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button colorStyle="filled">Filled</Button>
								<Button colorStyle="filled" icon={<Send className="w-5 h-5" />}>
									Icon
								</Button>
								<Button colorStyle="filled" disabled>
									Disabled
								</Button>
							</div>
						</div>

						{/* Filled Tonal Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Filled Tonal Button
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									A filled tonal button is an alternative middle ground between
									filled and outlined buttons. They&apos;re useful in contexts
									where a lower-priority button requires slightly more emphasis
									than an outline would give.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button colorStyle="tonal">Tonal</Button>
								<Button colorStyle="tonal" icon={<Edit className="w-5 h-5" />}>
									Icon
								</Button>
								<Button colorStyle="tonal" disabled>
									Disabled
								</Button>
							</div>
						</div>

						{/* Outlined Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Outlined Button
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Outlined buttons are medium-emphasis buttons. They contain
									actions that are important, but aren&apos;t the primary action
									in an app.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button colorStyle="outlined">Outlined</Button>
								<Button
									colorStyle="outlined"
									icon={<Plus className="w-5 h-5" />}
								>
									Icon
								</Button>
								<Button colorStyle="outlined" disabled>
									Disabled
								</Button>
							</div>
						</div>

						{/* Text Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Text Button
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Text buttons are used for the lowest priority actions,
									especially when presenting multiple options. Text buttons can
									be placed on a variety of backgrounds.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button colorStyle="text">Text</Button>
								<Button colorStyle="text" icon={<Trash2 className="w-5 h-5" />}>
									Icon
								</Button>
								<Button colorStyle="text" disabled>
									Disabled
								</Button>
							</div>
						</div>

						{/* Toggle Button Section */}
						<div className="flex flex-col gap-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Toggle Button & Shape Morph
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Toggle buttons morph from round to square when selected. They
									also transition icons from outlined to filled states.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Icon Morph Example */}
								<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl overflow-visible">
									<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
										Icon & Label Morph
									</p>
									<div className="flex flex-wrap items-center gap-4">
										<Button
											colorStyle="outlined"
											variant="toggle"
											selected={isIconBookmarked}
											onClick={() => setIsIconBookmarked(!isIconBookmarked)}
											icon={
												isIconBookmarked ? (
													<BookmarkCheck className="w-5 h-5 fill-current" />
												) : (
													<Bookmark className="w-5 h-5" />
												)
											}
										>
											{isIconBookmarked ? "Saved" : "Save"}
										</Button>
										<span className="text-xs text-m3-on-surface-variant italic">
											{isIconBookmarked
												? "Selected (Square)"
												: "Unselected (Round)"}
										</span>
									</div>
								</div>

								{/* Size Scaling Example */}
								<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl overflow-visible">
									<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
										Dynamic Radius Scaling
									</p>
									<div className="flex flex-wrap items-end gap-4">
										<Button
											size="xs"
											variant="toggle"
											selected={isSizeBookmarked}
											onClick={() => setIsSizeBookmarked(!isSizeBookmarked)}
										>
											XS
										</Button>
										<Button
											size="sm"
											variant="toggle"
											selected={isSizeBookmarked}
											onClick={() => setIsSizeBookmarked(!isSizeBookmarked)}
										>
											SM
										</Button>
										<Button
											size="md"
											variant="toggle"
											selected={isSizeBookmarked}
											onClick={() => setIsSizeBookmarked(!isSizeBookmarked)}
										>
											MD
										</Button>
										<Button
											size="lg"
											variant="toggle"
											selected={isSizeBookmarked}
											onClick={() => setIsSizeBookmarked(!isSizeBookmarked)}
										>
											LG
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</section>

				{/* Loading State */}
				<section id="loading-state" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Loading State
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest overflow-visible"
					>
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Morphing Shape (Default)
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Sử dụng <code>loadingVariant="loading-indicator"</code> để
									hiển thị biểu tượng loading morphing 7 hình MD3 đặc trưng. Phù
									hợp với các tác vụ sáng tạo, upload, gen AI.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<LoadingButtonDemo
									colorStyle="filled"
									loadingVariant="loading-indicator"
									label="Upload"
								/>
								<LoadingButtonDemo
									colorStyle="tonal"
									loadingVariant="loading-indicator"
									label="Generate"
								/>
							</div>
						</div>

						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Circular Spinner
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Sử dụng <code>loadingVariant="circular"</code> cho biểu tượng
									spinner tròn truyền thống. Phù hợp submit form, sync data.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<LoadingButtonDemo
									colorStyle="elevated"
									loadingVariant="circular"
									label="Submit"
								/>
								<LoadingButtonDemo
									colorStyle="outlined"
									loadingVariant="circular"
									label="Sync"
								/>
							</div>
						</div>
					</Card>
				</section>

				{/* Sizes and Shapes */}
				<section id="sizes-shapes" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Sizes & Shapes
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest overflow-visible"
					>
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Sizes
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Buttons come in 5 sizes following M3 Expressive spec. Default
									is Small (40dp). Medium=56dp, Large=96dp.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button size="xs">Extra Small</Button>
								<Button size="sm">Small (Default)</Button>
								<Button size="md">Medium</Button>
								<Button size="lg">Large</Button>
								<Button size="xl">Extra Large</Button>
							</div>
						</div>
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Shapes
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Buttons can be fully rounded (default) or slightly rounded
									squares.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Button shape="round">Round (Default)</Button>
								<Button shape="square">Square</Button>
							</div>
						</div>
					</Card>
				</section>

				{/* Usage Guidelines */}
				<section id="usage-guidelines" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Usage Guidelines
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								When to use
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant">
								<li>To submit a form or confirm an action.</li>
								<li>To trigger a new UI element to appear on screen.</li>
								<li>To specify a new step in a process.</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Best practices
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant">
								<li>
									Use the right button variant based on the action&apos;s
									priority.
								</li>
								<li>Keep button labels short and clear (1-3 words).</li>
								<li>
									Use icons to help users understand the action at a glance.
								</li>
								<li>Avoid using too many buttons on a single screen.</li>
							</ul>
						</Card>
					</div>
				</section>

				{/* Code Example */}
				<section id="code-example" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock code={buttonCode} />
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
