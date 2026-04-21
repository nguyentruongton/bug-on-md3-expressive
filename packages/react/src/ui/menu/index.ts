// ─── MD3 Expressive Menu — Barrel Export ─────────────────────────────────────

// Components — ContextMenu (right-click / long-press popup)
export {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from "./context-menu";
// Components — Menu (dropdown popup)
export { Menu, MenuContent, MenuTrigger } from "./menu";

// Animation variants (for consumers extending animations)
export {
	CHECK_ICON_VARIANTS,
	FAST_EFFECTS_TRANSITION,
	FAST_SPATIAL_SPRING,
	MENU_CHECK_ICON_SIZE,
	MENU_CONTAINER_VARIANTS,
	SUBMENU_CONTAINER_VARIANTS,
} from "./menu-animations";

// Context (for advanced usage / extending)
export { MenuProvider, useMenuContext } from "./menu-context";
export { MenuDivider } from "./menu-divider";
export { MenuGroup } from "./menu-group";
export { MenuItem } from "./menu-item";

// Tokens (for consumers who need raw values)
export {
	DIVIDER_COLOR,
	DIVIDER_PADDING,
	GROUP_SHAPES,
	ITEM_SHAPE_CLASSES,
	MENU_GROUP_GAP,
	MENU_ICON_SIZE,
	MENU_ITEM_MIN_HEIGHT,
	MENU_MAX_WIDTH,
	MENU_MIN_WIDTH,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";

// Types
export type {
	// ContextMenu
	ContextMenuContentProps,
	ContextMenuProps,
	ContextMenuTriggerProps,
	MenuColorVariant,
	MenuContentProps,
	MenuDividerProps,
	MenuGroupPosition,
	MenuGroupProps,
	MenuItemPosition,
	MenuItemProps,
	MenuPrimitive,
	MenuProps,
	MenuTriggerProps,
	MenuVariant,
	SubMenuProps,
	// Vertical Menu
	VerticalMenuContentProps,
	VerticalMenuDividerProps,
	VerticalMenuGroupProps,
	VerticalMenuProps,
	VerticalMenuSeparatorStyle,
} from "./menu-types";

export { SubMenu } from "./sub-menu";

// Vertical Menu components (static, always-visible — unchanged)
export {
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuDivider,
	VerticalMenuGroup,
} from "./vertical-menu";
