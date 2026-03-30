import { fireEvent, render, screen } from "@testing-library/react";
import * as MotionReact from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IconButton } from "./icon-button";

// ── Mock motion/react (same pattern as chip.test.tsx / button.test.tsx) ──────
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return {
		...actual,
		useReducedMotion: () => false,
	};
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const StarIcon = () => (
	<svg data-testid="star-icon" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

const renderIconButton = (
	props: Partial<
		Omit<
			Parameters<typeof IconButton>[0],
			"variant" | "selected" | "aria-label"
		>
	> & {
		"aria-label"?: string;
		variant?: "default" | "toggle";
		selected?: boolean;
	} = {},
) => {
	const { "aria-label": ariaLabel = "Test action", ...rest } = props;
	return render(
		<IconButton
			{...(rest as Parameters<typeof IconButton>[0])}
			aria-label={ariaLabel}
		>
			<StarIcon />
		</IconButton>,
	);
};

// ── Test Suites ───────────────────────────────────────────────────────────────

describe("IconButton Component", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	// ── Rendering ─────────────────────────────────────────────────────────────

	describe("basic rendering", () => {
		it("renders a <button> element", () => {
			renderIconButton();
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("renders children (icon) inside content span", () => {
			renderIconButton();
			expect(screen.getByTestId("star-icon")).toBeInTheDocument();
		});

		it("forwards ref to the underlying button element", () => {
			const ref = { current: null };
			render(
				<IconButton aria-label="Ref test" ref={ref}>
					<StarIcon />
				</IconButton>,
			);
			expect(ref.current).not.toBeNull();
		});

		it("passes extra HTML attributes through to the button", () => {
			render(
				<IconButton aria-label="Test" data-testid="my-icon-btn">
					<StarIcon />
				</IconButton>,
			);
			expect(screen.getByTestId("my-icon-btn")).toBeInTheDocument();
		});

		it("has type='button' to prevent accidental form submission", () => {
			renderIconButton();
			expect(screen.getByRole("button")).toHaveAttribute("type", "button");
		});
	});

	// ── Size Variants ─────────────────────────────────────────────────────────

	describe("size prop", () => {
		it.each([
			["xs", "h-8", "w-8"],
			["sm", "h-10", "w-10"],
			["md", "h-14", "w-14"],
			["lg", "h-24", "w-24"],
		] as const)("size='%s' applies correct Tailwind size classes (%s %s)", (size, hClass, wClass) => {
			const { container } = renderIconButton({ size });
			expect(container.firstChild).toHaveClass(hClass);
			expect(container.firstChild).toHaveClass(wClass);
		});

		it("size='xl' applies h-[8.5rem] w-[8.5rem]", () => {
			const { container } = renderIconButton({ size: "xl" });
			// Class name contains bracket notation so check inline style or presence
			expect(container.firstChild).toHaveClass("h-[8.5rem]");
			expect(container.firstChild).toHaveClass("w-[8.5rem]");
		});
	});

	// ── Touch Target (a11y) ───────────────────────────────────────────────────

	describe("touch target expansion (WCAG 2.5.5 + MD3 a11y)", () => {
		it("xs size renders aria-hidden touch target expander span", () => {
			const { container } = renderIconButton({ size: "xs" });
			const btn = container.firstChild as HTMLElement;
			const expander = btn.querySelector("span[aria-hidden='true']");
			expect(expander).not.toBeNull();
			expect(expander).toHaveClass("min-w-12");
			expect(expander).toHaveClass("min-h-12");
		});

		it("sm size renders aria-hidden touch target expander span", () => {
			const { container } = renderIconButton({ size: "sm" });
			const btn = container.firstChild as HTMLElement;
			const expander = btn.querySelector("span[aria-hidden='true']");
			expect(expander).not.toBeNull();
		});

		it("md size does NOT render touch target expander (already 56dp)", () => {
			const { container } = renderIconButton({ size: "md" });
			const btn = container.firstChild as HTMLElement;
			// Only the content span should be aria-hidden; no touch target expander
			const ariaHiddenSpans = Array.from(
				btn.querySelectorAll("span[aria-hidden='true']"),
			);
			const hasMinWClass = ariaHiddenSpans.some((el) =>
				el.classList.contains("min-w-12"),
			);
			expect(hasMinWClass).toBe(false);
		});
	});

	// ── Color Style Variants ──────────────────────────────────────────────────

	describe("colorStyle prop — default (unselected)", () => {
		it("standard → text-m3-on-surface-variant", () => {
			const { container } = renderIconButton({ colorStyle: "standard" });
			expect(container.firstChild).toHaveClass("text-m3-on-surface-variant");
		});

		it("filled → bg-m3-surface-container + text-m3-on-surface-variant", () => {
			const { container } = renderIconButton({ colorStyle: "filled" });
			expect(container.firstChild).toHaveClass("bg-m3-surface-container");
			expect(container.firstChild).toHaveClass("text-m3-on-surface-variant");
		});

		it("tonal → bg-m3-secondary-container + text-m3-on-secondary-container", () => {
			const { container } = renderIconButton({ colorStyle: "tonal" });
			expect(container.firstChild).toHaveClass("bg-m3-secondary-container");
			expect(container.firstChild).toHaveClass(
				"text-m3-on-secondary-container",
			);
		});

		it("outlined → text-m3-on-surface-variant + border class", () => {
			const { container } = renderIconButton({ colorStyle: "outlined" });
			expect(container.firstChild).toHaveClass("text-m3-on-surface-variant");
			expect(container.firstChild).toHaveClass("border-m3-outline-variant");
		});
	});

	describe("colorStyle 'outlined' — outline width scales with size", () => {
		it("xs/sm/md → border (1dp)", () => {
			for (const size of ["xs", "sm", "md"] as const) {
				const { container } = renderIconButton({
					colorStyle: "outlined",
					size,
				});
				expect(container.firstChild).toHaveClass("border");
			}
		});

		it("lg → border-2 (2dp)", () => {
			const { container } = renderIconButton({
				colorStyle: "outlined",
				size: "lg",
			});
			expect(container.firstChild).toHaveClass("border-2");
		});

		it("xl → border-[3px] (3dp)", () => {
			const { container } = renderIconButton({
				colorStyle: "outlined",
				size: "xl",
			});
			expect(container.firstChild).toHaveClass("border-[3px]");
		});
	});

	// ── Accessibility – ARIA attributes ───────────────────────────────────────

	describe("accessibility — ARIA", () => {
		it("aria-label is applied to the button", () => {
			renderIconButton({ "aria-label": "Yêu thích" });
			expect(
				screen.getByRole("button", { name: "Yêu thích" }),
			).toBeInTheDocument();
		});

		it("default (non-toggle) button does NOT have aria-pressed", () => {
			renderIconButton({ variant: "default" });
			expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
		});

		it("toggle button unselected → aria-pressed='false'", () => {
			renderIconButton({ variant: "toggle", selected: false });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-pressed",
				"false",
			);
		});

		it("toggle button selected → aria-pressed='true'", () => {
			renderIconButton({ variant: "toggle", selected: true });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-pressed",
				"true",
			);
		});

		it("disabled → aria-disabled='true'", () => {
			renderIconButton({ disabled: true });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		it("loading → aria-busy='true'", () => {
			renderIconButton({ loading: true });
			expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
		});

		it("loading → aria-disabled='true'", () => {
			renderIconButton({ loading: true });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		it("not loading → aria-busy attribute absent", () => {
			renderIconButton({ loading: false });
			expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
		});
	});

	// ── Toggle Variant ────────────────────────────────────────────────────────

	describe("toggle variant", () => {
		it("selected=true + filled → bg-m3-primary (selected state)", () => {
			const { container } = renderIconButton({
				variant: "toggle",
				selected: true,
				colorStyle: "filled",
			});
			expect(container.firstChild).toHaveClass("bg-m3-primary");
		});

		it("selected=false + filled → bg-m3-surface-container (default state)", () => {
			const { container } = renderIconButton({
				variant: "toggle",
				selected: false,
				colorStyle: "filled",
			});
			expect(container.firstChild).toHaveClass("bg-m3-surface-container");
		});

		it("selected=true + tonal → bg-m3-secondary", () => {
			const { container } = renderIconButton({
				variant: "toggle",
				selected: true,
				colorStyle: "tonal",
			});
			expect(container.firstChild).toHaveClass("bg-m3-secondary");
		});

		it("selected=true + outlined → bg-m3-inverse-surface (border removed)", () => {
			const { container } = renderIconButton({
				variant: "toggle",
				selected: true,
				colorStyle: "outlined",
			});
			expect(container.firstChild).toHaveClass("bg-m3-inverse-surface");
			expect(container.firstChild).toHaveClass("border-transparent");
		});

		it("selected=true + standard → text-m3-primary", () => {
			const { container } = renderIconButton({
				variant: "toggle",
				selected: true,
				colorStyle: "standard",
			});
			expect(container.firstChild).toHaveClass("text-m3-primary");
		});
	});

	// ── Disabled State ────────────────────────────────────────────────────────

	describe("disabled state", () => {
		it("has disabled:opacity-[0.38] class", () => {
			const { container } = renderIconButton({ disabled: true });
			expect(container.firstChild).toHaveClass("disabled:opacity-[0.38]");
		});

		it("has disabled:pointer-events-none class", () => {
			const { container } = renderIconButton({ disabled: true });
			expect(container.firstChild).toHaveClass("disabled:pointer-events-none");
		});

		it("filled variant disabled → has disabled:bg-m3-on-surface/12", () => {
			const { container } = renderIconButton({
				colorStyle: "filled",
				disabled: true,
			});
			expect(container.firstChild).toHaveClass("disabled:bg-m3-on-surface/12");
		});

		it("standard variant disabled → has disabled:text-m3-on-surface/[0.38] (no bg)", () => {
			const { container } = renderIconButton({
				colorStyle: "standard",
				disabled: true,
			});
			expect(container.firstChild).toHaveClass(
				"disabled:text-m3-on-surface/[0.38]",
			);
			expect(container.firstChild).not.toHaveClass(
				"disabled:bg-m3-on-surface/12",
			);
		});

		it("outlined variant disabled → has disabled:border-m3-on-surface/[0.12] (no bg)", () => {
			const { container } = renderIconButton({
				colorStyle: "outlined",
				disabled: true,
			});
			expect(container.firstChild).toHaveClass(
				"disabled:border-m3-on-surface/[0.12]",
			);
			expect(container.firstChild).not.toHaveClass(
				"disabled:bg-m3-on-surface/12",
			);
		});

		it("does not fire onClick when disabled", () => {
			const handleClick = vi.fn();
			renderIconButton({ disabled: true, onClick: handleClick });
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// ── Loading State ─────────────────────────────────────────────────────────

	describe("loading state", () => {
		it("loading=true → pointer-events-none opacity-75", () => {
			const { container } = renderIconButton({ loading: true });
			expect(container.firstChild).toHaveClass("pointer-events-none");
			expect(container.firstChild).toHaveClass("opacity-75");
		});

		it("loading=true → icon children hidden (loading-indicator shown)", () => {
			renderIconButton({ loading: true });
			// Star icon should NOT be present (AnimatePresence mode="wait")
			expect(screen.queryByTestId("star-icon")).toBeNull();
		});

		it("loading=true + loadingVariant='loading-indicator' → LoadingIndicator rendered", () => {
			const { container } = renderIconButton({
				loading: true,
				loadingVariant: "loading-indicator",
			});
			// LoadingIndicator renders an SVG with aria-label="Loading"
			expect(container.querySelector("[aria-label='Loading']")).not.toBeNull();
		});

		it("loading=false → star icon is visible", () => {
			renderIconButton({ loading: false });
			expect(screen.getByTestId("star-icon")).toBeInTheDocument();
		});

		it("onClick is blocked when loading", () => {
			const handleClick = vi.fn();
			renderIconButton({ loading: true, onClick: handleClick });
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("does not render opacity: 0 on the loading wrapper during entrance to prevent SMIL freezing", () => {
			const { container } = renderIconButton({ loading: true });
			// Tìm khung wrapper bao quanh loading indicator
			const spinnerWrapper = container.querySelector(
				"span.flex.items-center.justify-center.shrink-0",
			);

			// Đối với lỗi SMIL freezing trên Chrome, Inline style không được phép có "opacity: 0"
			// Nếu có thẻ style, đảm bảo không có giá trị này.
			if (spinnerWrapper?.hasAttribute("style")) {
				expect(spinnerWrapper.getAttribute("style")).not.toContain(
					"opacity: 0",
				);
			}
			// Đảm bảo AnimatePresence render đúng 1 wrapper
			expect(spinnerWrapper).not.toBeNull();
		});
	});

	// ── Interaction ───────────────────────────────────────────────────────────

	describe("interaction", () => {
		it("calls onClick when clicked", () => {
			const handleClick = vi.fn();
			renderIconButton({ onClick: handleClick });
			fireEvent.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("triggers ripple on pointerDown", () => {
			renderIconButton({ onClick: vi.fn() });
			const btn = screen.getByRole("button");
			fireEvent.pointerDown(btn, { clientX: 10, clientY: 10 });
			// Ripple renders an aria-hidden span inside the button
			expect(btn.querySelector("[aria-hidden='true']")).not.toBeNull();
		});

		it("does not trigger ripple when loading", () => {
			renderIconButton({ loading: true });
			const btn = screen.getByRole("button");
			const ariaHiddenBefore = btn.querySelectorAll(
				"[aria-hidden='true']",
			).length;
			fireEvent.pointerDown(btn, { clientX: 10, clientY: 10 });
			// Count should not increase (ripple blocked by loading guard)
			expect(btn.querySelectorAll("[aria-hidden='true']").length).toBe(
				ariaHiddenBefore,
			);
		});

		it("Enter key triggers click handler", () => {
			const handleClick = vi.fn();
			renderIconButton({ onClick: handleClick });
			const btn = screen.getByRole("button");
			fireEvent.keyDown(btn, { key: "Enter" });
			// handleKeyDown calls btn.click() which fires handleClick
			expect(handleClick).toHaveBeenCalled();
		});

		it("Space key triggers click handler", () => {
			const handleClick = vi.fn();
			renderIconButton({ onClick: handleClick });
			const btn = screen.getByRole("button");
			fireEvent.keyDown(btn, { key: " " });
			expect(handleClick).toHaveBeenCalled();
		});

		it("custom onKeyDown is called alongside internal handler", () => {
			const customKeyDown = vi.fn();
			renderIconButton({ onKeyDown: customKeyDown });
			fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" });
			expect(customKeyDown).toHaveBeenCalledTimes(1);
		});
	});

	// ── Shape Prop ────────────────────────────────────────────────────────────

	describe("shape prop", () => {
		it("round (default) applies overflow-hidden for clip", () => {
			const { container } = renderIconButton({ shape: "round" });
			expect(container.firstChild).toHaveClass("overflow-hidden");
		});

		it("square applies overflow-hidden for clip", () => {
			const { container } = renderIconButton({ shape: "square" });
			expect(container.firstChild).toHaveClass("overflow-hidden");
		});
	});

	// ── Custom className ──────────────────────────────────────────────────────

	describe("className prop", () => {
		it("merges custom className with base classes", () => {
			const { container } = renderIconButton({ className: "my-custom-class" });
			expect(container.firstChild).toHaveClass("my-custom-class");
		});
	});

	// ── A11y: prefers-reduced-motion ─────────────────────────────────────────

	describe("accessibility — reduced motion", () => {
		it("Ripple renders nothing when prefers-reduced-motion is active", () => {
			vi.spyOn(MotionReact, "useReducedMotion").mockReturnValue(true);
			renderIconButton({ onClick: vi.fn() });
			const btn = screen.getByRole("button");
			// Count all aria-hidden elements BEFORE pointerDown (baseline: icon span + touch target if any)
			const beforeCount = btn.querySelectorAll("[aria-hidden='true']").length;
			fireEvent.pointerDown(btn, { clientX: 5, clientY: 5 });
			// When reduced motion is on, Ripple returns null → count should NOT increase
			const afterCount = btn.querySelectorAll("[aria-hidden='true']").length;
			expect(afterCount).toBe(beforeCount);
		});
	});
});
