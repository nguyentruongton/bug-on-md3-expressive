import * as fs from "node:fs";
import * as path from "node:path";
import { Icon } from "@bug-on/md3-react";
import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getMDXComponents } from "@/components/mdx/mdx-components";
import { TocRegistrar } from "@/components/mdx/toc-registrar";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content", "components");

function getMDXFilePath(slug: string): string {
	return path.join(CONTENT_DIR, `${slug}.mdx`);
}

function getMDXContent(
	slug: string,
): { content: string; data: Record<string, string> } | null {
	const filePath = getMDXFilePath(slug);
	try {
		const raw = fs.readFileSync(filePath, "utf-8");
		const { content, data } = matter(raw);
		return { content, data };
	} catch {
		return null;
	}
}

/** Extract headings (## and ###) for the TableOfContents component */
function extractHeadings(content: string): { id: string; label: string }[] {
	const lines = content.split("\n");
	const headings: { id: string; label: string }[] = [];

	for (const line of lines) {
		const h2Match = /^##\s+(.+)$/.exec(line);
		const h3Match = /^###\s+(.+)$/.exec(line);
		const match = h2Match ?? h3Match;
		if (match) {
			const label = match[1].trim();
			// Replicate rehype-slug ID generation (lowercase, spaces→hyphens, remove specials)
			const id = label
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");
			headings.push({ id, label });
		}
	}
	return headings;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Params
// ─────────────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
	try {
		const files = fs.readdirSync(CONTENT_DIR);
		return files
			.filter((f) => f.endsWith(".mdx"))
			.map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
	} catch {
		return [];
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const mdx = getMDXContent(slug);
	if (!mdx) return {};

	const title = (mdx.data.title as string | undefined) ?? slug;
	const description = (mdx.data.description as string | undefined) ?? "";

	return {
		title: `${title} – Bug Ổn MD3 Expressive`,
		description,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function ComponentPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const mdx = getMDXContent(slug);

	// Falls through to hardcode generic page if no MDX file found
	if (!mdx) notFound();

	const { content, data } = mdx;
	const title = (data.title as string | undefined) ?? slug;
	const tocItems = extractHeadings(content);
	const components = getMDXComponents();

	return (
		<>
			{/* Register TOC items with the global context (client-side) */}
			<TocRegistrar items={tocItems} />

			<div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 lg:py-12">
				{/* Breadcrumbs */}
				<nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8">
					<Link
						href="/components"
						className="text-m3-primary font-medium text-sm hover:underline"
					>
						Components
					</Link>
					<Icon
						name="chevron_right"
						size={16}
						className=" text-m3-on-surface-variant"
						aria-hidden="true"
					/>
					<span
						className="text-m3-on-surface text-sm font-bold"
						aria-current="page"
					>
						{title}
					</span>
				</nav>

				{/* Page title from frontmatter */}
				<div className="mb-10">
					<span className="text-m3-primary font-medium tracking-widest uppercase text-xs">
						MATERIAL DESIGN 3
					</span>
					<h1 className="text-4xl sm:text-5xl font-normal tracking-tight mt-2 mb-4 text-m3-on-surface">
						{title}
					</h1>
					{data.description && (
						<p className="text-lg text-m3-on-surface-variant leading-relaxed max-w-2xl">
							{data.description}
						</p>
					)}
				</div>

				{/* MDX Content */}
				<div className="mdx-content">
					<MDXRemote
						source={content}
						components={components}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkGfm],
								rehypePlugins: [rehypeSlug],
							},
						}}
					/>
				</div>
			</div>
		</>
	);
}
