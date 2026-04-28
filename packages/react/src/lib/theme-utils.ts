import {
	argbFromHex,
	hexFromArgb,
	themeFromSourceColor,
} from "@material/material-color-utilities";

export type ThemeMode = "light" | "dark" | "system";

/**
 * Resolves the effective color scheme from a ThemeMode.
 * When mode is "system", reads the OS preference via matchMedia.
 * Returns "light" as the safe default in SSR environments.
 */
export function resolveMode(mode: ThemeMode): "light" | "dark" {
	if (mode !== "system") return mode;
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export interface MD3ColorScheme {
	primary: string;
	onPrimary: string;
	primaryContainer: string;
	onPrimaryContainer: string;
	inversePrimary: string;
	primaryFixed: string;
	primaryFixedDim: string;
	onPrimaryFixed: string;
	onPrimaryFixedVariant: string;

	secondary: string;
	onSecondary: string;
	secondaryContainer: string;
	onSecondaryContainer: string;
	secondaryFixed: string;
	secondaryFixedDim: string;
	onSecondaryFixed: string;
	onSecondaryFixedVariant: string;

	tertiary: string;
	onTertiary: string;
	tertiaryContainer: string;
	onTertiaryContainer: string;
	tertiaryFixed: string;
	tertiaryFixedDim: string;
	onTertiaryFixed: string;
	onTertiaryFixedVariant: string;

	error: string;
	onError: string;
	errorContainer: string;
	onErrorContainer: string;

	surface: string;
	onSurface: string;
	surfaceVariant: string;
	onSurfaceVariant: string;
	surfaceTint: string;
	surfaceContainerLowest: string;
	surfaceContainerLow: string;
	surfaceContainer: string;
	surfaceContainerHigh: string;
	surfaceContainerHighest: string;

	inverseSurface: string;
	inverseOnSurface: string;

	background: string;
	onBackground: string;

	outline: string;
	outlineVariant: string;

	shadow: string;
	scrim: string;
}

/**
 * Generate a complete MD3 color scheme from a source color hex string.
 * Uses the HCT color space algorithm — same as Material You on Android.
 */
export function generateM3Theme(
	sourceColorHex: string,
	mode: "light" | "dark" = "light",
): MD3ColorScheme {
	const sourceColor = argbFromHex(sourceColorHex);
	const theme = themeFromSourceColor(sourceColor);

	const scheme = mode === "light" ? theme.schemes.light : theme.schemes.dark;
	const palettes = theme.palettes;

	const tone = (palette: (typeof palettes)[keyof typeof palettes], t: number) =>
		hexFromArgb(palette.tone(t));

	return {
		primary: hexFromArgb(scheme.primary),
		onPrimary: hexFromArgb(scheme.onPrimary),
		primaryContainer: hexFromArgb(scheme.primaryContainer),
		onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
		inversePrimary: hexFromArgb(scheme.inversePrimary),
		primaryFixed: tone(palettes.primary, 90),
		primaryFixedDim: tone(palettes.primary, 80),
		onPrimaryFixed: tone(palettes.primary, 10),
		onPrimaryFixedVariant: tone(palettes.primary, 30),

		secondary: hexFromArgb(scheme.secondary),
		onSecondary: hexFromArgb(scheme.onSecondary),
		secondaryContainer: hexFromArgb(scheme.secondaryContainer),
		onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
		secondaryFixed: tone(palettes.secondary, 90),
		secondaryFixedDim: tone(palettes.secondary, 80),
		onSecondaryFixed: tone(palettes.secondary, 10),
		onSecondaryFixedVariant: tone(palettes.secondary, 30),

		tertiary: hexFromArgb(scheme.tertiary),
		onTertiary: hexFromArgb(scheme.onTertiary),
		tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
		onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
		tertiaryFixed: tone(palettes.tertiary, 90),
		tertiaryFixedDim: tone(palettes.tertiary, 80),
		onTertiaryFixed: tone(palettes.tertiary, 10),
		onTertiaryFixedVariant: tone(palettes.tertiary, 30),

		error: hexFromArgb(scheme.error),
		onError: hexFromArgb(scheme.onError),
		errorContainer: hexFromArgb(scheme.errorContainer),
		onErrorContainer: hexFromArgb(scheme.onErrorContainer),

		surface: hexFromArgb(scheme.surface),
		onSurface: hexFromArgb(scheme.onSurface),
		surfaceVariant: hexFromArgb(scheme.surfaceVariant),
		onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
		surfaceTint: hexFromArgb(scheme.primary),
		// Surface container roles from neutral palette tones
		surfaceContainerLowest:
			mode === "light"
				? tone(palettes.neutral, 100)
				: tone(palettes.neutral, 4),
		surfaceContainerLow:
			mode === "light"
				? tone(palettes.neutral, 96)
				: tone(palettes.neutral, 10),
		surfaceContainer:
			mode === "light"
				? tone(palettes.neutral, 94)
				: tone(palettes.neutral, 12),
		surfaceContainerHigh:
			mode === "light"
				? tone(palettes.neutral, 92)
				: tone(palettes.neutral, 17),
		surfaceContainerHighest:
			mode === "light"
				? tone(palettes.neutral, 90)
				: tone(palettes.neutral, 22),

		inverseSurface: hexFromArgb(scheme.inverseSurface),
		inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),

		background: hexFromArgb(scheme.background),
		onBackground: hexFromArgb(scheme.onBackground),

		outline: hexFromArgb(scheme.outline),
		outlineVariant: hexFromArgb(scheme.outlineVariant),

		shadow: hexFromArgb(scheme.shadow),
		scrim: hexFromArgb(scheme.scrim),
	};
}

/**
 * Apply an MD3 dynamic color scheme to the document root as CSS custom properties.
 * Sets both `--md-sys-color-*` tokens (used by components) and
 * `--color-m3-*` tokens (used by Tailwind arbitrary values in apps).
 *
 * Also sets `data-theme` attribute for dark mode CSS selectors.
 */
export function applyTheme(
	sourceColorHex: string,
	mode: ThemeMode = "light",
	root: HTMLElement = document.documentElement,
): void {
	const resolved = resolveMode(mode);
	const colors = generateM3Theme(sourceColorHex, resolved);

	for (const [key, value] of Object.entries(colors)) {
		const kebabKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
		root.style.setProperty(`--md-sys-color-${kebabKey}`, value);
		root.style.setProperty(`--color-m3-${kebabKey}`, value);
	}

	// data-theme is always "light" or "dark" — never "system"
	root.setAttribute("data-theme", resolved);
}
