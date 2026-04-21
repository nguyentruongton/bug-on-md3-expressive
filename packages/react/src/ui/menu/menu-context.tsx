// ─── MD3 Expressive Menu — React Context ──────────────────────────────────────
import * as React from "react";
import type {
	MenuColorVariant,
	MenuPrimitive,
	MenuVariant,
} from "./menu-types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface MenuContextValue {
	/** Visual variant: baseline (M3 standard) or expressive (shape-morphing) */
	variant: MenuVariant;
	/** Color variant inherited by all children unless overridden */
	colorVariant: MenuColorVariant;
	/**
	 * Which Radix primitive family drives this menu:
	 * - "dropdown" → @radix-ui/react-dropdown-menu (button/field trigger)
	 * - "context"  → @radix-ui/react-context-menu (right-click trigger)
	 * - "static"   → plain HTML via Slot (VerticalMenu, always-visible)
	 */
	menuPrimitive: MenuPrimitive;
	/**
	 * Whether the menu popup is currently open.
	 * Used by MenuContent to drive AnimatePresence for exit animations.
	 */
	open: boolean;
	/** Setter forwarded from Menu root — kept in sync with Radix Root open state */
	onOpenChange: (open: boolean) => void;
}

// ─── Backward-compat derived getter ───────────────────────────────────────────
// Components that still reference `isStatic` (MenuGroup, etc.) use this helper
// during the incremental migration period.
export function isStaticPrimitive(primitive: MenuPrimitive): boolean {
	return primitive === "static";
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MenuContext = React.createContext<MenuContextValue>({
	variant: "baseline",
	colorVariant: "standard",
	menuPrimitive: "dropdown",
	open: false,
	onOpenChange: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface MenuProviderProps {
	variant?: MenuVariant;
	colorVariant?: MenuColorVariant;
	menuPrimitive?: MenuPrimitive;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}

export function MenuProvider({
	variant = "baseline",
	colorVariant = "standard",
	menuPrimitive = "dropdown",
	open,
	onOpenChange,
	children,
}: MenuProviderProps) {
	const value = React.useMemo<MenuContextValue>(
		() => ({ variant, colorVariant, menuPrimitive, open, onOpenChange }),
		[variant, colorVariant, menuPrimitive, open, onOpenChange],
	);

	return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the nearest MenuContext value.
 * Safe to use outside a MenuProvider (returns default: baseline, dropdown, closed).
 *
 * Includes backward-compat shims:
 * - `menuVariant` → alias for `variant` (deprecated, will be removed)
 * - `isStatic`    → `menuPrimitive === "static"`
 */
export function useMenuContext(): MenuContextValue & {
	isStatic: boolean;
	menuVariant: MenuVariant;
} {
	const ctx = React.useContext(MenuContext);
	return React.useMemo(
		() => ({
			...ctx,
			isStatic: ctx.menuPrimitive === "static",
			menuVariant: ctx.variant,
		}),
		[ctx],
	);
}
