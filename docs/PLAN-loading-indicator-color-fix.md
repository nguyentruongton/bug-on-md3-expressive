# PLAN: Fix LoadingIndicator Color & Inheritance

## 1. Symptom
User reports the active indicator in `contained` variant looks "black".

## 2. Analysis
- Current implementation uses `var(--md-sys-color-on-primary-container)` which is `#21005d` (Deep Purple) in Light Theme. This can look black.
- If the token is not defined in the environment, it falls back to the default `currentColor`, which is often black.
- The `color` style is currently applied to an inner `div` for contained variant, and another inner `div` for uncontained. This repeats logic.

## 3. Proposed Changes

### [React] LoadingIndicator Component

#### [MODIFY] [loading-indicator.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/loading-indicator.tsx)
- Apply the `activeColor` to the outermost `div`'s `style` to ensure consistent inheritance for both variants.
- Add a CSS variable fallback to `activeColor` logic (e.g. `var(--token, currentColor)`) to be extra safe.
- Verify if `primary` might be preferred by the user over `on-primary-container` if they find it too dark, but stay with spec (`on-primary-container`) as default.

#### [MODIFY] [colors.css](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/tokens/src/colors.css)
- No changes planned yet, unless user confirms they want a different token than `on-primary-container`.

## 4. Verification Plan

### Automated Tests
- Run existing vitest tests: `pnpm --filter @bug-on/md3-react exec vitest run src/test/loading-indicator.test.tsx`

### Manual Verification
- Check the color in the browser. If it's still "too black", I will suggest using `var(--md-sys-color-primary)` instead.
