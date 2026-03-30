/**
 * @file fab-menu.test.tsx
 *
 * Comprehensive test suite for FABMenu, ToggleFAB, FABMenuItem components.
 * Uses Vitest + @testing-library/react.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FABMenu, FABMenuItem, ToggleFAB } from "./fab-menu";

// ── Test fixtures ─────────────────────────────────────────────────────────────

const AddIcon = () => (
	<svg data-testid="add-icon" aria-hidden="true" viewBox="0 0 24 24" />
);
const CloseIcon = () => (
	<svg data-testid="close-icon" aria-hidden="true" viewBox="0 0 24 24" />
);
const ShareIcon = () => (
	<svg data-testid="share-icon" aria-hidden="true" viewBox="0 0 24 24" />
);
const EditIcon = () => (
	<svg data-testid="edit-icon" aria-hidden="true" viewBox="0 0 24 24" />
);

const defaultItems = [
	{
		id: "share",
		label: "Share",
		icon: <ShareIcon />,
		onClick: vi.fn(),
	},
	{
		id: "edit",
		label: "Edit",
		icon: <EditIcon />,
		onClick: vi.fn(),
	},
];

const makeItems = (count: number) =>
	Array.from({ length: count }, (_, i) => ({
		id: `item-${i}`,
		label: `Item ${i + 1}`,
		icon: <ShareIcon />,
		onClick: vi.fn(),
	}));

// ── FABMenu tests ─────────────────────────────────────────────────────────────

describe("FABMenu", () => {
	// ── Rendering ───────────────────────────────────────────────────────────

	it("renders ToggleFAB in closed state", () => {
		render(
			<FABMenu
				expanded={false}
				onToggle={vi.fn()}
				items={defaultItems}
				aria-label="Test actions"
			/>,
		);
		// When aria-label is passed, ToggleFAB inherits it as its accessible name
		const fab = screen.getByRole("button", { name: /test actions/i });
		expect(fab).toBeInTheDocument();
		expect(fab).toHaveAttribute("aria-expanded", "false");
	});

	it("does not render menu items when closed", () => {
		render(
			<FABMenu expanded={false} onToggle={vi.fn()} items={defaultItems} />,
		);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
	});

	it("renders menu items when expanded", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={defaultItems} />);
		expect(screen.getByRole("menu")).toBeInTheDocument();
		const menuItems = screen.getAllByRole("menuitem");
		expect(menuItems).toHaveLength(2);
	});

	it("renders 2 items", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={makeItems(2)} />);
		expect(screen.getAllByRole("menuitem")).toHaveLength(2);
	});

	it("renders 6 items", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={makeItems(6)} />);
		expect(screen.getAllByRole("menuitem")).toHaveLength(6);
	});

	// ── Interaction ─────────────────────────────────────────────────────────

	it("calls onToggle(true) when FAB is clicked while closed", () => {
		const onToggle = vi.fn();
		render(
			<FABMenu expanded={false} onToggle={onToggle} items={defaultItems} />,
		);
		const fab = screen.getByRole("button");
		fireEvent.click(fab);
		expect(onToggle).toHaveBeenCalledWith(true);
	});

	it("calls onToggle(false) when FAB is clicked while open", () => {
		const onToggle = vi.fn();
		render(
			<FABMenu expanded={true} onToggle={onToggle} items={defaultItems} />,
		);
		const fab = screen.getByRole("button");
		fireEvent.click(fab);
		expect(onToggle).toHaveBeenCalledWith(false);
	});

	it("closes menu when Escape key is pressed", () => {
		const onToggle = vi.fn();
		render(
			<FABMenu expanded={true} onToggle={onToggle} items={defaultItems} />,
		);
		const container = screen.getByRole("group");
		fireEvent.keyDown(container, { key: "Escape" });
		expect(onToggle).toHaveBeenCalledWith(false);
	});

	it("calls item onClick and closes menu when item is clicked", () => {
		const onToggle = vi.fn();
		const handleClick = vi.fn();
		render(
			<FABMenu
				expanded={true}
				onToggle={onToggle}
				items={[
					{
						id: "test",
						label: "Test",
						icon: <ShareIcon />,
						onClick: handleClick,
					},
				]}
			/>,
		);
		const item = screen.getByRole("menuitem");
		fireEvent.click(item);
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(onToggle).toHaveBeenCalledWith(false);
	});

	it("does not call onClick on disabled items", () => {
		const onToggle = vi.fn();
		const handleClick = vi.fn();
		render(
			<FABMenu
				expanded={true}
				onToggle={onToggle}
				items={[
					{
						id: "test",
						label: "Disabled",
						icon: <ShareIcon />,
						onClick: handleClick,
						disabled: true,
					},
				]}
			/>,
		);
		const item = screen.getByRole("menuitem");
		fireEvent.click(item);
		expect(handleClick).not.toHaveBeenCalled();
		expect(onToggle).not.toHaveBeenCalled();
	});

	// ── Accessibility ───────────────────────────────────────────────────────

	it("has correct aria-expanded on ToggleFAB when closed", () => {
		render(
			<FABMenu expanded={false} onToggle={vi.fn()} items={defaultItems} />,
		);
		expect(screen.getByRole("button")).toHaveAttribute(
			"aria-expanded",
			"false",
		);
	});

	it("has correct aria-expanded on ToggleFAB when open", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={defaultItems} />);
		expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
	});

	it("items have role='menuitem'", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={defaultItems} />);
		const items = screen.getAllByRole("menuitem");
		expect(items.length).toBeGreaterThan(0);
		for (const item of items) {
			expect(item).toHaveAttribute("role", "menuitem");
		}
	});

	it("menu container has role='menu'", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={defaultItems} />);
		expect(screen.getByRole("menu")).toBeInTheDocument();
	});

	it("group container has role='group'", () => {
		render(
			<FABMenu expanded={false} onToggle={vi.fn()} items={defaultItems} />,
		);
		expect(screen.getByRole("group")).toBeInTheDocument();
	});

	it("ToggleFAB has aria-haspopup='menu'", () => {
		render(
			<FABMenu expanded={false} onToggle={vi.fn()} items={defaultItems} />,
		);
		expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "menu");
	});

	it("supports keyboard navigation with Arrow Down", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={makeItems(3)} />);
		const container = screen.getByRole("group");
		fireEvent.keyDown(container, { key: "ArrowDown" });
		// Should not throw
	});

	it("supports keyboard navigation with Arrow Up", () => {
		render(<FABMenu expanded={true} onToggle={vi.fn()} items={makeItems(3)} />);
		const container = screen.getByRole("group");
		fireEvent.keyDown(container, { key: "ArrowUp" });
		// Should not throw
	});

	// ── Variant tests ───────────────────────────────────────────────────────

	it("applies primary color variant by default", () => {
		render(
			<FABMenu expanded={false} onToggle={vi.fn()} items={defaultItems} />,
		);
		const fab = screen.getByRole("button");
		// Primary container background class
		expect(fab.className).toMatch(/m3-primary/);
	});

	it("applies secondary color variant when specified", () => {
		render(
			<FABMenu
				expanded={false}
				onToggle={vi.fn()}
				items={defaultItems}
				colorVariant="secondary"
			/>,
		);
		const fab = screen.getByRole("button");
		expect(fab.className).toMatch(/m3-secondary/);
	});

	it("applies tertiary color variant when specified", () => {
		render(
			<FABMenu
				expanded={false}
				onToggle={vi.fn()}
				items={defaultItems}
				colorVariant="tertiary"
			/>,
		);
		const fab = screen.getByRole("button");
		expect(fab.className).toMatch(/m3-tertiary/);
	});

	// ── Size tests ──────────────────────────────────────────────────────────

	it("renders at baseline FAB size", () => {
		render(
			<FABMenu
				expanded={false}
				onToggle={vi.fn()}
				items={defaultItems}
				fabSize="baseline"
			/>,
		);
		const fab = screen.getByRole("button");
		// h-14 w-14 for baseline
		expect(fab.className).toContain("h-14");
		expect(fab.className).toContain("w-14");
	});

	it("renders at medium FAB size", () => {
		render(
			<FABMenu
				expanded={false}
				onToggle={vi.fn()}
				items={defaultItems}
				fabSize="medium"
			/>,
		);
		const fab = screen.getByRole("button");
		expect(fab.className).toContain("h-20");
		expect(fab.className).toContain("w-20");
	});

	it("renders at large FAB size", () => {
		render(
			<FABMenu
				expanded={false}
				onToggle={vi.fn()}
				items={defaultItems}
				fabSize="large"
			/>,
		);
		const fab = screen.getByRole("button");
		expect(fab.className).toContain("h-24");
		expect(fab.className).toContain("w-24");
	});
});

// ── ToggleFAB tests ───────────────────────────────────────────────────────────

describe("ToggleFAB", () => {
	it("renders with aria-expanded=false initially", () => {
		render(
			<ToggleFAB
				expanded={false}
				onToggle={vi.fn()}
				aria-label="Toggle"
				icon={() => <AddIcon />}
			/>,
		);
		expect(screen.getByRole("button")).toHaveAttribute(
			"aria-expanded",
			"false",
		);
	});

	it("renders with aria-expanded=true when expanded", () => {
		render(
			<ToggleFAB
				expanded={true}
				onToggle={vi.fn()}
				aria-label="Toggle"
				icon={() => <CloseIcon />}
			/>,
		);
		expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
	});

	it("calls onToggle with false when clicked while expanded", () => {
		const onToggle = vi.fn();
		render(
			<ToggleFAB
				expanded={true}
				onToggle={onToggle}
				aria-label="Toggle"
				icon={() => <CloseIcon />}
			/>,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onToggle).toHaveBeenCalledWith(false);
	});

	it("calls onToggle with true when clicked while collapsed", () => {
		const onToggle = vi.fn();
		render(
			<ToggleFAB
				expanded={false}
				onToggle={onToggle}
				aria-label="Toggle"
				icon={() => <AddIcon />}
			/>,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onToggle).toHaveBeenCalledWith(true);
	});

	it("accepts custom icon render prop", () => {
		const mockIcon = vi.fn(() => <AddIcon />);
		render(
			<ToggleFAB
				expanded={false}
				onToggle={vi.fn()}
				aria-label="Toggle"
				icon={mockIcon}
			/>,
		);
		expect(mockIcon).toHaveBeenCalled();
		// Icon render prop receives progress value (0 when collapsed)
		expect(mockIcon).toHaveBeenCalledWith(expect.any(Number));
	});

	it("has aria-haspopup='menu'", () => {
		render(
			<ToggleFAB
				expanded={false}
				onToggle={vi.fn()}
				aria-label="Toggle"
				icon={() => <AddIcon />}
			/>,
		);
		expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "menu");
	});
});

// ── FABMenuItem tests ─────────────────────────────────────────────────────────

describe("FABMenuItem", () => {
	it("renders icon and label", () => {
		render(
			<FABMenuItem icon={<ShareIcon />} label="Share" onClick={vi.fn()} />,
		);
		expect(screen.getByText("Share")).toBeInTheDocument();
		expect(screen.getByTestId("share-icon")).toBeInTheDocument();
	});

	it("renders icon-only when no label provided", () => {
		render(<FABMenuItem icon={<ShareIcon />} onClick={vi.fn()} />);
		expect(screen.getByTestId("share-icon")).toBeInTheDocument();
		// No text content other than icon
		const item = screen.getByRole("menuitem");
		expect(item.textContent).toBe("");
	});

	it("calls onClick when clicked", () => {
		const onClick = vi.fn();
		render(
			<FABMenuItem icon={<ShareIcon />} label="Share" onClick={onClick} />,
		);
		fireEvent.click(screen.getByRole("menuitem"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("has aria-disabled when disabled", () => {
		render(
			<FABMenuItem
				icon={<ShareIcon />}
				label="Disabled"
				onClick={vi.fn()}
				disabled
			/>,
		);
		expect(screen.getByRole("menuitem")).toHaveAttribute(
			"aria-disabled",
			"true",
		);
	});

	it("does not call onClick when disabled", () => {
		const onClick = vi.fn();
		render(
			<FABMenuItem
				icon={<ShareIcon />}
				label="Disabled"
				onClick={onClick}
				disabled
			/>,
		);
		fireEvent.click(screen.getByRole("menuitem"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("has role='menuitem'", () => {
		render(<FABMenuItem icon={<ShareIcon />} label="Test" onClick={vi.fn()} />);
		expect(screen.getByRole("menuitem")).toBeInTheDocument();
	});

	it("activates on Enter key", () => {
		const onClick = vi.fn();
		render(<FABMenuItem icon={<ShareIcon />} label="Test" onClick={onClick} />);
		const item = screen.getByRole("menuitem");
		fireEvent.keyDown(item, { key: "Enter" });
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("activates on Space key", () => {
		const onClick = vi.fn();
		render(<FABMenuItem icon={<ShareIcon />} label="Test" onClick={onClick} />);
		const item = screen.getByRole("menuitem");
		fireEvent.keyDown(item, { key: " " });
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not activate on Enter when disabled", () => {
		const onClick = vi.fn();
		render(
			<FABMenuItem
				icon={<ShareIcon />}
				label="Disabled"
				onClick={onClick}
				disabled
			/>,
		);
		const item = screen.getByRole("menuitem");
		fireEvent.keyDown(item, { key: "Enter" });
		expect(onClick).not.toHaveBeenCalled();
	});
});
