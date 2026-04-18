// ─── MD3 Expressive Menu — Barrel Export ─────────────────────────────────────

// Components
export { Menu, MenuContent, MenuTrigger } from "./menu";
// Animation variants (for consumers extending animations)
export {
	CHECK_ICON_VARIANTS,
	GROUP_SHAPE_SPRING,
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
	MenuColorVariant,
	MenuContentProps,
	MenuDividerProps,
	MenuGroupPosition,
	MenuGroupProps,
	MenuItemPosition,
	MenuItemProps,
	MenuProps,
	MenuTriggerProps,
	SubMenuProps,
	// Vertical Menu
	VerticalMenuContentProps,
	VerticalMenuDividerProps,
	VerticalMenuGroupProps,
	VerticalMenuProps,
	VerticalMenuSeparatorStyle,
} from "./menu-types";
export { SubMenu } from "./sub-menu";
// Vertical Menu components
export {
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuDivider,
	VerticalMenuGroup,
} from "./vertical-menu";
