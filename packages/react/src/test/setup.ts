import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock ResizeObserver for Radix UI (must be a constructor and trigger callback)
class ResizeObserverMock {
	private callback: ResizeObserverCallback;

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}

	observe(element: Element) {
		// Immediately trigger callback with some dimensions to trick Radix
		this.callback(
			[
				{
					target: element,
					contentRect: {
						height: 1000,
						width: 1000,
						x: 0,
						y: 0,
						top: 0,
						right: 1000,
						bottom: 1000,
						left: 0,
						toJSON: () => ({}),
					},
					borderBoxSize: [],
					contentBoxSize: [],
					devicePixelContentBoxSize: [],
				},
			],
			this as any,
		);
	}
	unobserve = vi.fn();
	disconnect = vi.fn();
}

globalThis.ResizeObserver = ResizeObserverMock as any;

// Mock PointerEvent which is missing in JSDOM but used by Radix
if (!globalThis.PointerEvent) {
	class PointerEvent extends MouseEvent {
		constructor(type: string, params: PointerEventInit = {}) {
			super(type, params);
		}
	}
	globalThis.PointerEvent = PointerEvent as any;
}

// Mock HTMLElement prototype to return dimensions
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
	get() {
		return this.parentNode;
	},
});
