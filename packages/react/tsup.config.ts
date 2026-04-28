import type { Options } from "tsup";
import { defineConfig } from "tsup";

const config: Options = {
	entry: ["src/index.ts", "src/plugin.ts"],
	format: ["cjs", "esm"],
	dts: true,
	clean: false, // Tắt clean để tránh nuke mất typography.css khi Next.js đang khởi động
	// externalize peer dependencies — user project sẽ cung cấp
	external: ["react", "react-dom", "motion", "tailwindcss"],
	// Tree-shaking tối đa, không split vì thư viện nhỏ
	treeshake: true,
	splitting: false,
	sourcemap: true,
	outDir: "dist",
	// "use client" được inject sau build bằng copy-assets.js (banner của tsup gây esbuild warning cho library)
	onSuccess: "node scripts/copy-assets.js",
};

export default defineConfig(config);
