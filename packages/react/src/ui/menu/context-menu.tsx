// ─── MD3 Expressive Menu — ContextMenu (right-click / long-press) ─────────────
// Wraps @radix-ui/react-context-menu and provides MenuContext with
// menuPrimitive="context" so MenuItem automatically selects ContextMenu primitives.
//
// Visual styling is identical to Menu — baseline or expressive variant.
// Positioning, scroll lock, and outside click are all handled by Radix.
import * as RxContextMenu from "@radix-ui/react-context-menu";
import { AnimatePresence, m } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { FAST_SPATIAL_SPRING } from "./menu-animations";
import { MenuProvider, useMenuContext } from "./menu-context";
import {
	BASELINE_COLORS,
	MENU_CONTAINER_SHAPE,
	MENU_GROUP_GAP,
	MENU_MAX_WIDTH,
	MENU_MIN_WIDTH,
	MENU_POPUP_PADDING_Y,
	STANDARD_COLORS,
	VIBRANT_COLORS,
} from "./menu-tokens";
import type {
	ContextMenuContentProps,
	ContextMenuProps,
	ContextMenuTriggerProps,
} from "./menu-types";

// ─── ContextMenu (Root) ───────────────────────────────────────────────────────

/**
 * Root of a context menu (right-click / long-press triggered popup).
 *
 * Wraps `@radix-ui/react-context-menu` Root and provides `MenuContext` with
 * `menuPrimitive="context"` so nested `MenuItem` components automatically use
 * ContextMenu Radix primitives for correct accessibility and keyboard navigation.
 *
 * @example
 * // Baseline context menu
 * <ContextMenu variant="baseline">
 *   <ContextMenuTrigger asChild>
 *     <div>Right-click me</div>
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <MenuItem>Copy</MenuItem>
 *     <MenuItem>Paste</MenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 *
 * @example
 * // Expressive context menu with groups
 * <ContextMenu variant="expressive">
 *   <ContextMenuTrigger asChild><canvas /></ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <MenuGroup>
 *       <MenuItem>Cut</MenuItem>
 *       <MenuItem>Copy</MenuItem>
 *     </MenuGroup>
 *     <MenuGroup>
 *       <MenuItem>Paste</MenuItem>
 *     </MenuGroup>
 *   </ContextMenuContent>
 * </ContextMenu>
 */
export function ContextMenu({
	children,
	variant = "baseline",
	colorVariant = "standard",
}: ContextMenuProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<MenuProvider
			variant={variant}
			colorVariant={colorVariant}
			menuPrimitive="context"
			open={open}
			onOpenChange={setOpen}
		>
			<RxContextMenu.Root onOpenChange={setOpen}>{children}</RxContextMenu.Root>
		</MenuProvider>
	);
}
ContextMenu.displayName = "ContextMenu";

// ─── ContextMenuTrigger ───────────────────────────────────────────────────────

/**
 * The trigger area for a ContextMenu. Right-click (or long-press on touch)
 * within this area opens the context menu.
 *
 * Use `asChild` to apply trigger behavior to your own element without an
 * extra wrapper `<span>`.
 */
export const ContextMenuTrigger = React.forwardRef<
	React.ComponentRef<typeof RxContextMenu.Trigger>,
	ContextMenuTriggerProps &
		React.ComponentPropsWithoutRef<typeof RxContextMenu.Trigger>
>(({ children, asChild = true, ...props }, ref) => (
	<RxContextMenu.Trigger ref={ref} asChild={asChild} {...props}>
		{children}
	</RxContextMenu.Trigger>
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

// ─── ContextMenuContent (popup panel) ─────────────────────────────────────────

/**
 * The popup container for the context menu's contents.
 *
 * Renders into a portal via Radix. Uses Framer Motion `AnimatePresence` for
 * smooth enter/exit animations. Transform-origin is automatically set by
 * Radix via `--radix-context-menu-content-transform-origin`.
 *
 * Visual styling follows `variant` from `ContextMenuContext`:
 * - `baseline`   → CornerExtraSmall (4px), standard M3 styling
 * - `expressive` → rounded-2xl, shape-morphing groups, elevation-2
 *
 * @param hasOverflow - Set true when using SubMenu to prevent clipping
 */
export const ContextMenuContent = React.forwardRef<
	React.ComponentRef<typeof RxContextMenu.Content>,
	ContextMenuContentProps &
		Omit<
			React.ComponentPropsWithoutRef<typeof RxContextMenu.Content>,
			"asChild"
		>
>(
	(
		{
			children,
			hasOverflow = false,
			colorVariant: propColorVariant,
			separatorStyle = "gap",
			className,
			...props
		},
		ref,
	) => {
		const {
			open,
			variant,
			colorVariant: contextColorVariant,
		} = useMenuContext();
		const colorVariant = propColorVariant ?? contextColorVariant;

		const colors =
			variant === "baseline"
				? BASELINE_COLORS
				: colorVariant === "vibrant"
					? VIBRANT_COLORS
					: STANDARD_COLORS;

		const isExpressiveGap =
			variant === "expressive" && separatorStyle === "gap";

		const containerClassName =
			variant === "expressive"
				? cn(
						"z-50 flex flex-col w-full",
						MENU_MIN_WIDTH,
						MENU_MAX_WIDTH,
						isExpressiveGap ? MENU_GROUP_GAP : "",
						isExpressiveGap ? "bg-transparent" : colors.containerBg,
						isExpressiveGap ? "" : "rounded-2xl",
						isExpressiveGap ? "" : "elevation-2",
						hasOverflow || isExpressiveGap
							? "overflow-visible"
							: "overflow-hidden",
						"outline-none",
						className,
					)
				: cn(
						"z-50 flex flex-col",
						MENU_MIN_WIDTH,
						MENU_MAX_WIDTH,
						MENU_POPUP_PADDING_Y,
						MENU_GROUP_GAP,
						colors.containerBg,
						MENU_CONTAINER_SHAPE,
						"elevation-2",
						hasOverflow ? "overflow-visible" : "overflow-hidden",
						"outline-none",
						className,
					);

		// Helper to recursively flatten fragments
		const flattenChildren = (nodes: React.ReactNode): React.ReactElement[] => {
			return React.Children.toArray(nodes).reduce(
				(acc: React.ReactElement[], child) => {
					if (React.isValidElement(child)) {
						if (child.type === React.Fragment) {
							return acc.concat(
								flattenChildren(
									(child as React.ReactElement<{ children?: React.ReactNode }>)
										.props.children,
								),
							);
						}
						acc.push(child as React.ReactElement);
					}
					return acc;
				},
				[],
			);
		};

		let renderedChildren: React.ReactNode = children;

		if (variant === "expressive") {
			const validChildren = flattenChildren(children);
			const groupCount = validChildren.length;

			const enhancedChildren = validChildren.map((child, i) =>
				React.cloneElement(
					child as React.ReactElement<{
						index?: number;
						count?: number;
						isGapVariant?: boolean;
						className?: string;
					}>,
					{
						index: i,
						count: groupCount,
						isGapVariant: isExpressiveGap,
					},
				),
			);

			renderedChildren =
				separatorStyle === "divider"
					? enhancedChildren.reduce<React.ReactNode[]>((acc, child, i) => {
							if (i > 0) {
								acc.push(
									<hr
										key={`divider-${(child as React.ReactElement).key || i}`}
										className={cn(
											"mx-3 my-0.5 h-px border-0 bg-m3-outline-variant",
										)}
									/>,
								);
							}
							acc.push(child);
							return acc;
						}, [])
					: enhancedChildren;
		}

		return (
			<AnimatePresence>
				{open && (
					<RxContextMenu.Portal forceMount>
						<RxContextMenu.Content ref={ref} asChild forceMount {...props}>
							<m.div
								className={containerClassName}
								initial={{ opacity: 0, scale: 0.95, y: -4 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -4 }}
								transition={FAST_SPATIAL_SPRING}
								style={{
									...(props.style as React.CSSProperties),
									transformOrigin:
										"var(--radix-context-menu-content-transform-origin)",
								}}
							>
								{renderedChildren}
							</m.div>
						</RxContextMenu.Content>
					</RxContextMenu.Portal>
				)}
			</AnimatePresence>
		);
	},
);
ContextMenuContent.displayName = "ContextMenuContent";
