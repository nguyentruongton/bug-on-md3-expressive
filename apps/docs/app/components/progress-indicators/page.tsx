"use client";

import {
	Button,
	Card,
	CodeBlock,
	ProgressIndicator,
	TableOfContents,
} from "@bug-on/md3-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgressPlayground } from "./playground";

export default function ProgressIndicatorPage() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((p) => (p >= 100 ? 0 : p + 10));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const progressCode = `import { ProgressIndicator, Button } from '@bug-on/md3-react';

export function ProgressExamples() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-sm">
      {/* Indeterminate Linear (Wavy) */}
      <ProgressIndicator variant="linear" shape="wavy" aria-label="Processing data..." />
      
      {/* Determinate Linear */}
      <ProgressIndicator value={60} aria-label="Uploading file (60%)" />
      
      {/* Indeterminate Circular (Wavy) */}
      <ProgressIndicator variant="circular" shape="wavy" aria-label="Loading map" />
      
      {/* Determinate Circular */}
      <ProgressIndicator variant="circular" value={75} aria-label="Disk space" />

      {/* Progress inside Buttons using \`loading\` prop */}
      <div className="flex gap-4">
        <Button loading loadingVariant="loading-indicator">Uploading</Button>
        <Button loading loadingVariant="circular" colorStyle="outlined">Synchronizing</Button>
      </div>
    </div>
  );
}`;

	const tocItems = [
		{ id: "playground", label: "Interactive Playground" },
		{ id: "linear-variants", label: "Linear Variants" },
		{ id: "circular-variants", label: "Circular Variants" },
		{ id: "use-cases", label: "Use Cases" },
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
					<span className="text-m3-on-surface text-sm font-bold">
						Progress Indicator
					</span>
				</nav>

				{/* Content Section */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Progress Indicator
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Progress indicators show the real-time status of a process. Features
						include determinate and indeterminate modes, circular indicators,
						and expressive wavy linear bars.
					</p>
				</div>

				{/* Playground */}
				<section id="playground" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Interactive Playground
					</h2>
					<ProgressPlayground />
				</section>

				{/* Linear */}
				<section id="linear-variants" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Linear Progress
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						{/* Wavy */}
						<div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="md:w-1/3">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Wavy Shape
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									The expressive wavy shape provides an organic, engaging
									animation while users wait. Handled automatically for both
									indeterminate and determinate states.
								</p>
							</div>
							<div className="md:w-1/2 w-full flex flex-col gap-6">
								<div>
									<ProgressIndicator
										variant="linear"
										shape="wavy"
										aria-label="Loading wavy indeterminate"
										waveSpeed={0.5}
										crawlerSpeed={0.2}
										value={100}
										determinateAnimation="continuous"
									/>
									<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
										Indeterminate
									</div>
								</div>
								<div>
									<ProgressIndicator
										variant="linear"
										shape="wavy"
										value={progress}
										aria-label={`Progress ${progress}% wavy`}
									/>
									<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
										Determinate
									</div>
								</div>
								<div>
									<ProgressIndicator
										variant="linear"
										shape="wavy"
										amplitude={10}
										wavelength={40}
										trackHeight={8}
										crawlerSpeed={0.2}
										gapSize={0}
										waveSpeed={0.5}
										value={50}
										aria-label="Loading wavy custom"
									/>
									<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
										Custom Amplitude & Wavelength
									</div>
								</div>
							</div>
						</div>

						{/* Flat */}
						<div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
							<div className="md:w-1/3">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Flat Shape
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									The classic straight progress bar. Represents both determinate
									timelines and unknown durations.
								</p>
							</div>
							<div className="md:w-1/2 w-full flex flex-col gap-8 justify-center items-center">
								<div className="w-full">
									<ProgressIndicator
										variant="linear"
										aria-label="Loading flat indeterminate"
									/>
									<div className="text-xs text-m3-on-surface-variant/60 mt-2 text-center">
										Indeterminate
									</div>
								</div>
								<div className="w-full">
									<ProgressIndicator
										variant="linear"
										value={progress}
										aria-label={`Progress ${progress}%`}
									/>
									<div className="text-xs text-m3-on-surface-variant/60 font-medium mt-2 text-center">
										Determinate
									</div>
								</div>
							</div>
						</div>
					</Card>
				</section>

				{/* Circular */}
				<section id="circular-variants" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Circular Progress
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						{/* Wavy */}
						<div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="md:w-1/3">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Wavy Shape
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									An expressive circular indicator that uses radial waves to
									communicate progress. Handled automatically for both
									indeterminate and determinate states.
								</p>
							</div>
							<div className="md:w-1/2 w-full flex flex-col gap-8 justify-center items-center">
								<div className="flex flex-wrap items-center gap-6 sm:gap-12 justify-center w-full">
									<div className="flex flex-col items-center gap-4 min-w-25">
										<ProgressIndicator
											variant="circular"
											shape="wavy"
											aria-label="Indeterminate circular wavy"
										/>
										<span className="text-xs text-m3-on-surface-variant">
											Indeterminate
										</span>
									</div>
									<div className="flex flex-col items-center gap-4">
										<ProgressIndicator
											variant="circular"
											shape="wavy"
											value={progress}
											aria-label={`Determinate ${progress}% wavy`}
										/>
										<span className="text-xs text-m3-on-surface-variant">
											Determinate
										</span>
									</div>
									<div className="flex flex-col items-center gap-4 pt-2">
										<ProgressIndicator
											variant="circular"
											shape="wavy"
											value={progress}
											size={52}
											trackHeight={8}
											aria-label={`Thick wavy ${progress}%`}
										/>
										<span className="text-xs text-m3-on-surface-variant text-center max-w-25">
											Thick (8dp)
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Flat */}
						<div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
							<div className="md:w-1/3">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Flat Shape
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Circular indicators display progress around a classic circle.
									Default size is 48dp, and thickness is adjustable via tracked
									height.
								</p>
							</div>
							<div className="md:w-1/2 w-full flex flex-col gap-8 justify-center items-center">
								<div className="flex flex-wrap items-center gap-6 sm:gap-12 justify-center w-full">
									<div className="flex flex-col items-center gap-4 min-w-25">
										<ProgressIndicator
											variant="circular"
											aria-label="Indeterminate circular flat"
										/>
										<span className="text-xs text-m3-on-surface-variant">
											Indeterminate
										</span>
									</div>
									<div className="flex flex-col items-center gap-4">
										<ProgressIndicator
											variant="circular"
											value={progress}
											aria-label={`Determinate ${progress}% flat`}
										/>
										<span className="text-xs text-m3-on-surface-variant">
											Determinate
										</span>
									</div>
									<div className="flex flex-col items-center gap-4">
										<ProgressIndicator
											variant="circular"
											value={progress}
											size={80}
											aria-label={`Determinate Large ${progress}% flat`}
										/>
										<span className="text-xs text-m3-on-surface-variant text-center max-w-25">
											Large (80dp)
										</span>
									</div>
								</div>
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
						className="p-6 md:p-8 flex flex-col gap-12 bg-m3-surface-container-lowest"
					>
						{/* Inside a Button */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Progress inside Buttons
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									To ensure a minimum 3:1 contrast ratio inside buttons, change
									the active indicator color to the button label text color, and
									remove the track color.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4 justify-center min-w-50">
								<Button
									colorStyle="filled"
									loading={true}
									loadingVariant="loading-indicator"
								>
									Uploading
								</Button>
								<Button
									colorStyle="outlined"
									loading={true}
									loadingVariant="circular"
								>
									Synchronizing
								</Button>
							</div>
						</div>
					</Card>
				</section>

				{/* Code Example */}
				<section id="code-example" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock code={progressCode} />
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
