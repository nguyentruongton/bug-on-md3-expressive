"use client";

import { render, screen } from "@testing-library/react";
import * as MotionReact from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Badge, BadgedBox } from "./badge";

// Mock motion/react – same pattern as chip.test.tsx
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return {
		...actual,
		useReducedMotion: () => false,
	};
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const TestIcon = () => (
	<svg data-testid="test-icon" aria-hidden="true" viewBox="0 0 24 24" />
);

// ── Test Suites ───────────────────────────────────────────────────────────────

describe("Badge", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	// ── Rendering ──────────────────────────────────────────────────────────────

	describe("rendering", () => {
		it("renders as small dot when no children provided", () => {
			const { container } = render(<Badge />);
			const badge = container.firstChild as HTMLElement;
			expect(badge).toBeInTheDocument();
			// Small dot: aria-hidden (decorative)
			expect(badge).toHaveAttribute("aria-hidden", "true");
		});

		it("renders with text content when children provided", () => {
			render(<Badge>3</Badge>);
			expect(screen.getByRole("status")).toHaveTextContent("3");
		});

		it("applies correct size classes for small variant (6x6px)", () => {
			const { container } = render(<Badge />);
			const badge = container.firstChild as HTMLElement;
			// Tailwind shorthand: w-1.5 = 6px, h-1.5 = 6px
			expect(badge.className).toContain("w-1.5");
			expect(badge.className).toContain("h-1.5");
		});

		it("applies correct size classes for large variant (min 16px)", () => {
			const { container } = render(<Badge>3</Badge>);
			const badge = container.firstChild as HTMLElement;
			// Tailwind shorthand: min-w-4 = 16px, h-4 = 16px
			expect(badge.className).toContain("min-w-4");
			expect(badge.className).toContain("h-4");
		});
	});

	// ── Content truncation ─────────────────────────────────────────────────────

	describe("content truncation", () => {
		it("displays exact number when below max", () => {
			render(<Badge max={99}>42</Badge>);
			expect(screen.getByRole("status")).toHaveTextContent("42");
		});

		it("displays '{max}+' when number exceeds max prop", () => {
			render(<Badge max={99}>150</Badge>);
			expect(screen.getByRole("status")).toHaveTextContent("99+");
		});

		it("defaults to showing full number when max not set", () => {
			render(<Badge>9999</Badge>);
			expect(screen.getByRole("status")).toHaveTextContent("9999");
		});

		it("truncates string to 4 characters maximum including +", () => {
			render(<Badge>HELLO</Badge>);
			// "HELLO" → 5 chars → truncated to "HELL"
			expect(screen.getByRole("status")).toHaveTextContent("HELL");
		});

		it("does not truncate strings of 4 chars or fewer", () => {
			render(<Badge>NEW</Badge>);
			expect(screen.getByRole("status")).toHaveTextContent("NEW");
		});

		it("displays '99+' when value is exactly max+1", () => {
			render(<Badge max={99}>100</Badge>);
			expect(screen.getByRole("status")).toHaveTextContent("99+");
		});
	});

	// ── Styling ────────────────────────────────────────────────────────────────

	describe("styling", () => {
		it("applies MD3 error color as default container color for small badge", () => {
			const { container } = render(<Badge />);
			const badge = container.firstChild as HTMLElement;
			expect(badge.className).toContain("bg-m3-error");
		});

		it("applies MD3 error color as default container color for large badge", () => {
			const { container } = render(<Badge>3</Badge>);
			const badge = container.firstChild as HTMLElement;
			expect(badge.className).toContain("bg-m3-error");
		});

		it("applies MD3 onError color as default content color", () => {
			const { container } = render(<Badge>3</Badge>);
			const badge = container.firstChild as HTMLElement;
			expect(badge.className).toContain("text-m3-on-error");
		});

		it("accepts custom containerColor prop via inline style", () => {
			const { container } = render(<Badge containerColor="blue">3</Badge>);
			const badge = container.firstChild as HTMLElement;
			expect(badge.style.backgroundColor).toBe("blue");
			// Should NOT apply default bg class when override is provided
			expect(badge.className).not.toContain("bg-m3-error");
		});

		it("accepts custom contentColor prop via inline style", () => {
			const { container } = render(<Badge contentColor="white">3</Badge>);
			const badge = container.firstChild as HTMLElement;
			expect(badge.style.color).toBe("white");
		});

		it("applies rounded-full shape (MD3 CornerFull = 9999px)", () => {
			const { container } = render(<Badge>3</Badge>);
			const badge = container.firstChild as HTMLElement;
			expect(badge.className).toContain("rounded-full");
		});
	});

	// ── Accessibility ──────────────────────────────────────────────────────────

	describe("accessibility", () => {
		it("has role='status' for screen reader announcements when content present", () => {
			render(<Badge>3</Badge>);
			expect(screen.getByRole("status")).toBeInTheDocument();
		});

		it("renders aria-hidden='true' for small dot badge (decorative)", () => {
			const { container } = render(<Badge />);
			const badge = container.firstChild as HTMLElement;
			expect(badge).toHaveAttribute("aria-hidden", "true");
		});

		it("renders aria-label with content value for large badge", () => {
			render(<Badge>3</Badge>);
			expect(screen.getByRole("status")).toHaveAttribute("aria-label", "3");
		});

		it("renders aria-label with max+ when number exceeds max", () => {
			render(<Badge max={99}>150</Badge>);
			expect(screen.getByRole("status")).toHaveAttribute("aria-label", "99+");
		});

		it("accepts explicit aria-label prop (overrides default)", () => {
			render(<Badge aria-label="3 notifications">3</Badge>);
			expect(screen.getByRole("status")).toHaveAttribute(
				"aria-label",
				"3 notifications",
			);
		});

		it("small badge with explicit aria-label gets role='status'", () => {
			render(<Badge aria-label="New notification" />);
			expect(screen.getByRole("status")).toBeInTheDocument();
			expect(screen.getByRole("status")).toHaveAttribute(
				"aria-label",
				"New notification",
			);
		});
	});

	// ── className merging ──────────────────────────────────────────────────────

	describe("className merging", () => {
		it("merges additional className with base classes", () => {
			const { container } = render(
				<Badge className="my-custom-class">3</Badge>,
			);
			const badge = container.firstChild as HTMLElement;
			expect(badge).toHaveClass("my-custom-class");
			// Still has base classes
			expect(badge.className).toContain("rounded-full");
		});

		it("merges additional className for small dot badge", () => {
			const { container } = render(<Badge className="dot-extra" />);
			const badge = container.firstChild as HTMLElement;
			expect(badge).toHaveClass("dot-extra");
			expect(badge.className).toContain("w-1.5");
		});
	});

	// ── forwardRef ─────────────────────────────────────────────────────────────

	describe("forwardRef", () => {
		it("forwards ref to underlying span element", () => {
			const ref = { current: null };
			render(<Badge ref={ref}>3</Badge>);
			expect(ref.current).not.toBeNull();
			expect((ref.current as unknown as HTMLElement).tagName).toBe("SPAN");
		});

		it("forwards ref to small dot badge span element", () => {
			const ref = { current: null };
			render(<Badge ref={ref} />);
			expect(ref.current).not.toBeNull();
		});
	});

	// ── Reduced Motion ─────────────────────────────────────────────────────────

	describe("prefers-reduced-motion", () => {
		it("renders correctly when prefers-reduced-motion is active", () => {
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);
			render(<Badge>3</Badge>);
			expect(screen.getByRole("status")).toBeInTheDocument();
		});
	});
});

// ── BadgedBox Tests ───────────────────────────────────────────────────────────

describe("BadgedBox", () => {
	it("renders anchor content", () => {
		render(
			<BadgedBox badge={<Badge />}>
				<TestIcon />
			</BadgedBox>,
		);
		expect(screen.getByTestId("test-icon")).toBeInTheDocument();
	});

	it("renders badge overlaying the anchor", () => {
		render(
			<BadgedBox badge={<Badge aria-label="3 new" />}>
				<TestIcon />
			</BadgedBox>,
		);
		// The small badge is decorated, but the aria-label makes it visible to a11y
		expect(screen.getByLabelText("3 new")).toBeInTheDocument();
	});

	it("applies relative positioning to container", () => {
		const { container } = render(
			<BadgedBox badge={<Badge />}>
				<TestIcon />
			</BadgedBox>,
		);
		// The outer wrapper span has relative positioning class
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className).toContain("relative");
		expect(wrapper.className).toContain("inline-flex");
	});

	it("applies absolute positioning to badge wrapper", () => {
		const { container } = render(
			<BadgedBox badge={<Badge />}>
				<TestIcon />
			</BadgedBox>,
		);
		// Find the badge positioner span (second child of outer wrapper)
		const wrapper = container.firstChild as HTMLElement;
		const badgeSlot = wrapper.children[1] as HTMLElement;
		expect(badgeSlot.className).toContain("absolute");
	});

	it("positions small badge at top-trailing corner with 50% offset", () => {
		const { container } = render(
			<BadgedBox badge={<Badge />}>
				<TestIcon />
			</BadgedBox>,
		);
		const wrapper = container.firstChild as HTMLElement;
		const badgeSlot = wrapper.children[1] as HTMLElement;
		expect(badgeSlot.className).toContain("translate-x-[50%]");
		expect(badgeSlot.className).toContain("-translate-y-[50%]");
	});

	it("positions large badge at top-trailing corner with 35% offset", () => {
		const { container } = render(
			<BadgedBox badge={<Badge>3</Badge>}>
				<TestIcon />
			</BadgedBox>,
		);
		const wrapper = container.firstChild as HTMLElement;
		const badgeSlot = wrapper.children[1] as HTMLElement;
		expect(badgeSlot.className).toContain("translate-x-[35%]");
		expect(badgeSlot.className).toContain("-translate-y-[35%]");
	});

	it("respects explicit badgeSize='small' prop", () => {
		const { container } = render(
			// Even though badge has content, explicitly set small
			<BadgedBox badge={<Badge>3</Badge>} badgeSize="small">
				<TestIcon />
			</BadgedBox>,
		);
		const wrapper = container.firstChild as HTMLElement;
		const badgeSlot = wrapper.children[1] as HTMLElement;
		expect(badgeSlot.className).toContain("translate-x-[50%]");
	});

	it("respects explicit badgeSize='large' prop", () => {
		const { container } = render(
			// Even though badge has no content, explicitly set large
			<BadgedBox badge={<Badge />} badgeSize="large">
				<TestIcon />
			</BadgedBox>,
		);
		const wrapper = container.firstChild as HTMLElement;
		const badgeSlot = wrapper.children[1] as HTMLElement;
		expect(badgeSlot.className).toContain("translate-x-[35%]");
	});

	it("accepts and applies className to container", () => {
		const { container } = render(
			<BadgedBox badge={<Badge />} className="my-box-class">
				<TestIcon />
			</BadgedBox>,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("my-box-class");
	});

	it("badge slot wrapper has aria-hidden to avoid double-announcement", () => {
		const { container } = render(
			<BadgedBox badge={<Badge>3</Badge>}>
				<TestIcon />
			</BadgedBox>,
		);
		const wrapper = container.firstChild as HTMLElement;
		const badgeSlot = wrapper.children[1] as HTMLElement;
		expect(badgeSlot).toHaveAttribute("aria-hidden", "true");
	});
});
