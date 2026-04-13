import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	BottomAppBar,
	SearchAppBar,
	SmallAppBar,
	useAppBarScroll,
} from "./index";

describe("SmallAppBar", () => {
	it("renders title correctly", () => {
		render(<SmallAppBar title="My Title" />);
		expect(screen.getByText("My Title")).toBeInTheDocument();
	});

	it("renders subtitle correctly", () => {
		render(<SmallAppBar title="Main" subtitle="Sub" />);
		expect(screen.getByText("Sub")).toBeInTheDocument();
	});

	it("applies role='banner' to the header", () => {
		render(<SmallAppBar title="Role Test" />);
		expect(screen.getByRole("banner")).toBeInTheDocument();
	});

	it("renders navigation icon", () => {
		render(
			<SmallAppBar
				title="Nav Test"
				navigationIcon={<button type="button" aria-label="Menu" />}
			/>,
		);
		expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
	});

	it("renders actions", () => {
		render(
			<SmallAppBar
				title="Actions Test"
				actions={<button type="button" aria-label="Search" />}
			/>,
		);
		expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
	});
});

describe("SearchAppBar", () => {
	it("renders search bar with role='search'", () => {
		render(<SearchAppBar searchPlaceholder="Search inside" />);
		const searchContainer = screen.getByRole("search");
		expect(searchContainer).toBeInTheDocument();
		expect(searchContainer).toHaveAttribute("aria-label", "Search inside");
	});

	it("fires onSearchFocus when clicked", () => {
		const onFocus = vi.fn();
		render(<SearchAppBar onSearchFocus={onFocus} />);
		const searchContainer = screen.getByRole("search");
		fireEvent.click(searchContainer);
		expect(onFocus).toHaveBeenCalled();
	});
});

describe("BottomAppBar", () => {
	it("applies role='navigation' to the container", () => {
		render(<BottomAppBar />);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("renders FAB correctly", () => {
		render(
			<BottomAppBar
				floatingActionButton={<button type="button" aria-label="Add" />}
			/>,
		);
		expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
	});
});

describe("useAppBarScroll", () => {
	it("initializes with not scrolled", () => {
		const { result } = renderHook(() =>
			useAppBarScroll({ behavior: "pinned" }),
		);
		expect(result.current.isScrolled).toBe(false);
	});
});
