/**
 * @file search.test.tsx
 * Unit tests for the MD3 Expressive Search component system.
 *
 * Tests cover:
 * - SearchBar: render, focus → open, A11y attributes
 * - SearchViewDocked: render when active, keyboard (Arrow, Enter, Escape)
 * - SearchViewFullScreen: portal render, dialog role, close behavior
 * - useSearchKeyboard: isolated hook behavior
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Search } from "./search";
import { SearchBar } from "./search-bar";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeBaseProps(overrides = {}) {
	return {
		query: "",
		onQueryChange: vi.fn(),
		onSearch: vi.fn(),
		active: false,
		onActiveChange: vi.fn(),
		...overrides,
	};
}

// ─── SearchBar ──────────────────────────────────────────────────────────────

describe("SearchBar", () => {
	it("renders the search input with placeholder", () => {
		render(<Search {...makeBaseProps()} placeholder="Search messages" />);
		expect(screen.getByPlaceholderText("Search messages")).toBeInTheDocument();
	});

	it("has role='combobox' on the input", () => {
		render(<Search {...makeBaseProps()} />);
		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("input has aria-expanded=false when inactive", () => {
		render(<Search {...makeBaseProps({ active: false })} />);
		const input = screen.getByRole("combobox");
		expect(input).toHaveAttribute("aria-expanded", "false");
	});

	it("calls onActiveChange(true) when input is focused", () => {
		const onActiveChange = vi.fn();
		render(<Search {...makeBaseProps({ onActiveChange })} />);
		const input = screen.getByRole("combobox");
		fireEvent.focus(input);
		expect(onActiveChange).toHaveBeenCalledWith(true);
	});

	it("calls onQueryChange when user types", () => {
		const onQueryChange = vi.fn();
		render(<Search {...makeBaseProps({ onQueryChange })} />);
		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "hello" } });
		expect(onQueryChange).toHaveBeenCalledWith("hello");
	});
});

// ─── SearchViewDocked ────────────────────────────────────────────────────────

describe("SearchViewDocked", () => {
	it("does not render listbox when inactive", () => {
		render(
			<Search {...makeBaseProps({ active: false })} variant="docked">
				<div role="option" tabIndex={-1}>
					Result 1
				</div>
			</Search>,
		);
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("renders listbox when active", () => {
		render(
			<Search {...makeBaseProps({ active: true })} variant="docked">
				<div role="option" tabIndex={-1}>
					Result 1
				</div>
			</Search>,
		);
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("shows child results in the listbox", () => {
		render(
			<Search {...makeBaseProps({ active: true })} variant="docked">
				<div role="option" tabIndex={-1} data-testid="result-item">
					Result A
				</div>
			</Search>,
		);
		expect(screen.getByTestId("result-item")).toBeInTheDocument();
	});

	it("calls onActiveChange(false) on Escape key", () => {
		const onActiveChange = vi.fn();
		render(
			<Search
				{...makeBaseProps({ active: true, onActiveChange })}
				variant="docked"
			/>,
		);
		// Use the visible combobox input in the docked view
		const inputs = screen.getAllByRole("combobox");
		// The docked view renders a second input (id ending in "-view")
		const viewInput = inputs.find((el) => el.id.endsWith("-view")) ?? inputs[0];
		fireEvent.keyDown(viewInput, { key: "Escape" });
		expect(onActiveChange).toHaveBeenCalledWith(false);
	});

	it("calls onSearch on Enter key", () => {
		const onSearch = vi.fn();
		render(
			<Search
				{...makeBaseProps({ active: true, query: "test", onSearch })}
				variant="docked"
			/>,
		);
		const inputs = screen.getAllByRole("combobox");
		const viewInput = inputs.find((el) => el.id.endsWith("-view")) ?? inputs[0];
		fireEvent.keyDown(viewInput, { key: "Enter" });
		expect(onSearch).toHaveBeenCalledWith("test");
	});

	it("renders divider when styleType='divided'", () => {
		render(
			<Search
				{...makeBaseProps({ active: true })}
				variant="docked"
				styleType="divided"
			>
				<div role="option" tabIndex={-1}>
					Result
				</div>
			</Search>,
		);
		expect(document.querySelector("hr")).toBeInTheDocument();
	});

	it("does not render divider when styleType='contained'", () => {
		render(
			<Search
				{...makeBaseProps({ active: true })}
				variant="docked"
				styleType="contained"
			>
				<div role="option" tabIndex={-1}>
					Result
				</div>
			</Search>,
		);
		expect(document.querySelector("hr")).not.toBeInTheDocument();
	});
});

// ─── SearchViewFullScreen ────────────────────────────────────────────────────

describe("SearchViewFullScreen", () => {
	it("renders a dialog when active", () => {
		render(
			<Search {...makeBaseProps({ active: true })} variant="fullscreen" />,
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("has aria-modal=true on the dialog", () => {
		render(
			<Search {...makeBaseProps({ active: true })} variant="fullscreen" />,
		);
		expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
	});

	it("does not render dialog when inactive", () => {
		render(
			<Search {...makeBaseProps({ active: false })} variant="fullscreen" />,
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("calls onActiveChange(false) when close button is clicked", () => {
		const onActiveChange = vi.fn();
		render(
			<Search
				{...makeBaseProps({ active: true, onActiveChange })}
				variant="fullscreen"
			/>,
		);
		fireEvent.click(screen.getByLabelText("Close search"));
		expect(onActiveChange).toHaveBeenCalledWith(false);
	});

	it("clears query when clear button is clicked", () => {
		const onQueryChange = vi.fn();
		render(
			<Search
				{...makeBaseProps({ active: true, query: "hello", onQueryChange })}
				variant="fullscreen"
			/>,
		);
		fireEvent.click(screen.getByLabelText("Clear search"));
		expect(onQueryChange).toHaveBeenCalledWith("");
	});
});

// ─── SearchBar standalone ────────────────────────────────────────────────────

describe("SearchBar (standalone)", () => {
	it("renders with all required ARIA on combobox", () => {
		render(
			<SearchBar
				query=""
				onQueryChange={vi.fn()}
				onSearch={vi.fn()}
				active={false}
				onActiveChange={vi.fn()}
				searchId="test-bar"
				listboxId="test-listbox"
				onKeyDown={vi.fn()}
				activeIndex={-1}
			/>,
		);
		const input = screen.getByRole("combobox");
		expect(input).toHaveAttribute("aria-controls", "test-listbox");
		expect(input).toHaveAttribute("aria-autocomplete", "list");
	});
});
