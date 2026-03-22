"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { applyTheme, type ThemeMode } from "@/lib/theme-utils";

interface ThemeContextType {
	sourceColor: string;
	setSourceColor: (color: string) => void;
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [sourceColor, setSourceColor] = useState("#6750A4");
	const [mode, setMode] = useState<ThemeMode>("light");
	const [isMounted, setIsMounted] = useState(false);

	// Initialize from localStorage on mount
	useEffect(() => {
		const savedColor = localStorage.getItem("m3-source-color");
		const savedMode = localStorage.getItem("m3-theme-mode") as ThemeMode;

		// Defer state updates to next tick to avoid synchronous cascading render lint error
		Promise.resolve().then(() => {
			if (savedColor) setSourceColor(savedColor);
			if (savedMode) setMode(savedMode);
			setIsMounted(true);
		});
	}, []);

	useEffect(() => {
		if (isMounted) {
			applyTheme(sourceColor, mode);
			localStorage.setItem("m3-source-color", sourceColor);
			localStorage.setItem("m3-theme-mode", mode);
		}
	}, [sourceColor, mode, isMounted]);

	return (
		<ThemeContext.Provider
			value={{ sourceColor, setSourceColor, mode, setMode }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
