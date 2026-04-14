import type * as React from "react";
import { IconButton } from "../icon-button";
import { SEARCH_COLORS } from "./search.tokens";

interface TrailingActionProps {
	query: string;
	trailingIcon?: React.ReactNode;
	onClear: () => void;
}

/** Clear button when query is non-empty, otherwise the trailing icon slot. */
export function TrailingAction({
	query,
	trailingIcon,
	onClear,
}: TrailingActionProps) {
	if (query) {
		return (
			<IconButton
				size="sm"
				style={{ color: SEARCH_COLORS.trailingIcon }}
				aria-label="Clear search"
				onClick={onClear}
			>
				<span
					className="material-symbols-rounded select-none leading-none"
					style={{ fontSize: 20 }}
					aria-hidden="true"
				>
					close
				</span>
			</IconButton>
		);
	}

	if (trailingIcon) {
		return (
			<span
				className="flex shrink-0 items-center justify-center"
				style={{ color: SEARCH_COLORS.trailingIcon }}
				aria-hidden="true"
			>
				{trailingIcon}
			</span>
		);
	}

	return null;
}
