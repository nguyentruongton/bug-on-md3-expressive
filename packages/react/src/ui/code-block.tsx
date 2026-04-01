"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { ScrollArea } from "./scroll-area";

const COPY_RESET_DELAY = 2000;

export interface CodeBlockProps {
	/** Raw code string to display and copy. */
	code: string;
	/** Language label in the header (presentational only). @default "React" */
	language?: string;
	/** Additional CSS classes for the outer wrapper. */
	className?: string;
	/**
	 * Pre-highlighted HTML from Shiki SSR.
	 * Use `codeToHtml` with `themes: { light, dark }` for dual-theme support.
	 */
	html?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({
	copied,
	onCopy,
}: {
	copied: boolean;
	onCopy: () => void;
}) {
	return (
		<Button
			type="button"
			onClick={onCopy}
			title="Copy code"
			aria-label={copied ? "Code copied" : "Copy code"}
			colorStyle="text"
			className="h-8 px-2 gap-1.5"
		>
			{copied ? (
				<>
					<Icon
						name="check"
						size={14}
						className="text-m3-primary"
						aria-hidden="true"
					/>
					<span className="text-[10px] font-bold uppercase tracking-wider text-m3-primary">
						Copied!
					</span>
				</>
			) : (
				<>
					<Icon
						name="content_copy"
						size={14}
						className="text-m3-on-surface-variant"
						aria-hidden="true"
					/>
					<span className="text-[10px] font-bold uppercase tracking-wider text-m3-on-surface-variant">
						Copy
					</span>
				</>
			)}
		</Button>
	);
}

function CodeContent({ html, code }: { html?: string; code: string }) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current && html) {
			containerRef.current.innerHTML = html;
		}
	}, [html]);

	if (html) {
		return (
			<div
				ref={containerRef}
				className={cn(
					"text-sm font-mono",
					"[&>pre]:bg-transparent! [&>pre]:p-0! [&>pre]:m-0!",
				)}
			/>
		);
	}

	return (
		<pre className="text-sm font-mono text-m3-on-surface whitespace-pre">
			{code}
		</pre>
	);
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────

export function CodeBlock({
	code,
	language = "React",
	className,
	html,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), COPY_RESET_DELAY);
		} catch {
			// Clipboard API unavailable — fail silently
		}
	}, [code]);

	return (
		<div
			className={cn(
				"rounded-m3-lg overflow-hidden max-w-full",
				"bg-m3-surface-container-lowest border border-m3-outline-variant/60",
				className,
			)}
		>
			<div
				className={cn(
					"px-4 py-2 flex justify-between items-center",
					"bg-m3-surface-container-low border-b border-m3-outline-variant/60",
				)}
			>
				<span className="text-xs font-mono text-m3-on-surface-variant">
					{language}
				</span>
				<CopyButton copied={copied} onCopy={handleCopy} />
			</div>

			<ScrollArea
				type="hover"
				orientation="both"
				className="max-h-120 flex-col w-full min-w-0"
			>
				<div className="p-4 min-w-0 w-full">
					<CodeContent html={html} code={code} />
				</div>
			</ScrollArea>
		</div>
	);
}
