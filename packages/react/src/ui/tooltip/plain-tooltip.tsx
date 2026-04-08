import type { CSSProperties } from "react";
import { forwardRef } from "react";
import { TooltipTokens } from "./tooltip.tokens";
import type { PlainTooltipProps } from "./tooltip.types";
import { TooltipCaretShape } from "./tooltip-caret-shape";

export const PlainTooltip = forwardRef<HTMLDivElement, PlainTooltipProps>(
	(
		{
			children,
			caret,
			className = "",
			maxWidth,
			containerColor,
			textColor,
			...props
		},
		ref,
	) => {
		const { containerColor: tokenContainer, textColor: tokenText, font, padding, shape, height, maxWidth: tokenMaxWidth } =
			TooltipTokens.PlainTooltip;

		const style: CSSProperties = {
			...props.style,
			backgroundColor: containerColor ?? tokenContainer,
			color: textColor ?? tokenText,
			...(maxWidth && { maxWidth }),
		};

		const side = props["data-side"] ?? "top";

		return (
			<div
				ref={ref}
				className={`relative inline-flex items-center box-border ${shape} ${font} ${padding} ${height} ${!maxWidth ? tokenMaxWidth : ""} ${className}`}
				style={style}
				{...props}
			>
				{caret?.enabled && (
					<TooltipCaretShape
						side={side}
						width={caret.width}
						height={caret.height}
						color={style.backgroundColor as string}
						customPath={caret.customPath}
					/>
				)}
				<span className="whitespace-normal text-start wrap-break-word">{children}</span>
			</div>
		);
	},
);

PlainTooltip.displayName = "PlainTooltip";
