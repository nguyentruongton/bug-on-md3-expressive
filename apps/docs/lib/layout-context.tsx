"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface LayoutContextType {
	isDrawerOpen: boolean;
	toggleDrawer: () => void;
	setIsDrawerOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("md3-drawer-open");
		// Check if desktop (lg breakpoint is typically 1024px)
		if (stored === "true" && window.innerWidth >= 1024) {
			setIsDrawerOpen(true);
		}
	}, []);

	const toggleDrawer = () => {
		setIsDrawerOpen((prev) => {
			const nextState = !prev;
			if (window.innerWidth >= 1024) {
				localStorage.setItem("md3-drawer-open", String(nextState));
			}
			return nextState;
		});
	};

	const setDrawer = (open: boolean) => {
		setIsDrawerOpen(open);
		if (window.innerWidth >= 1024) {
			localStorage.setItem("md3-drawer-open", String(open));
		}
	};

	return (
		<LayoutContext.Provider
			value={{ isDrawerOpen, toggleDrawer, setIsDrawerOpen: setDrawer }}
		>
			{children}
		</LayoutContext.Provider>
	);
}

export function useLayout() {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}
	return context;
}
