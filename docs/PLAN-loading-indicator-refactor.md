# PLAN: Loading Indicator Refactor to MD3 Expressive

Refactor the `LoadingIndicator` component to align with Material Design 3 Expressive standards, ensuring high performance, accessibility, and flexible styling (dynamic colors).

## 0. Socratic Gate (User Review Required)

> [!IMPORTANT]
> Please review these questions before I proceed to implementation:
> 1. **Shapes**: The current implementation uses 7 shapes (Circle, Triangle, Diamond, etc.). MD3 Expressive spec sometimes uses a larger set or specific order. Should I stick with these 7 or do you have a specific SVG set?
> 2. **Animation Loop**: Do you prefer the continuous morphing loop as it is now, or should I implement any specific timing/easing changes (e.g., "emphasized" easing)?
> 3. **Size Defaults**: The "code mẫu" uses 48 as default. Should I strictly follow the 24, 48, 240 pixel constraints mentioned in your sample?

## 1. Proposed Changes

### [Component] Loading Indicator

#### [MODIFY] [loading-indicator.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/loading-indicator.tsx)
- [ ] **Structural Refactor**: Use the structure from the provided sample code.
    - Standardize `size` handling with `scaleFactor = size / 48`.
    - Implement `variant` ("uncontained" | "contained") with correct MD3 dimensions (38dp container for 48dp component).
- [ ] **SVG & Animation Integration**:
    - **Remove `motion/react` (Framer Motion)**: Use the native SMIL animation provided in `loading-indicator.svg` for better performance and smaller bundle size.
    - Use `<animate>` for path morphing and `<animateTransform>` for rotation.
    - Update `viewBox` to `4 4 40 40` to match the official spec SVG.
- [ ] **Color System**:
    - Change fixed `fill` in SVG to `fill="currentColor"`.
    - Default to MD3 system color tokens: `--md-sys-color-indicator-active` and `--md-sys-color-indicator-contained-active`.
    - Support the `color` prop via inline `style={{ color: ... }}` on the SVG wrapper.
- [ ] **Accessibility**:
    - Ensure `role="progressbar"` is correctly applied.
    - Retain mandatory `aria-label`.
    - Set `aria-valuemin={0}` and `aria-valuemax={100}`.

## 2. Verification Plan

### Automated Tests
- Run existing tests: `pnpm --filter @nguyentruongton/ui-react test src/test/loading-indicator.test.tsx`
- Add new test cases for:
    - [ ] Dynamic color inheritance via `currentColor`.
    - [ ] `contained` variant dimensions check.
    - [ ] `size` scaling logic.

### Manual Verification
1.  **Docs App**: View the component in the documentation app (if a demo exists or by adding one temporarily).
2.  **Theme Switch**: Verify color changes correctly when switching between Light and Dark modes.
3.  **Color Prop**: Pass a custom hex/color string to the `color` prop and verify it overrides the default.
4.  **A11y Audit**: Use browser dev tools to inspect accessibility properties.
