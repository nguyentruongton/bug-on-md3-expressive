# PLAN: Theme Documentation Update

> **Task Slug:** `theme-doc-update`
> **Project Type:** WEB (Documentation)
> **Agent:** `frontend-specialist`
> **Skills:** `clean-code`, `documentation-templates`
> **Date:** 2026-04-28

---

## Overview

### What
Update `apps/docs/content/get-started/theme.mdx` to include documentation for the new "system" theme mode support and the `effectiveMode` property.

### Why
The library now supports syncing with OS theme preferences, but the documentation only mentions "light" and "dark". Providing clear English instructions is essential for adoption.

### Scope
- File: `apps/docs/content/get-started/theme.mdx`

---

## Success Criteria

- [ ] `ThemeMode` definition updated to include `"system"`.
- [ ] `defaultMode` prop documentation updated to mention `"system"`.
- [ ] `useTheme` and `useThemeMode` hook examples updated to include `effectiveMode`.
- [ ] Added a section explaining how System Mode works (OS preference syncing).
- [ ] All content is in English as requested.

---

## Task Breakdown

### TASK 1 — Update `theme.mdx` Content

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `clean-code` |
| **Priority** | P0 |
| **Dependencies** | None |

**CHANGES:**
1. Update `Basic Configuration` snippet to mention `system` is possible.
2. Update `Provider Props` table:
   - `defaultMode`: `ThemeMode` (`"light"`, `"dark"`, or `"system"`) | Default: `"system"` (Note: our root layout now defaults to system, so we should update this or mention the library default vs app default). Actually, the library default is still `light` in code, but the docs app uses `system`. I'll list the library default as `light` but mention `system` as an option.
3. Update `Hooks` section:
   - Add `effectiveMode` to `useTheme` and `useThemeMode` destructuring examples.
   - Explain that `effectiveMode` is always either `"light"` or `"dark"`.
4. Add a sub-section "System Theme Support" explaining `matchMedia` and real-time updates.

**OUTPUT:**
- Updated `theme.mdx` file.

**VERIFY:**
- Check for typos.
- Ensure code snippets are valid.

---

## Phase X: Verification Checklist

- [ ] All mentions of `ThemeMode` include `system`.
- [ ] `effectiveMode` is explained clearly.
- [ ] Code examples are updated.
- [ ] Language is English.

---

## After Implementation

Tell user:
```
[OK] Plan created: docs/PLAN-theme-doc-update.md

Next steps:
- Review the plan
- Run `/enhance` to apply the changes
```
