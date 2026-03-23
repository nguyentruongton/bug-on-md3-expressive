import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	MD3_EXPRESSIVE_FONT_VARIATION,
	Typography,
	TypographyKeyTokens,
	TypographyProvider,
	TypographyTokens,
	useTypography,
} from "../ui/typography";

// ─── TypographyTokens ─────────────────────────────────────────────────────────

describe("TypographyTokens", () => {
	it("creates 30 styles (15 baseline + 15 emphasized)", () => {
		const tokens = new TypographyTokens();
		const baseline = [
			"BodyLarge", "BodyMedium", "BodySmall",
			"DisplayLarge", "DisplayMedium", "DisplaySmall",
			"HeadlineLarge", "HeadlineMedium", "HeadlineSmall",
			"LabelLarge", "LabelMedium", "LabelSmall",
			"TitleLarge", "TitleMedium", "TitleSmall",
		] as const;
		const emphasized = baseline.map((k) => `${k}Emphasized` as const);

		for (const key of baseline) {
			expect(tokens[key]).toBeDefined();
		}
		for (const key of emphasized) {
			expect((tokens as unknown as Record<string, unknown>)[key]).toBeDefined();
		}
	});

	it("applies ROND 100 fontVariationSettings to all styles", () => {
		const tokens = new TypographyTokens();
		const styles = [
			tokens.BodyLarge,
			tokens.DisplayLarge,
			tokens.HeadlineMedium,
			tokens.LabelSmall,
			tokens.TitleMedium,
			tokens.BodyLargeEmphasized,
			tokens.DisplayLargeEmphasized,
			tokens.LabelSmallEmphasized,
		];

		for (const style of styles) {
			expect(style.fontVariationSettings).toBe(MD3_EXPRESSIVE_FONT_VARIATION);
			expect(style.fontVariationSettings).toBe('"ROND" 100');
		}
	});

	it("uses Google Sans Flex as default font family", () => {
		const tokens = new TypographyTokens();
		expect(tokens.BodyLarge.fontFamily).toContain("Google Sans Flex");
		expect(tokens.DisplayLarge.fontFamily).toContain("Google Sans Flex");
	});

	it("overrides font family when provided", () => {
		const customFont = "'Inter', sans-serif";
		const tokens = new TypographyTokens(customFont);
		expect(tokens.BodyLarge.fontFamily).toBe(customFont);
		expect(tokens.DisplayLargeEmphasized.fontFamily).toBe(customFont);
	});

	it("emphasized styles have higher fontWeight than baseline", () => {
		const tokens = new TypographyTokens();
		expect(tokens.BodyLargeEmphasized.fontWeight).toBeGreaterThan(
			tokens.BodyLarge.fontWeight,
		);
		expect(tokens.DisplayLargeEmphasized.fontWeight).toBeGreaterThan(
			tokens.DisplayLarge.fontWeight,
		);
		expect(tokens.LabelLargeEmphasized.fontWeight).toBeGreaterThan(
			tokens.LabelLarge.fontWeight,
		);
	});

	it("styles are frozen (immutable)", () => {
		const tokens = new TypographyTokens();
		expect(Object.isFrozen(tokens.BodyLarge)).toBe(true);
		expect(Object.isFrozen(tokens.DisplayLargeEmphasized)).toBe(true);
	});
});

// ─── Typography class ─────────────────────────────────────────────────────────

describe("Typography", () => {
	it("constructs with default tokens", () => {
		const typography = new Typography();
		expect(typography.bodyLarge).toBeDefined();
		expect(typography.displayLargeEmphasized).toBeDefined();
	});

	it("fromToken returns correct style for all 30 keys", () => {
		const typography = new Typography();
		const allKeys = Object.values(TypographyKeyTokens);
		expect(allKeys).toHaveLength(30);

		for (const key of allKeys) {
			const style = typography.fromToken(key);
			expect(style).toBeDefined();
			expect(style.fontVariationSettings).toBe('"ROND" 100');
		}
	});

	it("fromToken(BodyLarge) matches bodyLarge property", () => {
		const typography = new Typography();
		expect(typography.fromToken(TypographyKeyTokens.BodyLarge)).toBe(
			typography.bodyLarge,
		);
	});

	it("fromToken(DisplayLargeEmphasized) matches displayLargeEmphasized property", () => {
		const typography = new Typography();
		expect(
			typography.fromToken(TypographyKeyTokens.DisplayLargeEmphasized),
		).toBe(typography.displayLargeEmphasized);
	});

	it("copy() creates a new instance with overridden styles", () => {
		const original = new Typography();
		const customStyle = { ...original.bodyLarge, fontWeight: 900 };
		const modified = original.copy({ bodyLarge: customStyle });

		expect(modified.bodyLarge.fontWeight).toBe(900);
		expect(modified.displayLarge).toBe(original.displayLarge);
	});
});

// ─── useTypography + TypographyProvider ───────────────────────────────────────

function TestConsumer() {
	const typography = useTypography();
	return (
		<div>
			<span data-testid="font-size">{typography.bodyLarge.fontSize}</span>
			<span data-testid="font-weight">
				{typography.displayLargeEmphasized.fontWeight}
			</span>
			<span data-testid="variation">
				{typography.bodyMedium.fontVariationSettings}
			</span>
		</div>
	);
}

describe("useTypography", () => {
	it("returns default Typography when no Provider is present", () => {
		render(<TestConsumer />);
		expect(screen.getByTestId("font-size").textContent).toBeTruthy();
		expect(screen.getByTestId("variation").textContent).toBe('"ROND" 100');
	});

	it("returns Typography from TypographyProvider", () => {
		render(
			<TypographyProvider>
				<TestConsumer />
			</TypographyProvider>,
		);
		expect(screen.getByTestId("font-size").textContent).toBeTruthy();
		expect(screen.getByTestId("variation").textContent).toBe('"ROND" 100');
	});

	it("allows custom fontFamily via TypographyProvider", () => {
		function CustomConsumer() {
			const typography = useTypography();
			return (
				<span data-testid="custom-family">
					{typography.bodyLarge.fontFamily}
				</span>
			);
		}

		render(
			<TypographyProvider fontFamily="'Inter', sans-serif">
				<CustomConsumer />
			</TypographyProvider>,
		);
		expect(screen.getByTestId("custom-family").textContent).toBe(
			"'Inter', sans-serif",
		);
	});

	it("emphasized fontWeight is higher than baseline", () => {
		render(
			<TypographyProvider>
				<TestConsumer />
			</TypographyProvider>,
		);
		const emphasizedWeight = Number(
			screen.getByTestId("font-weight").textContent,
		);
		expect(emphasizedWeight).toBeGreaterThanOrEqual(700);
	});
});
