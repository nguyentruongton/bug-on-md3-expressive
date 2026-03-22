# Circular Progress Wavy Shape Implementation Plan

## 1. Overview
The goal of this task is to implement the Material Design 3 Expressive "wavy" shape for the Circular Progress Indicator component. Currently, the `ProgressIndicator` only supports the wavy shape for the `linear` variant. We need to apply similar expressive SVG math and animation logic to the `circular` variant.

## 2. Project Type
**WEB** (React components library)
Agent assignment: `frontend-specialist`

## 3. Success Criteria
- The `CircularProgressProps` accepts a `shape` property (`"flat" | "wavy"`), `amplitude`, and `wavelength`.
- The wavy shape renders correctly around the circular track.
- The indicator animates correctly for both `determinate` and `indeterminate` states.
- Accessibility properties (`role`, `aria-*` tags) remain intact.
- New unit tests confirm that the wavy circular indicator renders without crashing and accepts custom amplitudes/wavelengths.

## 4. Tech Stack
- **Framework:** React
- **Animation:** `motion/react` (LazyMotion, m)
- **Styling:** Tailwind CSS + custom MD3 design tokens
- **Testing:** Vitest + React Testing Library

## 5. File Structure
The following files will be modified:
- `packages/react/src/ui/progress-indicator.tsx`
- `packages/react/src/test/progress-indicator.test.tsx`

---

## 6. Task Breakdown

### Task 1: Extend CircularProgressProps
- **Agent:** `frontend-specialist`
- **Skill:** `typescript-expert`, `frontend-design`
- **Description:** Add `shape?: "flat" | "wavy"`, `amplitude?: number`, and `wavelength?: number` to `CircularProgressProps` in `packages/react/src/ui/progress-indicator.tsx`. Update the `ProgressIndicator` interface to support these uniformly where appropriate.
- **INPUT:** `CircularProgressProps` interface
- **OUTPUT:** Updated interface with new properties
- **VERIFY:** TypeScript compilation passes without errors (`npm run lint`).

### Task 2: Implement Wavy Circular SVG Generation
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Description:** Create a helper function `generateWavyCircularPath(radius, amplitude, wavelength)` that calculates the SVG `path` data (`d` attribute) for a wavy circle using polar coordinates and quadratic/cubic bezier curves (`Q` or `C`). Ensure the path closes seamlessly.
- **INPUT:** `radius`, `amplitude`, `wavelength`
- **OUTPUT:** SVG path string `d="..."`
- **VERIFY:** Visual check or testing to ensure the SVG string contains valid path commands (`M`, `Q`/`C`, `Z`).

### Task 3: Update CircularProgress Component Rendering
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`, `frontend-design`
- **Description:** Modify the `<CircularProgress />` component to render the flat `<circle>` or the wavy `<m.path>` based on the `shape` prop. Map the `determinate` and `indeterminate` animation states (using `strokeDashoffset` and `rotate`) to the new wavy path.
- **INPUT:** Updated props, new wavy SVG math
- **OUTPUT:** Working component rendering
- **VERIFY:** Dev server preview of the wavy circular progress. Transitions match the existing MD3 motion specs.

### Task 4: Add Unit Tests
- **Agent:** `test-engineer`
- **Skill:** `testing-patterns`
- **Description:** In `packages/react/src/test/progress-indicator.test.tsx`, add a new describe block: `describe("Circular - Wavy")`. Add test cases to verify that the SVG path is rendered properly when `shape="wavy"`, and that custom `amplitude` and `wavelength` are applied.
- **INPUT:** Modified component
- **OUTPUT:** New test block
- **VERIFY:** `npm run test` inside `packages/react` passes.

---

## 7. Phase X: Verification Checklist

> **MANDATORY**: Run the following commands to verify everything once implementation is complete.

- [ ] **Lint and Type Check:**
  ```bash
  cd packages/react && npm run lint
  ```
- [ ] **Unit Tests:**
  ```bash
  cd packages/react && npm run test
  ```
- [ ] **Accessibility and Code Audit (Master Script):**
  ```bash
  python .agent/scripts/checklist.py .
  ```
- [ ] **Visual Verification:**
  ```bash
  npm run dev
  ```
  *(Check the demo documentation pages to make sure the circular wavy progress indicator is rendering and animating smoothly in both LTR and RTL directions).*

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Tests: ✅ Pass
- Checklist: ✅ Pass
- Date: 2026-03-21
