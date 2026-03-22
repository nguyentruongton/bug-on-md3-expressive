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

	const buttonGroupCode = `import { ButtonGroup } from '@bug-on/md3-react';
import { Button } from '@bug-on/md3-react';

export function SegmentedControl() {
  const [selected, setSelected] = useState('Day');

  return (
    <ButtonGroup>
      {['Day', 'Week', 'Month'].map((option) => (
        <Button
          key={option}
          colorStyle={selected === option ? 'filled' : 'outlined'}
          onClick={() => setSelected(option)}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}`;

	const tocItems = [
		{ id: "interactive-playground", label: "Interactive Playground" },
		{ id: "usage-guidelines", label: "Usage Guidelines" },
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
					<span className="text-m3-on-surface text-sm font-bold">
						Button Groups
					</span>
				</nav>

				{/* Content Section */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Button Groups
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Button groups (or segmented buttons) allow users to select options,
						switch views, or sort elements. They are typically used for
						single-select or multi-select choices within a specific context.
					</p>
				</div>

				{/* Interactive Playground */}
				<section id="interactive-playground" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Interactive Playground
					</h2>
					<Card
						variant="outlined"
						className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-m3-surface-container-lowest"
					>
						<div className="flex flex-col gap-12 w-full max-w-md">
							{/* Example 1: Single Select (Outlined) */}
							<div className="flex flex-col items-center gap-4">
								<h3 className="text-sm font-medium text-m3-on-surface-variant uppercase tracking-wider">
									Time Range (Single Select)
								</h3>
								<ButtonGroup>
									{["Day", "Week", "Month"].map((day) => (
										<Button
											key={day}
											colorStyle={selectedDay === day ? "filled" : "outlined"}
											onClick={() => setSelectedDay(day)}
											className={
												selectedDay === day
													? "bg-m3-secondary-container text-m3-on-secondary-container hover:bg-m3-secondary-container/80"
													: ""
											}
										>
											{selectedDay === day && (
												<Check className="w-4 h-4 mr-2" />
											)}
											{day}
										</Button>
									))}
								</ButtonGroup>
							</div>

							{/* Example 2: View Toggle (Icons + Text) */}
							<div className="flex flex-col items-center gap-4">
								<h3 className="text-sm font-medium text-m3-on-surface-variant uppercase tracking-wider">
									View Mode
								</h3>
								<ButtonGroup>
									{["List", "Grid"].map((view) => (
										<Button
											key={view}
											colorStyle={selectedView === view ? "filled" : "outlined"}
											onClick={() => setSelectedView(view)}
											className={
												selectedView === view
													? "bg-m3-secondary-container text-m3-on-secondary-container hover:bg-m3-secondary-container/80"
													: ""
											}
										>
											{view}
										</Button>
									))}
								</ButtonGroup>
							</div>

							{/* Example 3: Vertical Group */}
							<div className="flex flex-col items-center gap-4">
								<h3 className="text-sm font-medium text-m3-on-surface-variant uppercase tracking-wider">
									Vertical Orientation
								</h3>
								<ButtonGroup
									orientation="vertical"
									className="w-full max-w-[200px]"
								>
									<Button colorStyle="outlined" className="justify-start">
										<Plus className="w-4 h-4 mr-2" /> Add Item
									</Button>
									<Button colorStyle="outlined" className="justify-start">
										<Check className="w-4 h-4 mr-2" /> Mark Done
									</Button>
									<Button
										colorStyle="outlined"
										className="justify-start text-error hover:bg-error/10"
									>
										<X className="w-4 h-4 mr-2" /> Delete
									</Button>
								</ButtonGroup>
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
									Use icons consistently—either all segments have icons, or none
									do.
								</li>
								<li>
									Clearly indicate the selected state using visual contrast
									(e.g., filled vs. outlined).
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
					<CodeBlock code={buttonGroupCode} />
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
