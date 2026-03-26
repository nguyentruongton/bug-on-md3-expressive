import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingIndicator } from "../ui/loading-indicator";

describe("LoadingIndicator", () => {
	// ─── A11y: ARIA Attributes ───────────────────────────────────────────────
	it("renders with role='progressbar'", () => {
		render(<LoadingIndicator aria-label="Loading content" />);
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	});

	it("applies required aria-label", () => {
		render(<LoadingIndicator aria-label="Loading news article" />);
		const el = screen.getByRole("progressbar");
		expect(el).toHaveAttribute("aria-label", "Loading news article");
	});

	it("sets aria-valuemin and aria-valuemax", () => {
		render(<LoadingIndicator aria-label="Loading" />);
		const el = screen.getByRole("progressbar");
		expect(el).toHaveAttribute("aria-valuemin", "0");
		expect(el).toHaveAttribute("aria-valuemax", "100");
	});

	it("does not have aria-valuenow in indeterminate mode", () => {
		render(<LoadingIndicator aria-label="Loading" />);
		expect(screen.getByRole("progressbar")).not.toHaveAttribute(
			"aria-valuenow",
		);
	});

	// ─── Determinate Mode ────────────────────────────────────────────────────
	it("sets aria-valuenow when progress is provided", () => {
		render(<LoadingIndicator aria-label="Loading" progress={0.5} />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"aria-valuenow",
			"50",
		);
	});

	it("clamps aria-valuenow at 0 for negative progress", () => {
		render(<LoadingIndicator aria-label="Loading" progress={-0.5} />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"aria-valuenow",
			"0",
		);
	});

	it("clamps aria-valuenow at 100 for progress > 1", () => {
		render(<LoadingIndicator aria-label="Loading" progress={1.5} />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"aria-valuenow",
			"100",
		);
	});

	it("renders static path (no SMIL) in determinate mode", () => {
		const { container } = render(
			<LoadingIndicator aria-label="Loading" progress={0.5} />,
		);
		const path = container.querySelector("path");
		expect(path).toBeInTheDocument();
		// Determinate mode has no SMIL animate child
		const animateEl = path?.querySelector("animate");
		expect(animateEl).toBeNull();
	});

	// ─── Indeterminate Mode (SMIL) ───────────────────────────────────────────
	it("renders SVG path with SMIL shape morphing animation in indeterminate mode", () => {
		const { container } = render(
			<LoadingIndicator aria-label="Loading" />,
		);
		const path = container.querySelector("path");
		expect(path).toBeInTheDocument();
		const animateEl = path?.querySelector("animate[attributeName='d']");
		expect(animateEl).toBeInTheDocument();
	});

	// ─── Variants ────────────────────────────────────────────────────────────
	it("renders default uncontained variant without container background", () => {
		const { container } = render(
			<LoadingIndicator aria-label="Loading" />,
		);
		const inner = container.querySelector(".rounded-full");
		expect(inner).toBeNull();
	});

	it("renders contained variant with a circular container", () => {
		const { container } = render(
			<LoadingIndicator variant="contained" aria-label="Loading" />,
		);
		const inner = container.querySelector(".rounded-full");
		expect(inner).toBeInTheDocument();
	});

	// ─── Responsive Sizing ───────────────────────────────────────────────────
	it("applies custom size via style", () => {
		render(<LoadingIndicator size={96} aria-label="Loading" />);
		const el = screen.getByRole("progressbar");
		expect(el.style.width).toBe("96px");
		expect(el.style.height).toBe("96px");
	});

	it("clamps size to 24dp minimum", () => {
		render(<LoadingIndicator size={8} aria-label="Loading" />);
		const el = screen.getByRole("progressbar");
		expect(el.style.width).toBe("24px");
		expect(el.style.height).toBe("24px");
	});

	it("clamps size to 240dp maximum", () => {
		render(<LoadingIndicator size={999} aria-label="Loading" />);
		const el = screen.getByRole("progressbar");
		expect(el.style.width).toBe("240px");
		expect(el.style.height).toBe("240px");
	});

	// ─── General ─────────────────────────────────────────────────────────────
	it("renders an SVG element inside", () => {
		const { container } = render(
			<LoadingIndicator aria-label="Loading" />,
		);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("aria-hidden", "true");
	});

	it("merges custom className", () => {
		render(
			<LoadingIndicator aria-label="Loading" className="my-custom" />,
		);
		expect(screen.getByRole("progressbar").className).toContain(
			"my-custom",
		);
	});
});
