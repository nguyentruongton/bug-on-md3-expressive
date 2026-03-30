"use client";

import { CodeBlock } from "@bug-on/md3-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ComponentPreviewClientProps {
	name: string;
	sourceCode: string;
	highlightedCode: string;
}

type Tab = "preview" | "code";

/** Lazy-load registry demo components on the client side */
const demoRegistry: Record<
	string,
	React.LazyExoticComponent<React.ComponentType>
> = {};

function loadDemo(
	name: string,
): React.LazyExoticComponent<React.ComponentType> {
	if (!demoRegistry[name]) {
		demoRegistry[name] = React.lazy(() =>
			import(`../../registry/demos/${name}`).then((mod) => ({
				default: mod.default as React.ComponentType,
			})),
		);
	}
	return demoRegistry[name];
}

/**
 * Client Component: Renders the Preview/Code tab switcher.
 * - Preview: Dynamically imports and renders the demo component
 * - Code: Displays the raw source with syntax highlighting
 */
export function ComponentPreviewClient({
	name,
	sourceCode,
	highlightedCode,
}: ComponentPreviewClientProps) {
	const [activeTab, setActiveTab] = React.useState<Tab>("preview");

	const DemoComponent = React.useMemo(() => loadDemo(name), [name]);

	return (
		<section
			className="my-6 overflow-hidden rounded-m3-xl border border-m3-outline-variant/60"
			aria-label={`Preview của ${name}`}
		>
			{/* Tab bar */}
			<div className="flex items-center border-b border-m3-outline-variant/60 bg-m3-surface-container-low px-1">
				<TabButton
					active={activeTab === "preview"}
					onClick={() => setActiveTab("preview")}
					id={`${name}-preview-tab`}
					aria-controls={`${name}-preview-panel`}
				>
					Preview
				</TabButton>
				<TabButton
					active={activeTab === "code"}
					onClick={() => setActiveTab("code")}
					id={`${name}-code-tab`}
					aria-controls={`${name}-code-panel`}
				>
					Code
				</TabButton>
			</div>

			{/* Preview panel: Surface Container Lowest (White) to separate from layout */}
			<div
				id={`${name}-preview-panel`}
				role="tabpanel"
				aria-labelledby={`${name}-preview-tab`}
				hidden={activeTab !== "preview"}
				className="flex min-h-40 items-center justify-center p-8 bg-m3-surface-container-lowest"
			>
				<React.Suspense
					fallback={
						<div
							className="flex items-center gap-2 text-sm text-m3-on-surface-variant"
							aria-live="polite"
						>
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-m3-primary border-t-transparent" />
							Đang tải demo...
						</div>
					}
				>
					<DemoComponent />
				</React.Suspense>
			</div>

			{/* Code panel */}
			<div
				id={`${name}-code-panel`}
				role="tabpanel"
				aria-labelledby={`${name}-code-tab`}
				hidden={activeTab !== "code"}
			>
				<CodeBlock
					code={sourceCode}
					html={highlightedCode}
					language="tsx"
					className="rounded-none border-none"
				/>
			</div>
		</section>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab Button
// ─────────────────────────────────────────────────────────────────────────────
interface TabButtonProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
	id: string;
	"aria-controls": string;
}

function TabButton({
	active,
	onClick,
	children,
	id,
	"aria-controls": ariaControls,
}: TabButtonProps) {
	return (
		<button
			type="button"
			id={id}
			role="tab"
			aria-selected={active}
			aria-controls={ariaControls}
			onClick={onClick}
			className={cn(
				"relative px-4 py-3 text-sm font-medium transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-inset",
				active
					? "text-m3-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-m3-primary after:rounded-t-full"
					: "text-m3-on-surface-variant hover:text-m3-on-surface",
			)}
		>
			{children}
		</button>
	);
}
