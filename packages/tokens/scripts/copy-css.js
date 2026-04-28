const fs = require("node:fs");
const path = require("node:path");

const srcDir = path.join(__dirname, "../src");
const distDir = path.join(__dirname, "../dist");

// Ensure dist exists
if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, { recursive: true });
}

console.log("Copying CSS assets to dist...");

// CSS files to copy from src/ to dist/ (only files that exist in src/)
const cssFiles = ["colors.css", "shape.css"];

for (const file of cssFiles) {
	const srcPath = path.join(srcDir, file);
	const distPath = path.join(distDir, file);
	if (fs.existsSync(srcPath)) {
		fs.copyFileSync(srcPath, distPath);
		console.log(`✅ Copied ${file} to dist/${file}`);
	} else {
		console.warn(`⚠️  ${file} not found in src/, skipping`);
	}
}

// Generate .d.ts stubs for each CSS sub-path export that will be in dist/
const cssStubs = cssFiles.map((f) => `${f}.d.ts`);

for (const stub of cssStubs) {
	const distPath = path.join(distDir, stub);
	fs.writeFileSync(distPath, "// CSS module — no runtime types\nexport {};\n");
	console.log(`✅ Generated ${stub}`);
}
