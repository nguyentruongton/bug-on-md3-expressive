const fs = require("node:fs");
const path = require("node:path");

const srcAssets = path.join(__dirname, "../src/assets");
const distAssets = path.join(__dirname, "../dist/assets");
const srcCss = path.join(__dirname, "../src/ui/typography/typography.css");
const distCss = path.join(__dirname, "../dist/typography.css");
const srcIndexCss = path.join(__dirname, "../src/index.css");
const distIndexCss = path.join(__dirname, "../dist/index.css");

console.log("Copying assets to dist...");

if (fs.existsSync(srcAssets)) {
	fs.cpSync(srcAssets, distAssets, { recursive: true });
	console.log("✅ Copied src/assets to dist/assets");
}

if (fs.existsSync(srcCss)) {
	let cssContent = fs.readFileSync(srcCss, "utf-8");
	// Update font URL to be relative to the dist root
	cssContent = cssContent.replace(
		/url\(['"']?\.\.\/\.\.\/assets\/fonts\/GoogleSansFlex-VariableFont\.woff2['"']?\)/g,
		"url('./assets/fonts/GoogleSansFlex-VariableFont.woff2')",
	);
	fs.writeFileSync(distCss, cssContent);
	console.log("✅ Copied typography.css to dist/typography.css");
}

// Bundle index.css = md3-tokens CSS + react component base styles.
// This ensures users only need to import @bug-on/md3-react/index.css
// and get all required design tokens automatically.
const tokensCssDir = path.join(__dirname, "../../tokens/dist");
const tokensColorsCss = path.join(tokensCssDir, "colors.css");
const tokensShapeCss = path.join(tokensCssDir, "shape.css");

const bundleParts = [
	"/* @bug-on/md3-tokens — MD3 System Color Tokens */",
];

if (fs.existsSync(tokensColorsCss)) {
	bundleParts.push(fs.readFileSync(tokensColorsCss, "utf-8"));
	console.log("✅ Bundled colors.css from md3-tokens into index.css");
} else {
	console.warn("⚠️  md3-tokens colors.css not found — build tokens first");
}

if (fs.existsSync(tokensShapeCss)) {
	bundleParts.push(fs.readFileSync(tokensShapeCss, "utf-8"));
	console.log("✅ Bundled shape.css from md3-tokens into index.css");
} else {
	console.warn("⚠️  md3-tokens shape.css not found — build tokens first");
}

if (fs.existsSync(srcIndexCss)) {
	bundleParts.push(
		"\n/* @bug-on/md3-react — Component Base Reset */",
		fs.readFileSync(srcIndexCss, "utf-8"),
	);
}

fs.writeFileSync(distIndexCss, bundleParts.join("\n"));
console.log("✅ Built bundled index.css (tokens + component base) to dist/index.css");


// Copy Material Symbols CSS variants
const cssVariants = [
	"material-symbols-cdn.css",
	"material-symbols-self-hosted.css",
];

for (const file of cssVariants) {
	const srcPath = path.join(__dirname, `../src/assets/${file}`);
	const distPath = path.join(__dirname, `../dist/${file}`);
	if (fs.existsSync(srcPath)) {
		fs.copyFileSync(srcPath, distPath);
		console.log(`✅ Copied ${file} to dist/${file}`);
	}
}

// Generate .d.ts stubs for each CSS sub-path export
// Satisfies the `types` field in exports — prevents "Cannot find module"
// errors in TypeScript strict mode projects.
const cssStubs = [
	"index.css.d.ts",
	"typography.css.d.ts",
	"material-symbols-cdn.css.d.ts",
	"material-symbols-self-hosted.css.d.ts",
];

for (const stub of cssStubs) {
	const distPath = path.join(__dirname, `../dist/${stub}`);
	fs.writeFileSync(distPath, "// CSS module — no runtime types\nexport {};\n");
	console.log(`✅ Generated ${stub}`);
}

// Prepend "use client" to JS/MJS output files to support React Server Components.
// NOTE: Using post-build script instead of tsup banner — banner causes esbuild
// "Module level directives" warnings in library bundling context.
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
