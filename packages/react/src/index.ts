export { useMediaQuery } from "./hooks/useMediaQuery";
// Hooks
/** @deprecated Use `useRippleState` (Framer Motion) from the main package instead. DOM-only ripple. */
export { useRipple as useDOMRipple } from "./hooks/useRipple";
export { MaterialSymbolsPreconnect } from "./lib/material-symbols-preconnect";
// Theme — MD3 Dynamic Color
export type { MD3ColorScheme, ThemeMode } from "./lib/theme-utils";
export { applyTheme, generateM3Theme } from "./lib/theme-utils";
// Utils
export { cn } from "./lib/utils";
// Types
export type {
	MD3ColorStyle,
	MD3Shape,
	MD3Size,
	PolymorphicProps,
	PolymorphicRef,
} from "./types/md3";
// App Bar — MD3 Expressive App Bar system
export type {
	AppBarColors,
	AppBarColumnProps,
	AppBarItem,
	AppBarItemType,
	AppBarMenuState,
	AppBarOverflowIndicatorProps,
	AppBarRowProps,
	AppBarScrollBehavior,
	BaseAppBarProps,
	BottomAppBarProps,
	DockedToolbarProps,
	FlexibleAppBarProps,
	SearchAppBarProps,
	SearchBarVariant,
	SearchViewProps,
	SmallAppBarProps,
	TitleAlignment,
	UseAppBarScrollReturn,
} from "./ui/app-bar";
export {
	APP_BAR_BOTTOM_SPRING,
	APP_BAR_COLOR_TRANSITION,
	APP_BAR_COLORS,
	APP_BAR_ENTER_ALWAYS_SPRING,
	APP_BAR_TITLE_FADE,
	AppBarColumn,
	AppBarOverflowIndicator,
	AppBarRow,
	AppBarTokens,
	appBarTypography,
	BottomAppBar,
	DockedToolbar,
	LargeFlexibleAppBar,
	MediumFlexibleAppBar,
	SEARCH_VIEW_SPRING,
	SearchAppBar,
	SearchView,
	SearchViewContainer,
	SmallAppBar,
	useAppBarScroll,
} from "./ui/app-bar";
export type { BadgedBoxProps, BadgeProps } from "./ui/badge";
// Badge — MD3 Expressive status indicator
export { Badge, BadgedBox } from "./ui/badge";
export type { BaseButtonProps, ButtonProps } from "./ui/button";
export { Button } from "./ui/button";
export type { ButtonGroupProps } from "./ui/button-group";
export { ButtonGroup } from "./ui/button-group";
export type { CardProps } from "./ui/card";
export { Card } from "./ui/card";
// Checkbox — MD3 Expressive tri-state checkbox
export type {
	CheckboxProps,
	CheckboxState,
	TriStateCheckboxProps,
} from "./ui/checkbox";
export { Checkbox, TriStateCheckbox } from "./ui/checkbox";
export type { ChipProps } from "./ui/chip";
export { Chip } from "./ui/chip";
export type { CodeBlockProps } from "./ui/code-block";
export { CodeBlock } from "./ui/code-block";
export type {
	DialogContentProps,
	DialogFullScreenContentProps,
	DialogProps,
} from "./ui/dialog";
// Dialog
export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogFullScreenContent,
	DialogHeader,
	DialogIcon,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
// Divider — MD3 Expressive divider line
export type { DividerProps } from "./ui/divider";
export { buildWavePath, Divider } from "./ui/divider";
export type { DrawerContentProps, DrawerProps } from "./ui/drawer";
// Drawer (Bottom Sheet)
export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
} from "./ui/drawer";

export type { FABPositionProps, FABProps } from "./ui/fab";
// Floating Action Button
export { FAB, FABPosition } from "./ui/fab";
export type {
	FABMenuItemData,
	FABMenuItemProps,
	FABMenuProps,
	ToggleFABProps,
} from "./ui/fab-menu";
// FAB Menu
export { FABMenu, FABMenuItem, ToggleFAB } from "./ui/fab-menu";
// Icon — Material Symbols variable font
export type { IconProps } from "./ui/icon";
export { Icon } from "./ui/icon";
export type { BaseIconButtonProps, IconButtonProps } from "./ui/icon-button";
export { IconButton } from "./ui/icon-button";
export type { LoadingIndicatorProps } from "./ui/loading-indicator";
export { LoadingIndicator } from "./ui/loading-indicator";
// MD3 Expressive Menu — Standard + Vibrant + shape morphing
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
} from "./ui/menu";
export {
	CHECK_ICON_VARIANTS,
	DIVIDER_COLOR,
	DIVIDER_PADDING,
	GROUP_SHAPE_SPRING,
	GROUP_SHAPES,
	ITEM_SHAPE_CLASSES,
	MENU_CHECK_ICON_SIZE,
	MENU_CONTAINER_VARIANTS,
	MENU_GROUP_GAP,
	MENU_ICON_SIZE,
	MENU_ITEM_MIN_HEIGHT,
	MENU_MAX_WIDTH,
	MENU_MIN_WIDTH,
	Menu,
	MenuContent,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuProvider,
	MenuTrigger,
	STANDARD_COLORS,
	SUBMENU_CONTAINER_VARIANTS,
	SubMenu,
	useMenuContext,
	// Vertical Menu
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuDivider,
	VerticalMenuGroup,
	VIBRANT_COLORS,
} from "./ui/menu";
// Navigation Rail
export type {
	NavigationRailItemProps,
	NavigationRailLabelVisibility,
	NavigationRailProps,
	NavigationRailVariant,
} from "./ui/navigation-rail";
export { NavigationRail, NavigationRailItem } from "./ui/navigation-rail";
export type {
	CircularProgressProps,
	LinearProgressProps,
	ProgressIndicatorProps,
} from "./ui/progress-indicator";
export { ProgressIndicator } from "./ui/progress-indicator";
// RadioButton — MD3 Expressive radio button
export type {
	RadioButtonColors,
	RadioButtonProps,
	RadioGroupProps,
} from "./ui/radio-button";
export { RadioButton, RadioGroup } from "./ui/radio-button";
export type {
	RippleOrigin,
	RippleProps,
	UseRippleStateOptions,
} from "./ui/ripple";
export { Ripple, useRipple, useRippleState } from "./ui/ripple";
// ScrollArea
export type {
	ScrollAreaOrientation,
	ScrollAreaProps,
	ScrollAreaType,
} from "./ui/scroll-area";
export {
	ScrollArea,
	ScrollAreaScrollbar,
} from "./ui/scroll-area";
// Search — MD3 Expressive Search component
export type {
	SearchProps,
	SearchStyleType,
	SearchVariant,
} from "./ui/search";
export {
	SEARCH_BAR_EXPAND_SPRING,
	SEARCH_COLORS,
	SEARCH_DOCKED_REVEAL_SPRING,
	SEARCH_FULLSCREEN_SPRING,
	SEARCH_TYPOGRAPHY,
	Search,
	SearchBar,
	SearchTokens,
	SearchViewDocked,
	SearchViewFullScreen,
	useSearchKeyboard,
} from "./ui/search";
// Slider — MD3 Expressive
export type {
	RangeSliderProps,
	SliderOrientation,
	SliderProps,
	SliderTrackSize,
	SliderVariant,
} from "./ui/slider";
export { RangeSlider, Slider, SliderColors, SliderTokens } from "./ui/slider";
// Snackbar — MD3 Expressive imperative toast system
export type {
	SnackbarData,
	SnackbarDuration,
	SnackbarHostProps,
	SnackbarProps,
	SnackbarResult,
	SnackbarVisuals,
	UseSnackbarStateReturn,
} from "./ui/snackbar";
export {
	Snackbar,
	SnackbarHost,
	SnackbarProvider,
	useSnackbar,
	useSnackbarState,
} from "./ui/snackbar";
// Switch — MD3 Expressive toggle
export type { SwitchProps } from "./ui/switch";
export { Switch, SwitchColors, SwitchTokens } from "./ui/switch";
// Tabs — MD3 Expressive navigation tabs
export type {
	TabProps,
	TabsContentProps,
	TabsListProps,
	TabsProps,
	TabsVariant,
} from "./ui/tabs";
export {
	Tab,
	Tabs,
	TabsColors,
	TabsContent,
	TabsList,
	TabsTokens,
} from "./ui/tabs";
// TextField — MD3 Expressive
export type {
	TextFieldHandle,
	TextFieldInputType,
	TextFieldProps,
	TextFieldTrailingIconMode,
	TextFieldVariant,
} from "./ui/text-field";
export { TextField } from "./ui/text-field";
export type { MD3ThemeProviderProps } from "./ui/theme-provider";
export { MD3ThemeProvider, useTheme, useThemeMode } from "./ui/theme-provider";
export type { TableOfContentsProps, ToCItem } from "./ui/toc";
export { TableOfContents } from "./ui/toc";
// Tooltip — MD3 Expressive
export type {
	CaretConfig,
	PlainTooltipProps,
	RichTooltipProps,
	TooltipBoxProps,
	TooltipPlacement,
	TooltipState,
	TooltipStateConfig,
	TooltipTrigger,
} from "./ui/tooltip";
export {
	PlainTooltip,
	RichTooltip,
	TooltipBox,
	TooltipCaretShape,
	TooltipTokens,
	useTooltipPosition,
	useTooltipState,
} from "./ui/tooltip";
export type {
	TextStyle,
	TypeScaleTokensType,
	TypographyProviderProps,
} from "./ui/typography";
// Typography - MD3 Expressive
export {
	MD3_EXPRESSIVE_FONT_VARIATION,
	TypeScaleTokens,
	Typography,
	TypographyContext,
	TypographyKeyTokens,
	TypographyProvider,
	TypographyTokens,
	useTypography,
} from "./ui/typography";
