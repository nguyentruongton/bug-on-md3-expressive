import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";

describe("ButtonGroup Component", () => {
	it("renders children correctly", () => {
		render(
			<ButtonGroup>
				<Button>One</Button>
				<Button>Two</Button>
			</ButtonGroup>,
		);
		expect(screen.getByText("One")).toBeInTheDocument();
		expect(screen.getByText("Two")).toBeInTheDocument();
	});

	it("applies gap-2 for standard variant by default", () => {
		const { container } = render(
			<ButtonGroup>
				<Button>One</Button>
				<Button>Two</Button>
			</ButtonGroup>,
		);
		const fieldset = container.querySelector("fieldset");
		expect(fieldset).toHaveClass("gap-2");
	});

	it("applies gap-0.5 for connected variant", () => {
		const { container } = render(
			<ButtonGroup variant="connected">
				<Button>One</Button>
				<Button>Two</Button>
			</ButtonGroup>,
		);
		const fieldset = container.querySelector("fieldset");
		expect(fieldset).toHaveClass("gap-0.5");
	});

	it("passes size prop to children to enforce uniformity", () => {
		const { container } = render(
			<ButtonGroup size="lg">
				{/* Even if child specifies sm, the group's lg should override or inject */}
				<Button size="sm">One</Button>
				<Button>Two</Button>
			</ButtonGroup>,
		);

		const buttons = container.querySelectorAll("button");
		// SIZE_PADDING_MAP["lg"] is "3rem" in button.tsx (roughly corresponding to h-14/px-6 class)
		// We can check if the inner-radius variable is correctly injected (lg -> 16px)
		expect(buttons[0]).toHaveStyle({ "--m3-inner-rad": "16px" });
		expect(buttons[1]).toHaveStyle({ "--m3-inner-rad": "16px" });
	});

	it("applies morphing transition style to connected buttons by default", () => {
		const { container } = render(
			<ButtonGroup variant="connected">
				<Button>One</Button>
				<Button>Two</Button>
			</ButtonGroup>,
		);

		const buttons = container.querySelectorAll("button");
		// Check that the custom transition is injected via style
		const expectedTransition = "border-top-left-radius 0.25s cubic-bezier(0.2, 0, 0, 1), border-top-right-radius 0.25s cubic-bezier(0.2, 0, 0, 1), border-bottom-right-radius 0.25s cubic-bezier(0.2, 0, 0, 1), border-bottom-left-radius 0.25s cubic-bezier(0.2, 0, 0, 1), padding 0.2s cubic-bezier(0.2, 0, 0, 1), flex 0.2s cubic-bezier(0.2, 0, 0, 1)";
		expect(buttons[0]).toHaveStyle({ transition: expectedTransition });
		expect(buttons[1]).toHaveStyle({ transition: expectedTransition });
	});
});
