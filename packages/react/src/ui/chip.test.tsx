"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import * as MotionReact from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Chip } from "./chip";

// Mock motion/react – same pattern as card.test.tsx and button.test.tsx
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return {
		...actual,
		useReducedMotion: () => false,
	};
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const renderChip = (props: Partial<Parameters<typeof Chip>[0]> = {}) =>
	render(<Chip label="Test Chip" {...props} />);

// ── Test Suites ───────────────────────────────────────────────────────────────

describe("Chip Component", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	// ── Rendering ──────────────────────────────────────────────────────────────

	describe("basic rendering", () => {
		it("renders a <button> element by default", () => {
			renderChip();
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("renders the label text", () => {
			render(<Chip label="Shopping" />);
			expect(screen.getByText("Shopping")).toBeInTheDocument();
		});

		it("renders with label as ReactNode", () => {
			render(<Chip label={<span data-testid="custom-label">Custom</span>} />);
			expect(screen.getByTestId("custom-label")).toBeInTheDocument();
		});

		it("forwards ref to the button element", () => {
			const ref = { current: null };
			render(<Chip label="Ref Test" ref={ref} />);
			expect(ref.current).not.toBeNull();
		});

		it("passes extra HTML attributes to the button", () => {
			// Spread extra attributes through the Omit<HTMLButtonAttributes> extension
			render(<Chip label="Test Chip" data-testid="my-chip" />);
			expect(screen.getByTestId("my-chip")).toBeInTheDocument();
		});
	});

	// ── Variants ───────────────────────────────────────────────────────────────

	describe("variant: assist (default)", () => {
		it("has bordered style (border-m3-outline-variant)", () => {
			const { container } = renderChip({ variant: "assist" });
			expect(container.firstChild).toHaveClass("border-m3-outline-variant");
		});

		it("label color is on-surface", () => {
			const { container } = renderChip({ variant: "assist" });
			expect(container.firstChild).toHaveClass("text-m3-on-surface");
		});
	});

	describe("variant: filter", () => {
		it("has role='checkbox' for filter chip", () => {
			renderChip({ variant: "filter" });
			expect(screen.getByRole("checkbox")).toBeInTheDocument();
		});

		it("aria-checked=false when unselected", () => {
			renderChip({ variant: "filter", selected: false });
			expect(screen.getByRole("checkbox")).toHaveAttribute(
				"aria-checked",
				"false",
			);
		});

		it("aria-checked=true when selected", () => {
			renderChip({ variant: "filter", selected: true });
			expect(screen.getByRole("checkbox")).toHaveAttribute(
				"aria-checked",
				"true",
			);
		});

		it("selected → has secondary-container background", () => {
			const { container } = renderChip({ variant: "filter", selected: true });
			expect(container.firstChild).toHaveClass("bg-m3-secondary-container");
		});

		it("selected → border becomes transparent", () => {
			const { container } = renderChip({ variant: "filter", selected: true });
			expect(container.firstChild).toHaveClass("border-none");
		});

		it("unselected → no secondary-container bg", () => {
			const { container } = renderChip({ variant: "filter", selected: false });
			expect(container.firstChild).not.toHaveClass("bg-m3-secondary-container");
		});
	});

	describe("variant: input", () => {
		it("renders with role='button'", () => {
			renderChip({ variant: "input" });
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("selected → aria-pressed=true", () => {
			renderChip({ variant: "input", selected: true });
			expect(screen.getByRole("button", { hidden: true })).toHaveAttribute(
				"aria-pressed",
				"true",
			);
		});

		it("unselected → no aria-pressed attribute", () => {
			renderChip({ variant: "input", selected: false });
			expect(screen.getAllByRole("button")[0]).not.toHaveAttribute(
				"aria-pressed",
			);
		});

		it("selected → has secondary-container background", () => {
			const { container } = renderChip({ variant: "input", selected: true });
			expect(container.firstChild).toHaveClass("bg-m3-secondary-container");
		});

		it("renders remove button when onRemove is provided", () => {
			renderChip({ variant: "input", onRemove: vi.fn() });
			// There will be two buttons: the chip itself and the remove button
			const buttons = screen.getAllByRole("button");
			expect(buttons.length).toBe(2);
		});

		it("remove button has accessible aria-label", () => {
			renderChip({
				variant: "input",
				label: "React",
				onRemove: vi.fn(),
			});
			expect(screen.getByLabelText("Remove React")).toBeInTheDocument();
		});

		it("remove button click fires onRemove (not onClick)", () => {
			const handleRemove = vi.fn();
			const handleClick = vi.fn();
			renderChip({
				variant: "input",
				label: "Tag",
				onRemove: handleRemove,
				onClick: handleClick,
			});
			const removeBtn = screen.getByLabelText("Remove Tag");
			fireEvent.click(removeBtn);
			expect(handleRemove).toHaveBeenCalledTimes(1);
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	describe("variant: suggestion", () => {
		it("has bordered style", () => {
			const { container } = renderChip({ variant: "suggestion" });
			expect(container.firstChild).toHaveClass("border-m3-outline-variant");
		});

		it("label color is on-surface-variant", () => {
			const { container } = renderChip({ variant: "suggestion" });
			expect(container.firstChild).toHaveClass("text-m3-on-surface-variant");
		});
	});

	// ── Elevated State ─────────────────────────────────────────────────────────

	describe("elevated state", () => {
		it("elevated=true → has surface-container-low background", () => {
			const { container } = renderChip({ elevated: true });
			expect(container.firstChild).toHaveClass("bg-m3-surface-container-low");
		});

		it("elevated=true → border is none", () => {
			const { container } = renderChip({ elevated: true });
			expect(container.firstChild).toHaveClass("border-none");
		});

		it("elevated=false → no surface-container-low class", () => {
			const { container } = renderChip({ elevated: false });
			expect(container.firstChild).not.toHaveClass(
				"bg-m3-surface-container-low",
			);
		});
	});

	// ── Disabled State ─────────────────────────────────────────────────────────

	describe("disabled state", () => {
		it("has pointer-events-none when disabled", () => {
			const { container } = renderChip({ disabled: true });
			expect(container.firstChild).toHaveClass("pointer-events-none");
		});

		it("has opacity-[0.38] when disabled", () => {
			const { container } = renderChip({ disabled: true });
			expect(container.firstChild).toHaveClass("opacity-[0.38]");
		});

		it("has aria-disabled=true when disabled", () => {
			renderChip({ disabled: true });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		it("has tabIndex=-1 when disabled", () => {
			renderChip({ disabled: true });
			expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
		});

		it("does not fire onClick when disabled", () => {
			const handleClick = vi.fn();
			renderChip({ disabled: true, onClick: handleClick });
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// ── Interaction ────────────────────────────────────────────────────────────

	describe("interaction", () => {
		it("calls onClick when clicked", () => {
			const handleClick = vi.fn();
			renderChip({ onClick: handleClick });
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("triggers ripple on pointerDown", () => {
			renderChip({ onClick: vi.fn() });
			const btn = screen.getByRole("button");
			fireEvent.pointerDown(btn, { clientX: 10, clientY: 10 });
			// Ripple mounts an <m.span aria-hidden="true">
			expect(btn.querySelector("[aria-hidden='true']")).not.toBeNull();
		});
	});

	// ── Avatar ─────────────────────────────────────────────────────────────────

	describe("avatar (input chip)", () => {
		it("renders avatar element for input chips", () => {
			render(
				<Chip
					variant="input"
					label="Contact"
					avatar={<img data-testid="avatar-img" src="/avatar.png" alt="User" />}
				/>,
			);
			expect(screen.getByTestId("avatar-img")).toBeInTheDocument();
		});
	});

	// ── A11y: prefers-reduced-motion ──────────────────────────────────────────

	describe("accessibility - reduced motion", () => {
		it("Ripple renders nothing when prefers-reduced-motion is active", () => {
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);
			renderChip({ onClick: vi.fn() });
			const btn = screen.getByRole("button");
			fireEvent.pointerDown(btn, { clientX: 5, clientY: 5 });
			// When reduced motion is on, the Ripple component returns null
			expect(btn.querySelector("span[aria-hidden='true']")).toBeNull();
		});
	});

	// ── Custom className ───────────────────────────────────────────────────────

	describe("className prop", () => {
		it("merges custom className", () => {
			const { container } = renderChip({ className: "my-custom-class" });
			expect(container.firstChild).toHaveClass("my-custom-class");
		});
	});
});
