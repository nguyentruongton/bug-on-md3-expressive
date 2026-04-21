# Plan: Menu Demo Refactoring

Refactor the MD3 Menu demos to provide side-by-side comparisons of Baseline and Vertical variants, while isolating variant-specific features like Vibrant colors.

## Overview
- **Project Type**: WEB (Next.js Documentation)
- **Goal**: Clear visual distinction between standard Baseline menus and Expressive Vertical menus.
- **Success Criteria**: 
  - Every demo (Basic, Icons, Selection, etc.) shows both Baseline and Vertical side-by-side.
  - "Vibrant" color variant is strictly isolated to Vertical menu demos.
  - Code redundancy is minimized across demo files.

## Tech Stack
- React, Tailwind CSS
- MD3 Expressive Component Library (@bug-on/md3-react)

## Task Breakdown

### Phase 1: Core Demos Refactoring
Update existing demo files to follow the side-by-side comparison pattern.

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| T1.1 | Refactor Basic Demo | `frontend-specialist` | `clean-code` | P1 | - | `menu-basic-demo.tsx` → Updated with flex container showing both variants → Build & visual check |
| T1.2 | Refactor Icons Demo | `frontend-specialist` | `clean-code` | P1 | T1.1 | `menu-icons-demo.tsx` → Both variants side-by-side → Build & visual check |
| T1.3 | Refactor Selection Demo | `frontend-specialist` | `clean-code` | P1 | T1.2 | `menu-selection-demo.tsx` → Both variants side-by-side → Build & visual check |
| T1.4 | Refactor Supporting Text Demo | `frontend-specialist` | `clean-code` | P1 | T1.3 | `menu-supporting-text-demo.tsx` → Both variants side-by-side → Build & visual check |
| T1.5 | Refactor Grouped Demo | `frontend-specialist` | `clean-code` | P1 | T1.4 | `menu-grouped-demo.tsx` → Baseline (Divider) vs Vertical (Gap) → Build & visual check |

### Phase 2: Feature-Specific Demos
Isolate and update demos for features that only exist in one variant.

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| T2.1 | Refactor Vibrant Color Demo | `frontend-specialist` | `clean-code` | P1 | - | `menu-vibrant-demo.tsx` → Removed/Converted to `vertical-menu-vibrant.tsx` → Verify only Vertical menu is shown |
| T2.2 | Refactor Submenu Demo | `frontend-specialist` | `clean-code` | P1 | - | `menu-submenu-demo.tsx` → Compare Baseline cascading vs Vertical expressive motion → Visual check |
| T2.3 | Refactor Full Demo | `frontend-specialist` | `clean-code` | P2 | Phase 1 | `menu-full-demo.tsx` → Unified comprehensive demo → Build check |

### Phase 3: Cleanup & Registry Sync
Remove redundant files and ensure the registry is clean.

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| T3.1 | Remove Redundant Demo Files | `orchestrator` | `bash-linux` | P2 | Phase 1, 2 | `menu-baseline-demo.tsx`, `vertical-menu-*-demo.tsx` → Deleted → Registry remains functional |
| T3.2 | Final Build & UX Audit | `orchestrator` | `performance-profiling` | P1 | T3.1 | Workspace → `pnpm build` → Success + UX Audit script |

## Phase X: Verification
- [ ] `pnpm build` succeeds in `apps/docs`.
- [ ] No Baseline menu demo uses `colorVariant="vibrant"`.
- [ ] All side-by-side demos are responsive and center-aligned.
- [ ] `python .agent/skills/frontend-design/scripts/ux_audit.py .` passes.
