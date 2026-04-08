import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { RadioButton, RadioGroup } from "./radio-button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Renders a basic RadioGroup with 3 options. */
function renderGroup(props: {
	value?: string;
	defaultValue?: string;
	onValueChange?: (val: string) => void;
	disabled?: boolean;
}) {
	return render(
		<RadioGroup name="test-group" {...props} label="Test Group">
			<RadioButton value="a" label="Option A" />
			<RadioButton value="b" label="Option B" />
			<RadioButton value="c" label="Option C" />
		</RadioGroup>,
	);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("RadioButton Component", () => {
	// ── 1. Rendering ──────────────────────────────────────────────────────────

	describe("rendering", () => {
		it("renders without label", () => {
			render(<RadioButton value="x" aria-label="Option X" />);
			const input = screen.getByRole("radio");
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute("type", "radio");
		});

		it("renders with label", () => {
			render(<RadioButton value="x" label="My Option" />);
			expect(screen.getByRole("radio")).toBeInTheDocument();
			expect(screen.getByText("My Option")).toBeInTheDocument();
		});

		it("is unselected by default", () => {
			render(<RadioButton value="x" aria-label="Option X" />);
			expect(screen.getByRole("radio")).not.toBeChecked();
		});

		it("renders as selected when selected prop is true", () => {
			render(
				<RadioButton
					value="x"
					selected
					aria-label="Option X"
					onClick={vi.fn()}
				/>,
			);
			expect(screen.getByRole("radio")).toBeChecked();
		});

		it("renders as unselected when selected prop is false", () => {
			render(
				<RadioButton
					value="x"
					selected={false}
					aria-label="Option X"
					onClick={vi.fn()}
				/>,
			);
			expect(screen.getByRole("radio")).not.toBeChecked();
		});
	});

	// ── 2. Selection (Controlled) ─────────────────────────────────────────────

	describe("controlled selection", () => {
		it("fires onClick when clicked", () => {
			const handleClick = vi.fn();
			render(
				<RadioButton value="x" aria-label="Option X" onClick={handleClick} />,
			);
			fireEvent.click(screen.getByRole("radio"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("does not fire onClick when onClick is null", () => {
			const handleClick = vi.fn();
			render(<RadioButton value="x" aria-label="Option X" onClick={null} />);
			fireEvent.click(screen.getByRole("radio"));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("reflects controlled selected state", () => {
			const { rerender } = render(
				<RadioButton
					value="x"
					selected={false}
					aria-label="Option X"
					onClick={vi.fn()}
				/>,
			);
			expect(screen.getByRole("radio")).not.toBeChecked();

			rerender(
				<RadioButton
					value="x"
					selected={true}
					aria-label="Option X"
					onClick={vi.fn()}
				/>,
			);
			expect(screen.getByRole("radio")).toBeChecked();
		});
	});

	// ── 3. Selection (Uncontrolled) ───────────────────────────────────────────

	describe("uncontrolled selection", () => {
		it("starts unselected with no defaultSelected", () => {
			render(<RadioButton value="x" aria-label="Option X" />);
			expect(screen.getByRole("radio")).not.toBeChecked();
		});

		it("starts selected when defaultSelected is true", () => {
			render(<RadioButton value="x" defaultSelected aria-label="Option X" />);
			expect(screen.getByRole("radio")).toBeChecked();
		});

		it("updates internal state on click", () => {
			render(<RadioButton value="x" aria-label="Option X" />);
			const input = screen.getByRole("radio");
			expect(input).not.toBeChecked();

			fireEvent.click(input);
			expect(input).toBeChecked();
		});
	});

	// ── 4. Disabled state ─────────────────────────────────────────────────────

	describe("disabled state", () => {
		it("has disabled attribute when disabled", () => {
			render(<RadioButton value="x" disabled aria-label="Option X" />);
			expect(screen.getByRole("radio")).toBeDisabled();
		});

		it("sets aria-disabled on the input", () => {
			render(<RadioButton value="x" disabled aria-label="Option X" />);
			expect(screen.getByRole("radio")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		it("does not fire onClick when disabled", () => {
			const handleClick = vi.fn();
			render(
				<RadioButton
					value="x"
					disabled
					aria-label="Option X"
					onClick={handleClick}
				/>,
			);
			fireEvent.click(screen.getByRole("radio"));
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// ── 5. RadioGroup behavior ────────────────────────────────────────────────

	describe("RadioGroup", () => {
		it("only one radio selected at a time (controlled)", () => {
			const handleChange = vi.fn();
			renderGroup({ value: "a", onValueChange: handleChange });

			const radios = screen.getAllByRole("radio");
			expect(radios[0]).toBeChecked();
			expect(radios[1]).not.toBeChecked();
			expect(radios[2]).not.toBeChecked();
		});

		it("fires onValueChange with correct value when selecting", () => {
			const handleChange = vi.fn();
			renderGroup({ value: "a", onValueChange: handleChange });

			fireEvent.click(screen.getAllByRole("radio")[1]);
			expect(handleChange).toHaveBeenCalledWith("b");
		});

		it("works in uncontrolled mode with defaultValue", () => {
			renderGroup({ defaultValue: "b" });
			const radios = screen.getAllByRole("radio");
			expect(radios[1]).toBeChecked();
		});

		it("disables all radios when group is disabled", () => {
			renderGroup({ disabled: true });
			const radios = screen.getAllByRole("radio");
			for (const radio of radios) {
				expect(radio).toBeDisabled();
			}
		});

		it("shares the same name across all radios", () => {
			renderGroup({});
			const radios = screen.getAllByRole("radio");
			for (const radio of radios) {
				expect(radio).toHaveAttribute("name", "test-group");
			}
		});

		it("updates selection in uncontrolled mode on click", () => {
			renderGroup({ defaultValue: "a" });
			const radios = screen.getAllByRole("radio");

			expect(radios[0]).toBeChecked();
			fireEvent.click(radios[2]);
			expect(radios[2]).toBeChecked();
		});
	});

	// ── 6. Keyboard navigation ────────────────────────────────────────────────

	describe("keyboard navigation", () => {
		it("ArrowDown moves to next radio and selects it", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "a",
				onValueChange: handleChange,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			const radios = screen.getAllByRole("radio");
			radios[0].focus();

			fireEvent.keyDown(group, { key: "ArrowDown" });
			expect(handleChange).toHaveBeenCalledWith("b");
		});

		it("ArrowRight moves to next radio", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "a",
				onValueChange: handleChange,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			const radios = screen.getAllByRole("radio");
			radios[0].focus();

			fireEvent.keyDown(group, { key: "ArrowRight" });
			expect(handleChange).toHaveBeenCalledWith("b");
		});

		it("ArrowUp moves to previous radio", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "b",
				onValueChange: handleChange,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			const radios = screen.getAllByRole("radio");
			radios[1].focus();

			fireEvent.keyDown(group, { key: "ArrowUp" });
			expect(handleChange).toHaveBeenCalledWith("a");
		});

		it("ArrowLeft moves to previous radio", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "b",
				onValueChange: handleChange,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			const radios = screen.getAllByRole("radio");
			radios[1].focus();

			fireEvent.keyDown(group, { key: "ArrowLeft" });
			expect(handleChange).toHaveBeenCalledWith("a");
		});

		it("wraps from last to first with ArrowDown", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "c",
				onValueChange: handleChange,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			const radios = screen.getAllByRole("radio");
			radios[2].focus();

			fireEvent.keyDown(group, { key: "ArrowDown" });
			expect(handleChange).toHaveBeenCalledWith("a");
		});

		it("wraps from first to last with ArrowUp", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "a",
				onValueChange: handleChange,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			const radios = screen.getAllByRole("radio");
			radios[0].focus();

			fireEvent.keyDown(group, { key: "ArrowUp" });
			expect(handleChange).toHaveBeenCalledWith("c");
		});

		it("does not navigate when group is disabled", () => {
			const handleChange = vi.fn();
			const { container } = renderGroup({
				value: "a",
				onValueChange: handleChange,
				disabled: true,
			});

			const group = container.querySelector("[role='radiogroup']");
			if (!group) throw new Error("radiogroup not found");
			fireEvent.keyDown(group, { key: "ArrowDown" });
			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	// ── 7. Accessibility ──────────────────────────────────────────────────────

	describe("accessibility", () => {
		it("input has role radio", () => {
			render(<RadioButton value="x" aria-label="Option X" />);
			expect(screen.getByRole("radio")).toBeInTheDocument();
		});

		it("has aria-label when provided", () => {
			render(<RadioButton value="x" aria-label="My Radio Label" />);
			expect(screen.getByRole("radio")).toHaveAttribute(
				"aria-label",
				"My Radio Label",
			);
		});

		it("RadioGroup has role radiogroup", () => {
			renderGroup({});
			expect(screen.getByRole("radiogroup")).toBeInTheDocument();
		});

		it("RadioGroup sets aria-disabled when disabled", () => {
			renderGroup({ disabled: true });
			expect(screen.getByRole("radiogroup")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		it("RadioGroup label is accessible via aria-label", () => {
			renderGroup({});
			const group = screen.getByRole("radiogroup");
			expect(group).toHaveAttribute("aria-label", "Test Group");
		});

		it("RadioButton label associates with input via htmlFor", () => {
			render(<RadioButton value="x" label="Labeled Option" />);
			const input = screen.getByRole("radio");
			const label = screen.getByText("Labeled Option").closest("label");
			expect(label).toHaveAttribute("for", input.id);
		});

		it("input is visually hidden (sr-only)", () => {
			render(<RadioButton value="x" aria-label="Option X" />);
			const input = screen.getByRole("radio");
			expect(input.className).toContain("sr-only");
		});
	});

	// ── 8. Ref forwarding ─────────────────────────────────────────────────────

	describe("ref forwarding", () => {
		it("ref points to the hidden input element", () => {
			const ref = React.createRef<HTMLInputElement>();
			render(<RadioButton value="x" aria-label="Option X" ref={ref} />);
			expect(ref.current).toBeTruthy();
			if (!ref.current) throw new Error("ref.current is null");
			expect(ref.current.tagName.toLowerCase()).toBe("input");
			expect(ref.current.type).toBe("radio");
		});
	});

	// ── 9. Reduced motion ─────────────────────────────────────────────────────

	describe("reduced motion", () => {
		it("renders correctly when reduced motion is preferred", () => {
			// RadioVisual internal renders; just check component doesn't crash
			render(<RadioButton value="x" aria-label="Option X" selected />);
			expect(screen.getByRole("radio")).toBeChecked();
		});
	});
});
