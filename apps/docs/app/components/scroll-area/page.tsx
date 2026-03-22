"use client";

import {
	Card,
	CodeBlock,
	ScrollArea,
	TableOfContents,
} from "@bug-on/md3-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Demo data ────────────────────────────────────────────────────────────────
const TAGS = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);

const COLS = [
	{ name: "Column A", value: 756 },
	{ name: "Column B", value: 324 },
	{ name: "Column C", value: 912 },
	{ name: "Column D", value: 489 },
	{ name: "Column E", value: 671 },
	{ name: "Column F", value: 125 },
	{ name: "Column G", value: 890 },
	{ name: "Column H", value: 543 },
	{ name: "Column I", value: 216 },
	{ name: "Column J", value: 789 },
	{ name: "Column K", value: 432 },
	{ name: "Column L", value: 654 },
];

// ─── Code snippet ─────────────────────────────────────────────────────────────
const CODE = `import { ScrollArea } from '@bug-on/md3-react';

// Vertical (default — hide scrollbar until hover)
<ScrollArea className="h-64 w-64">
  {/* content */}
</ScrollArea>

// Always-visible scrollbar
<ScrollArea type="always" className="h-64 w-64">
  {/* content */}
</ScrollArea>

// Horizontal
<ScrollArea orientation="horizontal" className="w-full">
  {/* wide content */}
</ScrollArea>

// Both axes
<ScrollArea orientation="both" className="h-64 w-96">
  {/* 2D content */}
</ScrollArea>`;

// ─── TOC ──────────────────────────────────────────────────────────────────────
const TOC = [
	{ id: "vertical", label: "Vertical Scroll" },
	{ id: "horizontal", label: "Horizontal Scroll" },
	{ id: "both", label: "Both Axes" },
	{ id: "behavior", label: "Behavior Variants" },
	{ id: "usage", label: "Usage Guidelines" },
	{ id: "code", label: "Code Example" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ScrollAreaPage() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-12 py-12 flex flex-col xl:flex-row gap-12">
			<div className="flex-1 min-w-0">
				{/* Breadcrumbs */}
				<nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
					<Link
						className="text-m3-primary font-medium text-sm hover:underline"
						href="/components"
					>
						Components
					</Link>
					<ChevronRight
						className="w-4 h-4 text-m3-on-surface-variant"
						aria-hidden="true"
					/>
					<span
						className="text-m3-on-surface text-sm font-bold"
						aria-current="page"
					>
						Scroll Area
					</span>
				</nav>

				{/* Hero */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Scroll Area
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Augments native scroll functionality for custom, cross-browser
						styling with a minimal, MD3 Expressive pill-shaped scrollbar.
					</p>
				</div>

				{/* ── Vertical ──────────────────────────────────────────────────── */}
				<section id="vertical" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-2">
						Vertical Scroll
					</h2>
					<p className="text-m3-on-surface-variant mb-8">
						The default orientation. Hover over the container to show the
						scrollbar.
					</p>
					<Card
						variant="outlined"
						className="p-8 bg-m3-surface-container-lowest"
					>
						<div className="flex flex-col sm:flex-row gap-8 items-start">
							{/* Demo */}
							<ScrollArea
								className="h-64 w-52 rounded-m3-md bg-m3-surface-container"
								aria-label="Vertical scroll area demo"
							>
								<div className="p-4 space-y-2">
									{TAGS.map((tag) => (
										<div
											key={tag}
											className="px-3 py-2 rounded-m3-sm bg-m3-surface-container-high text-sm text-m3-on-surface"
										>
											{tag}
										</div>
									))}
								</div>
							</ScrollArea>

							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Default behaviour
								</h3>
								<ul className="space-y-2 text-sm text-m3-on-surface-variant list-disc list-inside">
									<li>
										<code className="text-m3-primary">type="hover"</code>{" "}
										(default) — scrollbar appears on hover.
									</li>
									<li>Pill-shaped thumb with soft opacity.</li>
									<li>Grows visual weight on hover / active for clarity.</li>
									<li>
										Full keyboard navigation supported (Tab, ↑↓, PgUp/PgDn).
									</li>
								</ul>
							</div>
						</div>
					</Card>
				</section>

				{/* ── Horizontal ────────────────────────────────────────────────── */}
				<section id="horizontal" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-2">
						Horizontal Scroll
					</h2>
					<p className="text-m3-on-surface-variant mb-8">
						Set{" "}
						<code className="text-m3-primary font-mono text-sm">
							orientation="horizontal"
						</code>{" "}
						to scroll wide content.
					</p>
					<Card
						variant="outlined"
						className="p-8 bg-m3-surface-container-lowest"
					>
						<ScrollArea
							orientation="horizontal"
							className="rounded-m3-md bg-m3-surface-container pb-2"
							aria-label="Horizontal scroll area demo"
						>
							<div className="flex gap-3 p-4 w-max">
								{COLS.map((col) => (
									<div
										key={col.name}
										className="flex flex-col items-center gap-2 min-w-20"
									>
										<div
											className="w-16 rounded-m3-sm bg-m3-primary/80"
											style={{ height: `${(col.value / 999) * 160}px` }}
											role="img"
											aria-label={`${col.name}: ${col.value}`}
										/>
										<span className="text-xs text-m3-on-surface-variant">
											{col.name}
										</span>
										<span className="text-xs font-medium text-m3-on-surface">
											{col.value}
										</span>
									</div>
								))}
							</div>
						</ScrollArea>
					</Card>
				</section>

				{/* ── Both axes ─────────────────────────────────────────────────── */}
				<section id="both" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-2">
						Both Axes
					</h2>
					<p className="text-m3-on-surface-variant mb-8">
						<code className="text-m3-primary font-mono text-sm">
							orientation="both"
						</code>{" "}
						renders both scrollbars with a corner filler.
					</p>
					<Card
						variant="outlined"
						className="p-8 bg-m3-surface-container-lowest"
					>
						<ScrollArea
							orientation="both"
							className="h-56 w-full max-w-lg rounded-m3-md bg-m3-surface-container"
							aria-label="Two-dimensional scroll area demo"
						>
							<table className="min-w-175 text-sm text-m3-on-surface border-collapse">
								<thead>
									<tr className="border-b border-m3-outline-variant sticky top-0 bg-m3-surface-container-high">
										{[
											"#",
											"Name",
											"Value",
											"Type",
											"Status",
											"Date",
											"Tags",
										].map((h) => (
											<th
												key={h}
												scope="col"
												className="px-4 py-3 text-left font-medium text-m3-on-surface-variant whitespace-nowrap"
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{Array.from({ length: 30 }).map((_, i) => {
										const rowId = `mock-row-${i}`;
										return (
											<tr
												key={rowId}
												className="border-b border-m3-outline-variant/40 hover:bg-m3-on-surface/5 transition-colors"
											>
												<td className="px-4 py-2 text-m3-on-surface-variant">
													{i + 1}
												</td>
												<td className="px-4 py-2 whitespace-nowrap">
													Item {i + 1}
												</td>
												<td className="px-4 py-2">{100 + ((i * 27) % 899)}</td>
												<td className="px-4 py-2">
													{["Alpha", "Beta", "Gamma"][i % 3]}
												</td>
												<td className="px-4 py-2">
													<span className="px-2 py-0.5 rounded-full text-xs bg-m3-primary/10 text-m3-primary">
														{["Active", "Pending", "Done"][i % 3]}
													</span>
												</td>
												<td className="px-4 py-2 whitespace-nowrap">
													2025-0{(i % 9) + 1}-{String(i + 1).padStart(2, "0")}
												</td>
												<td className="px-4 py-2">{TAGS[i % 10]}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</ScrollArea>
					</Card>
				</section>

				{/* ── Behavior Variants ─────────────────────────────────────────── */}
				<section id="behavior" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-2">
						Behavior Variants
					</h2>
					<p className="text-m3-on-surface-variant mb-8">
						Control when the scrollbar is visible via the{" "}
						<code className="text-m3-primary font-mono text-sm">type</code>{" "}
						prop.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{(
							[
								{
									type: "hover",
									label: "hover (default)",
									desc: "Shows scrollbar only when the pointer enters the container.",
								},
								{
									type: "scroll",
									label: "scroll",
									desc: "Shows scrollbar only while actively scrolling.",
								},
								{
									type: "always",
									label: "always",
									desc: "Scrollbar is always visible — best for accessibility.",
								},
								{
									type: "none",
									label: "none",
									desc: "Scrollbar is hidden entirely (native scrolling still works).",
								},
							] as const
						).map(({ type, label, desc }) => (
							<Card
								key={type}
								variant="outlined"
								className="p-6 bg-m3-surface-container-lowest flex flex-col gap-4"
							>
								<div>
									<code className="text-m3-primary font-mono text-sm">
										type="{type}"
									</code>
									<p className="text-xs text-m3-on-surface-variant mt-1">
										{desc}
									</p>
								</div>
								<ScrollArea
									type={type}
									className="h-36 rounded-m3-sm bg-m3-surface-container"
									aria-label={`Scroll area with type ${type}`}
								>
									<div className="p-3 space-y-1.5">
										{TAGS.slice(0, 20).map((tag) => (
											<div
												key={tag}
												className="px-2 py-1 rounded text-xs text-m3-on-surface bg-m3-surface-container-high"
											>
												{tag}
											</div>
										))}
									</div>
								</ScrollArea>
								<p className="text-sm font-medium text-m3-on-surface">
									{label}
								</p>
							</Card>
						))}
					</div>
				</section>

				{/* ── Usage Guidelines ──────────────────────────────────────────── */}
				<section id="usage" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Usage Guidelines
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								When to use
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant">
								<li>
									Long lists or content that exceeds the container height.
								</li>
								<li>Wide data tables that extend beyond the viewport.</li>
								<li>Chat message feeds, timelines, or logs.</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Best practices
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant">
								<li>
									Always define a fixed height or max-height on the container.
								</li>
								<li>
									Prefer <code>type="always"</code> when scrollability
									isn&apos;t obvious from context.
								</li>
								<li>
									Use <code>type="scroll"</code> for compact mobile experiences.
								</li>
								<li>Never rely on native scrollbars for consistent styling.</li>
							</ul>
						</Card>
					</div>
				</section>

				{/* ── Code ──────────────────────────────────────────────────────── */}
				<section id="code" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock code={CODE} />
				</section>
			</div>

			<TableOfContents items={TOC} />
		</div>
	);
}
