import { renderHook } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSearchViewFocus } from "./use-search-view-focus";

describe("useSearchViewFocus", () => {
	const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
	const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

	afterEach(() => {
		globalThis.requestAnimationFrame = originalRequestAnimationFrame;
		globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
		vi.restoreAllMocks();
	});

	it("does not focus when active is false", () => {
		const focusMock = vi.fn();
		const ref = {
			current: { focus: focusMock },
		} as unknown as React.RefObject<HTMLInputElement>;
		const rAFMock = vi.fn();
		globalThis.requestAnimationFrame = rAFMock;

		renderHook(() => useSearchViewFocus(ref, false));

		expect(rAFMock).not.toHaveBeenCalled();
		expect(focusMock).not.toHaveBeenCalled();
	});

	it("runs inner focus call on double requestAnimationFrame when active becomes true", () => {
		const focusMock = vi.fn();
		const ref = {
			current: { focus: focusMock },
		} as unknown as React.RefObject<HTMLInputElement>;

		const rafCallbacks: FrameRequestCallback[] = [];
		globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
			rafCallbacks.push(cb);
			return rafCallbacks.length;
		});
		globalThis.cancelAnimationFrame = vi.fn();

		const { rerender } = renderHook(
			({ active }) => useSearchViewFocus(ref, active),
			{
				initialProps: { active: false },
			},
		);

		expect(globalThis.requestAnimationFrame).not.toHaveBeenCalled();

		// Activate
		rerender({ active: true });

		// The hook should schedule the first rAF
		expect(rafCallbacks.length).toBe(1);

		// Fire first rAF
		rafCallbacks[0](0);

		// The hook should have scheduled the second rAF
		expect(rafCallbacks.length).toBe(2);
		expect(focusMock).not.toHaveBeenCalled();

		// Fire second rAF
		rafCallbacks[1](0);

		// Now it should focus
		expect(focusMock).toHaveBeenCalledTimes(1);
	});

	it("cancels animation frames if unmounted during animation", () => {
		const focusMock = vi.fn();
		const ref = {
			current: { focus: focusMock },
		} as unknown as React.RefObject<HTMLInputElement>;

		const rafCallbacks: FrameRequestCallback[] = [];
		globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
			rafCallbacks.push(cb);
			return rafCallbacks.length;
		});
		globalThis.cancelAnimationFrame = vi.fn();

		const { unmount } = renderHook(() => useSearchViewFocus(ref, true));

		expect(rafCallbacks.length).toBe(1);

		// Unmount before first rAF fires
		unmount();

		// Should have called cancelAnimationFrame with id 1
		expect(globalThis.cancelAnimationFrame).toHaveBeenCalledWith(1);
		expect(focusMock).not.toHaveBeenCalled();
	});
});
