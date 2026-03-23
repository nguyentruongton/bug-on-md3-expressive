import type { Options } from "tsup";
import { defineConfig } from "tsup";

const config: Options = {
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	clean: false, // Tắt clean để tránh nuke mất typography.css khi Next.js đang khởi động
	// externalize peer dependencies — user project sẽ cung cấp
	external: ["react", "react-dom", "motion"],
	// Tree-shaking tối đa, không split vì thư viện nhỏ
	treeshake: true,
	splitting: false,
	sourcemap: true,
	outDir: "dist",
	// "use client" sẽ được chèn thủ công bằng script phía sau (copy-assets.js)
	onSuccess: "node scripts/copy-assets.js",
};

export default defineConfig(config);
