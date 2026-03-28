import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock ResizeObserver for Radix UI (must be a constructor and trigger callback)
class ResizeObserverMock implements ResizeObserver {
	private callback: ResizeObserverCallback;

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}

	observe(element: Element, _options?: ResizeObserverOptions) {
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
				} as ResizeObserverEntry,
			],
			this,
		);
	}
	unobserve = vi.fn((_element: Element) => {});
	disconnect = vi.fn(() => {});
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Mock PointerEvent which is missing in JSDOM but used by Radix
if (!globalThis.PointerEvent) {
	class PointerEventMock extends MouseEvent {
		constructor(type: string, params: PointerEventInit = {}) {
			super(type, params);
		}
	}
	// Use any here for global registration as it's a known environment issue
	// but we cast it as unknown first to satisfy some strict linting
	vi.stubGlobal("PointerEvent", PointerEventMock as unknown as typeof PointerEvent);
}

// Mock HTMLElement prototype to return dimensions
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
	get() {
		return this.parentNode;
	},
});

// Mock IntersectionObserver
class IntersectionObserverMock implements IntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = "";
	readonly thresholds: ReadonlyArray<number> = [];
	constructor(public callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
	observe = vi.fn((_element: Element) => {});
	unobserve = vi.fn((_element: Element) => {});
	disconnect = vi.fn(() => {});
	takeRecords = vi.fn(() => []);
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
