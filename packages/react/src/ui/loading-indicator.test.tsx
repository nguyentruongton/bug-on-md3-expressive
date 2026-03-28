import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingIndicator } from "./loading-indicator";

describe("LoadingIndicator Component", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(window, "requestAnimationFrame").mockImplementation(
			(cb: FrameRequestCallback) => {
				return setTimeout(() => cb(Date.now()), 16) as unknown as number;
			},
		);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
			(id: number) => {
				clearTimeout(id);
			},
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("renders an <svg> element with correct structure", () => {
		const { container } = render(
			<LoadingIndicator size={24} aria-label="Loading" />,
		);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("viewBox", "4 4 40 40");
		expect(svg).toHaveAttribute("width", "24");
		expect(svg).toHaveAttribute("height", "24");
	});

	it("delays rendering of <animate> tags by 1 frame to prevent SMIL freezing", async () => {
		const { container } = render(<LoadingIndicator aria-label="Loading" />);
		const svg = container.querySelector("svg");
		
		// Ngay Frame 0 (lúc thẻ SVG vừa vẽ lên DOM), chưa được phép có <animate> 
		// để tránh đụng độ Chromium layout optimization (culling) gây tê liệt animation
		expect(svg?.querySelector("animate")).toBeNull();
		expect(svg?.querySelector("animateTransform")).toBeNull();

		// Tua nhanh thời gian vượt qua 16ms để giả lập hoàn tất requestAnimationFrame
		await act(async () => {
			vi.advanceTimersByTime(20);
		});

		// Sang Frame 1, thẻ <animate> phải được inject vào trong DOM để khởi sinh đồng hồ SMIL
		expect(svg?.querySelector("animate")).not.toBeNull();
		expect(svg?.querySelector("animateTransform")).not.toBeNull();
		expect(svg?.querySelector("animate")?.getAttribute("attributeName")).toBe("d");
		expect(svg?.querySelector("animateTransform")?.getAttribute("attributeName")).toBe("transform");
	});

	it("supports custom size and color", () => {
		const { container } = render(
			<LoadingIndicator size={48} color="red" aria-label="Loading" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		const svg = container.querySelector("svg");
		expect(svg).toHaveAttribute("width", "48");
		expect(svg).toHaveAttribute("height", "48");
		
		const styleStr = wrapper.getAttribute("style") || "";
		expect(styleStr).toMatch(/color:\s*(red|rgb\(255,\s*0,\s*0\))/);
	});
});
