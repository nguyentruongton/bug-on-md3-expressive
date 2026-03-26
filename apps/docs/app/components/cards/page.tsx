"use client";

import { Button, Card, CodeBlock, TableOfContents } from "@bug-on/md3-react";
import { ChevronRight, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CardsPage() {
	const [clickCount, setClickCount] = useState(0);

	const cardCode = `import { Card, Button } from '@bug-on/md3-react';
import { ExternalLink } from 'lucide-react';

export function CardExamples() {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* Static Elevated Card */}
      <Card variant="elevated" className="p-6 max-w-sm">
        <h3 className="text-xl font-medium mb-2">Static Card</h3>
        <p className="text-m3-on-surface-variant mb-6">
          This card is purely for displaying information and has no interactive hover or ripple effects.
        </p>
        <div className="flex justify-end">
          <Button colorStyle="tonal">Learn More</Button>
        </div>
      </Card>

      {/* Interactive Button Card */}
      <Card 
        variant="filled" 
        className="p-6 max-w-sm text-left"
        onClick={() => console.log('Card clicked!')}
      >
        <h3 className="text-xl font-medium mb-2">Interactive Card</h3>
        <p className="text-m3-on-surface-variant mb-6">
          This card is clickable. It morphs elevation on hover/press and shows a ripple effect.
        </p>
      </Card>

      {/* Link Card */}
      <Card 
        variant="outlined" 
        className="p-6 max-w-sm"
        href="https://m3.material.io"
        target="_blank"
      >
        <h3 className="text-xl font-medium mb-2 flex items-center justify-between">
          Link Card <ExternalLink className="w-5 h-5" />
        </h3>
        <p className="text-m3-on-surface-variant mb-6">
          This card renders as an &lt;a&gt; tag. Great for navigating between pages.
        </p>
      </Card>
    </div>
  );
}`;

	const tocItems = [
		{ id: "variants", label: "Card Variants" },
		{ id: "interactive-types", label: "Interactive Types" },
		{ id: "states", label: "States & A11y" },
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
					<span className="text-m3-on-surface text-sm font-bold">Cards</span>
				</nav>

				{/* Content Section */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Cards
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Cards contain content and actions about a single subject. Expressive
						cards use motion, elevation, and depth to communicate information
						hierarchy and interactivity.
					</p>
				</div>

				{/* Variants Section */}
				<section id="variants" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Card Variants
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Elevated */}
						<Card variant="elevated" className="flex flex-col">
							<div className="h-32 bg-m3-primary-container/30 flex items-center justify-center text-m3-primary mb-4 rounded-t-m3-lg">
								<ImageIcon className="w-8 h-8 opacity-50" />
							</div>
							<div className="px-6 pb-6 flex flex-col flex-1">
								<h3 className="text-xl font-medium text-m3-on-surface mb-2">
									Elevated
								</h3>
								<p className="text-m3-on-surface-variant text-sm mb-6 flex-1">
									Elevated cards use shadows to show depth and separation from
									the background.
								</p>
								<div className="flex gap-2 justify-end mt-auto">
									<Button colorStyle="text">Share</Button>
									<Button colorStyle="tonal">Explore</Button>
								</div>
							</div>
						</Card>

						{/* Filled */}
						<Card variant="filled" className="flex flex-col">
							<div className="h-32 bg-m3-secondary-container/30 flex items-center justify-center text-m3-secondary mb-4 rounded-t-m3-lg">
								<ImageIcon className="w-8 h-8 opacity-50" />
							</div>
							<div className="px-6 pb-6 flex flex-col flex-1">
								<h3 className="text-xl font-medium text-m3-on-surface mb-2">
									Filled
								</h3>
								<p className="text-m3-on-surface-variant text-sm mb-6 flex-1">
									Filled cards provide a subtle contrast using background fills
									instead of elevation.
								</p>
								<div className="flex gap-2 justify-end mt-auto">
									<Button colorStyle="text">Share</Button>
									<Button colorStyle="tonal">Explore</Button>
								</div>
							</div>
						</Card>

						{/* Outlined */}
						<Card variant="outlined" className="flex flex-col">
							<div className="h-32 bg-m3-surface-variant/20 border-b border-m3-outline-variant flex items-center justify-center text-m3-on-surface mb-4 rounded-t-m3-lg">
								<ImageIcon className="w-8 h-8 opacity-50" />
							</div>
							<div className="px-6 pb-6 flex flex-col flex-1">
								<h3 className="text-xl font-medium text-m3-on-surface mb-2">
									Outlined
								</h3>
								<p className="text-m3-on-surface-variant text-sm mb-6 flex-1">
									Outlined cards focus on clean boundaries and provide the
									lowest visual emphasis.
								</p>
								<div className="flex gap-2 justify-end mt-auto">
									<Button colorStyle="text">Share</Button>
									<Button colorStyle="tonal">Explore</Button>
								</div>
							</div>
						</Card>
					</div>
				</section>

				{/* Interactive Types */}
				<section id="interactive-types" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Interactive Types
					</h2>
					<Card
						variant="filled"
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						{/* Static Card */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-visible border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Static Card (Default)
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									A standard <code>&lt;div&gt;</code> container. Use this when
									the card itself isn't a single clickable action, but instead
									contains distinct interactive elements like buttons.
								</p>
							</div>
							<div className="flex-1 max-w-sm">
								<Card variant="elevated" className="p-6">
									<h4 className="font-medium text-m3-on-surface mb-2">
										Purely Informational
									</h4>
									<p className="text-sm text-m3-on-surface-variant mb-6">
										Hovering me won't trigger elevation changes or display
										cursor pointers.
									</p>
									<Button colorStyle="filled" className="w-full">
										Action inside
									</Button>
								</Card>
							</div>
						</div>

						{/* Button Card */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-visible border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Interactive Button Card
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Renders a <code>&lt;motion.button&gt;</code> when the{" "}
									<code>onClick</code> prop is passed. Features automatic
									elevation lifting and ripple feedback on tap.
								</p>
							</div>
							<div className="flex-1 max-w-sm">
								<Card
									variant="elevated"
									className="p-6 text-left"
									onClick={() => setClickCount((c) => c + 1)}
								>
									<h4 className="font-medium text-m3-on-surface mb-2">
										Clickable Card
									</h4>
									<p className="text-sm text-m3-on-surface-variant mb-4">
										Try clicking me to see the ripple effect and elevation
										animation in action.
									</p>
									<div className="text-m3-primary font-medium text-sm font-mono">
										Clicked: {clickCount} times
									</div>
								</Card>
							</div>
						</div>

						{/* Link Card */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-visible">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Link Card
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Renders a <code>&lt;motion.a&gt;</code> tag when the{" "}
									<code>href</code> prop is provided. Automatically appends{" "}
									<code>rel="noreferrer"</code> if target is <code>_blank</code>
									.
								</p>
							</div>
							<div className="flex-1 max-w-sm">
								<Card
									variant="elevated"
									className="p-6"
									href="https://m3.material.io/components/cards/overview"
									target="_blank"
								>
									<div className="flex justify-between items-start mb-2">
										<h4 className="font-medium text-m3-on-surface">
											External Link
										</h4>
										<ExternalLink className="w-5 h-5 text-m3-on-surface-variant" />
									</div>
									<p className="text-sm text-m3-on-surface-variant">
										Navigates to the official Material Design 3 guidelines for
										cards in a new tab.
									</p>
								</Card>
							</div>
						</div>
					</Card>
				</section>

				{/* States & A11y */}
				<section id="states" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						States & Accessibility
					</h2>
					<Card
						variant="filled"
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-visible border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Disabled State
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Passing <code>disabled</code> drops element opacity to 38%,
									disables pointers events, adds{" "}
									<code>aria-disabled="true"</code>, and removes the element
									from keyboard traversal (tabIndex=-1).
								</p>
							</div>
							<div className="flex-1 max-w-sm flex gap-4 overflow-x-auto pb-4 snap-x">
								<Card
									variant="elevated"
									className="p-6 min-w-50 shrink-0 snap-start"
									onClick={() => console.log("This will not fire")}
									disabled
								>
									<h4 className="font-medium mb-2">Disabled Elevated</h4>
									<p className="text-sm text-m3-on-surface-variant">
										Cannot interact or focus.
									</p>
								</Card>
								<Card
									variant="filled"
									className="p-6 min-w-50 shrink-0 snap-start"
									disabled
								>
									<h4 className="font-medium mb-2">Disabled Filled</h4>
									<p className="text-sm text-m3-on-surface-variant">
										Static disabled card.
									</p>
								</Card>
								<Card
									variant="outlined"
									className="p-6 min-w-50 shrink-0 snap-start"
									href="/disabled"
									disabled
								>
									<h4 className="font-medium mb-2">Disabled Link</h4>
									<p className="text-sm text-m3-on-surface-variant">
										Href is removed from DOM.
									</p>
								</Card>
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
								<li>To group related information together visually.</li>
								<li>To present a summary of a larger detail view.</li>
								<li>As an interactive entry point to more complex content.</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Best practices
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant">
								<li>
									Avoid nesting cards within cards. Instead, use dividers or
									spacing.
								</li>
								<li>
									If the entire card is actionable, use <code>onClick</code> or{" "}
									<code>href</code> instead of adding a single button inside.
								</li>
								<li>
									Ensure cards have enough padding (e.g. <code>p-4</code> or{" "}
									<code>p-6</code>) for readability.
								</li>
							</ul>
						</Card>
					</div>
				</section>

				{/* Code Example */}
				<section id="code-example" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock code={cardCode} />
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
