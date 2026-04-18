// ─── MD3 Expressive Menu — React Context ──────────────────────────────────────
import * as React from "react";
import type { MenuColorVariant } from "./menu-types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface MenuContextValue {
	/** Color variant inherited by all children unless overridden */
	colorVariant: MenuColorVariant;
	/**
	 * Whether the menu popup is currently open.
	 * Used by MenuContent to drive AnimatePresence for exit animations.
	 */
	open: boolean;
	/** Setter forwarded from Menu root — kept in sync with Radix Root open state */
	onOpenChange: (open: boolean) => void;
	/** Whether the menu is rendered statically (e.g. VerticalMenu) to bypass Radix Dropdown dependencies */
	isStatic: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MenuContext = React.createContext<MenuContextValue>({
	colorVariant: "standard",
	open: false,
	onOpenChange: () => {},
	isStatic: false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface MenuProviderProps {
	colorVariant?: MenuColorVariant;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isStatic?: boolean;
	children: React.ReactNode;
}

export function MenuProvider({
	colorVariant = "standard",
	open,
	onOpenChange,
	isStatic = false,
	children,
}: MenuProviderProps) {
	const value = React.useMemo<MenuContextValue>(
		() => ({ colorVariant, open, onOpenChange, isStatic }),
		[colorVariant, open, onOpenChange, isStatic],
	);

	return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the nearest MenuContext value.
 * Safe to use outside a MenuProvider (returns default: standard, closed).
 */
export function useMenuContext(): MenuContextValue {
	return React.useContext(MenuContext);
}
