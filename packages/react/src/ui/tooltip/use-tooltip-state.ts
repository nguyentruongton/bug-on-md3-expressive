import { useCallback, useEffect, useState } from "react";
import type { TooltipState, TooltipStateConfig } from "./tooltip.types";

const activeTooltipDismissals = new Set<() => void>();

export function useTooltipState(config?: TooltipStateConfig): TooltipState {
	const {
		initialVisible = false,
		isPersistent = false,
		duration = 1500,
	} = config ?? {};

	const [isVisible, setIsVisible] = useState(initialVisible);

	const dismiss = useCallback(() => {
		setIsVisible(false);
		activeTooltipDismissals.delete(dismiss);
	}, []);

	const show = useCallback(() => {
		for (const otherDismiss of activeTooltipDismissals) {
			if (otherDismiss !== dismiss) otherDismiss();
		}
		setIsVisible(true);
		activeTooltipDismissals.add(dismiss);
	}, [dismiss]);

	useEffect(() => {
		if (!isVisible || isPersistent) return;
		const timeoutId = setTimeout(dismiss, duration);
		return () => clearTimeout(timeoutId);
	}, [isVisible, isPersistent, duration, dismiss]);

	useEffect(() => {
		return () => {
			activeTooltipDismissals.delete(dismiss);
		};
	}, [dismiss]);

	return { isVisible, show, dismiss };
}
