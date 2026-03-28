"use client";

import type { BaseIconButtonProps } from "@bug-on/md3-react";
import {
	Card,
	CodeBlock,
	IconButton,
	TableOfContents,
} from "@bug-on/md3-react";
import {
	Bookmark,
	ChevronRight,
	Edit3,
	Heart,
	Loader2,
	Plus,
	Search,
	Settings,
	Share2,
	Star,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── Local Helpers ─────────────────────────────────────────────────────────────

function LoadingIconButtonDemo(
	props: Omit<BaseIconButtonProps, "children"> & {
		icon: React.ReactNode;
	},
) {
	const [isLoading, setIsLoading] = useState(false);
	const { icon, ...rest } = props;

	useEffect(() => {
		if (isLoading) {
			const timer = setTimeout(() => setIsLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	return (
		<IconButton
			loading={isLoading}
			onClick={() => setIsLoading(true)}
			{...rest}
		>
			{icon}
		</IconButton>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IconButtonsPage() {
	const [likedFilled, setLikedFilled] = useState(false);
	const [likedTonal, setLikedTonal] = useState(false);
	const [bookmarkedOutlined, setBookmarkedOutlined] = useState(false);
	const [starredStandard, setStarredStandard] = useState(false);

	const [shapeFilled, setShapeFilled] = useState(false);
	const [shapeTonal, setShapeTonal] = useState(false);

	const codeExample = `import { IconButton } from '@bug-on/md3-react';
import { Heart, Star, Bookmark, Settings } from 'lucide-react';

// Standard (default)
<IconButton aria-label="Cài đặt">
  <Settings />
</IconButton>

// Filled
<IconButton aria-label="Yêu thích" colorStyle="filled">
  <Heart />
</IconButton>

// Tonal
<IconButton aria-label="Đánh dấu" colorStyle="tonal">
  <Star />
</IconButton>

// Outlined
<IconButton aria-label="Lưu" colorStyle="outlined">
  <Bookmark />
</IconButton>

// Toggle button
<IconButton
  aria-label={isLiked ? "Bỏ thích" : "Thích"}
  colorStyle="filled"
  variant="toggle"
  selected={isLiked}
  onClick={() => setIsLiked(!isLiked)}
>
  <Heart />
</IconButton>

// All sizes
<IconButton aria-label="Nhỏ nhất" size="xs"><Heart /></IconButton>
<IconButton aria-label="Nhỏ" size="sm"><Heart /></IconButton>
<IconButton aria-label="Vừa" size="md"><Heart /></IconButton>
<IconButton aria-label="Lớn" size="lg"><Heart /></IconButton>
<IconButton aria-label="Rất lớn" size="xl"><Heart /></IconButton>

// Loading
<IconButton aria-label="Đang tải" loading colorStyle="filled">
  <Search />
</IconButton>`;

	const tocItems = [
		{ id: "icon-button-types", label: "Icon Button Types" },
		{ id: "toggle-morph", label: "Toggle & Shape Morph" },
		{ id: "sizes", label: "Sizes" },
		{ id: "shapes", label: "Shapes" },
		{ id: "loading-state", label: "Loading State" },
		{ id: "usage-guidelines", label: "Usage Guidelines" },
		{ id: "code-example", label: "Code Example" },
	];

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
					<ChevronRight
						className="w-4 h-4 text-m3-on-surface-variant"
						aria-hidden="true"
					/>
					<span className="text-m3-on-surface text-sm font-bold">
						Icon Buttons
					</span>
				</nav>

				{/* Hero */}
				<div className="mb-12">
					<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
						Icon Buttons
					</h1>
					<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
						Icon buttons let people take action with a single icon. They are
						compact, high-density components used for the most frequent actions
						— like liking, bookmarking, or sharing. They morph in shape and
						color to communicate context and state.
					</p>
				</div>

				{/* ── Section 1: Types ──────────────────────────────────── */}
				<section id="icon-button-types" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Icon Button Types
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-10 bg-m3-surface-container-lowest"
					>
						{/* Standard */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Standard
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Low emphasis. No container background. Suitable for toolbars
									and secondary actions. Uses <code>on-surface-variant</code>{" "}
									color; turns <code>primary</code> when selected.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<IconButton aria-label="Thêm">
									<Plus />
								</IconButton>
								<IconButton aria-label="Cài đặt">
									<Settings />
								</IconButton>
								<IconButton aria-label="Chỉnh sửa">
									<Edit3 />
								</IconButton>
								<IconButton aria-label="Chia sẻ" disabled>
									<Share2 />
								</IconButton>
							</div>
						</div>

						{/* Filled */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Filled
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									High emphasis with a <code>surface-container</code>{" "}
									background. Use for the primary icon action. Selected state
									switches to <code>primary</code> fill.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<IconButton aria-label="Thêm" colorStyle="filled">
									<Plus />
								</IconButton>
								<IconButton aria-label="Tìm kiếm" colorStyle="filled">
									<Search />
								</IconButton>
								<IconButton aria-label="Xóa" colorStyle="filled">
									<Trash2 />
								</IconButton>
								<IconButton
									aria-label="Thêm (disabled)"
									colorStyle="filled"
									disabled
								>
									<Plus />
								</IconButton>
							</div>
						</div>

						{/* Tonal */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Filled Tonal
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Middle-ground emphasis using <code>secondary-container</code>.
									Selected state switches to <code>secondary</code>. Softer than
									filled.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<IconButton aria-label="Yêu thích" colorStyle="tonal">
									<Heart />
								</IconButton>
								<IconButton aria-label="Đánh dấu sao" colorStyle="tonal">
									<Star />
								</IconButton>
								<IconButton aria-label="Chia sẻ" colorStyle="tonal">
									<Share2 />
								</IconButton>
								<IconButton
									aria-label="Chia sẻ (disabled)"
									colorStyle="tonal"
									disabled
								>
									<Share2 />
								</IconButton>
							</div>
						</div>

						{/* Outlined */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Outlined
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									Medium emphasis with a border (width scales per size: 1–3dp).
									No fill. Selected state uses <code>inverse-surface</code> fill
									and removes the border.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<IconButton aria-label="Lưu" colorStyle="outlined">
									<Bookmark />
								</IconButton>
								<IconButton aria-label="Chỉnh sửa" colorStyle="outlined">
									<Edit3 />
								</IconButton>
								<IconButton aria-label="Cài đặt" colorStyle="outlined">
									<Settings />
								</IconButton>
								<IconButton
									aria-label="Lưu (disabled)"
									colorStyle="outlined"
									disabled
								>
									<Bookmark />
								</IconButton>
							</div>
						</div>
					</Card>
				</section>

				{/* ── Section 2: Toggle & Shape Morph ──────────────────── */}
				<section id="toggle-morph" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Toggle &amp; Shape Morph
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-10 bg-m3-surface-container-lowest overflow-visible"
					>
						<p className="text-sm text-m3-on-surface-variant max-w-2xl">
							Toggle icon buttons morph shape when selected:{" "}
							<strong>round → square</strong> (or vice versa). The transition is
							driven by spring animation using exact <code>CornerFull</code> →{" "}
							<code>CornerMedium/ExtraLarge</code> values from MD3
							ShapeKeyTokens. Click any button below to see it live.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* Filled toggle */}
							<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
								<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
									Filled Toggle
								</p>
								<div className="flex items-center gap-6">
									<IconButton
										aria-label={likedFilled ? "Bỏ thích" : "Thích"}
										colorStyle="filled"
										variant="toggle"
										selected={likedFilled}
										onClick={() => setLikedFilled(!likedFilled)}
										size="md"
									>
										<Heart className={likedFilled ? "fill-current" : ""} />
									</IconButton>
									<span className="text-sm text-m3-on-surface-variant italic">
										{likedFilled
											? "Selected → square shape, primary fill"
											: "Unselected → round shape, surface-container"}
									</span>
								</div>
							</div>

							{/* Tonal toggle */}
							<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
								<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
									Tonal Toggle
								</p>
								<div className="flex items-center gap-6">
									<IconButton
										aria-label={likedTonal ? "Bỏ đánh dấu" : "Đánh dấu"}
										colorStyle="tonal"
										variant="toggle"
										selected={likedTonal}
										onClick={() => setLikedTonal(!likedTonal)}
										size="md"
									>
										<Star className={likedTonal ? "fill-current" : ""} />
									</IconButton>
									<span className="text-sm text-m3-on-surface-variant italic">
										{likedTonal
											? "Selected → secondary fill"
											: "Unselected → secondary-container"}
									</span>
								</div>
							</div>

							{/* Outlined toggle */}
							<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
								<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
									Outlined Toggle
								</p>
								<div className="flex items-center gap-6">
									<IconButton
										aria-label={bookmarkedOutlined ? "Bỏ lưu" : "Lưu"}
										colorStyle="outlined"
										variant="toggle"
										selected={bookmarkedOutlined}
										onClick={() => setBookmarkedOutlined(!bookmarkedOutlined)}
										size="md"
									>
										<Bookmark
											className={bookmarkedOutlined ? "fill-current" : ""}
										/>
									</IconButton>
									<span className="text-sm text-m3-on-surface-variant italic">
										{bookmarkedOutlined
											? "Selected → inverse-surface, no border"
											: "Unselected → bordered, transparent bg"}
									</span>
								</div>
							</div>

							{/* Standard toggle */}
							<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
								<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
									Standard Toggle
								</p>
								<div className="flex items-center gap-6">
									<IconButton
										aria-label={starredStandard ? "Bỏ gắn sao" : "Gắn sao"}
										colorStyle="standard"
										variant="toggle"
										selected={starredStandard}
										onClick={() => setStarredStandard(!starredStandard)}
										size="md"
									>
										<Star className={starredStandard ? "fill-current" : ""} />
									</IconButton>
									<span className="text-sm text-m3-on-surface-variant italic">
										{starredStandard
											? "Selected → primary color"
											: "Unselected → on-surface-variant"}
									</span>
								</div>
							</div>
						</div>

						{/* Shape comparison */}
						<div className="border-t border-m3-surface-variant pt-8">
							<p className="text-xs font-medium text-m3-primary uppercase tracking-wider mb-4">
								Round vs Square Shape (click to toggle)
							</p>
							<div className="flex flex-wrap items-end gap-6">
								<div className="flex flex-col items-center gap-2">
									<IconButton
										aria-label={shapeFilled ? "Bỏ thích" : "Thích"}
										colorStyle="filled"
										variant="toggle"
										selected={shapeFilled}
										shape="round"
										size="md"
										onClick={() => setShapeFilled(!shapeFilled)}
									>
										<Heart className={shapeFilled ? "fill-current" : ""} />
									</IconButton>
									<span className="text-xs text-m3-on-surface-variant">
										shape=&quot;round&quot;
									</span>
								</div>
								<div className="flex flex-col items-center gap-2">
									<IconButton
										aria-label={shapeTonal ? "Bỏ thích" : "Thích"}
										colorStyle="tonal"
										variant="toggle"
										selected={shapeTonal}
										shape="square"
										size="md"
										onClick={() => setShapeTonal(!shapeTonal)}
									>
										<Heart className={shapeTonal ? "fill-current" : ""} />
									</IconButton>
									<span className="text-xs text-m3-on-surface-variant">
										shape=&quot;square&quot;
									</span>
								</div>
							</div>
						</div>
					</Card>
				</section>

				{/* ── Section 3: Sizes ─────────────────────────────────── */}
				<section id="sizes" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Sizes
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 bg-m3-surface-container-lowest overflow-visible"
					>
						<p className="text-sm text-m3-on-surface-variant mb-8 max-w-2xl">
							5 sizes following MD3 Expressive ContainerHeight tokens. Each size
							has a precisely calibrated icon size and corner radius.
						</p>
						<div className="flex flex-wrap items-end gap-6 mb-8">
							{(
								[
									{
										size: "xs",
										label: "XS\n32dp / icon 20dp",
										colorStyle: "filled",
									},
									{
										size: "sm",
										label: "SM\n40dp / icon 24dp",
										colorStyle: "filled",
									},
									{
										size: "md",
										label: "MD\n56dp / icon 24dp",
										colorStyle: "filled",
									},
									{
										size: "lg",
										label: "LG\n96dp / icon 32dp",
										colorStyle: "filled",
									},
									{
										size: "xl",
										label: "XL\n136dp / icon 40dp",
										colorStyle: "filled",
									},
								] as const
							).map(({ size, label, colorStyle }) => (
								<div key={size} className="flex flex-col items-center gap-2">
									<IconButton
										aria-label={`Size ${size.toUpperCase()}`}
										colorStyle={colorStyle}
										size={size}
									>
										<Heart />
									</IconButton>
									<span className="text-xs text-m3-on-surface-variant text-center whitespace-pre-line">
										{label}
									</span>
								</div>
							))}
						</div>
						<div className="border-t border-m3-surface-variant pt-6">
							<p className="text-xs font-medium text-m3-primary uppercase tracking-wider mb-4">
								Touch target: xs & sm have 48×48dp minimum (WCAG 2.5.5)
							</p>
							<div className="flex flex-wrap items-center gap-4">
								<IconButton
									aria-label="XS touch target"
									size="xs"
									colorStyle="outlined"
								>
									<Settings />
								</IconButton>
								<span className="text-xs text-m3-on-surface-variant italic">
									← 32dp button, 48dp tap area
								</span>
							</div>
						</div>
					</Card>
				</section>

				{/* ── Section 4: Shapes ────────────────────────────────── */}
				<section id="shapes" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Shapes
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 bg-m3-surface-container-lowest overflow-visible"
					>
						<p className="text-sm text-m3-on-surface-variant mb-8 max-w-2xl">
							Two base shapes: <strong>round</strong> (CornerFull = height/2)
							and <strong>square</strong> (CornerMedium to CornerExtraLarge
							depending on size). Both morph with spring animation on press.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
							<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
								<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
									Round (CornerFull)
								</p>
								<div className="flex flex-wrap items-end gap-4">
									{(["xs", "sm", "md", "lg"] as const).map((size) => (
										<IconButton
											key={size}
											aria-label={`Round ${size}`}
											colorStyle="filled"
											shape="round"
											size={size}
										>
											<Star />
										</IconButton>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
								<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
									Square (CornerMedium–ExtraLarge)
								</p>
								<div className="flex flex-wrap items-end gap-4">
									{(["xs", "sm", "md", "lg"] as const).map((size) => (
										<IconButton
											key={size}
											aria-label={`Square ${size}`}
											colorStyle="filled"
											shape="square"
											size={size}
										>
											<Star />
										</IconButton>
									))}
								</div>
							</div>
						</div>
					</Card>
				</section>

				{/* ── Section 5: Loading ───────────────────────────────── */}
				<section id="loading-state" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Loading State
					</h2>
					<Card
						variant="outlined"
						className="p-6 md:p-8 flex flex-col gap-10 bg-m3-surface-container-lowest overflow-visible"
					>
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Morphing Shape (Default)
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									<code>loadingVariant=&quot;loading-indicator&quot;</code> —
									hiển thị loading indicator morphing 7 hình MD3 Expressive đặc
									trưng.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<LoadingIconButtonDemo
									aria-label="Tải lên"
									colorStyle="filled"
									loadingVariant="loading-indicator"
									icon={<Plus />}
									size="md"
								/>
								<LoadingIconButtonDemo
									aria-label="Tìm kiếm"
									colorStyle="tonal"
									loadingVariant="loading-indicator"
									icon={<Search />}
									size="md"
								/>
								<LoadingIconButtonDemo
									aria-label="Cài đặt"
									colorStyle="outlined"
									loadingVariant="loading-indicator"
									icon={<Settings />}
									size="md"
								/>
							</div>
						</div>

						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="max-w-sm">
								<h3 className="text-lg font-medium text-m3-on-surface mb-2">
									Circular Spinner
								</h3>
								<p className="text-sm text-m3-on-surface-variant">
									<code>loadingVariant=&quot;circular&quot;</code> — dùng
									circular progress indicator. Phù hợp sync data, submit form.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<LoadingIconButtonDemo
									aria-label="Tải lên"
									colorStyle="filled"
									loadingVariant="circular"
									icon={<Loader2 />}
									size="md"
								/>
								<LoadingIconButtonDemo
									aria-label="Tìm kiếm"
									colorStyle="tonal"
									loadingVariant="circular"
									icon={<Search />}
									size="md"
								/>
								<LoadingIconButtonDemo
									aria-label="Standard loading"
									colorStyle="standard"
									loadingVariant="circular"
									icon={<Settings />}
									size="md"
								/>
							</div>
						</div>
					</Card>
				</section>

				{/* ── Section 6: Usage Guidelines ──────────────────────── */}
				<section id="usage-guidelines" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Usage Guidelines
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								When to use
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant text-sm">
								<li>Frequent, well-understood actions (like, save, share).</li>
								<li>
									Compact toolbars and action bars where space is limited.
								</li>
								<li>Secondary actions alongside text or other components.</li>
								<li>
									Toggle states with clear visual affordance (filled/tonal).
								</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Accessibility
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant text-sm">
								<li>
									<strong>aria-label is required</strong> — icon buttons have no
									text label.
								</li>
								<li>Toggle buttons use aria-pressed for screen readers.</li>
								<li>Loading state exposes aria-busy=true to assistive tech.</li>
								<li>XS/SM sizes have 48×48dp touch target (WCAG 2.5.5).</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Variant hierarchy
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant text-sm">
								<li>
									<strong>Filled</strong> — highest emphasis, primary action.
								</li>
								<li>
									<strong>Tonal</strong> — medium-high, softer visual weight.
								</li>
								<li>
									<strong>Outlined</strong> — medium emphasis, supports toggle.
								</li>
								<li>
									<strong>Standard</strong> — lowest emphasis, toolbars.
								</li>
							</ul>
						</Card>
						<Card variant="elevated" className="p-6">
							<h3 className="text-lg font-medium text-m3-on-surface mb-4">
								Best practices
							</h3>
							<ul className="list-disc list-inside space-y-2 text-m3-on-surface-variant text-sm">
								<li>Use only one filled icon button per section.</li>
								<li>Pair icon buttons with tooltips for clarity.</li>
								<li>Do not place more than 3–4 icon buttons in a row.</li>
								<li>
									Match size to content density: MD/LG for FAB-like usage.
								</li>
							</ul>
						</Card>
					</div>
				</section>

				{/* ── Section 7: Code Example ──────────────────────────── */}
				<section id="code-example" className="mb-20 scroll-mt-24">
					<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
						Code Example
					</h2>
					<CodeBlock code={codeExample} />
				</section>
			</div>

			<TableOfContents items={tocItems} />
		</div>
	);
}
