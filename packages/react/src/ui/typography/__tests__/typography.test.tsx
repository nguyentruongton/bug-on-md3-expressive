import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography, TypographyProvider, useTypography } from "../typography";
import { TypographyKeyTokens } from "../typography-key-tokens";
import {
  TypographyTokens,
  serializeFontVariationAxes,
  DEFAULT_FONT_VARIATION_AXES,
} from "../typography-tokens";

describe("Typography", () => {
  describe("serializeFontVariationAxes", () => {
    it("should serialize a single axis correctly", () => {
      expect(serializeFontVariationAxes({ ROND: 100 })).toBe('"ROND" 100');
    });

    it("should serialize multiple axes correctly", () => {
      const result = serializeFontVariationAxes({ ROND: 50, wght: 700 });
      expect(result).toContain('"ROND" 50');
      expect(result).toContain('"wght" 700');
    });

    it("should skip undefined axis values", () => {
      const result = serializeFontVariationAxes({ ROND: 100, wght: undefined });
      expect(result).toBe('"ROND" 100');
    });
  });

  describe("TypographyTokens", () => {
    it("should initialize with default Google Sans Flex font", () => {
      const tokens = new TypographyTokens();
      expect(tokens.BodyLarge.fontFamily).toContain("Google Sans Flex");
      // MD3 Expressive requires ROND: 100 for maximum roundness
      expect(tokens.BodyLarge.fontVariationSettings).toContain('"ROND" 100');
    });

    it("should support a custom fontFamily override (options object)", () => {
      const tokens = new TypographyTokens({ fontFamily: "Inter, sans-serif" });
      expect(tokens.HeadlineLarge.fontFamily).toBe("Inter, sans-serif");
    });

    it("should support legacy string constructor for backward compatibility", () => {
      const tokens = new TypographyTokens("Inter, sans-serif");
      expect(tokens.HeadlineLarge.fontFamily).toBe("Inter, sans-serif");
    });

    it("should apply custom fontVariationAxes", () => {
      const tokens = new TypographyTokens({ fontVariationAxes: { ROND: 0 } });
      expect(tokens.BodyLarge.fontVariationSettings).toContain('"ROND" 0');
    });

    it("should merge custom axes on top of defaults (ROND stays 100 unless overridden)", () => {
      // Only wght is overridden; ROND should remain at default (100)
      expect(DEFAULT_FONT_VARIATION_AXES.ROND).toBe(100);
      const tokens = new TypographyTokens({ fontVariationAxes: { wght: 600 } });
      expect(tokens.BodyLarge.fontVariationSettings).toContain('"ROND" 100');
      expect(tokens.BodyLarge.fontVariationSettings).toContain('"wght" 600');
    });

    it("should lazily compute and cache styles on first access", () => {
      const tokens = new TypographyTokens();
      const first = tokens.DisplayLarge;
      const second = tokens.DisplayLarge;
      // Same object reference — cached
      expect(first).toBe(second);
    });

    it("should return frozen TextStyle objects", () => {
      const tokens = new TypographyTokens();
      expect(Object.isFrozen(tokens.BodyLarge)).toBe(true);
    });
  });

  describe("Typography (Class)", () => {
    it("should expose all 30 TextStyle getters", () => {
      const typography = new Typography();
      expect(typography.displayLarge).toBeDefined();
      expect(typography.bodyMedium).toBeDefined();
      expect(typography.labelSmallEmphasized).toBeDefined();

      // Check token delegation — should match token value
      const tokens = new TypographyTokens();
      expect(typography.headlineMedium).toEqual(tokens.HeadlineMedium);
    });

    it("should map TypographyKeyTokens correctly using fromToken()", () => {
      const typography = new Typography();
      const style = typography.fromToken(TypographyKeyTokens.TitleMedium);
      expect(style.fontSize).toBe("1.143rem");
      expect(style.fontWeight).toBe(500);

      const emphStyle = typography.fromToken(TypographyKeyTokens.TitleMediumEmphasized);
      expect(emphStyle.fontWeight).toBe(700);
    });

    it("should create an overridden copy without mutating the original via copy()", () => {
      const original = new Typography();
      const overridden = original.copy({
        bodyLarge: { fontSize: "99rem", lineHeight: "120rem" },
      });

      // Original remains intact
      expect(original.bodyLarge.fontSize).toBe("1.143rem");

      // Overridden instance reflects custom values
      expect(overridden.bodyLarge.fontSize).toBe("99rem");
      expect(overridden.bodyLarge.lineHeight).toBe("120rem");

      // Untouched properties remain referentially stable
      expect(overridden.headlineSmall).toBe(original.headlineSmall);
    });
  });

  describe("TypographyProvider & useTypography", () => {
    it("should provide default Google Sans Flex typography when no props given", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TypographyProvider>{children}</TypographyProvider>
      );
      const { result } = renderHook(() => useTypography(), { wrapper });
      expect(result.current.bodySmall.fontFamily).toContain("Google Sans Flex");
    });

    it("should respect fontFamily prop shorthand", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TypographyProvider fontFamily="'Roboto', sans-serif">
          {children}
        </TypographyProvider>
      );
      const { result } = renderHook(() => useTypography(), { wrapper });
      expect(result.current.bodySmall.fontFamily).toBe("'Roboto', sans-serif");
    });

    it("should apply custom fontVariationAxes via prop", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TypographyProvider fontVariationAxes={{ ROND: 0 }}>
          {children}
        </TypographyProvider>
      );
      const { result } = renderHook(() => useTypography(), { wrapper });
      expect(result.current.bodyLarge.fontVariationSettings).toContain('"ROND" 0');
    });

    it("should prioritize custom typography instance prop", () => {
      const customTokens = new TypographyTokens({ fontFamily: "'Comic Sans MS'" });
      const customTypography = new Typography(customTokens);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TypographyProvider typography={customTypography}>
          {children}
        </TypographyProvider>
      );
      const { result } = renderHook(() => useTypography(), { wrapper });
      expect(result.current.displayLarge.fontFamily).toBe("'Comic Sans MS'");
    });

    it("should return the default Typography if used without a provider", () => {
      const { result } = renderHook(() => useTypography());
      expect(result.current).toBeInstanceOf(Typography);
      expect(result.current.displaySmall.fontFamily).toContain("Google Sans Flex");
    });
  });
});
