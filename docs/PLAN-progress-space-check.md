# Project Plan: Progress Indicator MD3 Space & Wavy Compliance

## Overview
This plan addresses the user's request to verify if the "space" and shape of the `ProgressIndicator` conform to the Material Design 3 Expressive spec as seen in the provided image (min size 24, max size 240).

Analysis reveals critical mismatches with the MD3 spec:
1. **Track vs Active Shape**: Currently, if `shape="wavy"`, *both* the background track and the active indicator are rendered wavy. MD3 specifies that the background track must remain **Flat** (a straight line or a perfect circle), while only the active indicator becomes **Wavy**.
2. **Proportion Scaling**: At "max size 240", the wavy amplitude and wavelength must scale proportionally to maintain the expressive aesthetic. Currently, `amplitude` and `wavelength` are mathematically hardcoded (1.6px and 15px for circular), causing incorrect rendering at 240px.
3. **Space Gap Implementation**: The mathematical gap (`space`) is correctly computed based on path length, but it visually fails because it is applied to two overlapping wavy paths instead of a flat track and a wavy indicator. When applying to a flat track vs wavy active, the `pathLengthEst` for the wavy line is longer than the flat circle's circumference, so the `gap` percentage needs to be calculated separately for the flat track.

## Project Type
WEB (`frontend-specialist`)

## Success Criteria
- [ ] Circular Wavy Track: Background is flat, active is wavy.
- [ ] Linear Wavy Track: Background is flat, active is wavy.
- [ ] Scaling: Wavelength and amplitude scale appropriately based on the component's `size` if not explicitly overridden via props.
- [ ] Space (Gap): The 4dp gap between the active and track elements is visually correct when the wavy path and flat path overlap, managing the different `pathLength`s accurately.

## Tech Stack
React, Framer Motion, Tailwind CSS v4

## File Structure
- `packages/react/src/ui/progress-indicator.tsx`

## Task Breakdown

### Task 1: Fix Wavy Shape Applicability (Background vs Active)
- **Agent**: `frontend-specialist` (`react-best-practices`)
- **Action**: Update `progress-indicator.tsx`. Ensure that when `shape="wavy"`, the background track (both determinate and indeterminate) is always forced to `flat` (using `<m.circle>` for Circular and a straight `<line>`/`<path>` for Linear). Only the active `ActiveElem` should render the wavy path.
- **INPUT**: `packages/react/src/ui/progress-indicator.tsx`
- **OUTPUT**: Wavy progress indicators with standard flat tracks.
- **VERIFY**: Check DevTools/Preview to confirm track component is `<circle>` instead of matching the wavy `<path>`.

### Task 2: Implement Proportional Scaling for Amplitude & Wavelength
- **Agent**: `frontend-specialist` (`frontend-design`)
- **Action**: Update the default values for `amplitude` and `wavelength` in `CircularProgress`. Instead of hardcoded `1.6` and `15`, calculate them dynamically depending on `size` (e.g., matching the 48dp standard as baseline). Ensure `min size 24` and `max size 240` render with visually pleasing proportions that match the design image.
- **INPUT**: Props calculation logic in `progress-indicator.tsx`.
- **OUTPUT**: Scalable wavy paths for large and small components.
- **VERIFY**: Render size 240 and 24, verify wave size matches specification image.

### Task 3: Adjust Space/Gap Calculation for Mixed Paths
- **Agent**: `frontend-specialist`
- **Action**: Since the active path (wavy) has a different actual length than the flat track, the current mathematical gap percentage `gap = (space + trackHeight) / pathLengthEst` will cause the flat track's animating offset to diverge. Recalculate the `gap` separately for the track (using `circumference`) and the active (using `pathLengthEst`) so that the 4dp gap remains perfectly consistent during animation.
- **INPUT**: Circular gap mathematical calculations.
- **OUTPUT**: Accurate 4dp spacing between elements with different geometry.
- **VERIFY**: Visual review of the indeterminate animation to ensure the space gap doesn't grow/shrink unexpectedly.

## ✅ PHASE X COMPLETE
- Lint: [ ] Pass
- Build: [ ] Success
- Visual/E2E Tests: [ ] Pass
