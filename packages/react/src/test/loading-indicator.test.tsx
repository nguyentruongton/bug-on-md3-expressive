import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingIndicator } from "../ui/loading-indicator";

describe("LoadingIndicator", () => {
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

	it("applies custom size via style", () => {
		render(<LoadingIndicator size={96} aria-label="Loading" />);
		const el = screen.getByRole("progressbar");
		expect(el.style.width).toBe("96px");
		expect(el.style.height).toBe("96px");
	});

	it("renders an SVG element inside", () => {
		const { container } = render(
			<LoadingIndicator aria-label="Loading" />,
		);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("aria-hidden", "true");
	});

	it("renders SVG path for shape morphing", () => {
		const { container } = render(
			<LoadingIndicator aria-label="Loading" />,
		);
		const path = container.querySelector("path");
		expect(path).toBeInTheDocument();
		expect(path?.getAttribute("d")).toBeTruthy();
	});

	it("merges custom className", () => {
		render(
			<LoadingIndicator aria-label="Loading" className="my-custom" />,
		);
		expect(screen.getByRole("progressbar").className).toContain(
			"my-custom",
		);
	});

	it("does not have aria-valuenow (indeterminate)", () => {
		render(<LoadingIndicator aria-label="Loading" />);
		expect(screen.getByRole("progressbar")).not.toHaveAttribute(
			"aria-valuenow",
		);
	});
});
