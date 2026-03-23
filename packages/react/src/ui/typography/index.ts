/**
 * @file index.ts
 * @description Public API for the MD3 Expressive Typography module.
 *
 * Re-exports all types, classes, constants, and hooks required to integrate
 * the typography system into a React application.
 *
 * @module typography
 */

export type { TypeScaleTokensType } from "./type-scale-tokens";
export { TypeScaleTokens } from "./type-scale-tokens";

export type { TypographyProviderProps } from "./typography";
export {
  Typography,
  TypographyContext,
  TypographyProvider,
  useTypography,
} from "./typography";

export { TypographyKeyTokens } from "./typography-key-tokens";

export type { TextStyle, FontVariationAxes, TypographyTokensOptions } from "./typography-tokens";
export {
  MD3_EXPRESSIVE_FONT_VARIATION,
  DEFAULT_FONT_VARIATION_AXES,
  serializeFontVariationAxes,
  TypographyTokens,
} from "./typography-tokens";
