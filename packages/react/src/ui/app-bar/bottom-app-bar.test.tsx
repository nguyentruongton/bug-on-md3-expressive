import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BottomAppBar } from "./bottom-app-bar";

// Mock IntersectionObserver for useAppBarScroll
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
	observe: () => null,
	unobserve: () => null,
	disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe("BottomAppBar", () => {
	it("renders correctly with actions and FAB", () => {
		render(
			<BottomAppBar
				actions={<div data-testid="actions">Actions Content</div>}
				floatingActionButton={<div data-testid="fab">FAB Content</div>}
			/>,
		);

		const nav = screen.getByRole("navigation", { name: /bottom app bar/i });
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveClass(
			"fixed bottom-0 inset-x-0 z-50 flex items-center bg-m3-surface-container",
		);

		expect(screen.getByTestId("actions")).toBeInTheDocument();
		expect(screen.getByTestId("actions")).toHaveTextContent("Actions Content");

		expect(screen.getByTestId("fab")).toBeInTheDocument();
		expect(screen.getByTestId("fab")).toHaveTextContent("FAB Content");
	});

	it("applies custom classNames", () => {
		render(<BottomAppBar className="custom-bottom-action-bar" />);
		const nav = screen.getByRole("navigation");
		expect(nav).toHaveClass("custom-bottom-action-bar");
	});
});
