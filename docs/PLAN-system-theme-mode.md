# PLAN: System Theme Mode Support

> **Task Slug:** `system-theme-mode`
> **Project Type:** WEB (React component library)
> **Agent:** `frontend-specialist`
> **Skills:** `clean-code`, `react-best-practices`, `frontend-design`
> **Date:** 2026-04-28

---

## Overview

### What
Add a third theme mode value — `"system"` — to `ThemeMode`, allowing the app to automatically follow the OS-level `prefers-color-scheme` preference instead of forcing `"light"` or `"dark"`.

### Why
Currently `ThemeMode = "light" | "dark"` forces a hard choice. Users who set their OS to auto/dark expect apps to respect that. This is a UX best-practice and is required for a premium MD3 experience.

### Scope
| File | Change |
|------|--------|
| `packages/react/src/lib/theme-utils.ts` | Extend `ThemeMode`, update `applyTheme` to accept `"system"` |
| `packages/react/src/ui/theme-provider/index.tsx` | Subscribe to `matchMedia`, resolve effective mode, update localStorage guard |

---

## Success Criteria

- [ ] `ThemeMode = "light" | "dark" | "system"` exported correctly
- [ ] Setting `mode = "system"` reads `window.matchMedia("(prefers-color-scheme: dark)")` to apply the correct scheme
- [ ] OS preference changes (e.g., user switches macOS Dark Mode at runtime) are reflected without a page reload
- [ ] `"system"` value is persisted and restored correctly from `localStorage`
- [ ] `useThemeMode()` exposes the **effective** resolved mode (`"light"` or `"dark"`) alongside the raw `mode` so consumers can know which scheme is actually active
- [ ] Default `defaultMode` prop still works as `"light"` (backwards-compatible)
- [ ] No regressions in SSR / hydration (guard `window` access)

---

## Tech Stack

| Technology | Rationale |
|------------|-----------|
| `window.matchMedia` | Native browser API — zero deps, reactive via `addEventListener("change")` |
| React `useEffect` + `useState` | Reactive subscription pattern, already used in provider |
| TypeScript union type extension | Minimal diff, fully type-safe |

---

## File Structure (affected files only)

```
packages/react/src/
├── lib/
│   └── theme-utils.ts          ← TASK 1: extend ThemeMode type + applyTheme resolver
└── ui/
    └── theme-provider/
        └── index.tsx            ← TASK 2: system mode subscription + context exposure
```

---

## Task Breakdown

### TASK 1 — Extend `ThemeMode` and `applyTheme` in `theme-utils.ts`

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `clean-code` |
| **Priority** | P0 — must be done first, blocks Task 2 |
| **Dependencies** | None |

**INPUT:**
```ts
// Current
export type ThemeMode = "light" | "dark";

export function applyTheme(sourceColorHex: string, mode: ThemeMode = "light", root = document.documentElement): void {
  const colors = generateM3Theme(sourceColorHex, mode);
  // ...
  root.setAttribute("data-theme", mode);
}
```

**CHANGES:**
1. Extend type: `export type ThemeMode = "light" | "dark" | "system";`
2. Add a pure helper: `resolveMode(mode: ThemeMode): "light" | "dark"` — reads `matchMedia` when `mode === "system"`, SSR-safe (returns `"light"` if `window` is undefined).
3. Update `applyTheme` to call `resolveMode` internally before passing to `generateM3Theme`.
4. Update `data-theme` attribute to use the **resolved** value (not `"system"`).

**OUTPUT:**
- `ThemeMode` type includes `"system"`.
- `applyTheme("...", "system")` correctly applies light or dark scheme.
- `data-theme` is always `"light"` or `"dark"` (never `"system"`).
- New export: `resolveMode(mode: ThemeMode): "light" | "dark"`.

**VERIFY:**
```bash
npx tsc --noEmit  # No type errors
# Manual: call applyTheme("#6750A4", "system") in browser console -> correct data-theme
```

---

### TASK 2 — Update `MD3ThemeProvider` to subscribe to OS preference

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `react-best-practices` |
| **Priority** | P1 — depends on Task 1 |
| **Dependencies** | TASK 1 |

**INPUT:**
- `mode` state: `"light" | "dark"` (current)
- One `useEffect` applies theme on change
- localStorage guard only allows `"light"` or `"dark"` on restore

**CHANGES:**
1. **Context shape:** Add `effectiveMode: "light" | "dark"` to `ThemeContextValue`
2. **localStorage restore guard:** Also allow `"system"` when restoring from storage
3. **System preference subscription useEffect:** Subscribe to `matchMedia` change event when `mode === "system"`, cleanup on unmount/change
4. **`effectiveMode` derivation:** Compute via `resolveMode(mode)` — no new state needed
5. **Context value:** Include `effectiveMode` in `useMemo`
6. **`useThemeMode` hook:** Return `effectiveMode` as well

**OUTPUT:**
- `mode = "system"` correctly applies dark/light based on OS.
- OS preference changes at runtime update the theme without reload.
- `effectiveMode` accessible to consumers for conditional rendering.
- `localStorage` correctly persists and restores `"system"`.

**VERIFY:**
```bash
npx tsc --noEmit  # No type errors
# Manual browser test:
# 1. Set defaultMode="system" -> theme matches OS
# 2. Toggle OS dark/light mode -> app updates instantly
# 3. Set persistToLocalStorage=true, reload -> "system" is restored
# 4. Check useThemeMode().effectiveMode returns "light" or "dark", never "system"
```

---

## Risk Analysis

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSR / hydration mismatch (`window` not defined) | Medium | Guard `window` access in `resolveMode` with `typeof window !== "undefined"` |
| `matchMedia` listener memory leak | Low | Cleanup in `useEffect` return function |
| Consumers using `mode === "dark"` checks break when mode is `"system"` | Medium | Document `effectiveMode` and expose it via `useThemeMode` |
| Breaking change for existing `defaultMode` prop users | Low | Default remains `"light"`, fully backwards-compatible |

---

## Phase X: Verification Checklist

> DO NOT mark tasks complete until each item is verified.

### Type Safety
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `ThemeMode` union includes `"system"` in exported types

### Functionality
- [ ] `defaultMode="system"` reads OS preference on mount
- [ ] Toggling OS dark mode at runtime updates the app theme (no reload)
- [ ] `defaultMode="light"` and `defaultMode="dark"` still work unchanged
- [ ] `persistToLocalStorage=true` saves and restores `"system"` correctly
- [ ] `effectiveMode` is always `"light"` or `"dark"`, never `"system"`

### SSR Safety
- [ ] `resolveMode` does not throw when `window` is undefined (SSR)
- [ ] Provider hydrates correctly without flicker

### No Regressions
- [ ] Existing `useThemeMode()` consumers compile without change
- [ ] `applyTheme` called externally with `"light"` or `"dark"` still works

### Cleanup
- [ ] No `console.log` or debug code left
- [ ] Lint: `npm run lint` passes
