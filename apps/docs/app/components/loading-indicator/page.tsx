"use client";

import { LoadingIndicator, Card, CodeBlock, TableOfContents, Button } from "@bug-on/md3-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LoadingIndicatorPage() {
	const indicatorCode = `import { LoadingIndicator } from '@bug-on/md3-react';

export function LoadingExamples() {
  return (
    <div className="flex gap-8 items-center">
      {/* Uncontained Variant (Default) */}
      <LoadingIndicator aria-label="Loading content" />
      
      {/* Contained Variant */}
      <LoadingIndicator variant="contained" aria-label="Authenticating" />
      
      {/* Custom Size */}
      <LoadingIndicator size={64} aria-label="Processing video" />
    </div>
  );
}`;

	const tocItems = [
		{ id: "variants", label: "Variants" },
		{ id: "sizes", label: "Sizes" },
		{ id: "code-example", label: "Code Example" },
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-12 py-12 flex flex-col xl:flex-row gap-12">
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
					<span className="text-m3-on-surface text-sm font-bold">Loading Indicator</span>
				</nav>

				{/* Content Section */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Loading Indicator
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Loading indicators display progress of a process for a short wait time (under 5 seconds) inside an element. They morph through 7 unique Material design shapes.
					</p>
				</div>

				{/* Variants */}
				<section id="variants" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Variants
					</h2>
					<Card
						variant="outlined"
						className="p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						{/* Uncontained */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Uncontained
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									The default variant seamlessly blends into its surroundings. Used often in pull-to-refresh actions.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-8 justify-center min-w-50">
								<LoadingIndicator aria-label="Loading content" />
							</div>
						</div>

						{/* Contained */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Contained
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Puts the morphing indicator inside a distinct container, boosting visibility across varied backgrounds.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-8 justify-center min-w-50">
								<LoadingIndicator variant="contained" aria-label="Loading securely" />
							</div>
						</div>
					</Card>
				</section>

				{/* Sizes */}
				<section id="sizes" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Flexible Sizing
					</h2>
					<Card
						variant="outlined"
						className="p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						<div className="flex flex-col md:flex-row items-center justify-between gap-6">
							<div className="max-w-sm">
								<p className="text-sm text-m3-on-surface-variant">
									Loading indicators automatically adapt to any size via the <code>size</code> prop (default 24dp), seamlessly scaling bounds and container shapes while preserving performance.
								</p>
							</div>
							<div className="flex items-end gap-8">
								<LoadingIndicator size={24} aria-label="Small load" />
								<LoadingIndicator size={48} aria-label="Medium load" />
								<LoadingIndicator size={96} aria-label="Large load" />
								<LoadingIndicator variant="contained" size={64} aria-label="Contained load" />
							</div>
						</div>
					</Card>
				</section>

				{/* Use Cases */}
				<section id="use-cases" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Use Cases
					</h2>
					<Card
						variant="outlined"
						className="p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						{/* Inside a Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Inside a Button
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Used to indicate that an action is ongoing, such as validating a form or checking for updates.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4 justify-center min-w-50">
								<Button colorStyle="filled">
									<LoadingIndicator aria-label="Saving" size={20} color="currentColor" />
									<span className="ml-2">Saving...</span>
								</Button>
								<Button colorStyle="tonal">
									<LoadingIndicator aria-label="Loading" size={20} color="currentColor" />
									<span className="ml-2">Loading</span>
								</Button>
							</div>
						</div>

						{/* Pull to refresh mock */}
						<div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-4">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Pull-to-refresh
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									The container variant should be visible when the loading indicator is placed over other content to provide extra contrast.
								</p>
							</div>
							<div className="flex items-center justify-center min-w-50 w-full sm:w-auto">
								<div className="relative w-64 h-48 bg-m3-surface-container rounded-xl overflow-hidden shadow-sm border border-m3-surface-variant flex items-start justify-center pt-6">
									<LoadingIndicator variant="contained" size={38} aria-label="Refreshing content" className="z-10 shadow-md rounded-full" />
									<div className="absolute inset-0 p-4 pt-20 flex flex-col gap-3 opacity-50">
										<div className="h-4 bg-m3-surface-variant rounded w-3/4"></div>
										<div className="h-4 bg-m3-surface-variant rounded w-full"></div>
										<div className="h-4 bg-m3-surface-variant rounded w-5/6"></div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</section>

				{/* Code Example */}
				<section id="code-example" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock code={indicatorCode} />
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
