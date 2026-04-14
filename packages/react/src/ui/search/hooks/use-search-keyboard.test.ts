import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSearchKeyboard } from "./use-search-keyboard";

describe("useSearchKeyboard", () => {
	const defaultProps = {
		active: true,
		onActiveChange: vi.fn(),
		onSearch: vi.fn(),
		query: "test",
		itemCount: 3,
	};

	it("initializes with activeIndex -1", () => {
		const { result } = renderHook(() => useSearchKeyboard({ ...defaultProps }));
		expect(result.current.activeIndex).toBe(-1);
	});

	it("does not handle events if not active", () => {
		const { result } = renderHook(() =>
			useSearchKeyboard({ ...defaultProps, active: false }),
		);
		const e = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;
		act(() => {
			result.current.handleKeyDown(e);
		});
		expect(e.preventDefault).not.toHaveBeenCalled();
		expect(result.current.activeIndex).toBe(-1);
	});

	it("moves focus down with ArrowDown and clamps at itemCount - 1", () => {
		const { result } = renderHook(() => useSearchKeyboard({ ...defaultProps }));
		const e = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		// Move from -1 to 0
		act(() => result.current.handleKeyDown(e));
		expect(result.current.activeIndex).toBe(0);

		// Move to 1
		act(() => result.current.handleKeyDown(e));
		expect(result.current.activeIndex).toBe(1);

		// Move to 2
		act(() => result.current.handleKeyDown(e));
		expect(result.current.activeIndex).toBe(2);

		// Clamp at 2
		act(() => result.current.handleKeyDown(e));
		expect(result.current.activeIndex).toBe(2);
		expect(e.preventDefault).toHaveBeenCalledTimes(4);
	});

	it("moves focus up with ArrowUp and clamps at -1", () => {
		const { result } = renderHook(() => useSearchKeyboard({ ...defaultProps }));
		const eDown = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;
		const eUp = {
			key: "ArrowUp",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		// Move down to index 1
		act(() => {
			result.current.handleKeyDown(eDown);
			result.current.handleKeyDown(eDown);
		});
		expect(result.current.activeIndex).toBe(1);

		// Move up to 0
		act(() => result.current.handleKeyDown(eUp));
		expect(result.current.activeIndex).toBe(0);

		// Move up to -1
		act(() => result.current.handleKeyDown(eUp));
		expect(result.current.activeIndex).toBe(-1);

		// Clamp at -1
		act(() => result.current.handleKeyDown(eUp));
		expect(result.current.activeIndex).toBe(-1);
	});

	it("calls onSearch with query when Enter is pressed without an active suggestion", () => {
		const onSearch = vi.fn();
		const { result } = renderHook(() =>
			useSearchKeyboard({ ...defaultProps, onSearch }),
		);
		const e = {
			key: "Enter",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		act(() => result.current.handleKeyDown(e));
		expect(e.preventDefault).toHaveBeenCalled();
		expect(onSearch).toHaveBeenCalledWith("test");
	});

	it("calls onSelectSuggestion when Enter is pressed and an item is active", () => {
		const onSearch = vi.fn();
		const onSelectSuggestion = vi.fn();
		const { result } = renderHook(() =>
			useSearchKeyboard({ ...defaultProps, onSearch, onSelectSuggestion }),
		);
		const eDown = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;
		const eEnter = {
			key: "Enter",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		// Move to index 0
		act(() => result.current.handleKeyDown(eDown));
		expect(result.current.activeIndex).toBe(0);

		// Press Enter
		act(() => result.current.handleKeyDown(eEnter));
		expect(onSelectSuggestion).toHaveBeenCalledWith(0);
		expect(onSearch).not.toHaveBeenCalled();
	});

	it("calls onSearch instead if onSelectSuggestion is missing and Enter is pressed on active item", () => {
		const onSearch = vi.fn();
		const { result } = renderHook(
			() => useSearchKeyboard({ ...defaultProps, onSearch }), // NO onSelectSuggestion
		);
		const eDown = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;
		const eEnter = {
			key: "Enter",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		act(() => result.current.handleKeyDown(eDown));
		act(() => result.current.handleKeyDown(eEnter));

		expect(onSearch).toHaveBeenCalledWith("test");
	});

	it("calls onActiveChange(false) when Escape is pressed", () => {
		const onActiveChange = vi.fn();
		const { result } = renderHook(() =>
			useSearchKeyboard({ ...defaultProps, onActiveChange }),
		);
		const e = {
			key: "Escape",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		act(() => result.current.handleKeyDown(e));
		expect(e.preventDefault).toHaveBeenCalled();
		expect(onActiveChange).toHaveBeenCalledWith(false);
	});

	it("resets activeIndex when query changes", () => {
		const { result, rerender } = renderHook(
			(props) => useSearchKeyboard(props),
			{ initialProps: { ...defaultProps, query: "a" } },
		);
		const e = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		// Move index
		act(() => result.current.handleKeyDown(e));
		expect(result.current.activeIndex).toBe(0);

		// Change query -> should reset to -1
		rerender({ ...defaultProps, query: "ab" });
		expect(result.current.activeIndex).toBe(-1);
	});

	it("resets activeIndex when active state changes to false", () => {
		const { result, rerender } = renderHook(
			(props) => useSearchKeyboard(props),
			{ initialProps: { ...defaultProps, active: true } },
		);
		const e = {
			key: "ArrowDown",
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent;

		// Move index
		act(() => result.current.handleKeyDown(e));
		expect(result.current.activeIndex).toBe(0);

		// Deactivate -> should reset to -1
		rerender({ ...defaultProps, active: false });
		expect(result.current.activeIndex).toBe(-1);
	});
});
