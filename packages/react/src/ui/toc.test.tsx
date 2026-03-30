import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from "@testing-library/react";

// Mock implementation
let mockObserve: Mock<(element: Element) => void>;
let mockDisconnect: Mock<() => void>;
let observerCallback: IntersectionObserverCallback | undefined;

class MockObserver implements IntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = "";
	readonly thresholds: ReadonlyArray<number> = [];

	constructor(callback: IntersectionObserverCallback) {
		observerCallback = callback;
	}

	observe = (element: Element) => mockObserve(element);
	disconnect = () => mockDisconnect();
	unobserve = vi.fn();
	takeRecords = vi.fn(() => []);
}

vi.stubGlobal("IntersectionObserver", MockObserver);

import { TableOfContents } from "./toc";

const mockItems = [
	{ id: "section-1", label: "Section 1" },
	{ id: "section-2", label: "Section 2" },
];

describe("TableOfContents", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockObserve = vi.fn();
		mockDisconnect = vi.fn();
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
	});

	it("renders correctly", () => {
		render(<TableOfContents items={mockItems} />);
		expect(screen.getByText("On this page")).toBeInTheDocument();
		expect(screen.getByText("Section 1")).toBeInTheDocument();
	});

	it("handles active state change", async () => {
		render(
			<>
				<div id="section-1">Content 1</div>
				<div id="section-2">Content 2</div>
				<TableOfContents items={mockItems} />
			</>,
		);

		const firstLink = screen.getByText("Section 1");

		// Trigger observer inside act to handle state update
		if (observerCallback) {
			await act(async () => {
				const mockEntry = {
					isIntersecting: true,
					target: { id: "section-1" } as unknown as Element,
					time: Date.now(),
					intersectionRatio: 1,
					boundingClientRect: {} as DOMRectReadOnly,
					intersectionRect: {} as DOMRectReadOnly,
					rootBounds: null,
				} as IntersectionObserverEntry;

				observerCallback?.([mockEntry], {} as IntersectionObserver);
			});
		}

		await waitFor(() => {
			expect(firstLink).toHaveClass("text-m3-primary");
			expect(firstLink).toHaveClass("font-bold");
		});
	});

	it("handles click navigation", () => {
		render(
			<>
				<div id="section-1">Content 1</div>
				<TableOfContents items={mockItems} />
			</>,
		);

		const firstLink = screen.getByText("Section 1");
		const target = document.getElementById("section-1");

		if (target) {
			const scrollSpy = vi.fn();
			target.scrollIntoView = scrollSpy;
			fireEvent.click(firstLink);
			expect(scrollSpy).toHaveBeenCalledWith({
				behavior: "smooth",
				block: "start",
			});
		}
	});
});
