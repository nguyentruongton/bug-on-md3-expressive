"use client";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tab, Tabs, TabsContent, TabsList } from "./index";

describe("Tabs Component System", () => {
	it("renders correctly and selects the default tab", async () => {
		render(
			<Tabs defaultValue="tab2">
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		expect(tabItems).toHaveLength(2);

		// "tab2" should be selected
		expect(tabItems[1]).toHaveAttribute("aria-selected", "true");
		expect(tabItems[0]).toHaveAttribute("aria-selected", "false");

		// "Content 2" should be visible
		await waitFor(() => {
			expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 2");
		});
	});

	it("switches tabs on click", async () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");

		// Wait for initial render
		await waitFor(() => {
			expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
		});

		// Click "tab2"
		fireEvent.click(tabItems[1]);

		expect(tabItems[1]).toHaveAttribute("aria-selected", "true");

		await waitFor(() => {
			expect(screen.getByText("Content 2")).toBeInTheDocument();
		});
	});

	it("handles controlled value correctly", async () => {
		const handleChange = vi.fn();

		render(
			<Tabs value="tab1" onValueChange={handleChange}>
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");

		// Click "tab2"
		fireEvent.click(tabItems[1]);

		// the value shouldn't update internally if strictly controlled without state update wrapper,
		// but `onValueChange` should be called.
		expect(handleChange).toHaveBeenCalledWith("tab2");
	});

	it("supports keyboard navigation (Arrow Right/Left)", async () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
					<Tab value="tab3">Tab 3</Tab>
				</TabsList>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		tabItems[0].focus();

		// Move right
		fireEvent.keyDown(tabItems[0], { key: "ArrowRight" });
		expect(tabItems[1]).toHaveFocus();

		// Move right again
		fireEvent.keyDown(tabItems[1], { key: "ArrowRight" });
		expect(tabItems[2]).toHaveFocus();

		// Move right again (should wrap to first)
		fireEvent.keyDown(tabItems[2], { key: "ArrowRight" });
		expect(tabItems[0]).toHaveFocus();

		// Move left (should wrap to last)
		fireEvent.keyDown(tabItems[0], { key: "ArrowLeft" });
		expect(tabItems[2]).toHaveFocus();
	});

	it("supports Home/End keyboard navigation", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
					<Tab value="tab3">Tab 3</Tab>
				</TabsList>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		tabItems[0].focus();

		// End key
		fireEvent.keyDown(tabItems[0], { key: "End" });
		expect(tabItems[2]).toHaveFocus();

		// Home key
		fireEvent.keyDown(tabItems[2], { key: "Home" });
		expect(tabItems[0]).toHaveFocus();
	});

	it("auto-activates tabs on keyboard focus when autoActivate is true", async () => {
		render(
			<Tabs defaultValue="tab1" autoActivate>
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		tabItems[0].focus();

		// Move to second tab
		fireEvent.keyDown(tabItems[0], { key: "ArrowRight" });
		expect(tabItems[1]).toHaveFocus();

		// Because of autoActivate, tab2 should instantly be selected
		expect(tabItems[1]).toHaveAttribute("aria-selected", "true");
		await waitFor(() => {
			expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 2");
		});
	});

	it("does not select focused tabs with keyboard when autoActivate is false", async () => {
		render(
			<Tabs defaultValue="tab1" autoActivate={false}>
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		tabItems[0].focus();

		// Move to second tab
		fireEvent.keyDown(tabItems[0], { key: "ArrowRight" });
		expect(tabItems[1]).toHaveFocus();

		// Should still be tab1
		expect(tabItems[0]).toHaveAttribute("aria-selected", "true");
		expect(tabItems[1]).toHaveAttribute("aria-selected", "false");

		// Only updates selection upon Space or Enter
		fireEvent.keyDown(tabItems[1], { key: "Enter" });
		expect(tabItems[1]).toHaveAttribute("aria-selected", "true");
	});

	it("skips disabled tabs during keyboard navigation", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2" disabled>
						Tab 2
					</Tab>
					<Tab value="tab3">Tab 3</Tab>
				</TabsList>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		tabItems[0].focus();

		// ArrowRight should skip tab2 and land on tab3
		fireEvent.keyDown(tabItems[0], { key: "ArrowRight" });
		expect(tabItems[2]).toHaveFocus();
	});

	it("respects tab selection with Enter and Space keys", () => {
		const handleChange = vi.fn();
		render(
			<Tabs value="tab1" onValueChange={handleChange}>
				<TabsList variant="primary">
					<Tab value="tab1">Tab 1</Tab>
					<Tab value="tab2">Tab 2</Tab>
				</TabsList>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");
		tabItems[0].focus();

		// Move focus
		fireEvent.keyDown(tabItems[0], { key: "ArrowRight" });
		expect(tabItems[1]).toHaveFocus();

		// Press Space
		fireEvent.keyDown(tabItems[1], { key: " " });
		expect(handleChange).toHaveBeenCalledWith("tab2");

		// Press Enter
		fireEvent.keyDown(tabItems[1], { key: "Enter" });
		expect(handleChange).toHaveBeenCalledTimes(2);
	});

	it("sets correct attributes for accessibility", () => {
		render(
			<Tabs defaultValue="1">
				<TabsList variant="primary" aria-label="My Tabs">
					<Tab value="1">One</Tab>
					<Tab value="2">Two</Tab>
				</TabsList>
				<TabsContent value="1">Content One</TabsContent>
			</Tabs>,
		);

		expect(screen.getByRole("tablist")).toHaveAttribute(
			"aria-label",
			"My Tabs",
		);

		const tab = screen.getAllByRole("tab")[0];
		expect(tab.getAttribute("id")).toMatch(/tab-1$/);
		expect(tab.getAttribute("aria-controls")).toMatch(/panel-1$/);
		expect(tab).toHaveAttribute("tabindex", "0");

		const panel = screen.getByRole("tabpanel");
		expect(panel.getAttribute("id")).toMatch(/panel-1$/);
		expect(panel.getAttribute("aria-labelledby")).toMatch(/tab-1$/);
	});

	it("selects first enabled tab if no defaultValue is provided", async () => {
		render(
			<Tabs>
				<TabsList variant="primary">
					<Tab value="tab1" disabled>
						Tab 1
					</Tab>
					<Tab value="tab2">Tab 2</Tab>
					<Tab value="tab3">Tab 3</Tab>
				</TabsList>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		const tabItems = screen.getAllByRole("tab");

		await waitFor(() => {
			expect(tabItems[1]).toHaveAttribute("aria-selected", "true");
		});

		expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 2");
	});
});
