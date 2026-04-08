/**
 * @file navigation-rail.test.tsx
 *
 * Test suite for the NavigationRail component.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NavigationRail, NavigationRailItem } from "./navigation-rail";

describe("NavigationRail & NavigationRailItem", () => {
	it("renders the navigation rail with collapsed variant by default", () => {
		render(
			<NavigationRail>
				<NavigationRailItem
					selected
					icon={<svg data-testid="icon1" />}
					label="Home"
				/>
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveClass("w-24"); // default not narrow
		expect(nav).toHaveClass("items-center"); // collapsed layout class
	});

	it("renders the navigation rail with expanded variant", () => {
		render(
			<NavigationRail variant="expanded">
				<NavigationRailItem selected icon={<svg />} label="Home" />
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		expect(nav).toHaveClass("min-w-[13.75rem]");
	});

	it("renders the modal variant only when open is true", () => {
		const { rerender } = render(
			<NavigationRail variant="modal" open={false}>
				<NavigationRailItem selected icon={<svg />} label="Home" />
			</NavigationRail>,
		);

		expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

		rerender(
			<NavigationRail variant="modal" open={true}>
				<NavigationRailItem selected icon={<svg />} label="Home" />
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveClass("fixed");
	});

	it("calls onClose when modal backdrop is clicked", () => {
		const handleClose = vi.fn();
		render(
			<NavigationRail variant="modal" open={true} onClose={handleClose}>
				<NavigationRailItem selected icon={<svg />} label="Home" />
			</NavigationRail>,
		);

		// Backdrop is rendered just before the nav
		const nav = screen.getByRole("navigation");
		const backdrop = nav.previousSibling as HTMLElement;
		expect(backdrop).toHaveClass("z-40");

		fireEvent.click(backdrop);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it("sets correct attributes for items", () => {
		render(
			<NavigationRail>
				<NavigationRailItem
					selected
					icon={<svg />}
					label="Home"
					aria-label="Home custom"
				/>
				<NavigationRailItem selected={false} icon={<svg />} label="Settings" />
				<NavigationRailItem
					selected={false}
					disabled
					icon={<svg />}
					label="Admin"
				/>
			</NavigationRail>,
		);

		const items = screen.getAllByRole("menuitem");
		expect(items).toHaveLength(3);

		const home = items[0];
		expect(home).toHaveAttribute("aria-current", "page");
		expect(home).toHaveAttribute("aria-label", "Home custom");

		const settings = items[1];
		expect(settings).not.toHaveAttribute("aria-current");
		expect(settings).toHaveAttribute("aria-label", "Settings");

		const admin = items[2];
		expect(admin).toHaveAttribute("aria-disabled", "true");
		expect(admin).toHaveClass("opacity-[0.38]");
	});

	it("calls onClick when an item is clicked", () => {
		const handleClick = vi.fn();
		render(
			<NavigationRail>
				<NavigationRailItem
					selected={false}
					icon={<svg />}
					label="Home"
					onClick={handleClick}
				/>
			</NavigationRail>,
		);

		const item = screen.getByRole("menuitem");
		fireEvent.click(item);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("prevents click when an item is disabled", () => {
		const handleClick = vi.fn();
		render(
			<NavigationRail>
				<NavigationRailItem
					selected={false}
					disabled
					icon={<svg />}
					label="Home"
					onClick={handleClick}
				/>
			</NavigationRail>,
		);

		const item = screen.getByRole("menuitem");
		fireEvent.click(item);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("initializes roving tabindex with first item", () => {
		render(
			<NavigationRail>
				<NavigationRailItem selected={false} icon={<svg />} label="1" />
				<NavigationRailItem selected={false} icon={<svg />} label="2" />
			</NavigationRail>,
		);

		const items = screen.getAllByRole("menuitem");
		expect(items[0]).toHaveAttribute("tabindex", "0");
		expect(items[1]).toHaveAttribute("tabindex", "-1");
	});

	it("initializes roving tabindex with selected item", () => {
		render(
			<NavigationRail>
				<NavigationRailItem selected={false} icon={<svg />} label="1" />
				<NavigationRailItem selected icon={<svg />} label="2" />
			</NavigationRail>,
		);

		const items = screen.getAllByRole("menuitem");
		expect(items[0]).toHaveAttribute("tabindex", "-1");
		expect(items[1]).toHaveAttribute("tabindex", "0");
	});

	it("does not include disabled items in roving tabindex on init", () => {
		render(
			<NavigationRail>
				<NavigationRailItem
					selected={false}
					disabled
					icon={<svg />}
					label="1"
				/>
				<NavigationRailItem selected={false} icon={<svg />} label="2" />
			</NavigationRail>,
		);

		const items = screen.getAllByRole("menuitem");
		expect(items[0]).toHaveAttribute("tabindex", "-1"); // disabled item retains its default -1 tabindex
		expect(items[1]).toHaveAttribute("tabindex", "0");
	});

	it("moves focus down using ArrowDown", () => {
		render(
			<NavigationRail>
				<NavigationRailItem selected icon={<svg />} label="1" />
				<NavigationRailItem selected={false} icon={<svg />} label="2" />
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		const items = screen.getAllByRole("menuitem");

		items[0].focus();
		expect(document.activeElement).toBe(items[0]);

		fireEvent.keyDown(nav, { key: "ArrowDown" });
		expect(document.activeElement).toBe(items[1]);
		expect(items[1]).toHaveAttribute("tabindex", "0");
		expect(items[0]).toHaveAttribute("tabindex", "-1");
	});

	it("wraps around focus using ArrowDown", () => {
		render(
			<NavigationRail>
				<NavigationRailItem selected={false} icon={<svg />} label="1" />
				<NavigationRailItem selected icon={<svg />} label="2" />
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		const items = screen.getAllByRole("menuitem");

		items[1].focus();
		fireEvent.keyDown(nav, { key: "ArrowDown" });
		expect(document.activeElement).toBe(items[0]);
	});

	it("moves focus using Home and End keys", () => {
		render(
			<NavigationRail>
				<NavigationRailItem selected={false} icon={<svg />} label="1" />
				<NavigationRailItem selected icon={<svg />} label="2" />
				<NavigationRailItem selected={false} icon={<svg />} label="3" />
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		const items = screen.getAllByRole("menuitem");

		items[1].focus();
		fireEvent.keyDown(nav, { key: "Home" });
		expect(document.activeElement).toBe(items[0]);

		fireEvent.keyDown(nav, { key: "End" });
		expect(document.activeElement).toBe(items[2]);
	});

	it("triggers click on Enter and Space", () => {
		const handleClick = vi.fn();
		render(
			<NavigationRail>
				<NavigationRailItem
					selected={false}
					icon={<svg />}
					label="1"
					onClick={handleClick}
				/>
			</NavigationRail>,
		);

		const nav = screen.getByRole("navigation");
		const item = screen.getByRole("menuitem");

		item.focus();
		fireEvent.keyDown(nav, { key: "Enter" });
		expect(handleClick).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(nav, { key: " " });
		expect(handleClick).toHaveBeenCalledTimes(2);
	});

	it("renders badge when provided", () => {
		render(
			<NavigationRail>
				<NavigationRailItem
					selected={false}
					icon={<svg />}
					label="Notifications"
					badge="3"
				/>
			</NavigationRail>,
		);

		const item = screen.getByRole("menuitem");
		expect(item).toHaveTextContent("3");
	});

	// ── labelVisibility tests ──────────────────────────────────────────────────

	describe("labelVisibility", () => {
		it('shows labels for all items when labelVisibility="labeled" (default)', () => {
			render(
				<NavigationRail labelVisibility="labeled">
					<NavigationRailItem selected icon={<svg />} label="Home" />
					<NavigationRailItem selected={false} icon={<svg />} label="Search" />
				</NavigationRail>,
			);

			expect(screen.getByText("Home")).toBeInTheDocument();
			expect(screen.getByText("Search")).toBeInTheDocument();
		});

		it('shows label only for active item when labelVisibility="auto"', () => {
			render(
				<NavigationRail labelVisibility="auto">
					<NavigationRailItem selected icon={<svg />} label="Home" />
					<NavigationRailItem selected={false} icon={<svg />} label="Search" />
				</NavigationRail>,
			);

			expect(screen.getByText("Home")).toBeInTheDocument();
			expect(screen.queryByText("Search")).not.toBeInTheDocument();
		});

		it('shows no labels when labelVisibility="unlabeled"', () => {
			render(
				<NavigationRail labelVisibility="unlabeled">
					<NavigationRailItem selected icon={<svg />} label="Home" />
					<NavigationRailItem selected={false} icon={<svg />} label="Search" />
				</NavigationRail>,
			);

			expect(screen.queryByText("Home")).not.toBeInTheDocument();
			expect(screen.queryByText("Search")).not.toBeInTheDocument();
		});

		it("always shows labels in expanded variant regardless of labelVisibility", () => {
			render(
				<NavigationRail variant="expanded" labelVisibility="unlabeled">
					<NavigationRailItem selected icon={<svg />} label="Home" />
					<NavigationRailItem selected={false} icon={<svg />} label="Search" />
				</NavigationRail>,
			);

			// In expanded mode, labels are always shown
			expect(screen.getByText("Home")).toBeInTheDocument();
			expect(screen.getByText("Search")).toBeInTheDocument();
		});
	});

	// ── Additional Props (xr, narrow, header, footer, fab) ─────────────────────

	describe("additional layout and xr properties", () => {
		it("renders header, footer, and fab elements", () => {
			render(
				<NavigationRail
					header={<div data-testid="rail-header">Header</div>}
					footer={<div data-testid="rail-footer">Footer</div>}
					fab={
						<button type="button" data-testid="rail-fab">
							FAB
						</button>
					}
				>
					<NavigationRailItem selected icon={<svg />} label="Home" />
				</NavigationRail>,
			);

			expect(screen.getByTestId("rail-header")).toBeInTheDocument();
			expect(screen.getByTestId("rail-footer")).toBeInTheDocument();
			expect(screen.getByTestId("rail-fab")).toBeInTheDocument();
		});

		it("applies narrow styling when narrow={true}", () => {
			render(
				<NavigationRail narrow>
					<NavigationRailItem selected icon={<svg />} label="Home" />
				</NavigationRail>,
			);
			const nav = screen.getByRole("navigation");
			expect(nav).toHaveClass("w-20"); // narrow width
		});

		it("applies xr (spatial) styling when xr={true}", () => {
			render(
				<NavigationRail xr>
					<NavigationRailItem selected icon={<svg />} label="Home" />
				</NavigationRail>,
			);
			const nav = screen.getByRole("navigation");
			expect(nav).toHaveClass("py-5", "rounded-[48px]", "bg-m3-surface");
		});

		it("renders spatial wrapper structurally when xr='spatialized'", () => {
			render(
				<NavigationRail
					xr="spatialized"
					fab={
						<button type="button" data-testid="rail-fab">
							FAB
						</button>
					}
				>
					<NavigationRailItem selected icon={<svg />} label="Home" />
				</NavigationRail>,
			);
			expect(screen.getByTestId("rail-fab")).toBeInTheDocument();
			const nav = screen.getByRole("navigation");
			expect(nav).toBeInTheDocument();
		});
	});
});
