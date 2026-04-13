import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SmallAppBar } from "./small-app-bar";

describe("SmallAppBar", () => {
	it("renders correctly with basic props", () => {
		render(
			<SmallAppBar
				title="Inbox"
			/>
		);

		const header = screen.getByRole("banner");
		expect(header).toBeInTheDocument();

		const titleElement = screen.getByText("Inbox");
		expect(titleElement).toBeInTheDocument();
	});

	it("renders subtitle, actions, and navigationIcon", () => {
		render(
			<SmallAppBar
				title="Profile"
				subtitle="@username"
				navigationIcon={<button data-testid="nav-icon">Back</button>}
				actions={<button data-testid="actions-btn">Search</button>}
			/>
		);

		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByText("@username")).toBeInTheDocument();
		expect(screen.getByTestId("nav-icon")).toBeInTheDocument();
		expect(screen.getByTestId("actions-btn")).toBeInTheDocument();
	});

	it("applies custom classNames", () => {
		render(
			<SmallAppBar title="Custom" className="test-small-bar" />
		);

		// Container has the class
		const container = screen.getByText("Custom").closest("div");
		// Actually banner is inside or might be the returned container
		expect(document.querySelector(".test-small-bar")).toBeInTheDocument();
	});
});
