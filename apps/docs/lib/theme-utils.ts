import {
	argbFromHex,
	hexFromArgb,
	themeFromSourceColor,
} from "@material/material-color-utilities";

export type ThemeMode = "light" | "dark";

export function generateM3Theme(
	sourceColorHex: string,
	mode: ThemeMode = "light",
) {
	const sourceColor = argbFromHex(sourceColorHex);
	const theme = themeFromSourceColor(sourceColor);

	const scheme = mode === "light" ? theme.schemes.light : theme.schemes.dark;
	const palettes = theme.palettes;

	// Helper to get hex from palette tone
	const getTone = (tone: number) => hexFromArgb(palettes.neutral.tone(tone));

	return {
		primary: hexFromArgb(scheme.primary),
		onPrimary: hexFromArgb(scheme.onPrimary),
		primaryContainer: hexFromArgb(scheme.primaryContainer),
		onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),

		secondary: hexFromArgb(scheme.secondary),
		onSecondary: hexFromArgb(scheme.onSecondary),
		secondaryContainer: hexFromArgb(scheme.secondaryContainer),
		onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),

		tertiary: hexFromArgb(scheme.tertiary),
		onTertiary: hexFromArgb(scheme.onTertiary),
		tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
		onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),

		error: hexFromArgb(scheme.error),
		onError: hexFromArgb(scheme.onError),
		errorContainer: hexFromArgb(scheme.errorContainer),
		onErrorContainer: hexFromArgb(scheme.onErrorContainer),

		surface: hexFromArgb(scheme.surface),
		onSurface: hexFromArgb(scheme.onSurface),
		surfaceVariant: hexFromArgb(scheme.surfaceVariant),
		onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),

		outline: hexFromArgb(scheme.outline),
		outlineVariant: hexFromArgb(scheme.outlineVariant),

		// Manual calculation for surface container roles if missing in older Scheme versions
		surfaceContainerLowest: mode === "light" ? getTone(100) : getTone(4),
		surfaceContainerLow: mode === "light" ? getTone(96) : getTone(10),
		surfaceContainer: mode === "light" ? getTone(94) : getTone(12),
		surfaceContainerHigh: mode === "light" ? getTone(92) : getTone(17),
		surfaceContainerHighest: mode === "light" ? getTone(90) : getTone(22),
	};
}

export function applyTheme(sourceColorHex: string, mode: ThemeMode = "light") {
	const colors = generateM3Theme(sourceColorHex, mode);
	const root = document.documentElement;

	for (const [key, value] of Object.entries(colors)) {
		// Convert camelCase to kebab-case for CSS variables
		const kebabKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
		// Update standard MD3 tokens (used by @bug-on/md3-react components)
		root.style.setProperty(`--md-sys-color-${kebabKey}`, value);
		// Update Tailwind arbitrary variables (used by apps/docs utilities)
		root.style.setProperty(`--color-m3-${kebabKey}`, value);
	}

	// Toggle data-theme attribute for Shiki dual-theme CSS switching.
	// CSS in globals.css uses [data-theme="dark"] .shiki span { color: var(--shiki-dark) }
	root.setAttribute("data-theme", mode);
}
