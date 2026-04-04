# Implementation Plan - NavigationRail Demo Page

This plan outlines the steps to create a comprehensive demo page for the `NavigationRail` component in the `apps/docs` documentation application.

## User Review Required

> [!IMPORTANT]
> The demo will use **Material Symbols** for icons. Ensure that the environment has access to these icons (they are already used in other components like `Button` and `TextField`).

> [!NOTE]
> Each demo will include an MD3-style **FAB (Floating Action Button)** in the header of the `NavigationRail`, as requested.

## Proposed Changes

### Documentation Registry

#### [NEW] [navigation-rail-collapsed.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/navigation-rail-collapsed.tsx)
- Implementation of a basic collapsed Navigation Rail.
- Includes a FAB in the header.
- Manages active state with local `useState`.

#### [NEW] [navigation-rail-expanded.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/navigation-rail-expanded.tsx)
- Implementation of an expanded Navigation Rail with labels.
- Same items and active state logic as the collapsed version.

#### [NEW] [navigation-rail-modal.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/navigation-rail-modal.tsx)
- Implementation of the modal variant.
- Includes a primary button to toggle the `open` state.
- Demonstrates the backdrop and slide-in animation.

### Documentation Content

#### [NEW] [navigation-rail.mdx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/content/components/navigation-rail.mdx)
- Dynamic documentation page for Navigation Rail.
- Sections: Overview, Collapsed, Expanded, Modal, and API Reference.
- Uses `ComponentPreview` for each demo.

### Navigation Data

#### [MODIFY] [data.ts](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/lib/data.ts)
- Add `href: "/components/navigation-rail"` to the `Navigation rail` entry to enable it in the sidebar.

---

## Verification Plan

### Automated Tests
- Run `pnpm test` in `packages/react` to ensure no regressions in the core component.

### Manual Verification
- Start the documentation app with `pnpm dev` in `apps/docs`.
- Navigate to `/components/navigation-rail`.
- Verify each demo renders correctly and interactions (clicks, keyboard navigation) work as expected.
- Check responsiveness and layout transitions.
