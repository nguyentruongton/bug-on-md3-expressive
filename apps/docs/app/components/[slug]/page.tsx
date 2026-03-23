"use client";

import { Button, Card, TableOfContents } from "@bug-on/md3-react";
import { ArrowUp, ChevronRight, Maximize } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ComponentPage() {
	const params = useParams();
	const slug = params.slug as string;

	// Format slug back to title (e.g., "navigation-bar" -> "Navigation Bar")
	const title = slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	const tocItems = [
		{ id: "variants", label: `${title} Variants` },
		{ id: "motion", label: "Expressive Motion" },
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
					<span className="text-m3-on-surface text-sm font-bold">{title}</span>
				</nav>

				{/* Content Section */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						{title}
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						{title} contain content and actions about a single subject.
						Expressive {title.toLowerCase()} use motion, elevation, and depth to
						communicate information hierarchy and interactivity.
					</p>
				</div>

				{/* Card Types Section (Generic for now) */}
				<section id="variants" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						{title} Variants
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card variant="elevated">
							<div className="h-40 bg-m3-primary-container/30 rounded-m3-md mb-4 flex items-center justify-center text-m3-on-primary-container font-bold">
								Elevated
							</div>
							<p className="text-m3-on-surface-variant text-sm mb-6">
								Elevated {title.toLowerCase()} use shadows to show depth and
								separation from the background.
							</p>
							<Button colorStyle="text" className="self-start mt-auto -ml-4">
								VIEW MORE
							</Button>
						</Card>

						<Card variant="filled">
							<div className="h-40 bg-m3-secondary-container/30 rounded-m3-md mb-4 flex items-center justify-center text-m3-on-secondary-container font-bold">
								Filled
							</div>
							<p className="text-m3-on-surface-variant text-sm mb-6">
								Filled {title.toLowerCase()} provide a subtle contrast using
								background fills instead of elevation.
							</p>
							<Button colorStyle="text" className="self-start mt-auto -ml-4">
								VIEW MORE
							</Button>
						</Card>

						<Card variant="outlined">
							<div className="h-40 border-2 border-m3-outline/20 rounded-m3-md mb-4 flex items-center justify-center text-m3-on-surface font-bold">
								Outlined
							</div>
							<p className="text-m3-on-surface-variant text-sm mb-6">
								Outlined {title.toLowerCase()} focus on clean boundaries and
								provide the lowest visual emphasis.
							</p>
							<Button colorStyle="text" className="self-start mt-auto -ml-4">
								VIEW MORE
							</Button>
						</Card>
					</div>
				</section>

				{/* Motion Section */}
				<section
					id="motion"
					className="bg-m3-surface-container rounded-m3-xl p-6 md:p-8 mb-20 scroll-mt-24"
				>
					<div className="flex flex-col lg:flex-row gap-12">
						<div className="flex-1">
							<h2 className="text-2xl font-medium text-m3-on-surface mb-4">
								Expressive Motion
							</h2>
							<p className="text-m3-on-surface-variant mb-6 leading-relaxed">
								Motion in MD3 {title.toLowerCase()} isn&apos;t just decoration.
								It communicates change of state and focus. When a user interacts
								with an expressive {title.toLowerCase()}:
							</p>
							<ul className="space-y-6">
								<li className="flex gap-4">
									<ArrowUp className="w-6 h-6 text-m3-primary shrink-0" />
									<div>
										<p className="font-medium text-m3-on-surface text-sm mb-1">
											Vertical Lift
										</p>
										<p className="text-sm text-m3-on-surface-variant">
											Elevation increases to simulate interaction.
										</p>
									</div>
								</li>
								<li className="flex gap-4">
									<Maximize className="w-6 h-6 text-m3-primary shrink-0" />
									<div>
										<p className="font-medium text-m3-on-surface text-sm mb-1">
											Scale Transition
										</p>
										<p className="text-sm text-m3-on-surface-variant">
											The element slightly expands on focus.
										</p>
									</div>
								</li>
							</ul>
						</div>

						<div className="flex-1 flex items-center justify-center">
							<Card
								variant="elevated"
								className="w-full max-w-sm bg-m3-surface"
							>
								<div className="flex items-center gap-4 mb-6">
									<div className="w-12 h-12 rounded-m3-full bg-m3-primary-container flex items-center justify-center text-m3-on-primary-container font-bold text-lg">
										{title.charAt(0)}
									</div>
									<div>
										<h4 className="font-medium text-m3-on-surface">
											Interactive {title}
										</h4>
										<p className="text-xs text-m3-on-surface-variant">
											Preview Element
										</p>
									</div>
								</div>
								<div className="space-y-3">
									<div className="h-2.5 bg-m3-surface-variant rounded-m3-full w-full"></div>
									<div className="h-2.5 bg-m3-surface-variant rounded-m3-full w-5/6"></div>
								</div>
							</Card>
						</div>
					</div>
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
