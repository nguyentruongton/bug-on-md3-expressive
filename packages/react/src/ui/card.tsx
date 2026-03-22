"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

const cardVariants = cva(
	"rounded-m3-lg p-6 flex flex-col group transition-all cursor-pointer overflow-hidden",
	{
		variants: {
			variant: {
				elevated: "bg-m3-surface-container-high elevation-1 hover:elevation-2",
				filled: "bg-m3-surface-container-high",
				outlined: "bg-m3-surface-container-high border-2 border-m3-outline/20",
			},
		},
		defaultVariants: {
			variant: "elevated",
		},
	},
);

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(cardVariants({ variant, className }))}
				{...props}
			/>
		);
	},
);
Card.displayName = "Card";
