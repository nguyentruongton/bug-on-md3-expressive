export { useMediaQuery } from "./hooks/useMediaQuery";
// Hooks
/** @deprecated Use `useRippleState` (Framer Motion) from the main package instead. DOM-only ripple. */
export { useRipple as useDOMRipple } from "./hooks/useRipple";
export { MaterialSymbolsPreconnect } from "./lib/material-symbols-preconnect";
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
export type { BaseButtonProps, ButtonProps } from "./ui/button";
export { Button } from "./ui/button";
export type { ButtonGroupProps } from "./ui/button-group";
export { ButtonGroup } from "./ui/button-group";
export type { CardProps } from "./ui/card";
export { Card } from "./ui/card";
// Checkbox — MD3 Expressive tri-state checkbox
export type { CheckboxProps, CheckboxState, TriStateCheckboxProps } from "./ui/checkbox";
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
export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown";
// Dropdown Menu
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
export type {
	CircularProgressProps,
	LinearProgressProps,
	ProgressIndicatorProps,
} from "./ui/progress-indicator";
export { ProgressIndicator } from "./ui/progress-indicator";
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
export type { TableOfContentsProps, ToCItem } from "./ui/toc";
export { TableOfContents } from "./ui/toc";
// TextField — MD3 Expressive
export type {
	TextFieldHandle,
	TextFieldInputType,
	TextFieldProps,
	TextFieldTrailingIconMode,
	TextFieldVariant,
} from "./ui/text-field";
export { TextField } from "./ui/text-field";
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
