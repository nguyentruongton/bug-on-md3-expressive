import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Icon } from "../ui/icon";

describe("Icon Component", () => {
	it("renders successfully with a name", () => {
		render(<Icon name="home" />);
		const icon = screen.getByText("home");
		expect(icon).toBeInTheDocument();
		expect(icon.tagName).toBe("SPAN");
	});

	it("applies default styles and attributes", () => {
		render(<Icon name="home" />);
		const icon = screen.getByText("home");

		expect(icon).toHaveClass("md-icon", "select-none");
		expect(icon).toHaveAttribute("aria-hidden", "true");

		expect(icon).toHaveStyle({
			fontFamily: "'Material Symbols Outlined'",
			fontSize: "24px",
			fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
		});
	});

	it("renders different variants correctly", () => {
		const { rerender } = render(<Icon name="home" variant="rounded" />);
		let icon = screen.getByText("home");
		expect(icon).toHaveStyle({ fontFamily: "'Material Symbols Rounded'" });

		rerender(<Icon name="home" variant="sharp" />);
		icon = screen.getByText("home");
		expect(icon).toHaveStyle({ fontFamily: "'Material Symbols Sharp'" });

		rerender(<Icon name="home" variant="outlined" />);
		icon = screen.getByText("home");
		expect(icon).toHaveStyle({ fontFamily: "'Material Symbols Outlined'" });
	});

	it("updates font-variation-settings based on axes props", () => {
		render(
			<Icon
				name="settings"
				fill={1}
				weight={700}
				grade={200}
				opticalSize={48}
			/>,
		);
		const icon = screen.getByText("settings");
		expect(icon).toHaveStyle({
			fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 48",
		});
	});

	it("overrides font-size when size prop is provided", () => {
		render(<Icon name="home" size={32} opticalSize={40} />);
		const icon = screen.getByText("home");
		expect(icon).toHaveStyle({ fontSize: "32px" });
		// Ensure opsz axis still uses opticalSize
		expect(icon.style.fontVariationSettings).toContain("'opsz' 40");
	});

	it("forwards ref correctly", () => {
		const ref = React.createRef<HTMLSpanElement>();
		render(<Icon name="home" ref={ref} />);
		expect(ref.current).not.toBeNull();
		expect(ref.current?.tagName).toBe("SPAN");
		expect(ref.current?.textContent).toBe("home");
	});

	it("renders with animateFill without crashing", () => {
		render(<Icon name="favorite" fill={1} animateFill />);
		const icon = screen.getByText("favorite");
		expect(icon).toBeInTheDocument();
		// In a jsdom environment, complex motion logic might not fully 'run'
		// but we verify the component renders and has the correct styles.
		const style = window.getComputedStyle(icon);
		expect(style.fontVariationSettings).toBe(
			"'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
		);
	});

	it("passes through extra HTML attributes", () => {
		render(<Icon name="home" data-testid="custom-icon" id="my-icon" />);
		const icon = screen.getByTestId("custom-icon");
		expect(icon).toHaveAttribute("id", "my-icon");
	});
});
