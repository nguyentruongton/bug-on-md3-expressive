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
		<div className="my-6 rounded-m3-xl border border-m3-outline-variant/60 overflow-hidden">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				aria-label={`Preview của ${name}`}
			>
				<TabsList
					variant="secondary"
					className="bg-m3-surface-container-low px-1"
				>
					<Tab value="preview">Preview</Tab>
					<Tab value="code">Code</Tab>
				</TabsList>

				{/* Preview panel — overflow-visible so absolute/portal children (e.g. VerticalMenu) are not clipped */}
				<TabsContent
					value="preview"
					className="relative flex min-h-56 items-center justify-center p-8 bg-m3-surface-container-lowest overflow-visible"
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

				{/* Code panel — overflow-hidden restores clipping for the code block */}
				<TabsContent value="code" className="overflow-hidden">
					<CodeBlock
						code={sourceCode}
						html={highlightedCode}
						language="tsx"
						className="rounded-none border-none"
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
