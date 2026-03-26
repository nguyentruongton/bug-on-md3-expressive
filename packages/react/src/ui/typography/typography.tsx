/**
 * @file typography.tsx
 * @description MD3 Expressive Typography System for React.
 *
 * Port of `androidx.compose.material3.Typography` (Kotlin `@Immutable` class).
 *
 * Provides 30 {@link TextStyle} definitions via the React Context API, mirroring
 * the Compose `LocalTypography` / `MaterialTheme.typography` pattern.
 *
 * ### Memory & Performance Optimizations
 * - The `Typography` class delegates all property access to a `TypographyTokens`
 *   instance that uses **lazy getters**, so styles are computed only on first use.
 * - `TypographyProvider` memoizes the context value via `useMemo` to prevent
 *   unnecessary re-renders downstream.
 *
 * @example Wrap your application
 * ```tsx
 * <TypographyProvider>
 *   <App />
 * </TypographyProvider>
 * ```
 *
 * @example Consume in a component
 * ```tsx
 * const typography = useTypography();
 * <p style={typography.bodyLarge}>Hello</p>
 * ```
 *
 * @example Via token key
 * ```tsx
 * const style = typography.fromToken(TypographyKeyTokens.BodyLarge);
 * ```
 *
 * @example Custom font + half-rounded corners
 * ```tsx
 * <TypographyProvider
 *   fontFamily="'Roboto', sans-serif"
 *   fontVariationAxes={{ ROND: 50 }}
 * >
 *   <App />
 * </TypographyProvider>
 * ```
 */

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { TypographyKeyTokens } from "./typography-key-tokens";
import {
	type FontVariationAxes,
	type TextStyle,
	TypographyTokens,
} from "./typography-tokens";

// ─── Typography Class ─────────────────────────────────────────────────────────

/**
 * MD3 Expressive Typography — port of Compose's `@Immutable class Typography(...)`.
 *
 * All 30 style properties are **readonly** and lazily resolved from the
 * underlying {@link TypographyTokens} instance. Use {@link Typography.copy}
 * to create a customized variant without mutating the original.
 *
 * @example Default
 * ```ts
 * const typography = new Typography();
 * const style = typography.displayLarge; // lazy — computed on first access
 * ```
 *
 * @example Custom tokens
 * ```ts
 * const typography = new Typography(
 *   new TypographyTokens({ fontFamily: "'Inter', sans-serif", fontVariationAxes: { ROND: 0 } })
 * );
 * ```
 */
export class Typography {
	readonly #tokens: TypographyTokens;

	constructor(tokens: TypographyTokens = defaultTokens) {
		this.#tokens = tokens;
	}

	// ─── Baseline Styles ────────────────────────────────────────────────────────

	/** Display Large text style (`57px`, weight `400`). */
	get displayLarge(): TextStyle {
		return this.#tokens.DisplayLarge;
	}
	/** Display Medium text style (`45px`, weight `400`). */
	get displayMedium(): TextStyle {
		return this.#tokens.DisplayMedium;
	}
	/** Display Small text style (`36px`, weight `400`). */
	get displaySmall(): TextStyle {
		return this.#tokens.DisplaySmall;
	}
	/** Headline Large text style (`32px`, weight `400`). */
	get headlineLarge(): TextStyle {
		return this.#tokens.HeadlineLarge;
	}
	/** Headline Medium text style (`28px`, weight `400`). */
	get headlineMedium(): TextStyle {
		return this.#tokens.HeadlineMedium;
	}
	/** Headline Small text style (`24px`, weight `400`). */
	get headlineSmall(): TextStyle {
		return this.#tokens.HeadlineSmall;
	}
	/** Title Large text style (`22px`, weight `400`). */
	get titleLarge(): TextStyle {
		return this.#tokens.TitleLarge;
	}
	/** Title Medium text style (`16px`, weight `500`). */
	get titleMedium(): TextStyle {
		return this.#tokens.TitleMedium;
	}
	/** Title Small text style (`14px`, weight `500`). */
	get titleSmall(): TextStyle {
		return this.#tokens.TitleSmall;
	}
	/** Body Large text style (`16px`, weight `400`). */
	get bodyLarge(): TextStyle {
		return this.#tokens.BodyLarge;
	}
	/** Body Medium text style (`14px`, weight `400`). */
	get bodyMedium(): TextStyle {
		return this.#tokens.BodyMedium;
	}
	/** Body Small text style (`12px`, weight `400`). */
	get bodySmall(): TextStyle {
		return this.#tokens.BodySmall;
	}
	/** Label Large text style (`14px`, weight `500`). */
	get labelLarge(): TextStyle {
		return this.#tokens.LabelLarge;
	}
	/** Label Medium text style (`12px`, weight `500`). */
	get labelMedium(): TextStyle {
		return this.#tokens.LabelMedium;
	}
	/** Label Small text style (`11px`, weight `500`). */
	get labelSmall(): TextStyle {
		return this.#tokens.LabelSmall;
	}

	// ─── Emphasized Styles (MD3 Expressive) ─────────────────────────────────────

	/** Display Large Emphasized text style (`57px`, weight `800`). */
	get displayLargeEmphasized(): TextStyle {
		return this.#tokens.DisplayLargeEmphasized;
	}
	/** Display Medium Emphasized text style (`45px`, weight `800`). */
	get displayMediumEmphasized(): TextStyle {
		return this.#tokens.DisplayMediumEmphasized;
	}
	/** Display Small Emphasized text style (`36px`, weight `800`). */
	get displaySmallEmphasized(): TextStyle {
		return this.#tokens.DisplaySmallEmphasized;
	}
	/** Headline Large Emphasized text style (`32px`, weight `800`). */
	get headlineLargeEmphasized(): TextStyle {
		return this.#tokens.HeadlineLargeEmphasized;
	}
	/** Headline Medium Emphasized text style (`28px`, weight `800`). */
	get headlineMediumEmphasized(): TextStyle {
		return this.#tokens.HeadlineMediumEmphasized;
	}
	/** Headline Small Emphasized text style (`24px`, weight `800`). */
	get headlineSmallEmphasized(): TextStyle {
		return this.#tokens.HeadlineSmallEmphasized;
	}
	/** Title Large Emphasized text style (`22px`, weight `700`). */
	get titleLargeEmphasized(): TextStyle {
		return this.#tokens.TitleLargeEmphasized;
	}
	/** Title Medium Emphasized text style (`16px`, weight `700`). */
	get titleMediumEmphasized(): TextStyle {
		return this.#tokens.TitleMediumEmphasized;
	}
	/** Title Small Emphasized text style (`14px`, weight `700`). */
	get titleSmallEmphasized(): TextStyle {
		return this.#tokens.TitleSmallEmphasized;
	}
	/** Body Large Emphasized text style (`16px`, weight `700`). */
	get bodyLargeEmphasized(): TextStyle {
		return this.#tokens.BodyLargeEmphasized;
	}
	/** Body Medium Emphasized text style (`14px`, weight `700`). */
	get bodyMediumEmphasized(): TextStyle {
		return this.#tokens.BodyMediumEmphasized;
	}
	/** Body Small Emphasized text style (`12px`, weight `700`). */
	get bodySmallEmphasized(): TextStyle {
		return this.#tokens.BodySmallEmphasized;
	}
	/** Label Large Emphasized text style (`14px`, weight `800`). */
	get labelLargeEmphasized(): TextStyle {
		return this.#tokens.LabelLargeEmphasized;
	}
	/** Label Medium Emphasized text style (`12px`, weight `800`). */
	get labelMediumEmphasized(): TextStyle {
		return this.#tokens.LabelMediumEmphasized;
	}
	/** Label Small Emphasized text style (`11px`, weight `800`). */
	get labelSmallEmphasized(): TextStyle {
		return this.#tokens.LabelSmallEmphasized;
	}

	// ─── Methods ─────────────────────────────────────────────────────────────────

	/**
	 * Returns the `TextStyle` corresponding to the given {@link TypographyKeyTokens}.
	 *
	 * Port of `internal fun Typography.fromToken(value: TypographyKeyTokens): TextStyle`.
	 *
	 * @example
	 * ```ts
	 * const style = typography.fromToken(TypographyKeyTokens.BodyLarge);
	 * ```
	 */
	fromToken(value: TypographyKeyTokens): TextStyle {
		return this[TOKEN_TO_PROP[value]];
	}

	/**
	 * Creates a new `Typography` instance with the specified property overrides
	 * merged on top of the current instance's styles.
	 *
	 * Port of Compose's `fun Typography.copy(...)`.
	 *
	 * Unlike a shallow `Object.assign`, this method preserves the lazy-getter
	 * architecture — overridden styles are stored separately and looked up first
	 * on each property access, while non-overridden styles continue to be
	 * resolved from the underlying {@link TypographyTokens}.
	 *
	 * @param overrides - Map of camelCase property names to partial `TextStyle` overrides.
	 * @returns A new `Typography` instance. The original is never mutated.
	 *
	 * @example
	 * ```ts
	 * const custom = typography.copy({ bodyLarge: { fontSize: "2rem" } });
	 * custom.bodyLarge.fontSize; // "2rem"
	 * custom.bodySmall.fontSize; // original token value — untouched
	 * ```
	 */
	copy(
		overrides: Partial<Record<TypographyStyleKey, Partial<TextStyle>>>,
	): Typography {
		return new OverriddenTypography(this.#tokens, this, overrides);
	}
}

// ─── TypographyStyleKey ───────────────────────────────────────────────────────

/**
 * Union of all camelCase property names on {@link Typography} that return a
 * {@link TextStyle}. Used as the key type for `copy()` overrides and the
 * `OverriddenTypography` resolver.
 */
type TypographyStyleKey = {
	[K in keyof Typography]: Typography[K] extends TextStyle ? K : never;
}[keyof Typography];

// ─── OverriddenTypography ─────────────────────────────────────────────────────

/**
 * Internal subclass used by {@link Typography.copy}.
 *
 * Holds a map of explicit style overrides. Each getter checks for an override
 * first; if none exists, it falls through to the parent {@link Typography}.
 *
 * @internal
 */
class OverriddenTypography extends Typography {
	readonly #base: Typography;
	readonly #overrides: Partial<Record<TypographyStyleKey, Partial<TextStyle>>>;

	constructor(
		tokens: TypographyTokens,
		base: Typography,
		overrides: Partial<Record<TypographyStyleKey, Partial<TextStyle>>>,
	) {
		super(tokens);
		this.#base = base;
		this.#overrides = overrides;
	}

	#resolve(key: TypographyStyleKey): TextStyle {
		const override = this.#overrides[key];
		const base = (this.#base as unknown as Record<string, TextStyle>)[key];
		return override ? { ...base, ...override } : base;
	}

	// ─── Baseline
	override get displayLarge() {
		return this.#resolve("displayLarge");
	}
	override get displayMedium() {
		return this.#resolve("displayMedium");
	}
	override get displaySmall() {
		return this.#resolve("displaySmall");
	}
	override get headlineLarge() {
		return this.#resolve("headlineLarge");
	}
	override get headlineMedium() {
		return this.#resolve("headlineMedium");
	}
	override get headlineSmall() {
		return this.#resolve("headlineSmall");
	}
	override get titleLarge() {
		return this.#resolve("titleLarge");
	}
	override get titleMedium() {
		return this.#resolve("titleMedium");
	}
	override get titleSmall() {
		return this.#resolve("titleSmall");
	}
	override get bodyLarge() {
		return this.#resolve("bodyLarge");
	}
	override get bodyMedium() {
		return this.#resolve("bodyMedium");
	}
	override get bodySmall() {
		return this.#resolve("bodySmall");
	}
	override get labelLarge() {
		return this.#resolve("labelLarge");
	}
	override get labelMedium() {
		return this.#resolve("labelMedium");
	}
	override get labelSmall() {
		return this.#resolve("labelSmall");
	}
	// ─── Emphasized
	override get displayLargeEmphasized() {
		return this.#resolve("displayLargeEmphasized");
	}
	override get displayMediumEmphasized() {
		return this.#resolve("displayMediumEmphasized");
	}
	override get displaySmallEmphasized() {
		return this.#resolve("displaySmallEmphasized");
	}
	override get headlineLargeEmphasized() {
		return this.#resolve("headlineLargeEmphasized");
	}
	override get headlineMediumEmphasized() {
		return this.#resolve("headlineMediumEmphasized");
	}
	override get headlineSmallEmphasized() {
		return this.#resolve("headlineSmallEmphasized");
	}
	override get titleLargeEmphasized() {
		return this.#resolve("titleLargeEmphasized");
	}
	override get titleMediumEmphasized() {
		return this.#resolve("titleMediumEmphasized");
	}
	override get titleSmallEmphasized() {
		return this.#resolve("titleSmallEmphasized");
	}
	override get bodyLargeEmphasized() {
		return this.#resolve("bodyLargeEmphasized");
	}
	override get bodyMediumEmphasized() {
		return this.#resolve("bodyMediumEmphasized");
	}
	override get bodySmallEmphasized() {
		return this.#resolve("bodySmallEmphasized");
	}
	override get labelLargeEmphasized() {
		return this.#resolve("labelLargeEmphasized");
	}
	override get labelMediumEmphasized() {
		return this.#resolve("labelMediumEmphasized");
	}
	override get labelSmallEmphasized() {
		return this.#resolve("labelSmallEmphasized");
	}
}

// ─── Token → Property lookup (avoids recreating the map on every fromToken call) ──

type TypographyProp = {
	[K in keyof Typography]: Typography[K] extends TextStyle ? K : never;
}[keyof Typography];

const TOKEN_TO_PROP: Record<TypographyKeyTokens, TypographyProp> = {
	[TypographyKeyTokens.DisplayLarge]: "displayLarge",
	[TypographyKeyTokens.DisplayMedium]: "displayMedium",
	[TypographyKeyTokens.DisplaySmall]: "displaySmall",
	[TypographyKeyTokens.HeadlineLarge]: "headlineLarge",
	[TypographyKeyTokens.HeadlineMedium]: "headlineMedium",
	[TypographyKeyTokens.HeadlineSmall]: "headlineSmall",
	[TypographyKeyTokens.TitleLarge]: "titleLarge",
	[TypographyKeyTokens.TitleMedium]: "titleMedium",
	[TypographyKeyTokens.TitleSmall]: "titleSmall",
	[TypographyKeyTokens.BodyLarge]: "bodyLarge",
	[TypographyKeyTokens.BodyMedium]: "bodyMedium",
	[TypographyKeyTokens.BodySmall]: "bodySmall",
	[TypographyKeyTokens.LabelLarge]: "labelLarge",
	[TypographyKeyTokens.LabelMedium]: "labelMedium",
	[TypographyKeyTokens.LabelSmall]: "labelSmall",
	[TypographyKeyTokens.DisplayLargeEmphasized]: "displayLargeEmphasized",
	[TypographyKeyTokens.DisplayMediumEmphasized]: "displayMediumEmphasized",
	[TypographyKeyTokens.DisplaySmallEmphasized]: "displaySmallEmphasized",
	[TypographyKeyTokens.HeadlineLargeEmphasized]: "headlineLargeEmphasized",
	[TypographyKeyTokens.HeadlineMediumEmphasized]: "headlineMediumEmphasized",
	[TypographyKeyTokens.HeadlineSmallEmphasized]: "headlineSmallEmphasized",
	[TypographyKeyTokens.TitleLargeEmphasized]: "titleLargeEmphasized",
	[TypographyKeyTokens.TitleMediumEmphasized]: "titleMediumEmphasized",
	[TypographyKeyTokens.TitleSmallEmphasized]: "titleSmallEmphasized",
	[TypographyKeyTokens.BodyLargeEmphasized]: "bodyLargeEmphasized",
	[TypographyKeyTokens.BodyMediumEmphasized]: "bodyMediumEmphasized",
	[TypographyKeyTokens.BodySmallEmphasized]: "bodySmallEmphasized",
	[TypographyKeyTokens.LabelLargeEmphasized]: "labelLargeEmphasized",
	[TypographyKeyTokens.LabelMediumEmphasized]: "labelMediumEmphasized",
	[TypographyKeyTokens.LabelSmallEmphasized]: "labelSmallEmphasized",
};

// ─── React Context API ────────────────────────────────────────────────────────

/** Singleton default token instance (shared; never mutated). */
const defaultTokens = new TypographyTokens();

/**
 * Default {@link Typography} instance used as the context fallback when no
 * `TypographyProvider` is present in the tree.
 *
 * Mirrors `private val LocalTypography = staticCompositionLocalOf { Typography() }`.
 */
const defaultTypography = new Typography();

/**
 * React context that holds the current {@link Typography} instance.
 *
 * Port of `internal val LocalTypography = staticCompositionLocalOf { Typography() }`.
 *
 * @internal — Prefer {@link useTypography} and {@link TypographyProvider}.
 */
export const TypographyContext = createContext<Typography>(defaultTypography);

/**
 * React hook to access the current {@link Typography} from the nearest
 * {@link TypographyProvider} in the tree. Falls back to the default
 * googleapis Typography when no provider is present.
 *
 * @returns The current `Typography` instance.
 *
 * @example
 * ```tsx
 * const typography = useTypography();
 * <p style={typography.bodyLarge}>Hello</p>
 * ```
 */
export function useTypography(): Typography {
	return useContext(TypographyContext);
}

// ─── TypographyProvider ───────────────────────────────────────────────────────

/**
 * Props for {@link TypographyProvider}.
 */
export interface TypographyProviderProps {
	/** The child tree that will have access to the provided typography. */
	children: ReactNode;
	/**
	 * A fully custom {@link Typography} instance.
	 * When provided, `fontFamily` and `fontVariationAxes` are ignored.
	 */
	typography?: Typography;
	/**
	 * Shorthand to override the CSS `font-family` for all typography styles.
	 * Ignored when `typography` is provided.
	 *
	 * @example "'Roboto', sans-serif"
	 */
	fontFamily?: string;
	/**
	 * Variable font axes to apply globally via `font-variation-settings`.
	 * Merged on top of the defaults (`ROND: 100`). Only the axes you specify
	 * will be overridden; unspecified axes retain font defaults.
	 * Ignored when `typography` is provided.
	 *
	 * @example { ROND: 50 }  // half-rounded
	 * @example { ROND: 0 }   // sharp corners
	 */
	fontVariationAxes?: FontVariationAxes;
}

/**
 * Typography Provider component.
 *
 * Port of `CompositionLocalProvider(LocalTypography provides typography)`.
 * Wrap your application (or a subtree) to provide MD3 Expressive typography
 * to all descendant components that call {@link useTypography}.
 *
 * The context value is **memoized** — it is only re-computed when `typography`,
 * `fontFamily`, or `fontVariationAxes` change, preventing unnecessary re-renders.
 *
 * @example Default (Google Sans Flex, ROND = 100)
 * ```tsx
 * <TypographyProvider>
 *   <App />
 * </TypographyProvider>
 * ```
 *
 * @example Custom font
 * ```tsx
 * <TypographyProvider fontFamily="'Inter', sans-serif">
 *   <App />
 * </TypographyProvider>
 * ```
 *
 * @example Partially rounded corners (ROND = 50)
 * ```tsx
 * <TypographyProvider fontVariationAxes={{ ROND: 50 }}>
 *   <App />
 * </TypographyProvider>
 * ```
 *
 * @example Fully sharp (ROND = 0) with a custom font
 * ```tsx
 * <TypographyProvider
 *   fontFamily="'Outfit', sans-serif"
 *   fontVariationAxes={{ ROND: 0 }}
 * >
 *   <App />
 * </TypographyProvider>
 * ```
 */
export function TypographyProvider({
	children,
	typography,
	fontFamily,
	fontVariationAxes,
}: TypographyProviderProps) {
	const value = useMemo<Typography>(() => {
		if (typography) return typography;
		if (fontFamily || fontVariationAxes) {
			return new Typography(
				new TypographyTokens({ fontFamily, fontVariationAxes }),
			);
		}
		return defaultTypography;
	}, [typography, fontFamily, fontVariationAxes]);

	return (
		<TypographyContext.Provider value={value}>
			{children}
		</TypographyContext.Provider>
	);
}
