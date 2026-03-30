/**
 * @file icon.test.tsx
 *
 * Unit tests for the Material Symbols <Icon /> component.
 *
 * Tests cover:
 *  - Correct text content (icon name as ligature)
 *  - Font-family for each variant (outlined / rounded / sharp)
 *  - font-variation-settings reflecting fill / weight / grade / opticalSize
 *  - aria-hidden attribute
 *  - className merging
 *  - Static render (plain span) vs animated render (motion span)
 *  - size prop overrides font-size independently of opticalSize
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the rendered span's inline style object. */
function getStyle(element: HTMLElement): CSSStyleDeclaration {
	return element.style;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Icon", () => {
	// ── Rendering ─────────────────────────────────────────────────────────────

	it("renders the icon name as text content", () => {
		render(<Icon name="home" />);
		expect(screen.getByText("home")).toBeInTheDocument();
	});

	it("renders the icon name with underscores intact", () => {
		render(<Icon name="arrow_forward" />);
		expect(screen.getByText("arrow_forward")).toBeInTheDocument();
	});

	// ── Accessibility ─────────────────────────────────────────────────────────

	it("sets aria-hidden='true' by default", () => {
		render(<Icon name="home" />);
		const el = screen.getByText("home");
		expect(el).toHaveAttribute("aria-hidden", "true");
	});

	// ── Variant font-family ───────────────────────────────────────────────────

	it("uses 'Material Symbols Outlined' font by default (outlined variant)", () => {
		render(<Icon name="home" />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontFamily).toContain("Material Symbols Outlined");
	});

	it("uses 'Material Symbols Rounded' for variant='rounded'", () => {
		render(<Icon name="home" variant="rounded" />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontFamily).toContain("Material Symbols Rounded");
	});

	it("uses 'Material Symbols Sharp' for variant='sharp'", () => {
		render(<Icon name="home" variant="sharp" />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontFamily).toContain("Material Symbols Sharp");
	});

	// ── Font size ─────────────────────────────────────────────────────────────

	it("defaults font-size to opticalSize (24px) when size is not provided", () => {
		render(<Icon name="home" />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontSize).toBe("24px");
	});

	it("uses explicit size prop for font-size (overrides opticalSize)", () => {
		render(<Icon name="home" size={18} opticalSize={20} />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontSize).toBe("18px");
	});

	it("applies opticalSize=48 as font-size when no explicit size given", () => {
		render(<Icon name="home" opticalSize={48} />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontSize).toBe("48px");
	});

	// ── font-variation-settings ───────────────────────────────────────────────

	it("applies default font-variation-settings (fill=0, wght=400, GRAD=0, opsz=24)", () => {
		render(<Icon name="home" />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontVariationSettings).toBe(
			"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
		);
	});

	it("reflects fill=1 in font-variation-settings", () => {
		render(<Icon name="favorite" fill={1} />);
		const style = getStyle(screen.getByText("favorite"));
		expect(style.fontVariationSettings).toContain("'FILL' 1");
	});

	it("reflects weight=700 in font-variation-settings", () => {
		render(<Icon name="home" weight={700} />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontVariationSettings).toContain("'wght' 700");
	});

	it("reflects grade=-25 in font-variation-settings", () => {
		render(<Icon name="home" grade={-25} />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontVariationSettings).toContain("'GRAD' -25");
	});

	it("reflects opticalSize=48 in font-variation-settings opsz axis", () => {
		render(<Icon name="home" opticalSize={48} />);
		const style = getStyle(screen.getByText("home"));
		expect(style.fontVariationSettings).toContain("'opsz' 48");
	});

	it("composes all axes correctly when all props are provided", () => {
		render(
			<Icon name="star" fill={1} weight={300} grade={200} opticalSize={40} />,
		);
		const style = getStyle(screen.getByText("star"));
		expect(style.fontVariationSettings).toBe(
			"'FILL' 1, 'wght' 300, 'GRAD' 200, 'opsz' 40",
		);
	});

	// ── className merging ─────────────────────────────────────────────────────

	it("includes 'md-icon' base class by default", () => {
		render(<Icon name="home" />);
		const el = screen.getByText("home");
		expect(el.className).toContain("md-icon");
	});

	it("merges additional className with md-icon", () => {
		render(<Icon name="home" className="text-primary" />);
		const el = screen.getByText("home");
		expect(el.className).toContain("md-icon");
		expect(el.className).toContain("text-primary");
	});

	// ── Static vs animated render ─────────────────────────────────────────────

	it("renders a plain <span> when animateFill is false (default)", () => {
		const { container } = render(<Icon name="home" />);
		// motion/react m.span renders as a <span> in DOM, but static span has no
		// data-framer / motion attributes injected. We check the element is a span.
		const el = container.querySelector("span");
		expect(el).not.toBeNull();
		expect(el?.textContent).toBe("home");
	});

	it("still renders as a span element when animateFill=true (motion renders span)", () => {
		const { container } = render(<Icon name="home" animateFill />);
		// m.span renders as a real <span> in DOM
		const el = container.querySelector("span");
		expect(el).not.toBeNull();
		expect(el?.textContent).toBe("home");
	});

	it("sets aria-hidden on animated span too", () => {
		render(<Icon name="home" animateFill />);
		const el = screen.getByText("home");
		expect(el).toHaveAttribute("aria-hidden", "true");
	});

	// ── style prop passthrough ────────────────────────────────────────────────

	it("merges custom style with computed style", () => {
		render(<Icon name="home" style={{ color: "red" }} />);
		const el = screen.getByText("home");
		expect(el.style.color).toBe("red");
		// Computed props still present
		expect(el.style.fontFamily).toContain("Material Symbols Outlined");
	});

	// ── displayName ───────────────────────────────────────────────────────────

	it("has displayName 'Icon'", () => {
		// React.memo wraps the component; access display name via the inner type
		// biome-ignore lint/suspicious/noExplicitAny: accessing React internals for testing
		expect((Icon as any).type?.displayName ?? (Icon as any).displayName).toBe(
			"Icon",
		);
	});
});
