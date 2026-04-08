import plugin from "tailwindcss/plugin";

const md3Plugin = plugin(({ addBase, addComponents, addUtilities }) => {
	addBase({
		":root": {
			"--color-m3-primary": "var(--md-sys-color-primary)",
			"--color-m3-on-primary": "var(--md-sys-color-on-primary)",
			"--color-m3-primary-container": "var(--md-sys-color-primary-container)",
			"--color-m3-on-primary-container":
				"var(--md-sys-color-on-primary-container)",
			"--color-m3-secondary": "var(--md-sys-color-secondary)",
			"--color-m3-on-secondary": "var(--md-sys-color-on-secondary)",
			"--color-m3-secondary-container":
				"var(--md-sys-color-secondary-container)",
			"--color-m3-on-secondary-container":
				"var(--md-sys-color-on-secondary-container)",
			"--color-m3-tertiary": "var(--md-sys-color-tertiary)",
			"--color-m3-on-tertiary": "var(--md-sys-color-on-tertiary)",
			"--color-m3-tertiary-container": "var(--md-sys-color-tertiary-container)",
			"--color-m3-on-tertiary-container":
				"var(--md-sys-color-on-tertiary-container)",
			"--color-m3-error": "var(--md-sys-color-error)",
			"--color-m3-on-error": "var(--md-sys-color-on-error)",
			"--color-m3-error-container": "var(--md-sys-color-error-container)",
			"--color-m3-on-error-container": "var(--md-sys-color-on-error-container)",

			"--color-m3-surface": "var(--md-sys-color-surface)",
			"--color-m3-surface-dim": "var(--md-sys-color-surface-dim)",
			"--color-m3-surface-bright": "var(--md-sys-color-surface-bright)",
			"--color-m3-on-surface": "var(--md-sys-color-on-surface)",
			"--color-m3-surface-variant": "var(--md-sys-color-surface-variant)",
			"--color-m3-on-surface-variant": "var(--md-sys-color-on-surface-variant)",

			"--color-m3-surface-container-lowest":
				"var(--md-sys-color-surface-container-lowest)",
			"--color-m3-surface-container-low":
				"var(--md-sys-color-surface-container-low)",
			"--color-m3-surface-container": "var(--md-sys-color-surface-container)",
			"--color-m3-surface-container-high":
				"var(--md-sys-color-surface-container-high)",
			"--color-m3-surface-container-highest":
				"var(--md-sys-color-surface-container-highest)",

			"--color-m3-inverse-surface": "var(--md-sys-color-inverse-surface)",
			"--color-m3-inverse-on-surface": "var(--md-sys-color-inverse-on-surface)",
			"--color-m3-inverse-primary": "var(--md-sys-color-inverse-primary)",

			"--color-m3-outline": "var(--md-sys-color-outline)",
			"--color-m3-outline-variant": "var(--md-sys-color-outline-variant)",
			"--color-m3-shadow": "var(--md-sys-color-shadow)",
			"--color-m3-scrim": "var(--md-sys-color-scrim)",
			"--color-m3-surface-tint": "var(--md-sys-color-surface-tint)",

			"--color-m3-indicator-active": "var(--md-sys-color-indicator-active)",
			"--color-m3-indicator-container":
				"var(--md-sys-color-indicator-container)",
			"--color-m3-indicator-contained-active":
				"var(--md-sys-color-indicator-contained-active)",
			"--color-m3-indicator-contained-container":
				"var(--md-sys-color-indicator-contained-container)",
			"--color-m3-indicator-track": "var(--md-sys-color-indicator-track)",
			"--color-m3-indicator-stop": "var(--md-sys-color-indicator-stop)",

			"--radius-m3-none": "var(--md-sys-shape-corner-none, 0px)",
			"--radius-m3-xs": "var(--md-sys-shape-corner-extra-small, 4px)",
			"--radius-m3-sm": "var(--md-sys-shape-corner-small, 8px)",
			"--radius-m3-md": "var(--md-sys-shape-corner-medium, 12px)",
			"--radius-m3-lg": "var(--md-sys-shape-corner-large, 16px)",
			"--radius-m3-xl": "var(--md-sys-shape-corner-extra-large, 28px)",
			"--radius-m3-full": "var(--md-sys-shape-corner-full, 9999px)",
		},
	});

	// ── Material Symbols Icon base class ────────────────────────────────────
	// CSS variables drive font-variation-settings so utility classes and
	// inline style props can all influence the same axes without specificity wars.
	addComponents({
		".md-icon": {
			fontFamily: "var(--md-icon-font, 'Material Symbols Outlined')",
			fontWeight: "normal",
			fontStyle: "normal",
			fontSize: "var(--md-icon-size, 24px)",
			lineHeight: "1",
			display: "inline-block",
			whiteSpace: "nowrap",
			wordWrap: "normal",
			direction: "ltr",
			textRendering: "optimizeLegibility",
			"-webkit-font-smoothing": "antialiased",
			fontVariationSettings:
				"'FILL' var(--md-icon-fill, 0), 'wght' var(--md-icon-weight, 400), 'GRAD' var(--md-icon-grade, 0), 'opsz' var(--md-icon-opsz, 24)",
		},
	});

	addUtilities({
		".elevation-0": { boxShadow: "none" },
		".elevation-1": {
			boxShadow:
				"0px 1px 2px 0px rgba(0,0,0,.3), 0px 1px 3px 1px rgba(0,0,0,.15)",
		},
		".elevation-2": {
			boxShadow:
				"0px 1px 2px 0px rgba(0,0,0,.3), 0px 2px 6px 2px rgba(0,0,0,.15)",
		},
		".elevation-3": {
			boxShadow:
				"0px 1px 3px 0px rgba(0,0,0,.3), 0px 4px 8px 3px rgba(0,0,0,.15)",
		},
		".elevation-4": {
			boxShadow:
				"0px 2px 3px 0px rgba(0,0,0,.3), 0px 6px 10px 4px rgba(0,0,0,.15)",
		},
		".elevation-5": {
			boxShadow:
				"0px 4px 4px 0px rgba(0,0,0,.3), 0px 8px 12px 6px rgba(0,0,0,.15)",
		},
		// ── Icon variant utilities ─────────────────────────────────────────────
		// Set --md-icon-font to switch between Material Symbols font families.
		".icon-outlined": {
			"--md-icon-font": "'Material Symbols Outlined'",
			fontFamily: "'Material Symbols Outlined'",
		},
		".icon-rounded": {
			"--md-icon-font": "'Material Symbols Rounded'",
			fontFamily: "'Material Symbols Rounded'",
		},
		".icon-sharp": {
			"--md-icon-font": "'Material Symbols Sharp'",
			fontFamily: "'Material Symbols Sharp'",
		},
		// ── Fill axis utilities ────────────────────────────────────────────────
		".icon-fill-0": { "--md-icon-fill": "0" },
		".icon-fill-1": { "--md-icon-fill": "1" },
		// ── Weight axis utilities ──────────────────────────────────────────────
		".icon-weight-100": { "--md-icon-weight": "100" },
		".icon-weight-200": { "--md-icon-weight": "200" },
		".icon-weight-300": { "--md-icon-weight": "300" },
		".icon-weight-400": { "--md-icon-weight": "400" },
		".icon-weight-500": { "--md-icon-weight": "500" },
		".icon-weight-600": { "--md-icon-weight": "600" },
		".icon-weight-700": { "--md-icon-weight": "700" },
		// ── Grade axis utilities ───────────────────────────────────────────────
		// Named aliases match common usage patterns from MD3 spec.
		".icon-grade-low": { "--md-icon-grade": "-25" },
		".icon-grade-default": { "--md-icon-grade": "0" },
		".icon-grade-high": { "--md-icon-grade": "200" },
		// ── Optical size + font-size combined utilities ────────────────────────
		// opsz axis must match the rendered size for best optical quality.
		".icon-size-20": {
			"--md-icon-size": "20px",
			"--md-icon-opsz": "20",
			fontSize: "20px",
		},
		".icon-size-24": {
			"--md-icon-size": "24px",
			"--md-icon-opsz": "24",
			fontSize: "24px",
		},
		".icon-size-40": {
			"--md-icon-size": "40px",
			"--md-icon-opsz": "40",
			fontSize: "40px",
		},
		".icon-size-48": {
			"--md-icon-size": "48px",
			"--md-icon-opsz": "48",
			fontSize: "48px",
		},
	});
});

// biome-ignore lint/suspicious/noExplicitAny: Tailwind plugin type is complex
export default md3Plugin as any;
