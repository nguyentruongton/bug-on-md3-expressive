"use client";

import { domMax, LazyMotion } from "motion/react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { applyTheme, resolveMode, type ThemeMode } from "../../lib/theme-utils";
import {
	SnackbarContext,
	SnackbarHost,
	useSnackbarState,
} from "../snackbar/snackbar";
import { Typography, TypographyContext } from "../typography/typography";
import {
	type FontVariationAxes,
	TypographyTokens,
} from "../typography/typography-tokens";

// ─── Theme Context ─────────────────────────────────────────────────────────────

interface ThemeContextValue {
	sourceColor: string;
	setSourceColor: (color: string) => void;
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	/** The resolved color scheme actually applied — always "light" or "dark". */
	effectiveMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY_COLOR = "md3-source-color";
const STORAGE_KEY_MODE = "md3-theme-mode";

// ─── Singleton defaults (computed once) ───────────────────────────────────────

const defaultTokens = new TypographyTokens();
const defaultTypography = new Typography(defaultTokens);

// ─── MD3ThemeProvider ──────────────────────────────────────────────────────────

export interface MD3ThemeProviderProps {
	children: ReactNode;
	// ── Theme ─────────────────────────────────────────────────────────────────
	sourceColor?: string;
	defaultMode?: ThemeMode;
	persistToLocalStorage?: boolean;
	// ── Typography ────────────────────────────────────────────────────────────
	/**
	 * A fully custom `Typography` instance.
	 * When provided, `fontFamily` and `fontVariationAxes` are ignored.
	 */
	typography?: Typography;
	/**
	 * Override the CSS `font-family` for all typography styles.
	 * Ignored when `typography` prop is provided.
	 * @example "'Inter', sans-serif"
	 */
	fontFamily?: string;
	/**
	 * Variable font axes applied globally via `font-variation-settings`.
	 * Merged on top of defaults (`ROND: 100`). Ignored when `typography` is provided.
	 * @example { ROND: 50 }
	 */
	fontVariationAxes?: FontVariationAxes;
	// ── Snackbar ──────────────────────────────────────────────────────────────
	/**
	 * When `true`, mounts `SnackbarHost` inside the provider and exposes
	 * `useSnackbar()` to all descendants — no separate `<SnackbarProvider>` needed.
	 *
	 * Opt-in, default `false`. For advanced usage (e.g., scoped snackbars or
	 * custom host positioning), keep this `false` and use `<SnackbarProvider>`
	 * or `<SnackbarHost>` directly.
	 *
	 * @default false
	 */
	enableSnackbar?: boolean;
}

export function MD3ThemeProvider({
	children,
	sourceColor: initialSourceColor = "#6750A4",
	defaultMode = "light",
	persistToLocalStorage = false,
	typography: typographyProp,
	fontFamily,
	fontVariationAxes,
	enableSnackbar = false,
}: MD3ThemeProviderProps) {
	// ── Theme state ──────────────────────────────────────────────────────────
	const [sourceColor, setSourceColor] = useState(initialSourceColor);
	const [mode, setMode] = useState<ThemeMode>(defaultMode);
	const [isHydrated, setIsHydrated] = useState(!persistToLocalStorage);

	useEffect(() => {
		if (!persistToLocalStorage) return;

		const savedColor = localStorage.getItem(STORAGE_KEY_COLOR);
		const savedMode = localStorage.getItem(
			STORAGE_KEY_MODE,
		) as ThemeMode | null;

		if (savedColor) setSourceColor(savedColor);
		if (
			savedMode === "light" ||
			savedMode === "dark" ||
			savedMode === "system"
		)
			setMode(savedMode);

		setIsHydrated(true);
	}, [persistToLocalStorage]);

	useEffect(() => {
		if (!isHydrated) return;

		applyTheme(sourceColor, mode);

		if (persistToLocalStorage) {
			localStorage.setItem(STORAGE_KEY_COLOR, sourceColor);
			localStorage.setItem(STORAGE_KEY_MODE, mode);
		}
	}, [sourceColor, mode, persistToLocalStorage, isHydrated]);

	// ── System preference subscription ───────────────────────────────────────
	// When mode is "system", listen for OS-level dark/light changes in real time
	useEffect(() => {
		if (mode !== "system" || typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => applyTheme(sourceColor, "system");

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [mode, sourceColor]);

	// ── Derived effective mode (no extra state needed) ────────────────────────
	const effectiveMode = resolveMode(mode);

	const themeValue = useMemo<ThemeContextValue>(
		() => ({ sourceColor, setSourceColor, mode, setMode, effectiveMode }),
		[sourceColor, mode, effectiveMode],
	);

	// ── Typography value ─────────────────────────────────────────────────────
	const typographyValue = useMemo<Typography>(() => {
		if (typographyProp) return typographyProp;
		if (fontFamily ?? fontVariationAxes) {
			return new Typography(
				new TypographyTokens({ fontFamily, fontVariationAxes }),
			);
		}
		return defaultTypography;
	}, [typographyProp, fontFamily, fontVariationAxes]);

	// ── Snackbar — mounted as isolated subtree so hook only allocates when needed

	return (
		<LazyMotion features={domMax}>
			<ThemeContext.Provider value={themeValue}>
				<TypographyContext.Provider value={typographyValue}>
					{enableSnackbar ? (
						<SnackbarMountedProvider>{children}</SnackbarMountedProvider>
					) : (
						children
					)}
				</TypographyContext.Provider>
			</ThemeContext.Provider>
		</LazyMotion>
	);
}

// ─── SnackbarMountedProvider ──────────────────────────────────────────────────

/**
 * Internal helper component — renders only when `enableSnackbar={true}`.
 * Isolates `useSnackbarState` so the hook is never allocated unnecessarily.
 */
function SnackbarMountedProvider({ children }: { children: ReactNode }) {
	const state = useSnackbarState();
	const contextValue = useMemo(
		() => ({ showSnackbar: state.showSnackbar }),
		[state.showSnackbar],
	);

	return (
		<SnackbarContext.Provider value={contextValue}>
			{children}
			<SnackbarHost state={state} />
		</SnackbarContext.Provider>
	);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within <MD3ThemeProvider>.");
	}
	return context;
}

export function useThemeMode(): Pick<
	ThemeContextValue,
	"mode" | "setMode" | "effectiveMode"
> {
	const { mode, setMode, effectiveMode } = useTheme();
	return { mode, setMode, effectiveMode };
}
