"use client";

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SnackbarData } from "./snackbar";
import {
	Snackbar,
	SnackbarHost,
	SnackbarProvider,
	useSnackbar,
	useSnackbarState,
} from "./snackbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Builds a minimal SnackbarData object for pure Snackbar tests. */
function makeSnackbarData(overrides: Partial<SnackbarData> = {}): SnackbarData {
	return {
		id: "test-id",
		visuals: { message: "Test message", duration: 9999999 },
		resolve: vi.fn(),
		...overrides,
	};
}

// ─── 1. Renders message ───────────────────────────────────────────────────────

describe("Snackbar — renders message", () => {
	it("displays the message text", () => {
		const data = makeSnackbarData({
			visuals: { message: "File deleted", duration: 9999999 },
		});
		render(<Snackbar data={data} />);
		expect(screen.getByText("File deleted")).toBeInTheDocument();
	});
});

// ─── 2. Renders action button ─────────────────────────────────────────────────

describe("Snackbar — action button", () => {
	it("renders action button when actionLabel is provided", () => {
		const data = makeSnackbarData({
			visuals: { message: "Archived", actionLabel: "Undo", duration: 9999999 },
		});
		render(<Snackbar data={data} />);
		expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
	});

	it("does not render action button when actionLabel is absent", () => {
		const data = makeSnackbarData({
			visuals: { message: "No action", duration: 9999999 },
		});
		render(<Snackbar data={data} />);
		// Only the close button might be present — but not an "action"
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});
});

// ─── 3. Action click resolves 'action-performed' ──────────────────────────────

describe("Snackbar — action click resolves promise", () => {
	it("calls resolve with 'action-performed' when action button is clicked", async () => {
		const user = userEvent.setup();
		const resolveMock = vi.fn();
		const data = makeSnackbarData({
			visuals: { message: "Saved", actionLabel: "Undo", duration: 9999999 },
			resolve: resolveMock,
		});
		render(<Snackbar data={data} />);
		await user.click(screen.getByRole("button", { name: "Undo" }));
		expect(resolveMock).toHaveBeenCalledWith("action-performed");
	});
});

// ─── 4. Auto-dismiss ─────────────────────────────────────────────────────────

describe("Snackbar — auto-dismiss", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("calls resolve('dismissed') after short duration (4000ms)", () => {
		const resolveMock = vi.fn();
		const data = makeSnackbarData({
			visuals: { message: "Auto dismiss", duration: "short" },
			resolve: resolveMock,
		});
		render(<Snackbar data={data} />);
		expect(resolveMock).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(4000);
		});
		expect(resolveMock).toHaveBeenCalledWith("dismissed");
	});

	it("calls resolve after custom duration", () => {
		const resolveMock = vi.fn();
		const data = makeSnackbarData({
			visuals: { message: "Custom timer", duration: 1500 },
			resolve: resolveMock,
		});
		render(<Snackbar data={data} />);
		act(() => {
			vi.advanceTimersByTime(1499);
		});
		expect(resolveMock).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(resolveMock).toHaveBeenCalledWith("dismissed");
	});
});

// ─── 5. Dismiss button ────────────────────────────────────────────────────────

describe("Snackbar — dismiss button", () => {
	it("renders close button when withDismissAction=true", () => {
		const data = makeSnackbarData({
			visuals: {
				message: "Hello",
				withDismissAction: true,
				duration: 9999999,
			},
		});
		render(<Snackbar data={data} />);
		expect(
			screen.getByRole("button", { name: /dismiss/i }),
		).toBeInTheDocument();
	});

	it("calls resolve('dismissed') when close button is clicked", async () => {
		const user = userEvent.setup();
		const resolveMock = vi.fn();
		const data = makeSnackbarData({
			visuals: {
				message: "Hello",
				withDismissAction: true,
				duration: 9999999,
			},
			resolve: resolveMock,
		});
		render(<Snackbar data={data} />);
		await user.click(screen.getByRole("button", { name: /dismiss/i }));
		expect(resolveMock).toHaveBeenCalledWith("dismissed");
	});
});

// ─── 6. Queue behavior ────────────────────────────────────────────────────────

describe("SnackbarHost — queue behavior", () => {
	it("shows second snackbar after first is dismissed", async () => {
		const user = userEvent.setup();

		function Wrapper() {
			const state = useSnackbarState();
			return (
				<>
					<button
						type="button"
						onClick={() =>
							state.showSnackbar({
								message: "Snackbar One",
								actionLabel: "Close One",
								duration: 9999999,
							})
						}
					>
						Show One
					</button>
					<button
						type="button"
						onClick={() =>
							state.showSnackbar({
								message: "Snackbar Two",
								duration: 9999999,
							})
						}
					>
						Show Two
					</button>
					<SnackbarHost state={state} />
				</>
			);
		}

		render(<Wrapper />);

		// Show first
		await user.click(screen.getByRole("button", { name: "Show One" }));
		expect(screen.getByText("Snackbar One")).toBeInTheDocument();

		// Queue second immediately (first still showing)
		await user.click(screen.getByRole("button", { name: "Show Two" }));

		// Second should NOT be visible yet
		expect(screen.queryByText("Snackbar Two")).not.toBeInTheDocument();

		// Dismiss first via its action button
		await user.click(screen.getByRole("button", { name: "Close One" }));

		// Second should now appear
		await waitFor(() => {
			expect(screen.getByText("Snackbar Two")).toBeInTheDocument();
		});
	});
});

// ─── 7. actionOnNewLine layout ────────────────────────────────────────────────

describe("Snackbar — actionOnNewLine", () => {
	it("applies flex-col when actionOnNewLine=true", () => {
		const data = makeSnackbarData({
			visuals: {
				message: "Long message text here",
				actionLabel: "Action",
				actionOnNewLine: true,
				duration: 9999999,
			},
		});
		const { container } = render(<Snackbar data={data} />);
		// The snackbar root div should have flex-col
		const snackbarEl = container.firstChild as HTMLElement;
		expect(snackbarEl.className).toContain("flex-col");
	});

	it("applies flex-row by default (actionOnNewLine=false)", () => {
		const data = makeSnackbarData({
			visuals: {
				message: "Message",
				actionLabel: "Action",
				actionOnNewLine: false,
				duration: 9999999,
			},
		});
		const { container } = render(<Snackbar data={data} />);
		const snackbarEl = container.firstChild as HTMLElement;
		expect(snackbarEl.className).toContain("flex-row");
	});
});

// ─── 8. Accessibility ─────────────────────────────────────────────────────────

describe("Snackbar — accessibility", () => {
	it("has role='status' on the container", () => {
		const data = makeSnackbarData();
		render(<Snackbar data={data} />);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("has aria-live='polite' on the container", () => {
		const data = makeSnackbarData();
		const { container } = render(<Snackbar data={data} />);
		const statusEl = container.querySelector("[role='status']");
		expect(statusEl).toHaveAttribute("aria-live", "polite");
	});

	it("has aria-atomic='true' on the container", () => {
		const data = makeSnackbarData();
		const { container } = render(<Snackbar data={data} />);
		const statusEl = container.querySelector("[role='status']");
		expect(statusEl).toHaveAttribute("aria-atomic", "true");
	});
});

// ─── 9. Custom className ──────────────────────────────────────────────────────

describe("Snackbar — custom className", () => {
	it("applies custom className to the container", () => {
		const data = makeSnackbarData({
			visuals: {
				message: "Styled",
				className: "my-custom-class",
				duration: 9999999,
			},
		});
		const { container } = render(<Snackbar data={data} />);
		const snackbarEl = container.firstChild as HTMLElement;
		expect(snackbarEl.className).toContain("my-custom-class");
	});
});

// ─── 10. SnackbarProvider + useSnackbar ───────────────────────────────────────

describe("SnackbarProvider + useSnackbar", () => {
	it("provides showSnackbar via useSnackbar hook", async () => {
		const user = userEvent.setup();
		function TestConsumer() {
			const { showSnackbar } = useSnackbar();
			return (
				<button
					type="button"
					onClick={async () => {
						await showSnackbar({
							message: "Provider test",
							duration: 9999999,
						});
					}}
				>
					Trigger
				</button>
			);
		}

		render(
			<SnackbarProvider>
				<TestConsumer />
			</SnackbarProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Trigger" }));

		// Snackbar should appear in the provider's SnackbarHost
		await waitFor(() => {
			expect(screen.getByText("Provider test")).toBeInTheDocument();
		});
	});

	it("throws when useSnackbar is used outside SnackbarProvider", () => {
		const originalError = console.error;
		// Suppress React's boundary error log
		console.error = vi.fn();

		function BadConsumer() {
			useSnackbar();
			return null;
		}

		expect(() => render(<BadConsumer />)).toThrow(
			"useSnackbar must be used within a <SnackbarProvider>.",
		);

		console.error = originalError;
	});
});
