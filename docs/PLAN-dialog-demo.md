# PLAN-dialog-demo.md - Dialog Component Documentation

## Context
- **Task**: Implement full demo suite for MD3 Dialog.
- **Agent**: Antigravity Specialist.
- **Tech Stack**: React, Tailwind v4, Framer Motion, Radix UI.

## Phase 1: Structure Definition
- [ ] Create `apps/docs/app/components/dialogs/page.tsx`.
- [ ] Implement Breadcrumbs and Hero Header.
- [ ] Set up `TableOfContents` with IDs: `overview`, `basic`, `icon`, `scrollable`, `full-screen`, `code`.

## Phase 2: Variant Implementation
- [ ] **Basic Alert**: 2 action buttons, text only.
- [ ] **Icon Dialog**: Top slot icon + center aligned title.
- [ ] **Scrollable**: Usage of `DialogBody` with dummy text.
- [ ] **Full Screen**: Profile Editing Form with Top App Bar.
    - Fields: Full Name, Username, Bio (Textarea), Email.

## Phase 3: Interactive State Management
- [ ] Create state hooks for each dialog trigger.
- [ ] Ensure `AnimatePresence` handles multiple instances properly.

## Phase 4: Verification
- [ ] Run `pnpm dev`.
- [ ] Visual audit via browser.
- [ ] Check console for duplicate key warnings.
