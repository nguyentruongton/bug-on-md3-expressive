# [PLAN] LoadingIndicator MD3 Improvement - Expressive Compliance

This plan refines the `LoadingIndicator` to support both indeterminate and determinate modes while strictly following Material Design 3 Expressive guidelines from Android/Kotlin source.

## Proposed Changes

### [packages/react]

#### [MODIFY] [loading-indicator.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/loading-indicator.tsx)
-   **Add `progress` prop (number, 0-1)**.
-   **Determinate Mode Implementation**:
    -   If `progress` is provided:
        -   Morph between **Circle** and **SoftBurst**.
        -   Apply **counterclockwise rotation** (-180deg * progress).
        -   Use React-based attribute updates for path `d` and `transform` to sync with the `progress` prop.
-   **Responsive & Sizing Refinements**:
    -   **Constraint Enforcement**: Use `Math.min(240, Math.max(24, size))` to strictly enforce the 24dp–240dp range.
    -   **Constant Ratio**: 
        -   Uncontained: 48dp total area.
        -   Contained: 38dp container / 24dp active indicator (Ratio: 1.583).
        -   Implementation: Use `scaleFactor = clampedSize / 48` to derive all dimensions.
    -   **Responsive Sizing**: Support `size` as a number (default 48). For full responsiveness, the user should provide different `size` values based on screen matches (standard React pattern).
    -   **Large Viewport Guidelines**: In the documentation, explicitly recommend sizes >80dp only for large/XL windows (desktop).
-   **Accessibility (a11y)**:
    -   Add `aria-valuenow` when `progress` is present.
    -   Ensure `aria-label` is used as the primary identifier.

### [packages/tokens]
-   Ensure `on-primary-container` and `primary-container` tokens are correctly used for the `contained` variant.

## Verification Plan

### Automated Tests
-   `pnpm --filter @bug-on/md3-react exec vitest run src/test/loading-indicator.test.tsx`
-   Add cases for `progress={0.5}`.

### Manual Verification
-   Check documentation page for smooth morphing in both modes.
-   Verify rotation direction (clockwise for indeterminate, counterclockwise for determinate).
