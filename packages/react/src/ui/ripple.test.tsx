import { render } from "@testing-library/react";
import * as MotionReact from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Ripple } from "./ripple";

// Top-level mock is required by vitest (hoisted before any test runs)
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return {
		...actual,
		// Default: motion is allowed
		useReducedMotion: () => false,
	};
});

describe("Ripple Component", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("when motion is allowed (default)", () => {
		it("renders nothing without ripples passed in", () => {
			const { container } = render(
				<Ripple ripples={[]} onRippleDone={vi.fn()} />,
			);
			expect(container.textContent).toBe("");
		});

		it("renders ripple elements when provided", () => {
			const ripples = [{ id: 1, x: 10, y: 10, size: 50 }];
			const { container } = render(
				<Ripple ripples={ripples} onRippleDone={vi.fn()} />,
			);

			const span = container.querySelector("span");
			expect(span).toBeInTheDocument();
			expect(span).toHaveAttribute("aria-hidden", "true");
			expect(span?.style.left).toBe("-15px"); // x(10) - size(50)/2
			expect(span?.style.top).toBe("-15px"); // y(10) - size(50)/2
			expect(span?.style.width).toBe("50px");
			expect(span?.style.height).toBe("50px");
		});

		it("marks ripple span as aria-hidden for screen readers", () => {
			const ripples = [{ id: 2, x: 0, y: 0, size: 40 }];
			const { container } = render(
				<Ripple ripples={ripples} onRippleDone={vi.fn()} />,
			);
			expect(container.querySelector("span")).toHaveAttribute(
				"aria-hidden",
				"true",
			);
		});
	});

	// ── A11y: prefers-reduced-motion ──────────────────────────────────────────

	describe("when prefers-reduced-motion is active", () => {
		it("renders nothing even when ripples are provided", () => {
			// Override the mocked hook for this single test via spyOn
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);

			const ripples = [{ id: 99, x: 5, y: 5, size: 30 }];
			const { container } = render(
				<Ripple ripples={ripples} onRippleDone={vi.fn()} />,
			);

			// When useReducedMotion returns true, Ripple renders null — no spans
			expect(container.querySelector("span")).toBeNull();
		});
	});
});
