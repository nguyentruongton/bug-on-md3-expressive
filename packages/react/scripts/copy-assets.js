const fs = require("node:fs");
const path = require("node:path");

const srcAssets = path.join(__dirname, "../src/assets");
const distAssets = path.join(__dirname, "../dist/assets");
const srcCss = path.join(__dirname, "../src/ui/typography/typography.css");
const distCss = path.join(__dirname, "../dist/typography.css");

console.log("Copying assets to dist...");

if (fs.existsSync(srcAssets)) {
	fs.cpSync(srcAssets, distAssets, { recursive: true });
	console.log("✅ Copied src/assets to dist/assets");
}

if (fs.existsSync(srcCss)) {
	let cssContent = fs.readFileSync(srcCss, "utf-8");
	// Update font URL to be relative to the dist root
	cssContent = cssContent.replace(
		/url\(['"]?\.\.\/\.\.\/assets\/fonts\/GoogleSansFlex-VariableFont\.woff2['"]?\)/g,
		"url('./assets/fonts/GoogleSansFlex-VariableFont.woff2')",
	);
	fs.writeFileSync(distCss, cssContent);
	console.log("✅ Copied typography.css to dist/typography.css");
}

// Prepend "use client" to JS/MJS output files to support React Server Components
const distFiles = [
	path.join(__dirname, "../dist/index.js"),
	path.join(__dirname, "../dist/index.mjs"),
];

for (const file of distFiles) {
	if (fs.existsSync(file)) {
		const content = fs.readFileSync(file, "utf-8");
		if (
			!content.startsWith('"use client";') &&
			!content.startsWith("'use client';")
		) {
			fs.writeFileSync(file, `"use client";\n${content}`);
			console.log(`✅ Prepended "use client" to ${path.basename(file)}`);
		}
	}
}
