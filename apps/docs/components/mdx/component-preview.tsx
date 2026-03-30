import * as fs from "node:fs";
import * as path from "node:path";
import { codeToHtml } from "shiki";
import { ComponentPreviewClient } from "./component-preview-client";

interface ComponentPreviewProps {
	name: string;
}

/**
 * Server Component: Reads the demo source code from the registry,
 * then passes it along with the component name to the Client renderer.
 */
export async function ComponentPreview({ name }: ComponentPreviewProps) {
	const registryPath = path.join(
		process.cwd(),
		"registry",
		"demos",
		`${name}.tsx`,
	);

	let sourceCode = "";
	try {
		sourceCode = fs.readFileSync(registryPath, "utf-8");
	} catch {
		sourceCode = `// Demo file not found: registry/demos/${name}.tsx`;
	}

	// Generate dual-theme highlighted HTML using Shiki on the server.
	// `defaultColor: false` prevents Shiki from hardcoding a default color,
	// allowing CSS (via data-theme attribute) to control which theme is active.
	const highlightedCode = await codeToHtml(sourceCode, {
		lang: "tsx",
		themes: {
			light: "github-light",
			dark: "github-dark",
		},
		defaultColor: false,
	});

	return (
		<ComponentPreviewClient
			name={name}
			sourceCode={sourceCode}
			highlightedCode={highlightedCode}
		/>
	);
}
