# @bug-on/md3-react

## 3.0.2

### Patch Changes

- **Motion**: Improved `SPRING_TRANSITION_EXPRESSIVE` with a stronger bounce (0.35 → 0.45) to match MD3 Expressive standards.
- **Navigation**: Added `activeIndicatorTransition` prop to `NavigationBar` and `NavigationRail` for custom spring configuration.
- **Navigation**: Enhanced active indicator pill with a stronger "pop" scale animation.
- **Documentation**: Added custom animation examples for Navigation components and updated API references.
- **AI Context**: Updated `llms.txt` and `llms-full.txt` with the latest motion specs and Navigation Bar reference.

## 3.0.1

### Patch Changes

- - **React**: Automatically bundle CSS tokens into `index.css` for easier setup.
  - **React**: Re-export Tailwind plugin via `@bug-on/md3-react/plugin`.
  - **React**: Add `@bug-on/md3-tailwind` and `@bug-on/md3-tokens` as direct dependencies.
  - **Tokens**: Fix build warning when `index.css` is missing in src.
  - **Tailwind**: Improved compatibility for Tailwind v3 and v4.
  - **Build**: Optimized build process using native tsup features.
- Updated dependencies
  - @bug-on/md3-tailwind@3.0.1
  - @bug-on/md3-tokens@3.0.1

## 3.0.0

### Major Changes

- e170496: Fix types tokens, tailwind, add menu component ver 1

### Patch Changes

- Fix Menu component to correctly handle and pass the variant and menuVariant props to MenuProvider, ensuring expressive features like shape morphing work as intended.
- Updated dependencies [e170496]
  - @bug-on/md3-tokens@3.0.0

## 2.0.3

### Patch Changes

- 86381df: Add Search UI, demo

## 2.0.2

### Patch Changes

- c5ad43d: Added App Bars.

## 2.0.1

### Patch Changes

- 1b6bb5c: Implement Material Design 3 Expressive Sliders and update all documentation to English.

## 2.0.0

### Major Changes

- 039d035: Update docs, readme, optimize lints

### Patch Changes

- Updated dependencies [039d035]
  - @bug-on/md3-tokens@2.0.0

## 1.0.0

### Major Changes

- 0845e7b: update READMEs with English instructions for3 packages

### Patch Changes

- 4901a01: update READMEs with English instructions.
- Updated dependencies [4901a01]
- Updated dependencies [0845e7b]
  - @bug-on/md3-tokens@1.0.0
