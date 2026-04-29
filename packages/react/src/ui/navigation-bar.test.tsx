import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavigationBar, NavigationBarItem } from "./navigation-bar";

describe("NavigationBar", () => {
	it("renders with correct role and aria-label", () => {
		render(
			<NavigationBar>
				<NavigationBarItem selected icon={<span />} label="Home" />
			</NavigationBar>,
		);
		const nav = screen.getByRole("navigation", { name: "Main navigation" });
		expect(nav).toBeInTheDocument();
	});

	it("renders correct number of items", () => {
		render(
			<NavigationBar>
				<NavigationBarItem selected icon={<span />} label="Home" />
				<NavigationBarItem selected={false} icon={<span />} label="Search" />
			</NavigationBar>,
		);
		const items = screen.getAllByRole("menuitem");
		expect(items).toHaveLength(2);
	});

	it('marks selected item with aria-current="page"', () => {
		render(
			<NavigationBar>
				<NavigationBarItem selected icon={<span />} label="Home" />
				<NavigationBarItem selected={false} icon={<span />} label="Search" />
			</NavigationBar>,
		);
		const selectedItem = screen.getByRole("menuitem", { current: "page" });
		expect(selectedItem).toHaveTextContent("Home");
	});

	it("calls onClick when item clicked", () => {
		const onClick = vi.fn();
		render(
			<NavigationBar>
				<NavigationBarItem
					selected={false}
					icon={<span />}
					label="Home"
					onClick={onClick}
				/>
			</NavigationBar>,
		);
		const item = screen.getByRole("menuitem");
		fireEvent.click(item);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", () => {
		const onClick = vi.fn();
		render(
			<NavigationBar>
				<NavigationBarItem
					selected={false}
					disabled
					icon={<span />}
					label="Home"
					onClick={onClick}
				/>
			</NavigationBar>,
		);
		const item = screen.getByRole("menuitem");
		fireEvent.click(item);
		expect(onClick).not.toHaveBeenCalled();
		expect(item).toHaveAttribute("aria-disabled", "true");
	});

	it("renders badge when provided", () => {
		render(
			<NavigationBar>
				<NavigationBarItem selected icon={<span />} label="Home" badge="1" />
			</NavigationBar>,
		);
		const badge = screen.getByText("1");
		expect(badge).toBeInTheDocument();
	});

	it("uses aria-label prop when provided", () => {
		render(
			<NavigationBar>
				<NavigationBarItem
					selected
					icon={<span />}
					label="Home"
					aria-label="Go to homepage"
				/>
			</NavigationBar>,
		);
		const item = screen.getByRole("menuitem");
		expect(item).toHaveAttribute("aria-label", "Go to homepage");
	});

	it("renders xr variant with correct classes", () => {
		render(
			<NavigationBar variant="xr">
				<NavigationBarItem selected icon={<span />} label="Home" />
			</NavigationBar>,
		);
		const nav = screen.getByRole("navigation", { name: "Main navigation" });
		expect(nav).toHaveClass("bottom-6");
		expect(nav).toHaveClass("left-1/2");
		expect(nav).toHaveClass("-translate-x-1/2");
		expect(nav).toHaveClass("rounded-[48px]");
	});
});
