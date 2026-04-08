import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { applyTheme, type ThemeMode } from "../../lib/theme-utils";

interface ThemeContextValue {
	sourceColor: string;
	setSourceColor: (color: string) => void;
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY_COLOR = "md3-source-color";
const STORAGE_KEY_MODE = "md3-theme-mode";

export interface MD3ThemeProviderProps {
	children: ReactNode;
	sourceColor?: string;
	defaultMode?: ThemeMode;
	persistToLocalStorage?: boolean;
}

export function MD3ThemeProvider({
	children,
	sourceColor: initialSourceColor = "#6750A4",
	defaultMode = "light",
	persistToLocalStorage = false,
}: MD3ThemeProviderProps) {
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
		if (savedMode === "light" || savedMode === "dark") setMode(savedMode);

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

	return (
		<ThemeContext.Provider
			value={{ sourceColor, setSourceColor, mode, setMode }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within <MD3ThemeProvider>.");
	}
	return context;
}

export function useThemeMode(): Pick<ThemeContextValue, "mode" | "setMode"> {
	const { mode, setMode } = useTheme();
	return { mode, setMode };
}
