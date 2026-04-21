import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LargeFlexibleAppBar } from "./large-flexible-app-bar";
import { MediumFlexibleAppBar } from "./medium-flexible-app-bar";

describe("FlexibleAppBars", () => {
	describe("MediumFlexibleAppBar", () => {
		it("renders correctly with essential props", () => {
			render(
				<MediumFlexibleAppBar
					title="Medium Title"
					navigationIcon={
						<button type="button" data-testid="medium-nav">
							Menu
						</button>
					}
					actions={
						<button type="button" data-testid="medium-actions">
							Edit
						</button>
					}
				/>,
			);

			// Should render title inside the expanded area and pinned area (sometimes twice, or just once if transitioning)
			expect(screen.getAllByText("Medium Title").length).toBeGreaterThan(0);
			expect(screen.getByTestId("medium-nav")).toBeInTheDocument();
			expect(screen.getByTestId("medium-actions")).toBeInTheDocument();
		});

		it("renders subtitle if provided", () => {
			render(
				<MediumFlexibleAppBar
					title="Has Subtitle"
					subtitle="Medium Subtitle"
				/>,
			);
			expect(screen.getAllByText("Medium Subtitle").length).toBeGreaterThan(0);
		});
	});

	describe("LargeFlexibleAppBar", () => {
		it("renders correctly with essential props", () => {
			render(
				<LargeFlexibleAppBar
					title="Large Title"
					navigationIcon={
						<button type="button" data-testid="large-nav">
							Close
						</button>
					}
					actions={
						<button type="button" data-testid="large-actions">
							Save
						</button>
					}
				/>,
			);

			expect(screen.getAllByText("Large Title").length).toBeGreaterThan(0);
			expect(screen.getByTestId("large-nav")).toBeInTheDocument();
			expect(screen.getByTestId("large-actions")).toBeInTheDocument();
		});

		it("renders headerContent", () => {
			render(
				<LargeFlexibleAppBar
					title="With Header Content"
					headerContent={<div data-testid="header-content">Custom Content</div>}
				/>,
			);
			expect(screen.getByTestId("header-content")).toBeInTheDocument();
		});
	});
});
