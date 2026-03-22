"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ className, orientation = "horizontal", children, ...props }, ref) => {
		const childrenArray = React.Children.toArray(children).filter(
			React.isValidElement,
		);
		const count = childrenArray.length;

		return (
			<div
				ref={ref}
				role="group"
				className={cn(
					"inline-flex",
					orientation === "vertical" ? "flex-col" : "flex-row",
					className,
				)}
				{...props}
			>
				{childrenArray.map((child, index) => {
					const isFirst = index === 0;
					const isLast = index === count - 1;
					// biome-ignore lint/suspicious/noExplicitAny: Required for React.cloneElement 
					const element = child as React.ReactElement<any>;

					return React.cloneElement(element, {
						className: cn(
							element.props.className,
							"rounded-none",
							orientation === "horizontal" && isFirst && "rounded-l-full",
							orientation === "horizontal" && isLast && "rounded-r-full",
							orientation === "vertical" && isFirst && "rounded-t-full",
							orientation === "vertical" && isLast && "rounded-b-full",
							orientation === "horizontal" && !isFirst && "-ml-[1px]",
							orientation === "vertical" && !isFirst && "-mt-[1px]",
							"focus-visible:z-10 hover:z-10 relative",
						),
					});
				})}
			</div>
		);
	},
);
ButtonGroup.displayName = "ButtonGroup";
