# Typography Optimization Plan

## Overview
This project aims to optimize the Material Design 3 Expressive Typography system by prioritizing performance and memory allocation. It involves refactoring the internal structure from static property initialization to lazy-loading getters, allowing for significant improvements in initialization speed and memory footprint. Additionally, the plan includes writing comprehensive JSDoc comments in English for all properties and components, and creating a new demo page to showcase the typography system. Breaking changes to the Public API are permitted to achieve maximum optimization.

## Project Type
WEB (React UI Library & Documentation App)

## Success Criteria
- [ ] Memory footprint is reduced during the initialization of the Typography class via lazy-loading/getters.
- [ ] Added props to `TypographyProvider` and typography tokens to allow adjusting variable font axes (e.g., `ROND`, `WGHT`). By default, `ROND` is fully rounded, while other axes use font defaults.
- [ ] React performance in the `TypographyProvider` and `useTypography` hook is optimized (e.g., using `useMemo`).
- [ ] All methods, classes, and properties have comprehensive JSDocs in English.
- [ ] A dedicated Typography demo page is fully implemented and accessible.
- [ ] All existing Unit Tests in `__tests__/Typography.test.tsx` pass without regressions (or are updated to reflect intentional breaking changes).
- [ ] Code passes lint, type checking, and security audits.

## Tech Stack
- **TypeScript**: Ensuring full type safety during refactoring.
- **React**: Context API optimization (using `useMemo` for Providers).
- **CSS Modules/Vanilla Extract** (Optional): Depending on how the current CSS is mapped to Typography.
- **Vitest/Jest**: Unit testing framework.

## File Structure
```
packages/react/src/ui/typography/
├── index.ts
├── typography.tsx (Focus of context/memoization optimization)
├── typography-tokens.ts (Focus of memory allocation optimization)
├── typography-key-tokens.ts (Focus of JSDoc additions)
├── typography.css
└── __tests__/
    └── Typography.test.tsx (Focus of test verification)
apps/docs/app/(demo)/typography/
└── page.tsx (New dedicated demo page)
```

## Task Breakdown

### Task 1: Refactor `Typography` class to use Lazy Getters
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `performance-profiling`
- **Priority**: P0
- **Dependencies**: None
- **INPUT→OUTPUT→VERIFY**:
  - *Input*: `packages/react/src/ui/typography/typography.tsx`
  - *Output*: Refactored `Typography` class where all 30 properties (e.g., `displayLarge`, `bodySmallEmphasized`) are generated dynamically when accessed using getters (`get displayLarge() { ... }`) to save memory allocation at startup.
  - *Verify*: Run unit tests to confirm the `Typography` object still resolves correct `TextStyle` attributes for each property.

### Task 2: Optimize React Context Provider & Add Font Axes Props
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`, `clean-code`
- **Priority**: P0
- **Dependencies**: Task 1
- **INPUT→OUTPUT→VERIFY**:
  - *Input*: `packages/react/src/ui/typography/typography.tsx` (Specifically `TypographyProvider`)
  - *Output*: 
    - `TypographyProvider` leverages React `useMemo` correctly to prevent unnecessary re-renders when the `typography` or `fontFamily` props change.
    - Explicitly add props (or config) to allow dynamic adjustment of variable font axes, especially `ROND` (Roundness). Default `ROND` to fully rounded, with other axes remaining at font defaults.
  - *Verify*: Check React DevTools Profiler to ensure the Provider re-renders efficiently. Confirm via the DOM/CSS that the `font-variation-settings` appropriately reflect the ROND variable. Run existing unit tests.

### Task 3: Comprehensive English JSDocs
- **Agent**: `frontend-specialist`
- **Skills**: `documentation-templates`
- **Priority**: P1
- **Dependencies**: Task 1, Task 2
- **INPUT→OUTPUT→VERIFY**:
  - *Input*: `typography.tsx`, `typography-tokens.ts`, `typography-key-tokens.ts`
  - *Output*: English JSDoc blocks added to all classes, interfaces, properties, and important methods. Comments must include usage examples where appropriate.
  - *Verify*: Run linting. Use an IDE to verify IntelliSense surfaces the documentation correctly.

### Task 4: Update Unit Tests
- **Agent**: `test-engineer`
- **Skills**: `testing-patterns`, `tdd-workflow`
- **Priority**: P0
- **Dependencies**: Task 1, Task 2
- **INPUT→OUTPUT→VERIFY**:
  - *Input*: `packages/react/src/ui/typography/__tests__/Typography.test.tsx`
  - *Output*: Fix any tests that broke due to the API or internal lazy getter changes. Add new assertions to prove the Lazy Getter pattern works as intended.
  - *Verify*: `npm run test` executes successfully.

### Task 5: Implement Typography Demo Page
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Priority**: P1
- **Dependencies**: Task 3
- **INPUT→OUTPUT→VERIFY**:
  - *Input*: Demo app structure (`apps/docs/...`)
  - *Output*: An interactive layout or static showcase displaying all 30 MD3 Expressive typography styles. Must include interactive controls to test variable font axes (e.g., a slider or toggle for the `ROND` property) to verify real-time adjustments.
  - *Verify*: Start server (`pnpm dev`), manually inspect the Typography demo route (e.g., `/docs/typography`), and verify the ROND slider works correctly.

## ✅ Phase X: Verification (MANDATORY SCRIPT EXECUTION)
- [ ] Run Lint & Type Check: `npm run lint && npx tsc --noEmit`
- [ ] Run Unit Tests: `npm run test`
- [ ] Manual Check: No purple/violet hex codes used in demo.
- [ ] Run Build: `npm run build`
- [ ] Socratic Gate was respected.
