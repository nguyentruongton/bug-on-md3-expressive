import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

const typographyVariants = cva("m-0 p-0 text-m3-on-surface", {
	variants: {
		variant: {
			"display-lg": "text-[57px] leading-[64px] font-normal tracking-[-0.25px]",
			"display-md": "text-[45px] leading-[52px] font-normal tracking-[0px]",
			"display-sm": "text-[36px] leading-[44px] font-normal tracking-[0px]",
			"headline-lg": "text-[32px] leading-[40px] font-normal tracking-[0px]",
			"headline-md": "text-[28px] leading-[36px] font-normal tracking-[0px]",
			"headline-sm": "text-[24px] leading-[32px] font-normal tracking-[0px]",
			"title-lg": "text-[22px] leading-[28px] font-normal tracking-[0px]",
			"title-md": "text-[16px] leading-[24px] font-medium tracking-[0.15px]",
			"title-sm": "text-[14px] leading-[20px] font-medium tracking-[0.1px]",
			"label-lg": "text-[14px] leading-[20px] font-medium tracking-[0.1px]",
			"label-md": "text-[12px] leading-[16px] font-medium tracking-[0.5px]",
			"label-sm": "text-[11px] leading-[16px] font-medium tracking-[0.5px]",
			"body-lg": "text-[16px] leading-[24px] font-normal tracking-[0.5px]",
			"body-md": "text-[14px] leading-[20px] font-normal tracking-[0.25px]",
			"body-sm": "text-[12px] leading-[16px] font-normal tracking-[0.4px]",
		},
	},
	defaultVariants: {
		variant: "body-md",
	},
});

export interface TextProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof typographyVariants> {
	as?: React.ElementType;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
	({ className, variant, as: Component, ...props }, ref) => {
		// Default component based on variant if not provided
		const defaultComponent = React.useMemo(() => {
			if (variant?.startsWith("display") || variant?.startsWith("headline"))
				return "h1";
			if (variant?.startsWith("title")) return "h2";
			return "p";
		}, [variant]);

		const Tag = Component || defaultComponent;

		return (
			<Tag
				ref={ref}
				className={cn(typographyVariants({ variant, className }))}
				{...props}
			/>
		);
	},
);

Text.displayName = "Text";

export { Text, typographyVariants };
