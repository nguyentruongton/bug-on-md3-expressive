export const TooltipTokens = {
	PlainTooltip: {
		containerColor: "var(--md-sys-color-inverse-surface)", // #322F35 light / #E6E1E5 dark
		textColor: "var(--md-sys-color-inverse-on-surface)", // #F5EFF7 light / #322F35 dark
		shape: "rounded-[4px]", // CornerExtraSmall = 4dp
		font: "text-[12px] font-normal tracking-[0.4px] leading-[16px]", // BodySmall
		height: "min-h-6", // 24dp min height
		padding: "px-2 py-1", // 8dp all sides
		maxWidth: "max-w-50",
	},
	RichTooltip: {
		containerColor: "var(--md-sys-color-surface-container)",
		elevation: "shadow-md", // ElevationTokens.Level2 (approximate with shadow-md)
		shape: "rounded-[12px]", // CornerMedium = 12dp
		paddingTop: "pt-3", // 12dp
		paddingBottom: "pb-2", // 8dp
		paddingX: "px-4", // 16dp
		maxWidth: "max-w-80",
		subheadColor: "var(--md-sys-color-on-surface-variant)",
		subheadFont: "text-[14px] font-medium leading-[20px]", // TitleSmall
		bodyColor: "var(--md-sys-color-on-surface-variant)",
		bodyFont: "text-[14px] font-normal leading-[20px]", // BodyMedium
		actionColor: "var(--md-sys-color-primary)",
		actionFont: "text-[14px] font-medium leading-[20px]", // LabelLarge
	},
} as const;
