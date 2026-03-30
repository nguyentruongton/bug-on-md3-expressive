# PLAN: Material Symbols Font Loading Optimization & Self-Hosting

> **Task Slug:** `font-optimization`
> **Project Type:** WEB — Library Package (React component library)
> **Primary Agent:** `frontend-specialist`
> **Supporting Skills:** `frontend-design`, `clean-code`
> **Created:** 2026-03-30

---

## Overview

Package `@bug-on/md3-react` hiện nay load Material Symbols variable font thông qua Google Fonts CDN bằng `@import url()` trong một file CSS duy nhất, đồng thời load cả 3 variant (Outlined + Rounded + Sharp). Điều này gây ra:

1. **Third-party connection overhead** — FCP/LCP bị ảnh hưởng do browser phải khởi tạo thêm TCP + TLS handshake đến Google servers
2. **Late discovery** — `@import` trong CSS bị phát hiện muộn sau chain: HTML → JS bundle → CSS → Google Fonts
3. **Không có preconnect strategy** — Không có cơ chế báo trước cho browser cần connect đến 2 origins: `fonts.googleapis.com` + `fonts.gstatic.com`
4. **Layout shift risk** — Icon ligature font không thể dùng `font-display: swap` (sẽ render text thô như "arrow_forward")
5. **Không có self-hosting option** — GDPR compliance và offline use cases khi các user cần host font trên infrastructure riêng
6. **Triple download** — Load cả 3 font families khi user chỉ cần 1

---

## Current State Analysis

### File Hiện Tại
```
packages/react/
├── src/
│   ├── assets/
│   │   └── material-symbols.css        ← File duy nhất, load 3 @import CDN
│   ├── lib/
│   │   └── utils.ts
│   └── index.ts                        ← Không export preconnect component
├── scripts/
│   └── copy-assets.js                  ← Chỉ copy material-symbols.css → dist/
├── tsup.config.ts                      ← entry: ["src/index.ts"], không có CSS entry
└── package.json                        ← exports: ./material-symbols.css → dist/material-symbols.css
```

### Vấn đề cụ thể trong `copy-assets.js`
- Copy `material-symbols.css` → `dist/material-symbols.css` (flat, không vào assets/)
- Export trong `package.json` trỏ đến `./dist/material-symbols.css` (flat)
- Nhưng deliverable muốn output vào `./dist/assets/material-symbols-cdn.css` — **cần reconcile**

---

## Success Criteria

- [ ] `material-symbols-cdn.css` — CDN version với comment đầy đủ, chỉ load Outlined by default
- [ ] `material-symbols-self-hosted.css` — Self-hosted template với hướng dẫn step-by-step
- [ ] `MaterialSymbolsPreconnect` React component được export từ `@bug-on/md3-react`
- [ ] `package.json` exports đúng cho cả hai CSS variant
- [ ] `copy-assets.js` copy đúng cả hai files mới vào `dist/`
- [ ] README có section "Font Loading & Optimization" hoàn chỉnh
- [ ] Build thành công: `pnpm build` trong `packages/react`
- [ ] Không modify `icon.tsx` hay bất kỳ component hiện tại

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build | tsup + `copy-assets.js` | CSS không qua tsup, dùng Node.js copy script |
| Package | pnpm monorepo | workspace protocol |
| Font | Material Symbols variable WOFF2 | WOFF2 supports 100% modern browsers, ~30% better compression vs WOFF |
| Strategy | CDN default + Self-host option | GDPR compliance + flexibility |

---

## Technical Decisions (Non-Negotiable)

| Decision | Value | Reason |
|----------|-------|--------|
| `font-display` | `block` (NOT `swap`) | swap → render text thô "arrow_forward" = jarring layout shift; block hides text up to 3s |
| Format | WOFF2 only | 100% modern browser support, Brotli compression, no WOFF fallback needed |
| Preconnect origins | 2 origins: `fonts.googleapis.com` + `fonts.gstatic.com` | Stylesheet vs. font files come from different servers |
| `crossorigin` on `fonts.gstatic.com` | `anonymous` | Font download là CORS request |
| `font-weight` in @font-face | `100 700` (range) | Browser nhận diện variable font, chỉ download 1 file |
| Preload | **KHÔNG dùng** | Preload bỏ qua unicode-range, có thể load font không cần thiết |
| Default variant | Outlined only | Most commonly used; user uncomment Rounded/Sharp nếu cần |

---

## File Structure (After Implementation)

```
packages/react/
├── src/
│   ├── assets/
│   │   ├── material-symbols-cdn.css            [CREATE] Replaces old material-symbols.css
│   │   ├── material-symbols-self-hosted.css    [CREATE] New self-hosting template
│   │   ├── fonts/ (unchanged)
│   │   └── loading-indicator.svg (unchanged)
│   ├── lib/
│   │   ├── utils.ts (unchanged)
│   │   └── material-symbols-preconnect.tsx     [CREATE] React preconnect component
│   └── index.ts                                [MODIFY] Export MaterialSymbolsPreconnect
├── scripts/
│   └── copy-assets.js                          [MODIFY] Copy both new CSS files
├── tsup.config.ts                              [CHECK] — no change needed, CSS handled by copy-assets.js
├── package.json                                [MODIFY] Add exports for both CSS files + update old mapping
└── README.md                                   [MODIFY] Add Font Loading section
```

> ⚠️ **Về file `material-symbols.css` cũ**: File này đang được export qua `package.json` → `./dist/material-symbols.css`. Cần quyết định: đổi tên export sang `material-symbols-cdn.css`, hay giữ backward compat? Task này sẽ **update export path** để `./material-symbols.css` vẫn hoạt động, pointing đến CDN variant.

---

## Task Breakdown

### TASK-01 — Tạo `material-symbols-cdn.css`
- **Agent:** `frontend-specialist`
- **Priority:** P0 (foundation)
- **Dependencies:** none
- **Input:** Spec từ deliverable 1 + current `material-symbols.css`
- **Output:** `packages/react/src/assets/material-symbols-cdn.css`
- **Verify:** File tồn tại, chứa `@import url('https://fonts.googleapis.com/...')` với `display=block`, Rounded + Sharp commented out, comment đầy đủ

---

### TASK-02 — Tạo `material-symbols-self-hosted.css`
- **Agent:** `frontend-specialist`
- **Priority:** P0 (foundation)
- **Dependencies:** none (parallel với TASK-01)
- **Input:** Spec từ deliverable 2
- **Output:** `packages/react/src/assets/material-symbols-self-hosted.css`
- **Verify:** File tồn tại, có `@font-face` block đầy đủ cho Outlined, Rounded + Sharp đều commented out, có `font-weight: 100 700`, `font-display: block`, `format('woff2')`, comment GDPR và subsetting

---

### TASK-03 — Tạo `material-symbols-preconnect.tsx`
- **Agent:** `frontend-specialist`
- **Priority:** P1 (requires TASK-01 context)
- **Dependencies:** none (file độc lập)
- **Input:** Spec từ deliverable 3
- **Output:** `packages/react/src/lib/material-symbols-preconnect.tsx`
- **Verify:** File tồn tại, export named function `MaterialSymbolsPreconnect`, render 2 `<link>` tags, `crossOrigin="anonymous"` trên `fonts.gstatic.com`, JSDoc đầy đủ

---

### TASK-04 — Update `index.ts`
- **Agent:** `frontend-specialist`
- **Priority:** P2 (requires TASK-03)
- **Dependencies:** TASK-03
- **Input:** Current `index.ts`, new component path
- **Output:** Updated `index.ts` với line `export { MaterialSymbolsPreconnect } from './lib/material-symbols-preconnect';`
- **Verify:** Export line tồn tại, TypeScript compile không có lỗi

---

### TASK-05 — Update `package.json` exports
- **Agent:** `frontend-specialist`
- **Priority:** P2 (requires TASK-01, TASK-02)
- **Dependencies:** TASK-01, TASK-02
- **Input:** Current `package.json`, new CSS file paths
- **Output:** Updated exports map với 3 entries cho CSS:
  - `"./material-symbols.css"` → trỏ đến CDN variant (`dist/material-symbols-cdn.css`) — backward compat
  - `"./material-symbols-cdn.css"` → explicit CDN entry
  - `"./material-symbols-self-hosted.css"` → self-hosted entry
- **Verify:** JSON valid, 3 CSS exports tồn tại, file paths match thực tế trong dist/

---

### TASK-06 — Update `copy-assets.js`
- **Agent:** `frontend-specialist`
- **Priority:** P2 (requires TASK-01, TASK-02)
- **Dependencies:** TASK-01, TASK-02
- **Input:** Current `copy-assets.js`, new file list
- **Output:** Updated script copy cả `material-symbols-cdn.css` + `material-symbols-self-hosted.css`
- **Notes:** Hiện tại script copy `material-symbols.css` → `dist/material-symbols.css` (flat). Cần quyết định: copy sang `dist/material-symbols-cdn.css` (new) VÀ `dist/material-symbols.css` (compat) để không break backward compat
- **Verify:** Run `node scripts/copy-assets.js`, kiểm tra `dist/material-symbols.css`, `dist/material-symbols-cdn.css`, `dist/material-symbols-self-hosted.css` đều tồn tại

---

### TASK-07 — Update `README.md`
- **Agent:** `documentation-writer`
- **Priority:** P3 (sau khi code hoàn chỉnh)
- **Dependencies:** TASK-01, TASK-02, TASK-03
- **Input:** Current README, spec từ deliverable 7
- **Output:** README với section "Font Loading & Optimization" bao gồm:
  - CDN Mode usage
  - Self-Hosted Mode usage
  - Subsetting explanation
  - font-display: block explanation
- **Verify:** Section tồn tại trong README, code examples chính xác

---

### TASK-08 — Build Verification
- **Agent:** `performance-optimizer`
- **Priority:** P4 (final)
- **Dependencies:** ALL tasks
- **Input:** All modified files
- **Output:** `pnpm build` thành công trong `packages/react`
- **Verify:**
  - `pnpm build` exits 0
  - `dist/material-symbols.css` tồn tại (backward compat)
  - `dist/material-symbols-cdn.css` tồn tại
  - `dist/material-symbols-self-hosted.css` tồn tại
  - TypeScript: `pnpm lint` no errors
  - `MaterialSymbolsPreconnect` exported trong `dist/index.mjs`

---

## Execution Order (Dependency Graph)

```
TASK-01 ──────┐
              ├──→ TASK-05 (package.json) ──┐
TASK-02 ──────┘                             │
                                            ├──→ TASK-08 (build)
TASK-03 ──→ TASK-04 (index.ts) ────────────┤
                   │                        │
TASK-06 ───────────┘                       │
                                           │
TASK-07 ───────────────────────────────────┘
```

**Parallel groups:**
- Group A (no deps): TASK-01, TASK-02, TASK-03
- Group B (after A): TASK-04, TASK-05, TASK-06
- Group C (after B): TASK-07, TASK-08

---

## Risk Areas & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Backward compat break — old export `./material-symbols.css` bị thay đổi | HIGH | Giữ nguyên export key, update value path sang CDN variant |
| `copy-assets.js` copy sai path | MEDIUM | Test script sau mỗi thay đổi; kiểm tra dist/ structure |
| TypeScript error cho `.tsx` component | LOW | `MaterialSymbolsPreconnect` là pure functional component, không có state |
| `package.json` JSON syntax error | LOW | Validate JSON sau khi edit |

---

## Phase X: Verification Checklist

Sau khi tất cả tasks hoàn thành:

```bash
# 1. Build
cd packages/react
pnpm build

# 2. Kiểm tra dist output
# Expected files:
# dist/material-symbols.css          ← backward compat
# dist/material-symbols-cdn.css      ← explicit CDN  
# dist/material-symbols-self-hosted.css ← self-hosted
# dist/index.mjs                     ← contains MaterialSymbolsPreconnect

# 3. TypeScript lint
pnpm lint
```

**Manual checks:**
- [ ] `material-symbols-cdn.css` có `font-display: block` comment explanation
- [ ] `material-symbols-self-hosted.css` có `@font-face` block, Rounded/Sharp commented out
- [ ] `MaterialSymbolsPreconnect` render `<link rel="preconnect">` đúng cả 2 origins
- [ ] `crossOrigin="anonymous"` (camelCase) trên `fonts.gstatic.com` link
- [ ] README có 4 subsections: CDN Mode, Self-Hosted Mode, Subsetting, font-display explanation
- [ ] Không có thay đổi nào trong `icon.tsx` hay các component khác

---

## Notes for Implementer

1. **`tsup.config.ts` KHÔNG cần sửa** — CSS không đi qua tsup, được handle bởi `copy-assets.js` trong `onSuccess` hook
2. **`crossOrigin` vs `crossorigin`** — React dùng camelCase `crossOrigin="anonymous"`, không phải `crossorigin`
3. **File cũ `material-symbols.css`** — Cần giữ file cũ copy qua dist/ để backward compat, hoặc làm alias trong `copy-assets.js`
4. **Không dùng `font-display: swap`** — Icon fonts phải dùng `block`, đây là hard requirement theo web.dev best practices
