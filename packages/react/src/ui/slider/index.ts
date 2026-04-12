/**
 * @file index.ts
 * MD3 Expressive Slider — Public API exports.
 */

"use client";

export { RangeSlider } from "./range-slider";
export { Slider } from "./slider";
// Tokens (for customization)
export { SliderColors, SliderTokens } from "./slider.tokens";
// Types
export type {
	RangeSliderProps,
	SliderOrientation,
	SliderProps,
	SliderTrackSize,
	SliderVariant,
} from "./slider.types";
export { SliderThumb } from "./slider-thumb";
