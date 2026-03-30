# PLAN-fab-component: Implement FloatingActionButton (FAB)

## Goal
Implement a highly responsive Floating Action Button (FAB) and `FABPosition` helper component for `@bug-on/md3-react` abiding by Material Design 3 Expressive standards (May 2025 update). Support sizes: "fab", "medium", "large". Support 6 MD3 tonal colors. Utilize Framer Motion shape morphing (`borderRadius` via `spring` interpolation) and Ripple interaction layer.

## Socratic Gate (Đã chốt)
1. **Z-Index:** Component `Dialog` hiện dùng `z-50`. `FABPosition` mặc định sử dụng `z-40` sẽ thỏa mãn nằm ngay bên dưới lớp màng modal của Dialog.
2. **Prop Manage:** `FABPosition` sẽ nhận các thuộc tính linh hoạt quản lý safe-area và class trực tiếp thông qua props như `safeArea={boolean}`, `zIndex={number}`...
3. **Phím điều hướng UI/WCAG:** FAB sẽ áp dụng logic `handleKeyDown` từ `IconButton` (buộc gọi `event.click()` ngay khi có thẻ phím Space/Enter).

## Proposed Task Breakdown

### 1. [NEW] `packages/react/src/ui/fab.tsx`
- Setup const maps: `SIZE_STYLES`, `SIZE_ICON_PX`, `MORPH_RADIUS`.
- Configure `colorVariants` using `cva()`: "primary", "secondary", "tertiary", "primaryContainer", "secondaryContainer", "tertiaryContainer".
- Export Component interfaces `FABProps` and `FABPositionProps`.
- Implement `FAB` using `forwardRef` wrapping `LazyMotion` & `m.button`. Apply morphing animate behavior (bounce: 0) matching MD3 radius transitions.
- Apply `shadow-md`, `hover:shadow-lg`, `active:shadow-sm` state elevation adjustments, inclusive lowered state.
- Mount `Ripple` component handling click dimensions. Manage standard keyboard `.click()` emulation.
- Map loading icons using `<AnimatePresence>` for seamless swap-outs, respecting target container size.
- Include WCAG requirements (add 48dp explicit boundary check for XS sizing & `aria-label` debug checker).
- Implement Contextual helper `FABPosition` utilizing explicitly requested `position: fixed` patterns and passed config logic for `z-index` configuration.

### 2. [NEW] `packages/react/src/ui/fab.test.tsx`
- Boot vitest suite. Ensure tests for core properties:
  - Accessible correctly without failing when `aria-label` is populated. Verify dev console.error behavior.
  - Test the sizing properties mappings (`fab`, `medium`, `large`).
  - Render variants correctly (`colorStyle` matches to CSS spec).
  - Interactability test: onClick function triggered correctly, keyboard mapped correctly unless disabled/loading.
  - Ensure dynamic `<LoadingIndicator />` toggles.
  - Wrap check: Validate `FABPosition` applies absolute context layouts properly.

### 3. [UPDATE] `packages/react/src/index.ts`
- Append library export tree. Export `FAB`, `FABPosition` and type `FABProps`. Ensure typing gets exported correctly.

## Verifications
- Run `pnpm test` in the react package directory.
- Perform Biome code linting/formatting (`pnpm lint`).
- Execute library type-checking and bundling (`pnpm build`).
- Observe frame transition visual stutters during ripple triggers in interactive Storybook runtime.
