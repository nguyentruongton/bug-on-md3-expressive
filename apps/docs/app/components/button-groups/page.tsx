"use client";

import {
	Button,
	ButtonGroup,
	Card,
	CodeBlock,
	TableOfContents,
} from "@bug-on/md3-react";
import { Check, ChevronRight, Plus, X } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ButtonGroupsPage() {
	const [selectedDay, setSelectedDay] = React.useState("Day");
	const [selectedView, setSelectedView] = React.useState("List");
	const [selectedSizes, setSelectedSizes] = React.useState<string[]>(["M"]);

	const toggleSize = (size: string) => {
		setSelectedSizes((prev) =>
			prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
		);
	};

	const standardCode = `<ButtonGroup variant="standard">
  <Button colorStyle="tonal">Cancel</Button>
  <Button colorStyle="filled">Save Changes</Button>
</ButtonGroup>`;

	const connectedCode = `<ButtonGroup variant="connected" showCheck>
  <Button variant="toggle" selected={true}>8 oz</Button>
  <Button variant="toggle" selected={false}>12 oz</Button>
  <Button variant="toggle" selected={false}>16 oz</Button>
</ButtonGroup>`;

	const tocItems = [
		{ id: "standard-variant", label: "Standard Variant" },
		{ id: "connected-variant", label: "Connected Variant" },
		{ id: "orientation", label: "Orientation" },
		{ id: "use-cases", label: "Practical Use Cases" },
		{ id: "usage-guidelines", label: "Usage Guidelines" },
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
					<span className="text-m3-on-surface text-sm font-bold">
						Button Groups
					</span>
				</nav>

				{/* Header */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Button Groups
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Button groups allow users to group related actions or selections.
						They come in two primary flavors: <b>Standard</b> (spaced) and{" "}
						<b>Connected</b> (segmented).
					</p>
				</div>

				{/* Section 1: Standard Variant */}
				<section id="standard-variant" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-4">
						Standard Variant
					</h2>
					<p className="text-m3-on-surface-variant mb-8 leading-relaxed">
						The standard variant maintains a gap between buttons. In horizontal
						orientation, it features a unique <b>fluid expansion effect</b>{" "}
						where the pressed button expands slightly while others contract,
						creating a highly expressive interaction.
					</p>

					<Card
						variant="outlined"
						className="p-6 md:p-8 mb-6 bg-m3-surface-container-lowest"
					>
						<div className="flex flex-col items-center justify-center gap-8 py-10">
							<div className="flex flex-col items-center gap-2">
								<span className="text-xs font-medium text-m3-on-surface-variant uppercase tracking-widest mb-4">
									Try clicking and holding
								</span>
								<ButtonGroup variant="standard" className="flex-wrap justify-center">
									<Button colorStyle="tonal" className="min-w-28 mb-2">
										Cancel
									</Button>
									<Button colorStyle="filled" className="min-w-28 mb-2">
										Save Changes
									</Button>
								</ButtonGroup>
							</div>

							<div className="flex flex-col items-center gap-2 mt-8">
								<span className="text-xs font-medium text-m3-on-surface-variant uppercase tracking-widest mb-4">
									Without Morphing Effect
								</span>
								<ButtonGroup variant="standard" morphingWidth={false} className="flex-wrap justify-center">
									<Button colorStyle="tonal" className="min-w-28 mb-2">
										Cancel
									</Button>
									<Button colorStyle="filled" className="min-w-28 mb-2">
										Save Changes
									</Button>
								</ButtonGroup>
							</div>
						</div>
					</Card>
					<CodeBlock code={standardCode} />
				</section>

				{/* Section 2: Connected Variant */}
				<section id="connected-variant" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-4">
						Connected Variant
					</h2>
					<p className="text-m3-on-surface-variant mb-8 leading-relaxed">
						Connected groups (also known as Segmented Buttons) join buttons
						together for a seamless look. Roundness is automatically removed
						from inner corners to create a unified component.
					</p>

					<Card
						variant="outlined"
						className="p-6 md:p-8 mb-6 bg-m3-surface-container-lowest"
					>
						<div className="flex flex-col items-center justify-center gap-8 py-10">
							<div className="flex flex-col items-center gap-4 w-full">
								<span className="text-sm font-medium text-m3-on-surface-variant">
									Default Size (sm) - Inner Radius: 8px
								</span>
								<ButtonGroup variant="connected" showCheck className="flex-wrap justify-center">
									{["Day", "Week", "Month", "Year"].map((item) => (
										<Button
											key={`sm-${item}`}
											variant="toggle"
											selected={selectedDay === item}
											onClick={() => setSelectedDay(item)}
											className="mb-2"
										>
											{item}
										</Button>
									))}
								</ButtonGroup>
							</div>

							<div className="flex flex-col items-center gap-4 w-full mt-8">
								<span className="text-sm font-medium text-m3-on-surface-variant">
									Large Size (lg) - Inner Radius: 16px
								</span>
								<ButtonGroup variant="connected" size="lg" className="flex-wrap justify-center">
									{["Day", "Week", "Month", "Year"].map((item) => (
										<Button
											key={`lg-${item}`}
											variant="toggle"
											selected={selectedDay === item}
											onClick={() => setSelectedDay(item)}
											className="mb-2"
										>
											{item}
										</Button>
									))}
								</ButtonGroup>
							</div>
						</div>
					</Card>
					<CodeBlock code={connectedCode} />
				</section>

				{/* Section 3: Orientation */}
				<section id="orientation" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-4">
						Orientation
					</h2>
					<p className="text-m3-on-surface-variant mb-8 leading-relaxed">
						Both variants support horizontal and vertical orientations.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
						<Card
							variant="outlined"
							className="p-8 flex flex-col items-center gap-6"
						>
							<h3 className="text-sm font-bold text-m3-on-surface-variant uppercase tracking-wider">
								Vertical Standard
							</h3>
							<ButtonGroup orientation="vertical" className="w-full max-w-60">
								<Button
									colorStyle="outlined"
									className="justify-start"
									icon={<Plus className="w-4 h-4" />}
								>
									New Task
								</Button>
								<Button
									colorStyle="outlined"
									className="justify-start"
									icon={<Check className="w-4 h-4" />}
								>
									Mark Done
								</Button>
								<Button
									colorStyle="tonal"
									className="justify-start"
									icon={<X className="w-4 h-4" />}
								>
									Dismiss
								</Button>
							</ButtonGroup>
						</Card>

						<Card
							variant="outlined"
							className="p-8 flex flex-col items-center gap-6"
						>
							<h3 className="text-sm font-bold text-m3-on-surface-variant uppercase tracking-wider">
								Vertical Connected
							</h3>
							<ButtonGroup
								variant="connected"
								orientation="vertical"
								className="w-40"
							>
								{["List", "Grid", "Calendar"].map((view) => (
									<Button
										key={view}
										variant="toggle"
										selected={selectedView === view}
										onClick={() => setSelectedView(view)}
										className="justify-start"
									>
										{view}
									</Button>
								))}
							</ButtonGroup>
						</Card>
					</div>
				</section>

				{/* Section 4: Use Cases */}
				<section id="use-cases" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-4">
						Practical Use Cases
					</h2>
					<p className="text-m3-on-surface-variant mb-8 leading-relaxed">
						Explore various ways to combine buttons within a group.
					</p>

					<div className="flex flex-col gap-8">
						{/* Multi-select */}
						<Card variant="outlined" className="p-8">
							<h3 className="text-lg font-medium mb-4">
								Multi-selection (Toggle)
							</h3>
							<p className="text-sm text-m3-on-surface-variant mb-6">
								Allow users to select multiple options in a single group.
							</p>
							<ButtonGroup variant="connected">
								{["S", "M", "L", "XL"].map((size) => (
									<Button
										key={size}
										variant="toggle"
										selected={selectedSizes.includes(size)}
										onClick={() => toggleSize(size)}
									>
										{size}
									</Button>
								))}
							</ButtonGroup>
						</Card>

						{/* Icon Only */}
						<Card variant="outlined" className="p-8">
							<h3 className="text-lg font-medium mb-4">Icon-only Toolbar</h3>
							<p className="text-sm text-m3-on-surface-variant mb-6">
								Compact groups for editing or formatting actions.
							</p>
							<div className="flex gap-8">
								<ButtonGroup variant="connected">
									<Button
										variant="toggle"
										selected={false}
										className="px-3"
										title="Bold"
									>
										<span className="font-bold">B</span>
									</Button>
									<Button
										variant="toggle"
										selected={false}
										className="px-3"
										title="Italic"
									>
										<span className="italic">I</span>
									</Button>
									<Button
										variant="toggle"
										selected={false}
										className="px-3"
										title="Underline"
									>
										<span className="underline">U</span>
									</Button>
								</ButtonGroup>

								<ButtonGroup variant="standard">
									<Button colorStyle="tonal" className="px-3">
										<Plus className="w-5 h-5" />
									</Button>
									<Button colorStyle="filled" className="px-3">
										<X className="w-5 h-5" />
									</Button>
								</ButtonGroup>
							</div>
						</Card>
					</div>
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
								<li>
									To switch between different views of the same data (e.g., Map
									vs. List).
								</li>
								<li>
									To filter content based on mutually exclusive categories.
								</li>
								<li>
									To group related actions that affect a specific object or
									area.
								</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Best practices
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant">
								<li>
									Keep the number of segments between 2 and 5 for optimal
									usability.
								</li>
								<li>
									Ensure text labels are concise and clearly differentiate the
									options.
								</li>
								<li>
									Clearly indicate the selected state using visual contrast or
									the `toggle` variant.
								</li>
								<li>
									Use <b>Standard</b> variant for distinctive actions and{" "}
									<b>Connected</b>
									variant for choosing options (Segmented Buttons).
								</li>
							</ul>
						</Card>
					</div>
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
