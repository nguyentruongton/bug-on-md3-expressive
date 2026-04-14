import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DockedToolbar } from "./docked-toolbar";

describe("DockedToolbar", () => {
	it("renders successfully with given children and aria-label", () => {
		render(
			<DockedToolbar aria-label="Test Toolbar">
				<div data-testid="toolbar-content">Toolbar Item</div>
			</DockedToolbar>,
		);

		const toolbar = screen.getByRole("toolbar", { name: "Test Toolbar" });
		expect(toolbar).toBeInTheDocument();
		expect(toolbar).toHaveClass(
			"flex items-center w-full overflow-x-auto bg-m3-surface-container",
		);

		const content = screen.getByTestId("toolbar-content");
		expect(content).toBeInTheDocument();
		expect(content).toHaveTextContent("Toolbar Item");
	});

	it("applies additional classNames", () => {
		render(
			<DockedToolbar aria-label="Toolbar" className="custom-test-class">
				<span />
			</DockedToolbar>,
		);

		const toolbar = screen.getByRole("toolbar");
		expect(toolbar).toHaveClass("custom-test-class");
	});
});
