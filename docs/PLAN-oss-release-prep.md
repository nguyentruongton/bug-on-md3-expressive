# Project Plan: Open Source (OSS) Release Preparation

## Overview
This plan outlines the steps required to clean and standardise the `bug-on-md3-expressive` project so it is ready for a public open-source release on GitHub. Our analysis found that although the structural foundation (pnpm, turborepo, changesets, biome) is exceptional, there are multiple TypeScript compilation errors, Biome lint warnings, and missing community standards files (like CONTRIBUTING and CODE_OF_CONDUCT) that need to be resolved.

## Project Type
WEB / LIBRARY

## Success Criteria
- `tsc --noEmit` passes with **0 errors**.
- `biome check .` passes with **0 errors and 0 warnings**.
- Standard OSS Community Health files exist in the repository root (or `.github/`).
- `checklist.py` and `lint_runner.py` run flawlessly in standard environment pipelines.

## Tech Stack
- Typescript 5.8 (Strict Mode fixes)
- Biome (Linting + Formatting)
- Github Meta Templates (Standard markdown)

## File Structure
```
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── apps/docs/               (Fix Lint issues)
└── packages/react/          (Fix TS & remaining Lint issues)
```

## Task Breakdown

### Task 1: Fix Biome Lint Warnings
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `react-best-practices`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: `biome check .` returning 6 warnings (`apps/docs` & `docs/m3`).
- **OUTPUT**:
  - Replace `role="group"` with `<fieldset>` where applicable in `theme-demo.tsx`.
  - Remove unused alias `TabType` in `component-preview-client.tsx`.
  - Fix `.forEach` into `for...of` in `docs/m3/tabs/google/internal/tab.ts` and resolve non-null assertions `!`.
- **VERIFY**: Run `pnpm run check` → 0 errors, 0 warnings.

### Task 2: Fix TypeScript Compilation Errors
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`, `clean-code`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Massive list of errors from `tsc --noEmit` across `packages/react`.
- **OUTPUT**: Complete resolution of compilation errors across components. Type narrowing, ensuring refs and types align properly with TS 5.8 without using `any`.
- **VERIFY**: Run `tsc --noEmit` → 0 errors.

### Task 3: Establish OSS Community Guidelines
- **Agent**: `documentation-writer` (or `orchestrator`)
- **Skills**: `documentation-templates`
- **Priority**: P1
- **Dependencies**: none
- **INPUT**: Missing open-source community files.
- **OUTPUT**:
  - Create `CONTRIBUTING.md`
  - Create `CODE_OF_CONDUCT.md` (Contributor Covenant template)
  - Create `SECURITY.md` (Security Policy)
  - Create `.github/ISSUE_TEMPLATE/bug_report.md` & `feature_request.md`
  - Create `.github/PULL_REQUEST_TEMPLATE.md`
- **VERIFY**: Files are correctly placed in root and `.github` structure.

### Task 4: Fix / Stabilize Environment Check Scripts (Optional)
- **Agent**: `orchestrator`
- **Skills**: `bash-linux`, `nodejs-best-practices`
- **Priority**: P2
- **Dependencies**: None
- **INPUT**: `.agent/scripts/lint_runner.py` uses hardcoded `npm`/`npx` which conflicts with `pnpm/bun` missing in simple shells.
- **OUTPUT**: Make check scripts resilient by checking package managers dynamically (`pnpm` preferred).
- **VERIFY**: Running `python3 .agent/scripts/checklist.py .` passes locally.

## ✅ PHASE X: Verification Checklist
- [ ] Run `pnpm run check` (Biome Lint + Format fixes)
- [ ] Run `tsc --noEmit` (No TypeScript failures)
- [ ] Run `python3 .agent/scripts/checklist.py .`
- [ ] Missing Community Files verified via git tracking.
- [ ] Commit history is clean and ready.
