"use client";

import {
	CodeBlock,
	LoadingIndicator,
	Tab,
	Tabs,
	TabsContent,
	TabsList,
} from "@bug-on/md3-react";
import * as React from "react";

interface ComponentPreviewClientProps {
	name: string;
	sourceCode: string;
	highlightedCode: string;
}

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
	const [activeTab, setActiveTab] = React.useState<string>("preview");

	const DemoComponent = React.useMemo(() => loadDemo(name), [name]);

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			className="my-6 overflow-hidden rounded-m3-xl border border-m3-outline-variant/60"
			aria-label={`Preview của ${name}`}
		>
			<TabsList
				variant="secondary"
				className="bg-m3-surface-container-low px-1"
			>
				<Tab value="preview">Preview</Tab>
				<Tab value="code">Code</Tab>
			</TabsList>

			{/* Preview panel */}
			<TabsContent
				value="preview"
				className="flex min-h-40 items-center justify-center p-8 bg-m3-surface-container-lowest"
			>
				<React.Suspense
					fallback={
						<div
							className="flex items-center gap-2 text-sm text-m3-on-surface-variant"
							aria-live="polite"
						>
							<LoadingIndicator aria-label="Loading demo..." />
							Loading demo...
						</div>
					}
				>
					<DemoComponent />
				</React.Suspense>
			</TabsContent>

			{/* Code panel */}
			<TabsContent value="code">
				<CodeBlock
					code={sourceCode}
					html={highlightedCode}
					language="tsx"
					className="rounded-none border-none"
				/>
			</TabsContent>
		</Tabs>
	);
}
