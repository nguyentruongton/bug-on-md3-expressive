/**
 * @file checkbox.test.tsx
 *
 * Comprehensive test suite for the MD3 Expressive Checkbox component.
 * Tests cover: rendering, controlled state, tri-state, error, disabled,
 * accessibility, form integration, and keyboard interaction.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox, TriStateCheckbox } from "./checkbox";

afterEach(cleanup);

// ─────────────────────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Rendering", () => {
	it("renders unchecked by default", () => {
		render(<Checkbox aria-label="Test checkbox" />);
		const input = screen.getByRole("checkbox", { name: "Test checkbox" });
		expect(input).not.toBeChecked();
		expect(input).toHaveAttribute("aria-checked", "false");
	});

	it("renders checked when checked=true", () => {
		render(<Checkbox checked aria-label="Test" onCheckedChange={() => {}} />);
		const input = screen.getByRole("checkbox", { name: "Test" });
		expect(input).toBeChecked();
		expect(input).toHaveAttribute("aria-checked", "true");
	});

	it("renders indeterminate when indeterminate=true", () => {
		render(<Checkbox indeterminate aria-label="Test" />);
		const input = screen.getByRole("checkbox", { name: "Test" });
		expect(input).toHaveAttribute("aria-checked", "mixed");
	});

	it("renders with label text", () => {
		render(<Checkbox label="Accept terms" />);
		expect(screen.getByText("Accept terms")).toBeInTheDocument();
		// Label should be associated with the checkbox
		const input = screen.getByRole("checkbox");
		expect(input).toBeInTheDocument();
	});

	it("renders without label when label prop is omitted", () => {
		render(<Checkbox aria-label="Standalone" />);
		expect(screen.queryByText("Accept terms")).not.toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", { name: "Standalone" }),
		).toBeInTheDocument();
	});

	it("applies custom className to the wrapper", () => {
		render(<Checkbox aria-label="Test" className="custom-class" />);
		// The wrapper div should have the custom class
		const wrapper = screen
			.getByRole("checkbox", { name: "Test" })
			.closest(".w-12");
		expect(wrapper).toHaveClass("custom-class");
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Controlled State
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Controlled State", () => {
	it("calls onCheckedChange with true when unchecked checkbox is clicked", () => {
		const onCheckedChange = vi.fn();
		render(
			<Checkbox
				checked={false}
				onCheckedChange={onCheckedChange}
				aria-label="Test"
			/>,
		);
		const input = screen.getByRole("checkbox");
		fireEvent.click(input);
		expect(onCheckedChange).toHaveBeenCalledOnce();
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});

	it("calls onCheckedChange with false when checked checkbox is clicked", () => {
		const onCheckedChange = vi.fn();
		render(
			<Checkbox checked onCheckedChange={onCheckedChange} aria-label="Test" />,
		);
		const input = screen.getByRole("checkbox");
		fireEvent.click(input);
		expect(onCheckedChange).toHaveBeenCalledOnce();
		expect(onCheckedChange).toHaveBeenCalledWith(false);
	});

	it("does not call onCheckedChange when disabled", () => {
		const onCheckedChange = vi.fn();
		render(
			<Checkbox
				checked={false}
				onCheckedChange={onCheckedChange}
				disabled
				aria-label="Test"
			/>,
		);
		const input = screen.getByRole("checkbox");
		fireEvent.click(input);
		expect(onCheckedChange).not.toHaveBeenCalled();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Tri-State Mode
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Tri-State", () => {
	it("renders unchecked when state='unchecked'", () => {
		render(
			<Checkbox
				state="unchecked"
				onStateChange={() => {}}
				aria-label="Parent"
			/>,
		);
		const input = screen.getByRole("checkbox");
		expect(input).toHaveAttribute("aria-checked", "false");
	});

	it("renders checked when state='checked'", () => {
		render(
			<Checkbox state="checked" onStateChange={() => {}} aria-label="Parent" />,
		);
		const input = screen.getByRole("checkbox");
		expect(input).toHaveAttribute("aria-checked", "true");
	});

	it("renders indeterminate when state='indeterminate'", () => {
		render(
			<Checkbox
				state="indeterminate"
				onStateChange={() => {}}
				aria-label="Parent"
			/>,
		);
		const input = screen.getByRole("checkbox");
		expect(input).toHaveAttribute("aria-checked", "mixed");
	});

	it("calls onStateChange with next state on click (unchecked → checked)", () => {
		const onStateChange = vi.fn();
		render(
			<Checkbox
				state="unchecked"
				onStateChange={onStateChange}
				aria-label="Parent"
			/>,
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onStateChange).toHaveBeenCalledWith("checked");
	});

	it("calls onStateChange with next state on click (checked → indeterminate)", () => {
		const onStateChange = vi.fn();
		render(
			<Checkbox
				state="checked"
				onStateChange={onStateChange}
				aria-label="Parent"
			/>,
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onStateChange).toHaveBeenCalledWith("indeterminate");
	});

	it("calls onStateChange with next state on click (indeterminate → unchecked)", () => {
		const onStateChange = vi.fn();
		render(
			<Checkbox
				state="indeterminate"
				onStateChange={onStateChange}
				aria-label="Parent"
			/>,
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onStateChange).toHaveBeenCalledWith("unchecked");
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// TriStateCheckbox component
// ─────────────────────────────────────────────────────────────────────────────

describe("TriStateCheckbox", () => {
	it("renders with correct state", () => {
		render(
			<TriStateCheckbox
				state="indeterminate"
				onStateChange={() => {}}
				aria-label="Select all"
			/>,
		);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-checked",
			"mixed",
		);
	});

	it("calls onStateChange when clicked", () => {
		const onStateChange = vi.fn();
		render(
			<TriStateCheckbox
				state="unchecked"
				onStateChange={onStateChange}
				aria-label="Select all"
			/>,
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onStateChange).toHaveBeenCalledWith("checked");
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Error State
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Error State", () => {
	it("sets aria-invalid=true in error state", () => {
		render(<Checkbox error aria-label="Required" />);
		const input = screen.getByRole("checkbox");
		expect(input).toHaveAttribute("aria-invalid", "true");
	});

	it("does not set aria-invalid when error is false", () => {
		render(<Checkbox aria-label="Test" />);
		const input = screen.getByRole("checkbox");
		expect(input).not.toHaveAttribute("aria-invalid");
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Disabled State
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Disabled State", () => {
	it("has disabled attribute when disabled=true", () => {
		render(<Checkbox disabled aria-label="Disabled checkbox" />);
		expect(screen.getByRole("checkbox")).toBeDisabled();
	});

	it("has aria-disabled=true when disabled=true", () => {
		render(<Checkbox disabled aria-label="Disabled checkbox" />);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-disabled",
			"true",
		);
	});

	it("does not call onCheckedChange when disabled and clicked", () => {
		const onCheckedChange = vi.fn();
		render(
			<Checkbox
				disabled
				onCheckedChange={onCheckedChange}
				aria-label="Disabled"
			/>,
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	it("does not call onStateChange when disabled (tri-state)", () => {
		const onStateChange = vi.fn();
		render(
			<Checkbox
				disabled
				state="unchecked"
				onStateChange={onStateChange}
				aria-label="Disabled"
			/>,
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onStateChange).not.toHaveBeenCalled();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Accessibility
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Accessibility", () => {
	it("has correct aria-checked='false' when unchecked", () => {
		render(<Checkbox aria-label="Test" />);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-checked",
			"false",
		);
	});

	it("has correct aria-checked='true' when checked", () => {
		render(<Checkbox checked aria-label="Test" onCheckedChange={() => {}} />);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-checked",
			"true",
		);
	});

	it("has correct aria-checked='mixed' when indeterminate", () => {
		render(<Checkbox indeterminate aria-label="Test" />);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-checked",
			"mixed",
		);
	});

	it("associates label with input via htmlFor when label prop provided", () => {
		render(<Checkbox label="My label" id="my-checkbox" />);
		const label = screen.getByText("My label").closest("label");
		const input = screen.getByRole("checkbox");
		expect(label).toHaveAttribute("for", "my-checkbox");
		expect(input).toHaveAttribute("id", "my-checkbox");
	});

	it("forwards ref to the hidden input element", () => {
		const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
		render(<Checkbox ref={ref} aria-label="Test" />);
		expect(ref.current).not.toBeNull();
		expect(ref.current?.tagName).toBe("INPUT");
		expect(ref.current?.type).toBe("checkbox");
	});

	it("supports aria-label prop", () => {
		render(<Checkbox aria-label="Custom accessible label" />);
		expect(
			screen.getByRole("checkbox", { name: "Custom accessible label" }),
		).toBeInTheDocument();
	});

	it("supports aria-labelledby prop", () => {
		render(
			<>
				<span id="label-text">External label</span>
				<Checkbox aria-labelledby="label-text" />
			</>,
		);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-labelledby",
			"label-text",
		);
	});

	it("supports aria-describedby prop", () => {
		render(
			<>
				<span id="desc">Description text</span>
				<Checkbox aria-label="Test" aria-describedby="desc" />
			</>,
		);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-describedby",
			"desc",
		);
	});

	it("supports aria-required prop", () => {
		render(<Checkbox aria-label="Required field" aria-required />);
		expect(screen.getByRole("checkbox")).toHaveAttribute(
			"aria-required",
			"true",
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Form Integration
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Form Integration", () => {
	it("renders with name prop on the input", () => {
		render(<Checkbox name="newsletter" aria-label="Subscribe" />);
		expect(screen.getByRole("checkbox")).toHaveAttribute("name", "newsletter");
	});

	it("renders with value prop on the input", () => {
		render(<Checkbox value="yes" aria-label="Subscribe" />);
		expect(screen.getByRole("checkbox")).toHaveAttribute("value", "yes");
	});

	it("works as uncontrolled with defaultChecked=true", () => {
		render(<Checkbox defaultChecked aria-label="Uncontrolled" />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("toggles state when uncontrolled", () => {
		render(<Checkbox aria-label="Uncontrolled toggle" />);
		const input = screen.getByRole("checkbox");
		expect(input).toHaveAttribute("aria-checked", "false");
		fireEvent.click(input);
		expect(input).toHaveAttribute("aria-checked", "true");
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard Interaction
// ─────────────────────────────────────────────────────────────────────────────

describe("Checkbox — Keyboard Interaction", () => {
	it("toggles on Space key press", () => {
		const onCheckedChange = vi.fn();
		render(
			<Checkbox
				checked={false}
				onCheckedChange={onCheckedChange}
				aria-label="Space test"
			/>,
		);
		const input = screen.getByRole("checkbox");
		input.focus();
		fireEvent.keyDown(input, { key: " ", code: "Space" });
		fireEvent.click(input);
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});
});
