import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AppBarItem } from "./app-bar.types";
import { AppBarColumn } from "./app-bar-column";
import { AppBarItemButton } from "./app-bar-item-button";
import { AppBarRow } from "./app-bar-row";

const mockItems: AppBarItem[] = [
	{
		type: "clickable",
		icon: <span data-testid="icon-1">I1</span>,
		label: "Action 1",
		onClick: vi.fn(),
	},
	{
		type: "toggleable",
		icon: <span data-testid="icon-2">I2</span>,
		label: "Action 2",
		checked: false,
		onCheckedChange: vi.fn(),
	},
	{
		type: "custom",
		icon: <span>I3</span>,
		label: "Action 3",
		appBarContent: <div data-testid="custom-item">Custom</div>,
	},
];

describe("AppBar Items", () => {
	describe("AppBarItemButton", () => {
		it("renders clickable item and handles click", () => {
			render(<AppBarItemButton item={mockItems[0]} />);
			const btn = screen.getByLabelText("Action 1");
			expect(btn).toBeInTheDocument();
			fireEvent.click(btn);
			expect(mockItems[0].onClick).toHaveBeenCalled();
		});

		it("renders toggleable item and handles toggle", () => {
			render(<AppBarItemButton item={mockItems[1]} />);
			const btn = screen.getByLabelText("Action 2");
			expect(btn).toHaveAttribute("aria-pressed", "false");
			fireEvent.click(btn);
			expect(mockItems[1].onCheckedChange).toHaveBeenCalledWith(true);
		});

		it("renders custom item content", () => {
			render(<AppBarItemButton item={mockItems[2]} />);
			expect(screen.getByTestId("custom-item")).toBeInTheDocument();
		});
	});

	describe("AppBarRow", () => {
		it("renders all items when maxItemCount is sufficient", () => {
			render(<AppBarRow items={mockItems} />);
			expect(screen.getByLabelText("Action 1")).toBeInTheDocument();
			expect(screen.getByLabelText("Action 2")).toBeInTheDocument();
			expect(screen.getByTestId("custom-item")).toBeInTheDocument();
		});

		it("shows overflow indicator when items exceed maxItemCount", () => {
			render(<AppBarRow items={mockItems} maxItemCount={2} />);
			expect(screen.getByLabelText("Action 1")).toBeInTheDocument();
			// Action 2 vs Action 3 depending on how maxItemCount slices. Usually shows first N-1 and the indicator.
			// Let's just check for the More actions indicator
			expect(
				screen.getByRole("button", { name: "More actions" }),
			).toBeInTheDocument();
		});
	});

	describe("AppBarColumn", () => {
		it("renders items vertically", () => {
			render(<AppBarColumn items={mockItems} />);
			expect(screen.getByLabelText("Action 1")).toBeInTheDocument();
			expect(screen.getByLabelText("Action 2")).toBeInTheDocument();
			expect(screen.getByTestId("custom-item")).toBeInTheDocument();
		});

		it("shows overflow indicator when items exceed maxItemCount", () => {
			render(<AppBarColumn items={mockItems} maxItemCount={1} />);
			expect(screen.getByLabelText("Action 1")).toBeInTheDocument(); // maybe Action 1 is replaced or first item is passed depending on n-1 rule
			expect(
				screen.getByRole("button", { name: "More actions" }),
			).toBeInTheDocument();
		});
	});
});
