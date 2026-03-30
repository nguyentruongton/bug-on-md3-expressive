"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

// ── Inline SVG test icon (no external deps) ───────────────────────────────────
const TestIcon = () => (
	<svg data-testid="test-icon" aria-hidden="true" viewBox="0 0 24 24" />
);

describe("Button Component", () => {
	// ── Existing tests (preserved) ─────────────────────────────────────────────

	it("renders correctly with default props", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Click me");
	});

	it("handles onClick event", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("respects colorStyle variant classes", () => {
		render(<Button colorStyle="outlined">Outlined</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("bg-transparent");
		expect(button.className).toContain("border");
	});

	it("applies toggle 'selected' behavior", () => {
		const { rerender } = render(
			<Button variant="toggle" selected={false}>
				Toggle
			</Button>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-pressed", "false");

		rerender(
			<Button variant="toggle" selected={true}>
				Toggle
			</Button>,
		);
		expect(button).toHaveAttribute("aria-pressed", "true");
	});

	it("shows ripple effect wrapper layer (visual verification representation)", () => {
		render(<Button>Ripple Test</Button>);
		const button = screen.getByRole("button");
		fireEvent.pointerDown(button, { clientX: 10, clientY: 10 });
	});

	// ── New: Disabled state ────────────────────────────────────────────────────

	describe("disabled state", () => {
		it("has disabled attribute when disabled prop is passed", () => {
			render(<Button disabled>Disabled</Button>);
			expect(screen.getByRole("button")).toBeDisabled();
		});

		it("does not trigger onClick when disabled", () => {
			const handleClick = vi.fn();
			render(
				<Button disabled onClick={handleClick}>
					Disabled
				</Button>,
			);
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// ── New: Keyboard navigation ───────────────────────────────────────────────

	describe("keyboard navigation", () => {
		it("triggers onClick when Enter is pressed", () => {
			const handleClick = vi.fn();
			render(<Button onClick={handleClick}>Enter Key</Button>);
			const button = screen.getByRole("button");
			button.focus();
			fireEvent.keyDown(button, { key: "Enter" });
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("triggers onClick when Space is pressed", () => {
			const handleClick = vi.fn();
			render(<Button onClick={handleClick}>Space Key</Button>);
			const button = screen.getByRole("button");
			button.focus();
			fireEvent.keyDown(button, { key: " " });
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("does not trigger onClick for unrelated keys", () => {
			const handleClick = vi.fn();
			render(<Button onClick={handleClick}>Tab Key</Button>);
			fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" });
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// ── New: Icon position ─────────────────────────────────────────────────────

	describe("icon position", () => {
		it("renders leading icon before label in DOM order", () => {
			render(
				<Button icon={<TestIcon />} iconPosition="leading">
					Label
				</Button>,
			);
			const button = screen.getByRole("button");
			const spans = Array.from(button.querySelectorAll("span"));
			const iconIndex = spans.findIndex((s) =>
				s.querySelector("[data-testid='test-icon']"),
			);
			const labelIndex = spans.findIndex((s) =>
				s.textContent?.includes("Label"),
			);
			expect(iconIndex).toBeGreaterThanOrEqual(0);
			expect(labelIndex).toBeGreaterThanOrEqual(0);
			expect(iconIndex).toBeLessThan(labelIndex);
		});

		it("renders trailing icon after label in DOM order", () => {
			render(
				<Button icon={<TestIcon />} iconPosition="trailing">
					Label
				</Button>,
			);
			const button = screen.getByRole("button");
			const spans = Array.from(button.querySelectorAll("span"));
			const iconIndex = spans.findIndex((s) =>
				s.querySelector("[data-testid='test-icon']"),
			);
			const labelIndex = spans.findIndex((s) =>
				s.textContent?.includes("Label"),
			);
			expect(iconIndex).toBeGreaterThanOrEqual(0);
			expect(labelIndex).toBeGreaterThanOrEqual(0);
			expect(iconIndex).toBeGreaterThan(labelIndex);
		});

		it("marks icon span with aria-hidden", () => {
			render(
				<Button icon={<TestIcon />} iconPosition="leading">
					With Icon
				</Button>,
			);
			const button = screen.getByRole("button");
			// Icon wrapper span should be aria-hidden
			const iconWrapper = button.querySelector(
				"span[aria-hidden='true']:has([data-testid='test-icon'])",
			);
			expect(iconWrapper).toBeInTheDocument();
		});
	});

	// ── New: Sentence-case label ───────────────────────────────────────────────

	describe("sentence-case label", () => {
		it("converts ALL CAPS to sentence-case", () => {
			render(<Button>HELLO WORLD</Button>);
			expect(screen.getByRole("button")).toHaveTextContent("Hello world");
		});

		it("converts all-lowercase to sentence-case", () => {
			render(<Button>hello world</Button>);
			expect(screen.getByRole("button")).toHaveTextContent("Hello world");
		});

		it("handles mixed case correctly", () => {
			render(<Button>hElLo WoRlD</Button>);
			expect(screen.getByRole("button")).toHaveTextContent("Hello world");
		});
	});

	// ── New: RTL layout ────────────────────────────────────────────────────────

	describe("RTL layout", () => {
		it("renders without crash inside dir=rtl container", () => {
			const { container } = render(
				<div dir="rtl">
					<Button>RTL Button</Button>
				</div>,
			);
			expect(container.querySelector("button")).toBeInTheDocument();
		});

		it("applies flex-row class regardless of text direction", () => {
			render(
				<div dir="rtl">
					<Button>Button RTL</Button>
				</div>,
			);
			expect(screen.getByRole("button").className).toContain("flex-row");
		});

		it("renders trailing icon after label in RTL context", () => {
			render(
				<div dir="rtl">
					<Button icon={<TestIcon />} iconPosition="trailing">
						RTL Trailing
					</Button>
				</div>,
			);
			const button = screen.getByRole("button");
			const spans = Array.from(button.querySelectorAll("span"));
			const iconIndex = spans.findIndex((s) =>
				s.querySelector("[data-testid='test-icon']"),
			);
			const labelIndex = spans.findIndex((s) =>
				s.textContent?.includes("Rtl trailing"),
			);
			// DOM order is still trailing (CSS handles visual flip in RTL via flex)
			expect(iconIndex).toBeGreaterThan(labelIndex);
		});
	});

	// ── New: aria-label ────────────────────────────────────────────────────────

	describe("aria-label", () => {
		it("sets aria-label to children string as fallback", () => {
			render(<Button>Submit</Button>);
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-label",
				"Submit",
			);
		});

		it("uses explicit aria-label prop when provided", () => {
			render(<Button aria-label="Custom Label">Submit</Button>);
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-label",
				"Custom Label",
			);
		});

		it("does not set aria-label when children is not a string", () => {
			render(
				<Button>
					<span>Node child</span>
				</Button>,
			);
			// aria-label should be undefined (not set) for non-string children
			// unless explicitly provided
			expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
		});
	});
});
