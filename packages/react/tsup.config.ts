import type { Options } from "tsup";
import { defineConfig } from "tsup";

const config: Options = {
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	// externalize peer dependencies — user project sẽ cung cấp
	external: ["react", "react-dom", "motion"],
	// Tree-shaking tối đa, không split vì thư viện nhỏ
	treeshake: true,
	splitting: false,
	sourcemap: true,
	outDir: "dist",
	// Giữ "use client" directive ở đầu file — bắt buộc cho Next.js App Router
	banner: {
		js: '"use client";',
	},
};

export default defineConfig(config);
