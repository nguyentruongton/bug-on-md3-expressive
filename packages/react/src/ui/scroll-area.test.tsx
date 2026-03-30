import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
	it("renders correctly with children", () => {
		render(
			<ScrollArea className="h-40 w-40">
				<div data-testid="content">Long content here</div>
			</ScrollArea>,
		);

		expect(screen.getByTestId("content")).toBeInTheDocument();
	});

	it("renders scrollbars when type is 'always'", async () => {
		const { container } = render(
			<ScrollArea type="always" className="h-40 w-40">
				<div style={{ height: "1000px" }}>Overflowing content</div>
			</ScrollArea>,
		);

		await waitFor(() => {
			const scrollbars = container.querySelectorAll("[data-orientation]");
			expect(scrollbars.length).toBeGreaterThan(0);
		});
	});

	it("respects orientation prop", async () => {
		const { container } = render(
			<ScrollArea type="always" orientation="horizontal" className="h-40 w-40">
				<div style={{ width: "1000px" }}>Overflowing content</div>
			</ScrollArea>,
		);

		await waitFor(() => {
			const scrollbar = container.querySelector(
				'[data-orientation="horizontal"]',
			);
			expect(scrollbar).toBeInTheDocument();
		});
	});

	it("hides scrollbar when type is 'none'", async () => {
		const { container } = render(
			<ScrollArea type="none" className="h-40 w-40">
				<div style={{ height: "1000px" }}>Overflowing content</div>
			</ScrollArea>,
		);

		await waitFor(() => {
			const scrollbar = container.querySelector(
				'[data-orientation="vertical"]',
			);
			expect(scrollbar).toHaveClass("hidden");
		});
	});
});
