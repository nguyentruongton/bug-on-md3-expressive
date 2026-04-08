import type { CSSProperties } from "react";
import { forwardRef } from "react";
import { TooltipTokens } from "./tooltip.tokens";
import type { RichTooltipProps } from "./tooltip.types";
import { TooltipCaretShape } from "./tooltip-caret-shape";

export const RichTooltip = forwardRef<HTMLDivElement, RichTooltipProps>(
	(
		{
			children,
			title,
			action,
			caret,
			className = "",
			maxWidth,
			colors = {},
			...props
		},
		ref,
	) => {
		const {
			containerColor: tokenContainer,
			elevation,
			shape,
			paddingTop,
			paddingBottom,
			paddingX,
			maxWidth: tokenMaxWidth,
			subheadColor,
			subheadFont,
			bodyColor,
			bodyFont,
			actionColor,
			actionFont,
		} = TooltipTokens.RichTooltip;

		const containerStyle: CSSProperties = {
			...props.style,
			backgroundColor: colors.container ?? tokenContainer,
			...(maxWidth && { maxWidth }),
		};

		const side = props["data-side"] ?? "top";

		const titleColor = colors.title ?? subheadColor;
		const bodyColorResolved = colors.body ?? bodyColor;
		const actionColorResolved = colors.action ?? actionColor;

		return (
			<div
				ref={ref}
				className={`relative box-border flex flex-col ${shape} ${elevation} ${paddingTop} ${paddingBottom} ${paddingX} ${!maxWidth ? tokenMaxWidth : ""} ${className}`}
				style={containerStyle}
				{...props}
			>
				{caret?.enabled && (
					<TooltipCaretShape
						side={side}
						width={caret.width}
						height={caret.height}
						color={containerStyle.backgroundColor as string}
						customPath={caret.customPath}
					/>
				)}

				{title && (
					<div className={`mb-1 ${subheadFont}`} style={{ color: titleColor }}>
						{title}
					</div>
				)}

				{children && (
					<div
						className={`whitespace-normal text-start wrap-break-word ${bodyFont}`}
						style={{ color: bodyColorResolved }}
					>
						{children}
					</div>
				)}

				{action && (
					<div
						className={`mt-2 flex min-h-9 flex-wrap items-center gap-2 ${actionFont}`}
						style={{ color: actionColorResolved }}
					>
						{action}
					</div>
				)}
			</div>
		);
	},
);

RichTooltip.displayName = "RichTooltip";
