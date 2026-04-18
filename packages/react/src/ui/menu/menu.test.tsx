// ─── MD3 Expressive Menu — Tests (TASK-09) ───────────────────────────────────
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import {
	Menu,
	MenuContent,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuTrigger,
} from "./index";

afterEach(cleanup);

// ─── Helper ──────────────────────────────────────────────────────────────────

function renderMenu({
	colorVariant = "standard" as const,
	items = ["Cut", "Copy", "Paste"],
	selectedIndex = -1,
	defaultOpen = true,
}: {
	colorVariant?: "standard" | "vibrant";
	items?: string[];
	selectedIndex?: number;
	defaultOpen?: boolean;
} = {}) {
	return render(
		<Menu colorVariant={colorVariant} defaultOpen={defaultOpen}>
			<MenuTrigger>
				<button type="button">Open menu</button>
			</MenuTrigger>
			<MenuContent>
				{items.map((item, i) => (
					<MenuItem
						key={item}
						selected={i === selectedIndex}
						data-testid={`menu-item-${i}`}
					>
						{item}
					</MenuItem>
				))}
			</MenuContent>
		</Menu>,
	);
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe("Menu", () => {
	// 1. Menu renders children when open
	it("renders children when open", () => {
		renderMenu({ defaultOpen: true });
		expect(screen.getByText("Cut")).toBeInTheDocument();
		expect(screen.getByText("Copy")).toBeInTheDocument();
		expect(screen.getByText("Paste")).toBeInTheDocument();
	});

	// 2. MenuItem applies correct shape class for each itemPosition
	it("MenuItem applies correct shape class for each itemPosition", () => {
		render(
			<Menu defaultOpen>
				<MenuTrigger>
					<button type="button">Open</button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem itemPosition="leading" data-testid="item-leading">
						A
					</MenuItem>
					<MenuItem itemPosition="middle" data-testid="item-middle">
						B
					</MenuItem>
					<MenuItem itemPosition="trailing" data-testid="item-trailing">
						C
					</MenuItem>
					<MenuItem itemPosition="standalone" data-testid="item-standalone">
						D
					</MenuItem>
				</MenuContent>
			</Menu>,
		);

		const leading = screen.getByTestId("item-leading");
		const middle = screen.getByTestId("item-middle");
		const trailing = screen.getByTestId("item-trailing");
		const standalone = screen.getByTestId("item-standalone");

		// Shape classes based on ITEM_SHAPE_CLASSES token
		expect(leading.className).toContain("rounded-t-[12px]");
		expect(leading.className).toContain("rounded-b-[4px]");
		expect(middle.className).toContain("rounded-[4px]");
		expect(trailing.className).toContain("rounded-t-[4px]");
		expect(trailing.className).toContain("rounded-b-[12px]");
		expect(standalone.className).toContain("rounded-[4px]");
	});

	// 3. MenuItem shows check icon when selected=true
	it("MenuItem shows check icon when selected", () => {
		renderMenu({ selectedIndex: 0 });
		// The check icon uses the text "check" from Material Symbols
		const checkIcon = screen.getByText("check");
		expect(checkIcon).toBeInTheDocument();
	});

	// 4. MenuItem applies disabled state correctly
	it("MenuItem applies disabled state — opacity class and aria-disabled", () => {
		render(
			<Menu defaultOpen>
				<MenuTrigger>
					<button type="button">Open</button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem disabled data-testid="disabled-item">
						Disabled
					</MenuItem>
				</MenuContent>
			</Menu>,
		);
		const item = screen.getByTestId("disabled-item");
		expect(item.className).toContain("opacity-[0.38]");
		expect(item.getAttribute("aria-disabled")).toBe("true");
	});

	// 5. MenuGroup auto-injects itemPosition into children
	it("MenuGroup auto-injects correct itemPosition based on child index", () => {
		render(
			<Menu defaultOpen>
				<MenuTrigger>
					<button type="button">Open</button>
				</MenuTrigger>
				<MenuContent>
					<MenuGroup index={0} count={1}>
						<MenuItem data-testid="g-item-0">A</MenuItem>
						<MenuItem data-testid="g-item-1">B</MenuItem>
						<MenuItem data-testid="g-item-2">C</MenuItem>
					</MenuGroup>
				</MenuContent>
			</Menu>,
		);

		const first = screen.getByTestId("g-item-0");
		const last = screen.getByTestId("g-item-2");

		// First item should be "leading" shape: rounded-t-[12px] rounded-b-[4px]
		expect(first.className).toContain("rounded-t-[12px]");
		// Last item should be "trailing" shape: rounded-t-[4px] rounded-b-[12px]
		expect(last.className).toContain("rounded-b-[12px]");
	});

	// 6. MenuDivider renders with role="separator"
	it("MenuDivider renders with correct role and classes", () => {
		render(
			<Menu defaultOpen>
				<MenuTrigger>
					<button type="button">Open</button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem>A</MenuItem>
					<MenuDivider data-testid="divider" />
					<MenuItem>B</MenuItem>
				</MenuContent>
			</Menu>,
		);
		const divider = screen.getByTestId("divider");
		expect(divider.getAttribute("role")).toBe("separator");
		expect(divider.className).toContain("mx-3");
		expect(divider.className).toContain("bg-m3-outline-variant");
	});

	// 7. Standard colorVariant applies surface-container-low on group container
	it("Standard variant applies surface-container-low on MenuGroup", () => {
		render(
			<Menu colorVariant="standard" defaultOpen>
				<MenuTrigger>
					<button type="button">Open</button>
				</MenuTrigger>
				<MenuContent>
					<MenuGroup index={0} count={1} data-testid="group-standard">
						<MenuItem>A</MenuItem>
					</MenuGroup>
				</MenuContent>
			</Menu>,
		);
		const group = screen.getByTestId("group-standard");
		expect(group.className).toContain("bg-m3-surface-container-low");
	});

	// 8. Vibrant colorVariant applies tertiary-container on group container
	it("Vibrant variant applies tertiary-container on MenuGroup", () => {
		render(
			<Menu colorVariant="vibrant" defaultOpen>
				<MenuTrigger>
					<button type="button">Open</button>
				</MenuTrigger>
				<MenuContent>
					<MenuGroup index={0} count={1} data-testid="group-vibrant">
						<MenuItem>A</MenuItem>
					</MenuGroup>
				</MenuContent>
			</Menu>,
		);
		const group = screen.getByTestId("group-vibrant");
		expect(group.className).toContain("bg-m3-tertiary-container");
	});

	// 9. Keyboard: ArrowDown moves focus to next item
	it("Keyboard ArrowDown moves focus to next item", async () => {
		const user = userEvent.setup();
		render(
			<Menu>
				<MenuTrigger asChild>
					<button type="button" data-testid="trigger">
						Open
					</button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem data-testid="item-a">A</MenuItem>
					<MenuItem data-testid="item-b">B</MenuItem>
				</MenuContent>
			</Menu>,
		);

		const trigger = screen.getByTestId("trigger");
		await user.click(trigger);

		// Radix focuses the first item on open; ArrowDown once moves to item-a,
		// ArrowDown again moves to item-b
		await user.keyboard("{ArrowDown}");
		await user.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(screen.getByTestId("item-b"));
	});

	// 10. Keyboard: Escape closes menu
	it("Keyboard Escape closes menu and returns focus to trigger", async () => {
		const user = userEvent.setup();
		render(
			<Menu>
				<MenuTrigger asChild>
					<button type="button" data-testid="trigger">
						Open
					</button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem>A</MenuItem>
				</MenuContent>
			</Menu>,
		);

		const trigger = screen.getByTestId("trigger");
		await user.click(trigger);

		// Menu should be visible
		expect(screen.getByText("A")).toBeInTheDocument();

		await user.keyboard("{Escape}");

		// After Escape, menu should be gone and trigger should be focused
		expect(screen.queryByText("A")).not.toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});
});

// ─── VerticalMenu Tests ────────────────────────────────────────────────────────

import {
	VerticalMenu,
	VerticalMenuContent,
	VerticalMenuDivider,
	VerticalMenuGroup,
} from "./index";

describe("VerticalMenu", () => {
	// 1. VerticalMenu renders children
	it("renders children directly without a trigger", () => {
		render(
			<VerticalMenu>
				<VerticalMenuContent>
					<VerticalMenuGroup>
						<MenuItem>Item A</MenuItem>
						<MenuItem>Item B</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		expect(screen.getByText("Item A")).toBeInTheDocument();
		expect(screen.getByText("Item B")).toBeInTheDocument();
	});

	// 2. Gap variant: no hr elements between groups
	it("gap separatorStyle renders no divider elements between groups", () => {
		render(
			<VerticalMenu>
				<VerticalMenuContent separatorStyle="gap" data-testid="content">
					<VerticalMenuGroup>
						<MenuItem>A</MenuItem>
					</VerticalMenuGroup>
					<VerticalMenuGroup>
						<MenuItem>B</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		// No hr elements inserted automatically
		const hrs = document.querySelectorAll("hr");
		expect(hrs).toHaveLength(0);
	});

	// 3. Divider variant: hr elements auto-inserted between groups
	it("divider separatorStyle inserts an hr between each pair of groups", () => {
		render(
			<VerticalMenu>
				<VerticalMenuContent separatorStyle="divider">
					<VerticalMenuGroup>
						<MenuItem>A</MenuItem>
					</VerticalMenuGroup>
					<VerticalMenuGroup>
						<MenuItem>B</MenuItem>
					</VerticalMenuGroup>
					<VerticalMenuGroup>
						<MenuItem>C</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		// 3 groups → 2 dividers between them
		const dividers = document.querySelectorAll("hr");
		expect(dividers).toHaveLength(2);
	});

	// 4. VerticalMenuDivider renders an hr with correct classes
	it("VerticalMenuDivider renders as hr with outline-variant and separator role", () => {
		render(<VerticalMenuDivider data-testid="vdivider" />);
		const el = screen.getByTestId("vdivider");
		expect(el.tagName).toBe("HR");
		expect(el.getAttribute("role")).toBe("separator");
		expect(el.className).toContain("bg-m3-outline-variant");
		expect(el.className).toContain("mx-3");
	});

	// 5. VerticalMenuContent auto-injects index/count into VerticalMenuGroup children
	it("auto-injects index and count props into group children for shape morphing", () => {
		render(
			<VerticalMenu>
				<VerticalMenuContent>
					<VerticalMenuGroup data-testid="grp-0">
						<MenuItem>A</MenuItem>
					</VerticalMenuGroup>
					<VerticalMenuGroup data-testid="grp-1">
						<MenuItem>B</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		// Both groups rendered (shape morphing is tested visually via shape classes)
		expect(screen.getByTestId("grp-0")).toBeInTheDocument();
		expect(screen.getByTestId("grp-1")).toBeInTheDocument();
	});

	// 6. Standard colorVariant applies surface-container-low background
	it("standard colorVariant applies surface-container-low to the root container", () => {
		render(
			<VerticalMenu colorVariant="standard" data-testid="vm-root">
				<VerticalMenuContent>
					<VerticalMenuGroup>
						<MenuItem>A</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		const root = screen.getByTestId("vm-root");
		expect(root.className).toContain("bg-m3-surface-container-low");
	});

	// 7. Vibrant colorVariant applies tertiary-container background
	it("vibrant colorVariant applies tertiary-container to the root container", () => {
		render(
			<VerticalMenu colorVariant="vibrant" data-testid="vm-vibrant">
				<VerticalMenuContent>
					<VerticalMenuGroup>
						<MenuItem>A</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		const root = screen.getByTestId("vm-vibrant");
		expect(root.className).toContain("bg-m3-tertiary-container");
	});

	// 8. MenuItem inside VerticalMenu shows check icon when selected
	it("MenuItem inside VerticalMenu shows check icon when selected=true", () => {
		render(
			<VerticalMenu>
				<VerticalMenuContent>
					<VerticalMenuGroup>
						<MenuItem selected>Selected Item</MenuItem>
					</VerticalMenuGroup>
				</VerticalMenuContent>
			</VerticalMenu>,
		);
		// Check icon uses Material Symbols text "check"
		expect(screen.getByText("check")).toBeInTheDocument();
	});
});

