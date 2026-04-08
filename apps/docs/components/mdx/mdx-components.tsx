import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ComponentPreview } from "./component-preview";
import { ThemeDemo } from "./theme-demo";

/**
 * Returns the MDX component mapping for next-mdx-remote.
 * Maps standard HTML elements to MD3-styled React components.
 */
export function getMDXComponents(): MDXComponents {
	return {
		// ── Headings ──────────────────────────────────────────────────────────
		h1: ({ children, id }) => (
			<h1
				id={id}
				className="scroll-mt-24 text-4xl font-normal tracking-tight text-m3-on-surface mt-10 mb-4 first:mt-0"
			>
				{children}
			</h1>
		),
		h2: ({ children, id }) => (
			<h2
				id={id}
				className="scroll-mt-24 text-2xl font-medium text-m3-on-surface mt-12 mb-4 pb-2 border-b border-m3-outline-variant/40"
			>
				{children}
			</h2>
		),
		h3: ({ children, id }) => (
			<h3
				id={id}
				className="scroll-mt-24 text-lg font-medium text-m3-on-surface mt-8 mb-3"
			>
				{children}
			</h3>
		),
		h4: ({ children, id }) => (
			<h4
				id={id}
				className="scroll-mt-24 text-base font-semibold text-m3-on-surface mt-6 mb-2"
			>
				{children}
			</h4>
		),

		// ── Body text ─────────────────────────────────────────────────────────
		p: ({ children }) => (
			<p className="text-m3-on-surface-variant leading-7 mb-4 last:mb-0">
				{children}
			</p>
		),

		// ── Links ─────────────────────────────────────────────────────────────
		a: ({ href, children }) => {
			const isExternal = typeof href === "string" && href.startsWith("http");
			if (isExternal) {
				return (
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="text-m3-primary underline underline-offset-4 hover:text-m3-primary/80 transition-colors"
					>
						{children}
					</a>
				);
			}
			return (
				<Link
					href={href ?? "#"}
					className="text-m3-primary underline underline-offset-4 hover:text-m3-primary/80 transition-colors"
				>
					{children}
				</Link>
			);
		},

		// ── Lists ─────────────────────────────────────────────────────────────
		ul: ({ children }) => (
			<ul className="my-4 ml-6 list-disc space-y-1.5 text-m3-on-surface-variant">
				{children}
			</ul>
		),
		ol: ({ children }) => (
			<ol className="my-4 ml-6 list-decimal space-y-1.5 text-m3-on-surface-variant">
				{children}
			</ol>
		),
		li: ({ children }) => <li className="leading-7">{children}</li>,

		// ── Code ──────────────────────────────────────────────────────────────
		code: ({ children }) => (
			<code className="relative rounded-m3-xs px-[0.3rem] py-[0.15rem] font-mono text-sm text-m3-on-surface">
				{children}
			</code>
		),
		pre: ({ children }) => (
			<pre className="my-6 overflow-x-auto rounded-m3-lg bg-m3-surface-container-highest p-4 text-sm leading-relaxed">
				{children}
			</pre>
		),

		// ── Tables ────────────────────────────────────────────────────────────
		table: ({ children }) => (
			<div className="my-6 w-full overflow-x-auto rounded-m3-lg border border-m3-outline-variant/50">
				<table className="w-full text-sm">{children}</table>
			</div>
		),
		thead: ({ children }) => (
			<thead className="bg-m3-surface-container">{children}</thead>
		),
		tbody: ({ children }) => (
			<tbody className="divide-y divide-m3-outline-variant/30">
				{children}
			</tbody>
		),
		tr: ({ children }) => <tr>{children}</tr>,
		th: ({ children }) => (
			<th className="px-4 py-3 text-left font-medium text-m3-on-surface tracking-wide">
				{children}
			</th>
		),
		td: ({ children }) => (
			<td className="px-4 py-3 text-m3-on-surface-variant align-top">
				{children}
			</td>
		),

		// ── Divider ───────────────────────────────────────────────────────────
		hr: () => <hr className="my-8 border-m3-outline-variant/40" />,

		// ── Blockquote ────────────────────────────────────────────────────────
		blockquote: ({ children }) => (
			<blockquote className="my-6 border-l-4 border-m3-primary pl-4 text-m3-on-surface-variant italic">
				{children}
			</blockquote>
		),

		// ── Custom MDX Components ─────────────────────────────────────────────
		ComponentPreview,
		ThemeDemo,
	};
}
