"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FAB, FABPosition } from "./fab";

// ── Inline SVG test icon (no external deps) ───────────────────────────────────
const TestIcon = () => (
	<svg data-testid="test-icon" aria-hidden="true" viewBox="0 0 24 24" />
);

describe("FAB Component", () => {
	// ── Rendering cơ bản ─────────────────────────────────────────────────────

	it("renders without crashing with required props", () => {
		render(<FAB icon={<TestIcon />} aria-label="Test FAB" />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders with correct aria-label", () => {
		render(<FAB icon={<TestIcon />} aria-label="Chỉnh sửa" />);
		expect(screen.getByRole("button")).toHaveAttribute(
			"aria-label",
			"Chỉnh sửa",
		);
	});

	// ── Kích thước (size) ─────────────────────────────────────────────────────

	describe("size variants", () => {
		it("renders small (sm) size correctly", () => {
			render(<FAB icon={<TestIcon />} aria-label="FAB" size="sm" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("renders medium (md) size correctly", () => {
			render(<FAB icon={<TestIcon />} aria-label="Medium FAB" size="md" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("renders large (lg) size correctly", () => {
			render(<FAB icon={<TestIcon />} aria-label="Large FAB" size="lg" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("renders extra-large (xl) size correctly", () => {
			render(<FAB icon={<TestIcon />} aria-label="XL FAB" size="xl" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});

	// ── Màu sắc (colorStyle) ─────────────────────────────────────────────────

	describe("colorStyle variants", () => {
		const variants = ["primary", "secondary", "tertiary", "surface"] as const;

		for (const colorStyle of variants) {
			it(`renders colorStyle="${colorStyle}" without error`, () => {
				render(
					<FAB
						icon={<TestIcon />}
						aria-label={`FAB ${colorStyle}`}
						colorStyle={colorStyle}
					/>,
				);
				expect(screen.getByRole("button")).toBeInTheDocument();
			});
		}
	});

	// ── Interaction ───────────────────────────────────────────────────────────

	it("fires onClick when clicked", () => {
		const handleClick = vi.fn();
		render(
			<FAB icon={<TestIcon />} aria-label="Click me" onClick={handleClick} />,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("does NOT fire onClick when disabled", () => {
		const handleClick = vi.fn();
		render(
			<FAB
				icon={<TestIcon />}
				aria-label="Disabled FAB"
				disabled
				onClick={handleClick}
			/>,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});

	// ── Loading state ─────────────────────────────────────────────────────────

	it("shows LoadingIndicator when loading=true", () => {
		render(<FAB icon={<TestIcon />} aria-label="Loading FAB" loading />);
		// Icon bị ẩn; loading indicator được render
		expect(screen.queryByTestId("test-icon")).not.toBeInTheDocument();
		// aria-busy được set khi loading
		expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
	});

	it("shows icon when loading=false", () => {
		render(<FAB icon={<TestIcon />} aria-label="Normal FAB" loading={false} />);
		expect(screen.getByTestId("test-icon")).toBeInTheDocument();
		expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
	});

	// ── Ripple ───────────────────────────────────────────────────────────────

	it("does NOT add ripple when disabled", () => {
		render(<FAB icon={<TestIcon />} aria-label="Disabled FAB" disabled />);
		const button = screen.getByRole("button");
		// When disabled=true, the button should be present with disabled state
		expect(button).toHaveAttribute("aria-disabled", "true");
		// The ripple layer has no active ripple spans (data-ripple attribute)
		expect(button.querySelectorAll("[data-ripple]")).toHaveLength(0);
	});

	// ── Visible prop ──────────────────────────────────────────────────────────

	it("renders button when visible=true", () => {
		render(<FAB icon={<TestIcon />} aria-label="Visible FAB" visible={true} />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("does not render button when visible=false", () => {
		render(<FAB icon={<TestIcon />} aria-label="Hidden FAB" visible={false} />);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	// ── Lowered state ─────────────────────────────────────────────────────────

	it("applies lowered shadow classes when lowered=true", () => {
		render(<FAB icon={<TestIcon />} aria-label="Lowered FAB" lowered />);
		const button = screen.getByRole("button");
		// Khi lowered=true, cva sẽ áp dụng lớp shadow-sm thay shadow-md
		expect(button.className).toContain("shadow-sm");
	});

	// ── Keyboard navigation ────────────────────────────────────────────────────

	describe("keyboard navigation", () => {
		it("triggers onClick when Enter is pressed", () => {
			const handleClick = vi.fn();
			render(
				<FAB
					icon={<TestIcon />}
					aria-label="Enter Key"
					onClick={handleClick}
				/>,
			);
			const button = screen.getByRole("button");
			button.focus();
			fireEvent.keyDown(button, { key: "Enter" });
			expect(handleClick).toHaveBeenCalled();
		});

		it("triggers onClick when Space is pressed", () => {
			const handleClick = vi.fn();
			render(
				<FAB
					icon={<TestIcon />}
					aria-label="Space Key"
					onClick={handleClick}
				/>,
			);
			const button = screen.getByRole("button");
			button.focus();
			fireEvent.keyDown(button, { key: " " });
			expect(handleClick).toHaveBeenCalled();
		});
	});

	// ── FABPosition helper component ──────────────────────────────────────────

	describe("FABPosition", () => {
		it("renders children with absolute positioning", () => {
			const { container } = render(
				<FABPosition>
					<FAB icon={<TestIcon />} aria-label="FAB in position" />
				</FABPosition>,
			);
			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper).toBeInTheDocument();
			expect(wrapper.className).toContain("absolute");
		});

		it("applies z-10 class by default", () => {
			const { container } = render(
				<FABPosition>
					<FAB icon={<TestIcon />} aria-label="FAB" />
				</FABPosition>,
			);
			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper.className).toContain("z-10");
		});

		it("renders bottom-right position by default", () => {
			const { container } = render(
				<FABPosition position="bottom-right">
					<FAB icon={<TestIcon />} aria-label="FAB" />
				</FABPosition>,
			);
			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper.className).toContain("bottom-4");
			expect(wrapper.className).toContain("right-4");
		});

		it("renders bottom-left position", () => {
			const { container } = render(
				<FABPosition position="bottom-left">
					<FAB icon={<TestIcon />} aria-label="FAB" />
				</FABPosition>,
			);
			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper.className).toContain("left-4");
		});

		it("renders children correctly", () => {
			render(
				<FABPosition>
					<FAB icon={<TestIcon />} aria-label="Positioned FAB" />
				</FABPosition>,
			);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});
});
