# PLAN: Settings System Theme Support

> **Task Slug:** `settings-system-theme`
> **Project Type:** WEB (React/Next.js)
> **Agent:** `frontend-specialist`
> **Skills:** `clean-code`, `react-best-practices`, `frontend-design`
> **Date:** 2026-04-28

---

## Overview

### What
Update the settings page in the `docs` app to allow users to select "System" as their theme mode preference. This will utilize the newly implemented `system` mode in the `MD3ThemeProvider`.

### Why
Users expect a "System" option to automatically sync the app's appearance with their OS preference. Having implemented this in the core library, we now need to expose it in the reference documentation UI.

### Scope
- File: `apps/docs/app/settings/page.tsx`

---

## Success Criteria

- [ ] A third button labeled "System Theme" is visible in the Theme Mode section.
- [ ] Clicking "System Theme" correctly calls `setMode("system")`.
- [ ] The "System Theme" button shows an active state (tonal style) when `mode === "system"`.
- [ ] The card header icon correctly reflects the mode (or shows a system-specific icon when system is selected).
- [ ] (Optional but Recommended) Visual feedback indicates whether "System" is currently resolving to Light or Dark mode.

---

## Task Breakdown

### TASK 1 — Update UI in `settings/page.tsx`

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `clean-code` |
| **Priority** | P0 |
| **Dependencies** | None |

**INPUT:**
```tsx
// Current Theme Mode Section
<div className="flex flex-col gap-4">
    <Button ... onClick={() => setMode("light")}>Light Theme</Button>
    <Button ... onClick={() => setMode("dark")}>Dark Theme</Button>
</div>
```

**CHANGES:**
1. Update `useTheme()` destructuring to include `effectiveMode` if desired for display.
2. Add a third `Button` component for "System Theme".
3. Use `settings_brightness` or a similar icon for the System option.
4. Update the logic for the header icon:
   - If `mode === "system"`, show `settings_brightness`.
   - Otherwise show `light_mode` or `dark_mode`.
5. Update button styles to reflect the three-way choice.

**OUTPUT:**
- Updated `SettingsPage` component with 3 theme options.

**VERIFY:**
- Visually confirm 3 buttons exist.
- Click each button and verify the theme changes as expected.

---

## Risk Analysis

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| UI Layout shifting | Low | Ensure the buttons are stacked or wrapped correctly in the flex container. |
| Confusion between `mode` and `effectiveMode` | Low | Clearly label the buttons; `effectiveMode` is only for background/preview logic if needed. |

---

## Phase X: Verification Checklist

- [ ] "System" button correctly sets mode to `system`.
- [ ] Active state is visually distinct for the selected option.
- [ ] App theme responds correctly to OS changes when "System" is active.
- [ ] TypeScript and Lint checks pass.

---

## After Implementation

Tell user:
```
[OK] Plan created: docs/PLAN-settings-system-theme.md

Next steps:
- Review the plan
- Run `/enhance` to apply the changes
```
