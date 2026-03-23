/**
 * @file typography-tokens.ts
 * @description MD3 Expressive Typography Token Definitions.
 *
 * Port of `androidx.compose.material3.tokens.TypographyTokens` (Kotlin class).
 *
 * ### Memory Optimization
 * All 30 `TextStyle` properties are implemented as **lazy getters** — they are
 * computed on first access and cached, rather than being computed eagerly at
 * construction time. This reduces the instantiation cost of `TypographyTokens`.
 *
 * ### Variable Font Axes
 * Supports customizable CSS `font-variation-settings` via {@link FontVariationAxes}.
 * - Default `ROND` value is `100` (maximum roundness of Google Sans Flex).
 * - Other axes remain at font defaults unless explicitly overridden.
 *
 * @example Basic usage (default tokens)
 * ```ts
 * const tokens = new TypographyTokens();
 * const style = tokens.BodyLarge; // { fontSize, fontWeight, ... }
 * ```
 *
 * @example Custom font family
 * ```ts
 * const tokens = new TypographyTokens({ fontFamily: "'Inter', sans-serif" });
 * ```
 *
 * @example Custom ROND axis (partial roundness)
 * ```ts
 * const tokens = new TypographyTokens({ fontVariationAxes: { ROND: 50 } });
 * ```
 */

import { TypeScaleTokens } from "./type-scale-tokens";

// ─── Font Variation ───────────────────────────────────────────────────────────

/**
 * Configurable axes for CSS `font-variation-settings`.
 *
 * Each key maps to a named variable font axis. Any axis not specified falls
 * back to the font's own default value.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
 *
 * @example
 * ```ts
 * const axes: FontVariationAxes = { ROND: 100, wght: 600 };
 * ```
 */
export interface FontVariationAxes {
  /**
   * Roundness axis of Google Sans Flex Variable Font.
   * Range: `0` (sharp corners) – `100` (fully rounded).
   * @default 100
   */
  ROND?: number;
  /**
   * Weight axis. Overrides `font-weight` via variation settings.
   * @default font default
   */
  wght?: number;
  /**
   * Width axis. Controls glyph condensation/expansion.
   * @default font default
   */
  wdth?: number;
  /** Any additional named variation axis supported by the font. */
  [axis: string]: number | undefined;
}

/**
 * Default font variation axes for MD3 Expressive.
 * Sets `ROND` to `100` for maximum roundness; all other axes use font defaults.
 */
export const DEFAULT_FONT_VARIATION_AXES: Readonly<FontVariationAxes> =
  Object.freeze({ ROND: 100 });

/**
 * Serializes a {@link FontVariationAxes} map into a CSS `font-variation-settings` string.
 *
 * @example
 * ```ts
 * serializeFontVariationAxes({ ROND: 100, wght: 700 });
 * // → '"ROND" 100, "wght" 700'
 * ```
 */
export function serializeFontVariationAxes(
  axes: FontVariationAxes
): string {
  return Object.entries(axes)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `"${k}" ${v}`)
    .join(", ");
}

/**
 * Pre-computed default `font-variation-settings` string.
 * Equivalent to `'"ROND" 100'`.
 */
export const MD3_EXPRESSIVE_FONT_VARIATION: string = serializeFontVariationAxes(
  DEFAULT_FONT_VARIATION_AXES
);

// ─── TextStyle ────────────────────────────────────────────────────────────────

/**
 * Web equivalent of Compose's `TextStyle`.
 *
 * All properties are readonly and map directly to CSS font properties.
 * The `fontVariationSettings` field carries the serialized variable-font axes.
 */
export interface TextStyle {
  /** CSS `font-family` value. */
  readonly fontFamily: string;
  /** CSS `font-weight` numeric value (e.g. `400`, `700`). */
  readonly fontWeight: number;
  /** CSS `font-size` in `rem` units. */
  readonly fontSize: string;
  /** CSS `line-height` in `rem` units. */
  readonly lineHeight: string;
  /** CSS `letter-spacing` in `px` units. */
  readonly letterSpacing: string;
  /**
   * CSS `font-variation-settings` string.
   * @example '"ROND" 100'
   * @example '"ROND" 50, "wght" 600'
   */
  readonly fontVariationSettings: string;
}

// ─── TypographyTokens Options ─────────────────────────────────────────────────

/**
 * Constructor options for {@link TypographyTokens}.
 */
export interface TypographyTokensOptions {
  /**
   * Custom CSS `font-family` string. When provided, overrides the default
   * Google Sans Flex font for all token styles.
   *
   * @example "'Roboto', sans-serif"
   */
  fontFamily?: string;
  /**
   * Variable font axes to apply via `font-variation-settings`.
   * Merged on top of {@link DEFAULT_FONT_VARIATION_AXES}.
   * Provide only the axes you want to override.
   *
   * @example { ROND: 0 } // sharp corners
   */
  fontVariationAxes?: FontVariationAxes;
}

// ─── Internal factory ─────────────────────────────────────────────────────────

type TokenRecord = Record<string, string | number>;

/**
 * Creates a frozen {@link TextStyle} from the {@link TypeScaleTokens} lookup
 * using the given token prefix (e.g. `"BodyLarge"`).
 *
 * @internal
 */
function buildStyle(
  prefix: string,
  fontFamily: string | undefined,
  fontVariationSettings: string
): TextStyle {
  const t = TypeScaleTokens as TokenRecord;
  return Object.freeze({
    fontFamily: fontFamily ?? (t[`${prefix}Font`] as string),
    fontWeight: t[`${prefix}Weight`] as number,
    fontSize: t[`${prefix}Size`] as string,
    lineHeight: t[`${prefix}LineHeight`] as string,
    letterSpacing: t[`${prefix}Tracking`] as string,
    fontVariationSettings,
  });
}

// ─── TypographyTokens ─────────────────────────────────────────────────────────

/**
 * MD3 Expressive Typography Token class.
 *
 * Port of `internal class TypographyTokens(val fontFamily: FontFamily? = null)`
 * from `androidx.compose.material3.tokens.TypographyTokens`.
 *
 * Provides 30 pre-defined {@link TextStyle} properties (15 baseline + 15 emphasized),
 * each implemented as a **lazy getter** — computed once on first access, then cached.
 *
 * ### Customization
 * Pass {@link TypographyTokensOptions} to the constructor to override:
 * - `fontFamily` — swap the typeface
 * - `fontVariationAxes` — control variable font axes (e.g., `ROND`)
 *
 * @example Default
 * ```ts
 * const tokens = new TypographyTokens();
 * ```
 *
 * @example Custom font + half-rounded
 * ```ts
 * const tokens = new TypographyTokens({
 *   fontFamily: "'Inter', sans-serif",
 *   fontVariationAxes: { ROND: 50 },
 * });
 * ```
 */
export class TypographyTokens {
  readonly #fontFamily: string | undefined;
  readonly #fontVariationSettings: string;

  constructor(options: TypographyTokensOptions | string = {}) {
    // Support legacy string signature: new TypographyTokens("'Inter', sans-serif")
    if (typeof options === "string") {
      this.#fontFamily = options;
      this.#fontVariationSettings = MD3_EXPRESSIVE_FONT_VARIATION;
    } else {
      this.#fontFamily = options.fontFamily;
      const axes: FontVariationAxes = options.fontVariationAxes
        ? { ...DEFAULT_FONT_VARIATION_AXES, ...options.fontVariationAxes }
        : DEFAULT_FONT_VARIATION_AXES;
      this.#fontVariationSettings = serializeFontVariationAxes(axes);
    }
  }

  // Helper to lazily build + cache a style on first access
  #cache: Map<string, TextStyle> = new Map();
  #get(prefix: string): TextStyle {
    let style = this.#cache.get(prefix);
    if (!style) {
      style = buildStyle(prefix, this.#fontFamily, this.#fontVariationSettings);
      this.#cache.set(prefix, style);
    }
    return style;
  }

  // ─── Baseline Styles (15) ──────────────────────────────────────────────────
  /** Display Large – `57px`, weight 400 */
  get DisplayLarge(): TextStyle { return this.#get("DisplayLarge"); }
  /** Display Medium – `45px`, weight 400 */
  get DisplayMedium(): TextStyle { return this.#get("DisplayMedium"); }
  /** Display Small – `36px`, weight 400 */
  get DisplaySmall(): TextStyle { return this.#get("DisplaySmall"); }
  /** Headline Large – `32px`, weight 400 */
  get HeadlineLarge(): TextStyle { return this.#get("HeadlineLarge"); }
  /** Headline Medium – `28px`, weight 400 */
  get HeadlineMedium(): TextStyle { return this.#get("HeadlineMedium"); }
  /** Headline Small – `24px`, weight 400 */
  get HeadlineSmall(): TextStyle { return this.#get("HeadlineSmall"); }
  /** Title Large – `22px`, weight 400 */
  get TitleLarge(): TextStyle { return this.#get("TitleLarge"); }
  /** Title Medium – `16px`, weight 500 */
  get TitleMedium(): TextStyle { return this.#get("TitleMedium"); }
  /** Title Small – `14px`, weight 500 */
  get TitleSmall(): TextStyle { return this.#get("TitleSmall"); }
  /** Body Large – `16px`, weight 400 */
  get BodyLarge(): TextStyle { return this.#get("BodyLarge"); }
  /** Body Medium – `14px`, weight 400 */
  get BodyMedium(): TextStyle { return this.#get("BodyMedium"); }
  /** Body Small – `12px`, weight 400 */
  get BodySmall(): TextStyle { return this.#get("BodySmall"); }
  /** Label Large – `14px`, weight 500 */
  get LabelLarge(): TextStyle { return this.#get("LabelLarge"); }
  /** Label Medium – `12px`, weight 500 */
  get LabelMedium(): TextStyle { return this.#get("LabelMedium"); }
  /** Label Small – `11px`, weight 500 */
  get LabelSmall(): TextStyle { return this.#get("LabelSmall"); }

  // ─── Emphasized Styles (15) – MD3 Expressive ──────────────────────────────
  /** Display Large Emphasized – `57px`, weight 800 */
  get DisplayLargeEmphasized(): TextStyle { return this.#get("DisplayLargeEmphasized"); }
  /** Display Medium Emphasized – `45px`, weight 800 */
  get DisplayMediumEmphasized(): TextStyle { return this.#get("DisplayMediumEmphasized"); }
  /** Display Small Emphasized – `36px`, weight 800 */
  get DisplaySmallEmphasized(): TextStyle { return this.#get("DisplaySmallEmphasized"); }
  /** Headline Large Emphasized – `32px`, weight 800 */
  get HeadlineLargeEmphasized(): TextStyle { return this.#get("HeadlineLargeEmphasized"); }
  /** Headline Medium Emphasized – `28px`, weight 800 */
  get HeadlineMediumEmphasized(): TextStyle { return this.#get("HeadlineMediumEmphasized"); }
  /** Headline Small Emphasized – `24px`, weight 800 */
  get HeadlineSmallEmphasized(): TextStyle { return this.#get("HeadlineSmallEmphasized"); }
  /** Title Large Emphasized – `22px`, weight 700 */
  get TitleLargeEmphasized(): TextStyle { return this.#get("TitleLargeEmphasized"); }
  /** Title Medium Emphasized – `16px`, weight 700 */
  get TitleMediumEmphasized(): TextStyle { return this.#get("TitleMediumEmphasized"); }
  /** Title Small Emphasized – `14px`, weight 700 */
  get TitleSmallEmphasized(): TextStyle { return this.#get("TitleSmallEmphasized"); }
  /** Body Large Emphasized – `16px`, weight 700 */
  get BodyLargeEmphasized(): TextStyle { return this.#get("BodyLargeEmphasized"); }
  /** Body Medium Emphasized – `14px`, weight 700 */
  get BodyMediumEmphasized(): TextStyle { return this.#get("BodyMediumEmphasized"); }
  /** Body Small Emphasized – `12px`, weight 700 */
  get BodySmallEmphasized(): TextStyle { return this.#get("BodySmallEmphasized"); }
  /** Label Large Emphasized – `14px`, weight 800 */
  get LabelLargeEmphasized(): TextStyle { return this.#get("LabelLargeEmphasized"); }
  /** Label Medium Emphasized – `12px`, weight 800 */
  get LabelMediumEmphasized(): TextStyle { return this.#get("LabelMediumEmphasized"); }
  /** Label Small Emphasized – `11px`, weight 800 */
  get LabelSmallEmphasized(): TextStyle { return this.#get("LabelSmallEmphasized"); }
}
