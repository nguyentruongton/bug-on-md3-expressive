"use client";

import { render, screen } from "@testing-library/react";
import * as MotionReact from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildWavePath, Divider } from "./divider";

// Mock motion/react — same pattern as badge.test.tsx / chip.test.tsx
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return {
		...actual,
		useReducedMotion: () => false,
	};
});

// ── Test Suites ───────────────────────────────────────────────────────────────

describe("Divider", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	// ── Core Accessibility ──────────────────────────────────────────────────────

	describe("core accessibility", () => {
		it("renders with role='separator' by default", () => {
			render(<Divider />);
			expect(screen.getByRole("separator")).toBeInTheDocument();
		});

		it("has aria-orientation='horizontal' by default", () => {
			render(<Divider />);
			expect(screen.getByRole("separator")).toHaveAttribute(
				"aria-orientation",
				"horizontal",
			);
		});

		it("vertical orientation sets aria-orientation='vertical'", () => {
			render(<Divider orientation="vertical" />);
			expect(screen.getByRole("separator")).toHaveAttribute(
				"aria-orientation",
				"vertical",
			);
		});

		it("decorative=true adds aria-hidden='true'", () => {
			const { container } = render(<Divider decorative />);
			const divider = container.firstChild as HTMLElement;
			expect(divider).toHaveAttribute("aria-hidden", "true");
		});

		it("decorative=true removes role='separator'", () => {
			render(<Divider decorative />);
			expect(screen.queryByRole("separator")).toBeNull();
		});
	});

	// ── Variants ────────────────────────────────────────────────────────────────

	describe("variants", () => {
		it("full-bleed → no indent classes", () => {
			render(<Divider variant="full-bleed" />);
			const el = screen.getByRole("separator");
			expect(el.className).not.toMatch(/ml-|mx-|mt-|my-/);
		});

		it("inset + insetStart='standard' → has class 'ml-4'", () => {
			render(<Divider variant="inset" insetStart="standard" />);
			const el = screen.getByRole("separator");
			expect(el.className).toContain("ml-4");
		});

		it("inset + insetStart='icon' → has class 'ml-[72px]'", () => {
			render(<Divider variant="inset" insetStart="icon" />);
			const el = screen.getByRole("separator");
			expect(el.className).toContain("ml-[72px]");
		});

		it("middle-inset → has class 'mx-4'", () => {
			render(<Divider variant="middle-inset" />);
			const el = screen.getByRole("separator");
			expect(el.className).toContain("mx-4");
		});

		it("subheader → no indent classes (same as full-bleed)", () => {
			render(<Divider variant="subheader" />);
			const el = screen.getByRole("separator");
			expect(el.className).not.toMatch(/ml-|mx-|mt-|my-/);
		});
	});

	// ── Shape: flat ─────────────────────────────────────────────────────────────

	describe("shape: flat", () => {
		it("renders a div element (not svg)", () => {
			const { container } = render(<Divider shape="flat" />);
			// LazyMotion wrapper is present; the animated element is a div
			const svg = container.querySelector("svg");
			expect(svg).toBeNull();
		});

		it("has class 'bg-m3-outline-variant'", () => {
			render(<Divider shape="flat" />);
			const el = screen.getByRole("separator");
			expect(el.className).toContain("bg-m3-outline-variant");
		});

		it("horizontal → has class 'h-px'", () => {
			render(<Divider shape="flat" orientation="horizontal" />);
			const el = screen.getByRole("separator");
			expect(el.className).toContain("h-px");
		});

		it("vertical → has class 'w-px'", () => {
			render(<Divider shape="flat" orientation="vertical" />);
			const el = screen.getByRole("separator");
			expect(el.className).toContain("w-px");
		});
	});

	// ── Shape: wavy ─────────────────────────────────────────────────────────────

	describe("shape: wavy", () => {
		it("renders an svg element", () => {
			const { container } = render(<Divider shape="wavy" />);
			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();
		});

		it("svg contains a path element with d attribute starting with 'M'", () => {
			const { container } = render(<Divider shape="wavy" />);
			const path = container.querySelector("path");
			expect(path).toBeInTheDocument();
			expect(path?.getAttribute("d")).toMatch(/^M/);
		});

		it("wavy path has strokeLinecap='round' for rounded ends", () => {
			const { container } = render(<Divider shape="wavy" />);
			const path = container.querySelector("path");
			expect(path?.getAttribute("stroke-linecap")).toBe("round");
		});

		it("wavy renders direct <path> — no <pattern> element", () => {
			const { container } = render(<Divider shape="wavy" />);
			expect(container.querySelector("pattern")).toBeNull();
			expect(container.querySelector("defs")).toBeNull();
		});

		it("wavy + vertical → falls back to flat (no svg rendered)", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const { container } = render(
				<Divider shape="wavy" orientation="vertical" />,
			);
			const svg = container.querySelector("svg");
			expect(svg).toBeNull();
			warnSpy.mockRestore();
		});

		it("wavy + vertical → emits console.warn", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			render(<Divider shape="wavy" orientation="vertical" />);
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"shape='wavy' is not supported with orientation='vertical'",
				),
			);
			warnSpy.mockRestore();
		});

		it("custom waveConfig → renders without error", () => {
			expect(() => {
				render(
					<Divider
						shape="wavy"
						waveConfig={{ amplitude: 5, wavelength: 24 }}
					/>,
				);
			}).not.toThrow();
		});
	});

	// ── buildWavePath Helper ────────────────────────────────────────────────────

	describe("buildWavePath helper", () => {
		it("returns a string starting with 'M {startX},{yCenter}'", () => {
			// New signature: buildWavePath(startX, endX, amplitude, wavelength, yCenter)
			const d = buildWavePath(0, 64, 3, 16, 4);
			expect(d).toMatch(/^M 0,4/);
		});

		it("respects non-zero startX", () => {
			const d = buildWavePath(0.5, 100, 2, 32, 4);
			expect(d).toMatch(/^M 0\.5,4/);
		});

		it("contains 'C' (cubic Bézier curves)", () => {
			const d = buildWavePath(0, 64, 3, 16, 4);
			expect(d).toContain("C");
		});

		it("produces path with monotonically increasing X coordinates", () => {
			const d = buildWavePath(0, 64, 3, 16, 4);
			const parts = d.replace(/[MC]/g, " ").trim().split(/\s+/);
			const xValues: number[] = [];
			for (let i = 0; i < parts.length; i += 2) {
				const x = parseFloat(parts[i] ?? "");
				if (!Number.isNaN(x)) xValues.push(x);
			}
			expect(xValues.length).toBeGreaterThan(0);
			expect(xValues[xValues.length - 1]).toBeGreaterThan(xValues[0] ?? 0);
		});

		it("returns empty string when startX >= endX", () => {
			expect(buildWavePath(0, 0)).toBe("");
			expect(buildWavePath(10, 5)).toBe("");
			expect(buildWavePath(0, -10)).toBe("");
		});

		it("respects custom amplitude and wavelength", () => {
			const d = buildWavePath(0, 32, 5, 8, 5);
			expect(d).toMatch(/^M 0,5/);
		});

		it("path ends exactly at endX", () => {
			const d = buildWavePath(0, 64, 2, 32, 4);
			// Last coordinate pair in the path should be endX,yCenter
			const match = d.match(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/);
			expect(Number(match?.[1])).toBe(64);
			expect(Number(match?.[2])).toBe(4);
		});
	});

	// ── Props Forwarding ────────────────────────────────────────────────────────

	describe("props forwarding", () => {
		it("custom className is merged via cn()", () => {
			render(<Divider className="my-custom-divider" />);
			const el = screen.getByRole("separator");
			expect(el).toHaveClass("my-custom-divider");
			// Also retains base classes
			expect(el.className).toContain("bg-m3-outline-variant");
		});

		it("style prop is forwarded to the root element", () => {
			render(<Divider style={{ opacity: 0.5 }} />);
			const el = screen.getByRole("separator");
			expect(el.style.opacity).toBe("0.5");
		});

		it("ref forwarding works for flat divider (div element)", () => {
			const ref = { current: null };
			render(<Divider ref={ref} />);
			expect(ref.current).not.toBeNull();
			expect((ref.current as unknown as HTMLElement).tagName).toBe("DIV");
		});

		it("ref forwarding works for wavy divider (outer div element)", () => {
			const ref = { current: null };
			render(<Divider ref={ref} shape="wavy" />);
			expect(ref.current).not.toBeNull();
			// Wavy forwards ref to the outer wrapper div
			expect((ref.current as unknown as HTMLElement).tagName).toBe("DIV");
		});
	});

	// ── Reduced Motion ──────────────────────────────────────────────────────────

	describe("prefers-reduced-motion", () => {
		it("renders correctly when useReducedMotion returns true", () => {
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);
			render(<Divider />);
			expect(screen.getByRole("separator")).toBeInTheDocument();
		});

		it("wavy renders correctly when useReducedMotion returns true", () => {
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);
			const { container } = render(<Divider shape="wavy" />);
			expect(container.querySelector("svg")).toBeInTheDocument();
		});
	});

	// ── Snapshots ───────────────────────────────────────────────────────────────

	describe("snapshots", () => {
		it("flat/horizontal (default)", () => {
			const { container } = render(<Divider />);
			expect(container.firstChild).toMatchSnapshot();
		});

		it("flat/vertical", () => {
			const { container } = render(<Divider orientation="vertical" />);
			expect(container.firstChild).toMatchSnapshot();
		});

		it("wavy", () => {
			const { container } = render(<Divider shape="wavy" />);
			expect(container.firstChild).toMatchSnapshot();
		});

		it("inset", () => {
			const { container } = render(
				<Divider variant="inset" insetStart="standard" />,
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		it("middle-inset", () => {
			const { container } = render(<Divider variant="middle-inset" />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});
});
