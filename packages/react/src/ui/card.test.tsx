"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import * as MotionReact from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Card } from "./card";

// Mock motion/react – tương tự pattern trong button.test.tsx
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return {
		...actual,
		useReducedMotion: () => false,
	};
});

const renderCard = (props = {}, children = <p>Content</p>) =>
	render(<Card {...props}>{children}</Card>);

describe("Card Component", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	// ── Static Card ──────────────────────────────────────────────────────────

	describe("static card (no interaction)", () => {
		it("renders a <div> when no onClick/href/interactive given", () => {
			const { container } = renderCard();
			expect(container.firstChild?.nodeName).toBe("DIV");
		});

		it("does not have tabIndex on static card", () => {
			const { container } = renderCard();
			expect(container.firstChild).not.toHaveAttribute("tabIndex");
		});

		it("renders children inside the card", () => {
			renderCard({}, <span data-testid="child">Hello</span>);
			expect(screen.getByTestId("child")).toBeInTheDocument();
		});
	});

	// ── Interactive Card (onClick) ────────────────────────────────────────────

	describe("interactive card (onClick prop)", () => {
		it("renders a <button> when onClick is provided", () => {
			renderCard({ onClick: vi.fn() });
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("has tabIndex={0} when interactive", () => {
			renderCard({ onClick: vi.fn() });
			expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
		});

		it("calls onClick when clicked", () => {
			const handleClick = vi.fn();
			renderCard({ onClick: handleClick });
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("triggers ripple on pointerDown", () => {
			renderCard({ onClick: vi.fn() });
			const btn = screen.getByRole("button");
			fireEvent.pointerDown(btn, { clientX: 10, clientY: 10 });
			// Ripple mounts a span[aria-hidden] inside the button
			expect(btn.querySelector("span[aria-hidden='true']")).not.toBeNull();
		});
	});

	// ── Interactive Card (interactive prop) ───────────────────────────────────

	describe("interactive card (interactive prop)", () => {
		it("renders a <button> when interactive=true even without onClick", () => {
			renderCard({ interactive: true });
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("has tabIndex={0} when interactive=true", () => {
			renderCard({ interactive: true });
			expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
		});
	});

	// ── Link Card (href) ───────────────────────────────────────────────────────

	describe("link card (href prop)", () => {
		it("renders an <a> tag when href is provided", () => {
			renderCard({ href: "/some-page" });
			expect(screen.getByRole("link")).toBeInTheDocument();
		});

		it("passes href attribute to the <a> element", () => {
			renderCard({ href: "/some-page" });
			expect(screen.getByRole("link")).toHaveAttribute("href", "/some-page");
		});

		it("adds rel='noreferrer' automatically when target='_blank'", () => {
			renderCard({ href: "https://example.com", target: "_blank" });
			expect(screen.getByRole("link")).toHaveAttribute("rel", "noreferrer");
		});

		it("does not add rel when target is not '_blank'", () => {
			renderCard({ href: "/internal", target: "_self" });
			expect(screen.getByRole("link")).not.toHaveAttribute("rel");
		});
	});

	// ── Disabled State ────────────────────────────────────────────────────────

	describe("disabled state", () => {
		it("static card: has aria-disabled when disabled=true", () => {
			const { container } = renderCard({ disabled: true });
			expect(container.firstChild).toHaveAttribute("aria-disabled", "true");
		});

		it("interactive card: has aria-disabled when disabled=true", () => {
			renderCard({ onClick: vi.fn(), disabled: true });
			expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
		});

		it("interactive card: has tabIndex=-1 when disabled", () => {
			renderCard({ onClick: vi.fn(), disabled: true });
			expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
		});

		it("interactive card: has 'pointer-events-none' class when disabled", () => {
			renderCard({ onClick: vi.fn(), disabled: true });
			expect(screen.getByRole("button").className).toContain("pointer-events-none");
		});

		it("interactive card: has 'opacity-[0.38]' class when disabled", () => {
			renderCard({ onClick: vi.fn(), disabled: true });
			expect(screen.getByRole("button").className).toMatch(/opacity-\[0\.38\]/);
		});

		it("link card: href is removed when disabled", () => {
			const { container } = renderCard({ href: "/page", disabled: true });
			// When disabled, href is set to undefined so the <a> has no href attribute.
			// Note: without href, the element loses its "link" role, so we query by tag.
			const anchor = container.querySelector("a");
			expect(anchor).toBeInTheDocument();
			expect(anchor).not.toHaveAttribute("href");
		});
	});

	// ── Variant Token Classes ─────────────────────────────────────────────────

	describe("variant token classes (MD3)", () => {
		it("elevated variant → bg-m3-surface-container-low", () => {
			const { container } = renderCard({ variant: "elevated" });
			expect(container.firstChild).toHaveClass("bg-m3-surface-container-low");
		});

		it("filled variant → bg-m3-surface-container-highest", () => {
			const { container } = renderCard({ variant: "filled" });
			expect(container.firstChild).toHaveClass("bg-m3-surface-container-highest");
		});

		it("outlined variant → bg-m3-surface + border-m3-outline-variant", () => {
			const { container } = renderCard({ variant: "outlined" });
			expect(container.firstChild).toHaveClass("bg-m3-surface");
			expect(container.firstChild).toHaveClass("border-m3-outline-variant");
		});
	});

	// ── A11y: prefers-reduced-motion ──────────────────────────────────────────

	describe("accessibility - reduced motion", () => {
		it("Ripple renders nothing when prefers-reduced-motion is active", () => {
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);
			renderCard({ onClick: vi.fn() });
			const btn = screen.getByRole("button");
			fireEvent.pointerDown(btn, { clientX: 5, clientY: 5 });
			expect(btn.querySelector("span[aria-hidden='true']")).toBeNull();
		});
	});
});
