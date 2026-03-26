# PLAN: Fix LoadingIndicator Contained Visibility

## 1. Symptom
When `variant="contained"`, the morphing shape is invisible because it has the same color as the container background.

## 2. Root Cause
In `packages/tokens/src/colors.css`, both `--md-sys-color-indicator-contained-active` and `--md-sys-color-indicator-contained-container` are assigned to `var(--md-sys-color-primary-container)` in the Light Theme.

## 3. Proposed Changes

### [Tokens] Color System

#### [MODIFY] [colors.css](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/tokens/src/colors.css)
- Change `--md-sys-color-indicator-contained-active` from `var(--md-sys-color-primary-container)` to `var(--md-sys-color-on-primary-container)`.

## 4. Verification Plan

### Automated Tests
- The existing test `renders contained variant with a circular container` passes because it only checks for the presence of the div, not the color contrast.
- I will add a new test case to `packages/react/src/test/loading-indicator.test.tsx` (if possible in jsdom) or simply rely on manual verification as the fix is a token change.

### Manual Verification
1. Open the documentation app.
2. Navigate to the Loading Indicator section.
3. Verify that the "Contained" variant now shows the morphing shape clearly against the background.
4. Verify both Light and Dark modes.
