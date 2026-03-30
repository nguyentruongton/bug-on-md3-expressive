import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressIndicator } from "../ui/progress-indicator";

describe("ProgressIndicator", () => {
	// ── Linear Flat ──────────────────────────────────────────────────────────
	describe("Linear - Flat", () => {
		it("renders with role='progressbar'", () => {
			render(
				<ProgressIndicator variant="linear" aria-label="Uploading file" />,
			);
			expect(screen.getByRole("progressbar")).toBeInTheDocument();
		});

		it("applies required aria-label", () => {
			render(
				<ProgressIndicator variant="linear" aria-label="Uploading file" />,
			);
			expect(screen.getByRole("progressbar")).toHaveAttribute(
				"aria-label",
				"Uploading file",
			);
		});

		it("shows aria-valuenow for determinate state", () => {
			render(
				<ProgressIndicator
					variant="linear"
					value={42}
					aria-label="Downloading"
				/>,
			);
			const el = screen.getByRole("progressbar");
			expect(el).toHaveAttribute("aria-valuenow", "42");
			expect(el).toHaveAttribute("aria-valuemin", "0");
			expect(el).toHaveAttribute("aria-valuemax", "100");
		});

		it("does not show aria-valuenow for indeterminate state", () => {
			render(<ProgressIndicator variant="linear" aria-label="Loading" />);
			expect(screen.getByRole("progressbar")).not.toHaveAttribute(
				"aria-valuenow",
			);
		});

		it("clamps value between 0 and 100", () => {
			render(
				<ProgressIndicator
					variant="linear"
					value={150}
					aria-label="Overloaded"
				/>,
			);
			expect(screen.getByRole("progressbar")).toHaveAttribute(
				"aria-valuenow",
				"100",
			);
		});

		it("shows stop indicator dot in determinate mode by default", () => {
			const { container } = render(
				<ProgressIndicator variant="linear" value={50} aria-label="Loading" />,
			);
			const dot = container.querySelector(".rounded-full[aria-hidden='true']");
			expect(dot).toBeInTheDocument();
		});

		it("stop indicator is 4px (MD3 spec) regardless of trackHeight", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					value={50}
					trackHeight={8}
					aria-label="Thick track"
				/>,
			);
			const dot = container.querySelector(
				".rounded-full[aria-hidden='true']",
			) as HTMLElement | null;
			expect(dot).toBeInTheDocument();
			expect(dot?.style.width).toBe("4px");
			expect(dot?.style.height).toBe("4px");
		});

		it("stop indicator is NOT shown for indeterminate state", () => {
			const { container } = render(
				<ProgressIndicator variant="linear" aria-label="Loading" />,
			);
			const dot = container.querySelector(".rounded-full[aria-hidden='true']");
			expect(dot).toBeNull();
		});

		it("accepts space prop", () => {
			render(
				<ProgressIndicator
					variant="linear"
					value={50}
					gapSize={8}
					aria-label="Test space"
				/>,
			);
			expect(screen.getByRole("progressbar")).toBeInTheDocument();
		});

		it("hides stop indicator when showStopIndicator=false", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					value={50}
					showStopIndicator={false}
					aria-label="Loading"
				/>,
			);
			const dot = container.querySelector(".rounded-full[aria-hidden='true']");
			expect(dot).toBeNull();
		});

		it("merges custom className", () => {
			render(
				<ProgressIndicator
					variant="linear"
					aria-label="Loading"
					className="test-class"
				/>,
			);
			expect(screen.getByRole("progressbar").className).toContain("test-class");
		});

		it("active indicator has minWidth (dot) when value is 0 — MD3 spec", () => {
			// MD3 spec: "When progress first begins, the active indicator appears as a dot."
			const { container } = render(
				<ProgressIndicator variant="linear" value={0} aria-label="Starting" />,
			);
			// The animated div inside the track should have minWidth set (not zero)
			// Track background is the first absolute div, active is the second absolute div.
			const track = container.querySelectorAll(".relative.w-full .absolute")[1];
			expect(track).toBeInTheDocument();
			const style = (track as HTMLElement)?.style;
			// minWidth should be the trackHeight default (4px)
			expect(style?.minWidth).toBe("4px");
		});
	});

	// ── Linear Wavy ──────────────────────────────────────────────────────────
	describe("Linear - Wavy", () => {
		it("renders SVG for wavy shape", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					shape="wavy"
					aria-label="Loading wavy"
				/>,
			);
			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();
		});

		it("accepts custom amplitude and wavelength", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					shape="wavy"
					amplitude={10}
					wavelength={40}
					aria-label="Loading wavy custom"
				/>,
			);
			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("SVG has overflow=visible to prevent wave clip (MD3)", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					shape="wavy"
					aria-label="Loading wavy overflow"
				/>,
			);
			const svg = container.querySelector("svg") as SVGElement | null;
			expect(svg?.style.overflow).toBe("visible");
		});

		it("accepts indeterminateWavelength prop", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					shape="wavy"
					indeterminateWavelength={30}
					aria-label="Custom indeterminate wavelength"
				/>,
			);
			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("does NOT show stop indicator for wavy indeterminate — MD3 spec", () => {
			const { container } = render(
				<ProgressIndicator
					variant="linear"
					shape="wavy"
					aria-label="Loading wavy no stop"
				/>,
			);
			const dot = container.querySelector(".rounded-full[aria-hidden='true']");
			expect(dot).toBeNull();
		});
	});

	// ── Circular ─────────────────────────────────────────────────────────────
	describe("Circular", () => {
		it("renders with role='progressbar'", () => {
			render(
				<ProgressIndicator variant="circular" aria-label="Loading circular" />,
			);
			expect(screen.getByRole("progressbar")).toBeInTheDocument();
		});

		it("renders SVG with circle elements", () => {
			const { container } = render(
				<ProgressIndicator variant="circular" aria-label="Loading circular" />,
			);
			const circles = container.querySelectorAll("circle");
			expect(circles.length).toBeGreaterThanOrEqual(2);
		});

		it("shows aria-valuenow for determinate state", () => {
			render(
				<ProgressIndicator
					variant="circular"
					value={75}
					aria-label="Loading 75%"
				/>,
			);
			expect(screen.getByRole("progressbar")).toHaveAttribute(
				"aria-valuenow",
				"75",
			);
		});

		it("applies custom size via inline style", () => {
			render(
				<ProgressIndicator variant="circular" size={64} aria-label="Loading" />,
			);
			const el = screen.getByRole("progressbar");
			expect(el.style.width).toBe("64px");
			expect(el.style.height).toBe("64px");
		});

		it("does not show aria-valuenow for indeterminate", () => {
			render(<ProgressIndicator variant="circular" aria-label="Loading" />);
			expect(screen.getByRole("progressbar")).not.toHaveAttribute(
				"aria-valuenow",
			);
		});
	});

	// ── Circular Wavy ────────────────────────────────────────────────────────
	describe("Circular - Wavy", () => {
		it("renders SVG with path element for wavy shape", () => {
			const { container } = render(
				<ProgressIndicator
					variant="circular"
					shape="wavy"
					aria-label="Loading circular wavy"
				/>,
			);
			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();
			const path = container.querySelector("path");
			expect(path).toBeInTheDocument();
		});

		it("accepts custom amplitude and wavelength", () => {
			const { container } = render(
				<ProgressIndicator
					variant="circular"
					shape="wavy"
					amplitude={8}
					wavelength={40}
					aria-label="Loading circular wavy custom"
				/>,
			);
			const path = container.querySelector("path");
			expect(path).toBeInTheDocument();
			// verify that path starts with M (move layout command generated mathematically)
			expect(path?.getAttribute("d")?.startsWith("M ")).toBe(true);
		});
	});

	// ── RTL Support ──────────────────────────────────────────────────────────
	describe("RTL support", () => {
		it("renders linear inside RTL container without crashing", () => {
			const { container } = render(
				<div dir="rtl">
					<ProgressIndicator
						variant="linear"
						value={30}
						aria-label="RTL progress"
					/>
				</div>,
			);
			expect(
				container.querySelector("[role='progressbar']"),
			).toBeInTheDocument();
		});
	});
});
