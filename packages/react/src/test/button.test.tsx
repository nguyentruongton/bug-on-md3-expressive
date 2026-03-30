import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../ui/button";

describe("Button Loading State", () => {
	it("does not render LoadingIndicator by default", () => {
		render(<Button>Submit</Button>);
		expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
	});

	it("renders LoadingIndicator when loading=true", () => {
		render(<Button loading>Submit</Button>);
		const progressbar = screen.getByRole("progressbar");
		expect(progressbar).toBeInTheDocument();
		expect(progressbar).toHaveAttribute("aria-label", "Loading");
	});

	it("applies aria-busy and aria-disabled when loading", () => {
		render(<Button loading>Submit</Button>);
		const button = screen.getByRole("button", { name: "Submit" });
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("prevents interactions when loading", async () => {
		const handleClick = vi.fn();
		render(
			<Button loading onClick={handleClick}>
				Submit
			</Button>,
		);

		const button = screen.getByRole("button", { name: "Submit" });
		await userEvent.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it("replaces leading icon with loading indicator", () => {
		const FakeIcon = <svg data-testid="fake-icon" />;

		const { rerender } = render(
			<Button icon={FakeIcon} iconPosition="leading">
				Submit
			</Button>,
		);
		expect(screen.getByTestId("fake-icon")).toBeInTheDocument();
		expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

		rerender(
			<Button loading icon={FakeIcon} iconPosition="leading">
				Submit
			</Button>,
		);
		expect(screen.queryByTestId("fake-icon")).not.toBeInTheDocument();
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	});
});
