import { domMax, LazyMotion, m } from "motion/react";
import * as React from "react";
import { cn } from "../lib/utils";
import { SPRING_TRANSITION_FAST } from "./shared/constants";

// @internal — font must be loaded via '@bug-on/md3-react/material-symbols.css'
const VARIANT_FONT: Record<NonNullable<IconProps["variant"]>, string> = {
	outlined: "'Material Symbols Outlined'",
	rounded: "'Material Symbols Rounded'",
	sharp: "'Material Symbols Sharp'",
};

/**
 * Props for the {@link Icon} component.
 *
 * All variable font axes map directly to `font-variation-settings`.
 */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Material Symbol name in snake_case ligature format.
	 * @example "home", "arrow_forward", "settings"
	 * @see https://fonts.google.com/icons
	 */
	name: string;

	/**
	 * Geometric style variant — maps to the loaded font family.
	 * @default "outlined"
	 */
	variant?: "outlined" | "rounded" | "sharp";

	/**
	 * FILL axis. `0` = outlined, `1` = filled.
	 * Spring-animated when `animateFill` is true.
	 * @default 0
	 */
	fill?: 0 | 1;

	/**
	 * wght axis — stroke weight. Match to surrounding text weight.
	 * @default 400
	 */
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;

	/**
	 * GRAD axis — visual weight fine-tune without affecting layout.
	 * Use `-25` on dark backgrounds to compensate for halation.
	 * @default 0
	 */
	grade?: -50 | -25 | 0 | 100 | 200;

	/**
	 * opsz axis — optical size in dp. Also sets `font-size` unless `size` is given.
	 * Match to the rendered pixel size for best rendering quality.
	 * @default 24
	 */
	opticalSize?: 20 | 24 | 40 | 48;

	/**
	 * Explicit `font-size` override in px. The `opsz` axis still follows `opticalSize`.
	 * @example size={18} opticalSize={20}
	 */
	size?: number | "inherit";

	/**
	 * Animate the FILL axis transition with a spring (uses `SPRING_TRANSITION_FAST`).
	 * Requires `motion/react` peer dependency.
	 * @default false
	 * @example <Icon name="favorite" fill={isLiked ? 1 : 0} animateFill />
	 */
	animateFill?: boolean;
}

const IconComponent = React.forwardRef<HTMLSpanElement, IconProps>(
	(
		{
			name,
			variant = "outlined",
			fill = 0,
			weight = 400,
			grade = 0,
			opticalSize = 24,
			size,
			animateFill = false,
			className,
			style,
			...restProps
		},
		ref,
	) => {
		const fontVariationSettings = `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`;

		const computedStyle: React.CSSProperties = {
			fontFamily: VARIANT_FONT[variant],
			fontSize: size === "inherit" ? "inherit" : (size != null ? `${size}px` : `${opticalSize}px`),
			fontVariationSettings,
			...style,
		};

		if (animateFill) {
			return (
				<LazyMotion features={domMax} strict>
					<m.span
						ref={ref}
						className={cn("md-icon inline-flex items-center justify-center shrink-0 select-none", className)}
						aria-hidden="true"
						animate={{ fontVariationSettings }}
						transition={SPRING_TRANSITION_FAST}
						style={computedStyle}
						// biome-ignore lint/suspicious/noExplicitAny: motion v12 HTMLMotionProps conflicts with React's event types
						{...(restProps as any)}
					>
						{name}
					</m.span>
				</LazyMotion>
			);
		}

		return (
			<span
				ref={ref}
				className={cn("md-icon inline-flex items-center justify-center shrink-0 select-none", className)}
				aria-hidden="true"
				style={computedStyle}
				{...restProps}
			>
				{name}
			</span>
		);
	},
);

IconComponent.displayName = "Icon";

/**
 * Material Symbols variable font icon.
 *
 * Load the font first:
 * ```ts
 * import '@bug-on/md3-react/material-symbols.css';
 * ```
 *
 * @remarks
 * - Names use snake_case ligatures: `"arrow_forward"`, not `"ArrowForward"`.
 * - `aria-hidden="true"` is set automatically — add accessible labels on the parent.
 *
 * @example
 * ```tsx
 * <Icon name="home" />
 * <Icon name="favorite" variant="rounded" fill={1} weight={300} />
 * <Icon name="bookmark" fill={saved ? 1 : 0} animateFill />
 * <Icon name="close" size={18} opticalSize={20} />
 * <Button icon={<Icon name="add" />}>Add item</Button>
 * ```
 *
 * @see https://fonts.google.com/icons
 * @see https://m3.material.io/styles/icons/overview
 */
export const Icon = React.memo(IconComponent);
