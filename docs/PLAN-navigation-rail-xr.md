# Refactor Navigation Rail XR Measurements

This plan details the necessary layout changes to perfectly align the `NavigationRail` component with the provided Material Design 3 Expressive XR/Spatial specifications.

## Background Context
The image specifies the exact measurements for the XR (`xr=true`) variation of the Navigation Rail:
- **Rail Dimensions**: 96px width (`w-24`).
- **Padding**: 20px all around (`p-5`).
- **Header Elements**: Menu Toggle (48px) and FAB (56px) have a gap of 4px.
- **Header to Items Gap**: 40px gap between the FAB and the first destination item.
- **Destination Item**: 56px height (`h-14`) containing a 56x32px active pill (`w-14 h-8`).
- **Destination Gap**: 4px gap between destination items (`gap-y-1`).

## User Review Required
> [!IMPORTANT]
> The current code maps almost identically to the spec except for the gap below the `header` container in XR mode. Please review the proposed spacing changes to ensure this matches your expectation when passing the FAB and Menu Toggle via the `header` prop.

## Proposed Changes

### `packages/react/src/ui/navigation-rail.tsx`

We identified that `w-24` (96px), `p-5` (20px), `h-14` (56px), and `h-8 w-14` (32x56px pill) are all already perfectly implemented in the current codebase. The only misalignment for XR is the gap under the header and between header elements.

#### [MODIFY] navigation-rail.tsx
Locate the `header` container configuration (around line 529):

```diff
				{header && (
					<div
						className={cn(
							"flex w-full flex-col items-center justify-start shrink-0 empty:hidden",
-							xr ? "mb-1" : "min-h-10 mb-6",
+							xr ? "mb-10 gap-1" : "min-h-10 mb-6",
						)}
					>
						{header}
					</div>
				)}
```

**Why this change?**
- `mb-10` maps exactly to the `40px` required gap between the FAB (inside header) and the first Active Destination item.
- `gap-1` adds a 4px vertical gap within the header itself, ensuring the exact 4px spacing between the Menu toggle and the FAB button as shown in the spec.

## Open Questions

> [!WARNING]
> Does the `header` prop strictly expect two children elements (Menu + FAB) when used in XR mode? Adding `gap-1` assumes the header container will align these elements nicely with a 4px gap. If you handle spacing externally inside your header node, this `gap-1` might compound, so please advise.

## Verification Plan

### Manual Verification
- Render the `NavigationRail` component with `xr={true}`.
- Supply a Menu toggle child and a FAB child to the `header` prop.
- Inspect the DOM or visually compare it to the design reference to guarantee:
  1. The space below the FAB is precisely 40px (`margin-bottom: 2.5rem`).
  2. The gap between the Menu and the FAB is 4px.
  3. The whole rail remains 96px wide with 20px padding.
