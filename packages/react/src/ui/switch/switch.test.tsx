/**
 * @file switch.test.tsx
 *
 * Comprehensive test suite for the MD3 Expressive Switch component.
 * Tests cover: rendering, controlled state, disabled, accessibility,
 * and keyboard interaction.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

afterEach(cleanup);

// ─────────────────────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────────────────────

describe("Switch — Rendering", () => {
	it("renders unchecked by default", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				ariaLabel="Test switch"
			/>,
		);
		const toggle = screen.getByRole("switch", { name: "Test switch" });
		expect(toggle).toHaveAttribute("aria-checked", "false");
	});

	it("renders checked when checked=true", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={true}
				onCheckedChange={onCheckedChange}
				ariaLabel="Test switch"
			/>,
		);
		const toggle = screen.getByRole("switch", { name: "Test switch" });
		expect(toggle).toHaveAttribute("aria-checked", "true");
	});

	it("renders with label text", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				label="Notifications"
			/>,
		);
		expect(screen.getByText("Notifications")).toBeInTheDocument();
		// Label should be associated with the switch
		const toggle = screen.getByRole("switch", { name: "Notifications" });
		expect(toggle).toBeInTheDocument();
	});

	it("applies custom className to the button (when no label)", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				ariaLabel="Test"
				className="custom-class"
			/>,
		);
		const toggle = screen.getByRole("switch");
		expect(toggle).toHaveClass("custom-class");
	});

	it("applies custom className to the label wrapper (when label exists)", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				label="Test Label"
				className="wrapper-class"
			/>,
		);
		const label = screen.getByText("Test Label").closest("label");
		expect(label).toHaveClass("wrapper-class");
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Interaction
// ─────────────────────────────────────────────────────────────────────────────

describe("Switch — Interaction", () => {
	it("calls onCheckedChange with true when unchecked switch is clicked", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				ariaLabel="Test"
			/>,
		);
		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});

	it("calls onCheckedChange with false when checked switch is clicked", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={true}
				onCheckedChange={onCheckedChange}
				ariaLabel="Test"
			/>,
		);
		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);
		expect(onCheckedChange).toHaveBeenCalledWith(false);
	});

	it("does not call onCheckedChange when disabled", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				disabled
				ariaLabel="Test"
			/>,
		);
		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);
		expect(onCheckedChange).not.toHaveBeenCalled();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Accessibility
// ─────────────────────────────────────────────────────────────────────────────

describe("Switch — Accessibility", () => {
	it("has role='switch'", () => {
		render(
			<Switch checked={false} onCheckedChange={() => {}} ariaLabel="Test" />,
		);
		expect(screen.getByRole("switch")).toBeInTheDocument();
	});

	it("has correct aria-checked state", () => {
		const { rerender } = render(
			<Switch checked={false} onCheckedChange={() => {}} ariaLabel="Test" />,
		);
		expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

		rerender(
			<Switch checked={true} onCheckedChange={() => {}} ariaLabel="Test" />,
		);
		expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
	});

	it("has aria-disabled=true when disabled=true", () => {
		render(
			<Switch
				disabled
				checked={false}
				onCheckedChange={() => {}}
				ariaLabel="Test"
			/>,
		);
		expect(screen.getByRole("switch")).toHaveAttribute("aria-disabled", "true");
	});

	it("forwards ref to the button element", () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(
			<Switch
				ref={ref}
				checked={false}
				onCheckedChange={() => {}}
				ariaLabel="Test"
			/>,
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard Interaction
// ─────────────────────────────────────────────────────────────────────────────

describe("Switch — Keyboard Interaction", () => {
	it("toggles on Space key press", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				ariaLabel="Space test"
			/>,
		);
		const toggle = screen.getByRole("switch");
		toggle.focus();
		fireEvent.keyDown(toggle, { key: " ", code: "Space" });
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});

	it("toggles on Enter key press", () => {
		const onCheckedChange = vi.fn();
		render(
			<Switch
				checked={false}
				onCheckedChange={onCheckedChange}
				ariaLabel="Enter test"
			/>,
		);
		const toggle = screen.getByRole("switch");
		toggle.focus();
		fireEvent.keyDown(toggle, { key: "Enter", code: "Enter" });
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Visual Props
// ─────────────────────────────────────────────────────────────────────────────

describe("Switch — Visual Props", () => {
	it("renders thumbContent when provided", () => {
		render(
			<Switch
				checked={true}
				onCheckedChange={() => {}}
				thumbContent={<span data-testid="custom-icon">✓</span>}
				icons={true}
				ariaLabel="Icon test"
			/>,
		);
		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});
});
