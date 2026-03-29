"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogFullScreenContent,
	DialogIcon,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

// Helper components for testing
const TestIcon = () => (
	<svg data-testid="test-icon" aria-hidden="true" viewBox="0 0 24 24" />
);

interface ControlledDialogWrapperProps {
	defaultOpen?: boolean;
	onOpenChangeSpy?: (open: boolean) => void;
}

const ControlledDialogWrapper = ({
	defaultOpen = false,
	onOpenChangeSpy,
}: ControlledDialogWrapperProps) => {
	const [open, setOpen] = React.useState(defaultOpen);
	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				onOpenChangeSpy?.(v);
			}}
		>
			<DialogTrigger data-testid="trigger">Open</DialogTrigger>
			<DialogPortal open={open}>
				<DialogOverlay />
				<DialogContent aria-describedby={undefined}>
					<DialogTitle>Title</DialogTitle>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};

describe("Dialog", () => {
	it("renders trigger button", () => {
		render(
			<Dialog>
				<DialogTrigger data-testid="trigger">Open</DialogTrigger>
			</Dialog>,
		);
		const trigger = screen.getByTestId("trigger");
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveTextContent("Open");
	});

	it("opens dialog on trigger click", async () => {
		const user = userEvent.setup();
		render(<ControlledDialogWrapper />);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		await user.click(screen.getByTestId("trigger"));

		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("closes dialog on close button click", async () => {
		const user = userEvent.setup();
		const handleOpenChange = vi.fn();
		render(
			<ControlledDialogWrapper
				defaultOpen={true}
				onOpenChangeSpy={handleOpenChange}
			/>,
		);

		expect(screen.getByRole("dialog")).toBeInTheDocument();

		const closeBtn = screen.getByLabelText("Close dialog");
		await user.click(closeBtn);

		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders accessible title with role=heading", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogContent aria-describedby={undefined}>
						<DialogTitle>Dialog Headline</DialogTitle>
					</DialogContent>
				</DialogPortal>
			</Dialog>,
		);
		const title = screen.getByRole("heading", { name: "Dialog Headline" });
		expect(title).toBeInTheDocument();
	});

	it("renders accessible description", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogContent>
						<DialogTitle>Title</DialogTitle>
						<DialogDescription>Accessible description info.</DialogDescription>
					</DialogContent>
				</DialogPortal>
			</Dialog>,
		);
		expect(
			screen.getByText("Accessible description info."),
		).toBeInTheDocument();
	});

	it("hides close button when hideCloseButton=true", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogContent hideCloseButton aria-describedby={undefined}>
						<DialogTitle>Title</DialogTitle>
					</DialogContent>
				</DialogPortal>
			</Dialog>,
		);
		expect(screen.queryByLabelText("Close dialog")).not.toBeInTheDocument();
	});

	it("calls onOpenChange when closed via Escape", async () => {
		const handleOpenChange = vi.fn();
		render(
			<ControlledDialogWrapper
				defaultOpen={true}
				onOpenChangeSpy={handleOpenChange}
			/>,
		);

		fireEvent.keyDown(document, { key: "Escape" });
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders DialogIcon slot", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogContent aria-describedby={undefined}>
						<DialogIcon>
							<TestIcon />
						</DialogIcon>
						<DialogTitle>Title</DialogTitle>
					</DialogContent>
				</DialogPortal>
			</Dialog>,
		);
		const icon = screen.getByTestId("test-icon");
		expect(icon).toBeInTheDocument();
		const iconWrapper = icon.parentElement;
		expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
	});

	it("renders DialogBody with overflow-y-auto", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogContent aria-describedby={undefined}>
						<DialogTitle>Title</DialogTitle>
						<DialogBody data-testid="body">Content area</DialogBody>
					</DialogContent>
				</DialogPortal>
			</Dialog>,
		);
		const body = screen.getByTestId("body");
		expect(body).toBeInTheDocument();
		expect(body.className).toContain("overflow-y-auto");
	});

	it("renders DialogFooter with end-aligned buttons", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogContent aria-describedby={undefined}>
						<DialogTitle>Title</DialogTitle>
						<DialogFooter data-testid="footer">
							<button type="button">Action</button>
						</DialogFooter>
					</DialogContent>
				</DialogPortal>
			</Dialog>,
		);
		const footer = screen.getByTestId("footer");
		expect(footer).toBeInTheDocument();
		expect(footer.className).toContain("justify-end");
	});
});

describe("DialogFullScreenContent", () => {
	it("renders full-screen dialog covering viewport", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogFullScreenContent aria-describedby={undefined}>
						<p>Full screen body</p>
					</DialogFullScreenContent>
				</DialogPortal>
			</Dialog>,
		);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(dialog.className).toContain("fixed inset-0 z-50 w-full h-full");
	});

	it("renders title in top app bar", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogFullScreenContent
						title="My Form Title"
						aria-describedby={undefined}
					>
						<p>Full screen body</p>
					</DialogFullScreenContent>
				</DialogPortal>
			</Dialog>,
		);
		expect(screen.getByText("My Form Title")).toBeInTheDocument();
	});

	it("renders action button in top bar when actionLabel provided", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogFullScreenContent
						title="Title"
						actionLabel="Save Form"
						onAction={vi.fn()}
						aria-describedby={undefined}
					>
						<p>Full screen body</p>
					</DialogFullScreenContent>
				</DialogPortal>
			</Dialog>,
		);
		const actionBtn = screen.getByRole("button", { name: "Save Form" });
		expect(actionBtn).toBeInTheDocument();
	});

	it("calls onAction callback when action button clicked", async () => {
		const user = userEvent.setup();
		const handleAction = vi.fn();
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogFullScreenContent
						title="Title"
						actionLabel="Save Data"
						onAction={handleAction}
						aria-describedby={undefined}
					>
						<p>Full screen body</p>
					</DialogFullScreenContent>
				</DialogPortal>
			</Dialog>,
		);

		const actionBtn = screen.getByRole("button", { name: "Save Data" });
		await user.click(actionBtn);
		expect(handleAction).toHaveBeenCalledTimes(1);
	});

	it("renders divider when showDivider=true", () => {
		render(
			<Dialog open={true}>
				<DialogPortal open={true}>
					<DialogFullScreenContent
						title="Title"
						showDivider
						aria-describedby={undefined}
					>
						<p>Full screen body</p>
					</DialogFullScreenContent>
				</DialogPortal>
			</Dialog>,
		);

		const divider = document.querySelector("hr");
		expect(divider).toBeInTheDocument();
		expect(divider?.className).toContain("border-m3-outline-variant");
	});
});
