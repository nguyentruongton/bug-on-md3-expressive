import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchAppBar } from "./search-app-bar";
import { SearchView } from "./search-view";

describe("SearchAppBar and SearchView", () => {
	describe("SearchAppBar", () => {
		it("renders correctly with search bar", () => {
			render(
				<SearchAppBar searchPlaceholder="Search here..." />
			);

			expect(screen.getByPlaceholderText("Search here...")).toBeInTheDocument();
		});

		it("triggers onSearchFocus when clicked", () => {
			const onSearchFocus = vi.fn();
			render(<SearchAppBar onSearchFocus={onSearchFocus} />);

			const input = screen.getByRole("textbox");
			fireEvent.focus(input);
			expect(onSearchFocus).toHaveBeenCalledTimes(1);
			fireEvent.click(input);
			expect(onSearchFocus).toHaveBeenCalledTimes(2);
		});
	});

	describe("SearchView", () => {
		it("renders overlay correctly", () => {
			const onClose = vi.fn();
			render(
				<SearchView onClose={onClose} placeholder="Type to search">
					<div data-testid="search-results">Results</div>
				</SearchView>
			);

			expect(screen.getByPlaceholderText("Type to search")).toBeInTheDocument();
			expect(screen.getByTestId("search-results")).toBeInTheDocument();
		});

		it("calls onClose when back button is pressed", () => {
			const onClose = vi.fn();
			render(
				<SearchView onClose={onClose} leadingIcon={<button data-testid="back-btn" onClick={onClose} />} />
			);

			const btn = screen.getByTestId("back-btn");
			fireEvent.click(btn);
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
});
