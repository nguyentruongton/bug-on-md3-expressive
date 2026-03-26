"use client";

import { Chip, CodeBlock, TableOfContents } from "@bug-on/md3-react";
import {
	Bookmark,
	Calendar,
	Camera,
	ChevronRight,
	MapPin,
	Music,
	Search,
	Star,
	Tag,
	User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const Icon = ({ icon: IconComponent }: { icon: React.ElementType }) => (
	<IconComponent className="w-4.5 h-4.5" />
);

function FilterChipToggle({
	label,
	icon,
	elevated,
}: {
	label: string;
	icon?: React.ElementType;
	elevated?: boolean;
}) {
	const [selected, setSelected] = useState(false);
	return (
		<Chip
			variant="filter"
			label={label}
			selected={selected}
			elevated={elevated}
			leadingIcon={icon ? <Icon icon={icon} /> : undefined}
			onClick={() => setSelected((v) => !v)}
		/>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChipsPage() {
	const [inputTags, setInputTags] = useState([
		"React",
		"TypeScript",
		"Tailwind",
		"Framer Motion",
	]);
	const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
		null,
	);

	const removeTag = (tag: string) =>
		setInputTags((prev) => prev.filter((t) => t !== tag));

	const tocItems = [
		{ id: "overview", label: "Overview" },
		{ id: "assist", label: "Assist Chip" },
		{ id: "filter", label: "Filter Chip" },
		{ id: "input", label: "Input Chip" },
		{ id: "suggestion", label: "Suggestion Chip" },
		{ id: "states", label: "States" },
		{ id: "code-example", label: "Code Example" },
	];

	const assistCode = `import { Chip } from '@bug-on/md3-react';
import { Calendar, MapPin } from 'lucide-react';

// Flat (bordered) — default
<Chip variant="assist" label="Add to calendar" leadingIcon={<Calendar />} />

// Elevated
<Chip variant="assist" elevated label="Open in Maps" leadingIcon={<MapPin />} />`;

	const filterCode = `import { Chip } from '@bug-on/md3-react';
import { useState } from 'react';

function FilterExample() {
  const [selected, setSelected] = useState(false);
  return (
    <Chip
      variant="filter"
      label="Starred"
      selected={selected}
      onClick={() => setSelected(v => !v)}
      leadingIcon={<Star />} // replaced by ✓ when selected
    />
  );
}`;

	const inputCode = `import { Chip } from '@bug-on/md3-react';
import { useState } from 'react';

function TagsInput() {
  const [tags, setTags] = useState(['React', 'TypeScript']);
  const remove = (tag: string) => setTags(t => t.filter(x => x !== tag));
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map(tag => (
        <Chip key={tag} variant="input" label={tag} onRemove={() => remove(tag)} />
      ))}
    </div>
  );
}`;

	const suggestionCode = `import { Chip } from '@bug-on/md3-react';

<div className="flex gap-2 flex-wrap">
  <Chip variant="suggestion" label="Nearby restaurants" />
  <Chip variant="suggestion" label="Coffee shops" />
  <Chip variant="suggestion" label="Open now" />
</div>`;

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
					<span className="text-m3-on-surface text-sm font-bold">Chips</span>
				</nav>

				{/* Hero */}
				<div id="overview" className="mb-12 scroll-mt-24">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Chips
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed max-w-3xl">
						Chips help people enter information, make selections, filter
						content, or trigger actions. They appear as a group of interactive
						elements to enhance a person&apos;s current journey — unlike
						buttons, which progress them through the product.
					</p>
				</div>

				{/* ── ASSIST ────────────────────────────────────────────────────────────── */}
				<section id="assist" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Assist Chip
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Represents smart or automated actions that can span multiple apps.
						They should appear dynamically and contextually in a UI. Available
						in flat (bordered) and elevated styles.
					</p>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Flat (default)
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip variant="assist" label="Add to calendar" />
							<Chip
								variant="assist"
								label="Add to calendar"
								leadingIcon={<Calendar className="w-4.5 h-4.5" />}
							/>
							<Chip
								variant="assist"
								label="Find nearby"
								leadingIcon={<MapPin className="w-4.5 h-4.5" />}
							/>
							<Chip
								variant="assist"
								label="Take photo"
								leadingIcon={<Camera className="w-4.5 h-4.5" />}
							/>
						</div>
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Elevated
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip variant="assist" elevated label="Add to calendar" />
							<Chip
								variant="assist"
								elevated
								label="Add to calendar"
								leadingIcon={<Calendar className="w-4.5 h-4.5" />}
							/>
							<Chip
								variant="assist"
								elevated
								label="Find nearby"
								leadingIcon={<MapPin className="w-4.5 h-4.5" />}
							/>
						</div>
					</div>

					<CodeBlock code={assistCode} />
				</section>

				{/* ── FILTER ────────────────────────────────────────────────────────────── */}
				<section id="filter" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Filter Chip
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Filter chips use tags or descriptive words to filter content. They
						toggle between selected and unselected states. When selected, a
						checkmark animates in — and the outline transitions out.
					</p>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Interactive — click to toggle
						</p>
						<div className="flex flex-wrap gap-2">
							<FilterChipToggle label="Starred" />
							<FilterChipToggle label="Bookmarked" icon={Bookmark} />
							<FilterChipToggle label="Music" icon={Music} />
							<FilterChipToggle label="Photography" icon={Camera} />
						</div>
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							States preview
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip variant="filter" label="Unselected" selected={false} />
							<Chip variant="filter" label="Selected" selected />
							<Chip
								variant="filter"
								label="Icon — unselected"
								selected={false}
								leadingIcon={<Star className="w-4.5 h-4.5" />}
							/>
							<Chip
								variant="filter"
								label="Icon — selected"
								selected
								leadingIcon={<Star className="w-4.5 h-4.5" />}
							/>
						</div>
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Elevated
						</p>
						<div className="flex flex-wrap gap-2">
							<FilterChipToggle label="Elevated filter" elevated />
							<FilterChipToggle label="With icon" elevated icon={Star} />
						</div>
					</div>

					<CodeBlock code={filterCode} />
				</section>

				{/* ── INPUT ─────────────────────────────────────────────────────────────── */}
				<section id="input" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Input Chip
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Input chips represent a complex piece of information in compact
						form, such as an entity (person, place, or thing). They can include
						a leading icon or avatar, and a remove (×) button.
					</p>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Interactive — click × to remove
						</p>
						<div className="flex flex-wrap gap-2 min-h-9">
							{inputTags.length > 0 ? (
								inputTags.map((tag) => (
									<Chip
										key={tag}
										variant="input"
										label={tag}
										onRemove={() => removeTag(tag)}
									/>
								))
							) : (
								<span className="text-sm text-m3-on-surface-variant italic">
									All tags removed — reload to reset
								</span>
							)}
						</div>
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							With leading icon
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip
								variant="input"
								label="Location"
								leadingIcon={<MapPin className="w-4.5 h-4.5" />}
								onRemove={() => {}}
							/>
							<Chip
								variant="input"
								label="Calendar"
								leadingIcon={<Calendar className="w-4.5 h-4.5" />}
								onRemove={() => {}}
							/>
							<Chip
								variant="input"
								label="Tag"
								leadingIcon={<Tag className="w-4.5 h-4.5" />}
								onRemove={() => {}}
							/>
						</div>
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							With avatar
						</p>
						<div className="flex flex-wrap gap-2">
							{[
								{
									name: "Alice",
									bg: "bg-m3-primary-container text-m3-on-primary-container",
								},
								{
									name: "Bob",
									bg: "bg-m3-secondary-container text-m3-on-secondary-container",
								},
								{
									name: "Carol",
									bg: "bg-m3-tertiary-container text-m3-on-tertiary-container",
								},
							].map(({ name, bg }) => (
								<Chip
									key={name}
									variant="input"
									label={name}
									avatar={
										<span
											className={`w-full h-full flex items-center justify-center text-xs font-bold ${bg}`}
										>
											{name[0]}
										</span>
									}
									onRemove={() => {}}
								/>
							))}
						</div>
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Selected state
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip
								variant="input"
								label="Selected"
								selected
								onRemove={() => {}}
							/>
							<Chip
								variant="input"
								label="Icon — selected"
								selected
								leadingIcon={<User className="w-4.5 h-4.5" />}
								onRemove={() => {}}
							/>
						</div>
					</div>

					<CodeBlock code={inputCode} />
				</section>

				{/* ── SUGGESTION ────────────────────────────────────────────────────────── */}
				<section id="suggestion" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-3">
						Suggestion Chip
					</h2>
					<p className="text-m3-on-surface-variant mb-8 max-w-2xl">
						Suggestion chips provide dynamic suggestions that help users make
						decisions or take action based on their current context.
					</p>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Search context — click to select
						</p>
						<div className="flex flex-wrap gap-2">
							{[
								"Nearby restaurants",
								"Coffee shops",
								"Open now",
								"Highly rated",
								"Free parking",
							].map((s) => (
								<Chip
									key={s}
									variant="suggestion"
									label={s}
									leadingIcon={<Search className="w-4.5 h-4.5" />}
									onClick={() =>
										setSelectedSuggestion(s === selectedSuggestion ? null : s)
									}
									className={
										s === selectedSuggestion
											? "bg-m3-secondary-container text-m3-on-secondary-container border-transparent"
											: ""
									}
								/>
							))}
						</div>
						{selectedSuggestion && (
							<p className="mt-3 text-sm text-m3-on-surface-variant">
								Selected:{" "}
								<span className="font-medium text-m3-on-surface">
									{selectedSuggestion}
								</span>
							</p>
						)}
					</div>

					<div className="mb-6">
						<p className="text-sm text-m3-on-surface-variant font-medium mb-3">
							Elevated
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip variant="suggestion" elevated label="Add a subject" />
							<Chip variant="suggestion" elevated label="Set a date" />
							<Chip variant="suggestion" elevated label="Add location" />
						</div>
					</div>

					<CodeBlock code={suggestionCode} />
				</section>

				{/* ── STATES ────────────────────────────────────────────────────────────── */}
				<section id="states" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						States
					</h2>

					<div className="mb-8">
						<h3 className="text-lg font-medium text-m3-on-surface mb-3">
							Disabled
						</h3>
						<p className="text-sm text-m3-on-surface-variant mb-4">
							Disabled chips apply 38% opacity to text and 12% opacity to
							borders. They are removed from keyboard navigation.
						</p>
						<div className="flex flex-wrap gap-2">
							<Chip variant="assist" label="Assist" disabled />
							<Chip
								variant="assist"
								label="With icon"
								disabled
								leadingIcon={<Calendar className="w-4.5 h-4.5" />}
							/>
							<Chip variant="filter" label="Filter" disabled />
							<Chip
								variant="filter"
								label="Filter selected"
								disabled
								selected
							/>
							<Chip
								variant="input"
								label="Input"
								disabled
								onRemove={() => {}}
							/>
							<Chip variant="suggestion" label="Suggestion" disabled />
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium text-m3-on-surface mb-4">
							All variants at a glance
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{(
								[
									{ variant: "assist", label: "Assist chip" },
									{ variant: "filter", label: "Filter chip" },
									{ variant: "input", label: "Input chip" },
									{ variant: "suggestion", label: "Suggestion chip" },
								] as const
							).map(({ variant, label }) => (
								<div
									key={variant}
									className="p-4 rounded-xl border border-m3-outline-variant bg-m3-surface-container-lowest flex flex-col gap-3"
								>
									<span className="text-xs font-mono text-m3-on-surface-variant">
										variant=&quot;{variant}&quot;
									</span>
									<div className="flex gap-2 flex-wrap">
										<Chip
											variant={variant}
											label={label}
											{...(variant === "input" ? { onRemove: () => {} } : {})}
										/>
										{variant === "filter" && (
											<Chip variant="filter" label="Selected" selected />
										)}
										{variant === "assist" && (
											<Chip variant="assist" label="Elevated" elevated />
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ── CODE EXAMPLE ──────────────────────────────────────────────────────── */}
				<section id="code-example" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock
						code={`import { Chip } from '@bug-on/md3-react';

// Assist (flat / elevated)
<Chip variant="assist" label="Add to calendar" leadingIcon={<Calendar />} />
<Chip variant="assist" elevated label="Elevated" />

// Filter (controlled toggle)
<Chip variant="filter" label="Starred" selected={selected} onClick={() => setSelected(v => !v)} />

// Input with remove button
<Chip variant="input" label="React" onRemove={() => remove('React')} />

// Suggestion
<Chip variant="suggestion" label="Nearby restaurants" />`}
					/>
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
