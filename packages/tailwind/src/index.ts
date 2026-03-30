import plugin from "tailwindcss/plugin";

const md3Plugin = plugin(({ addBase, addUtilities }) => {
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
			"--color-m3-surface": "var(--md-sys-color-surface)",
			"--color-m3-on-surface": "var(--md-sys-color-on-surface)",
			"--color-m3-surface-variant": "var(--md-sys-color-surface-variant)",
			"--color-m3-on-surface-variant": "var(--md-sys-color-on-surface-variant)",
			"--color-m3-surface-container-low":
				"var(--md-sys-color-surface-container-low)",
			"--color-m3-surface-container": "var(--md-sys-color-surface-container)",
			"--color-m3-surface-container-high":
				"var(--md-sys-color-surface-container-high)",
			"--color-m3-surface-container-highest":
				"var(--md-sys-color-surface-container-highest)",
			"--color-m3-outline": "var(--md-sys-color-outline)",
			"--color-m3-outline-variant": "var(--md-sys-color-outline-variant)",

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
	});
});

// biome-ignore lint/suspicious/noExplicitAny: Tailwind plugin type is complex
export default md3Plugin as any;
