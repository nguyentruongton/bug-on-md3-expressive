import type * as React from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right" | "auto";
export type TooltipTrigger =
	| "hover"
	| "focus"
	| "click"
	| "long-press"
	| "manual";

export interface TooltipStateConfig {
	initialVisible?: boolean;
	isPersistent?: boolean;
	duration?: number;
}

export interface TooltipState {
	isVisible: boolean;
	show: () => void;
	dismiss: () => void;
}

export interface CaretConfig {
	enabled: boolean;
	width?: number;
	height?: number;
	customPath?: string;
}

export interface TooltipBoxProps {
	children: React.ReactNode;
	tooltip: React.ReactNode;
	placement?: TooltipPlacement;
	trigger?: TooltipTrigger | TooltipTrigger[];
	state?: TooltipState;
	spacingFromAnchor?: number;
	disabled?: boolean;
	className?: string;
	showDelay?: number;
	hideDelay?: number;
	"aria-label"?: string;
}

export interface PlainTooltipProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	caret?: CaretConfig | null;
	maxWidth?: number;
	className?: string;
	containerColor?: string;
	textColor?: string;
	"data-side"?: "top" | "bottom" | "left" | "right";
}

export interface RichTooltipProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	children?: React.ReactNode;
	title?: React.ReactNode;
	action?: React.ReactNode;
	caret?: CaretConfig | null;
	maxWidth?: number;
	className?: string;
	colors?: {
		container?: string;
		title?: string;
		body?: string;
		action?: string;
	};
	"data-side"?: "top" | "bottom" | "left" | "right";
}
