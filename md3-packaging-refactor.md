# PLAN: MD3 Library Packaging Refactor

> **File:** `md3-packaging-refactor.md`
> **Created:** 2026-04-21
> **Status:** 🟡 PLANNING

---

## 📋 Overview

Tối ưu hóa cấu trúc monorepo `bug-on-md3-expressive` gồm 3 gói (`@bug-on/md3-react`, `@bug-on/md3-tailwind`, `@bug-on/md3-tokens`) để giải quyết các vấn đề tích hợp thực tế: types resolution, peer dependencies, exports completeness, và DX improvements.

**Project Type:** BACKEND (Library/Package tooling)
**Agent:** `backend-specialist` + `frontend-specialist` (cho Typography audit)

---

## ✅ Success Criteria

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | `pnpm install` ở host project không báo peer dep warning | `pnpm install --strict-peer-dependencies` |
| 2 | `pnpm build` ở root pass cho tất cả 3 packages | `turbo run build` exit code 0 |
| 3 | TypeScript strict mode không lỗi ở host project | `tsc --noEmit` trong host |
| 4 | `@bug-on/md3-tailwind` export có đầy đủ IntelliSense | VS Code hover trên plugin import |
| 5 | CSS sub-path exports không báo "Cannot find module" | TS strict + `moduleResolution: bundler` |
| 6 | `<Typography />` component có thể import và dùng được | Render trong host project |
| 7 | `dts: true` trong tsup của `md3-react` tạo ra `dist/index.d.ts` | `ls dist/*.d.ts` |

---

## 🔍 Current State Analysis

### ✅ Đã đúng / Không cần sửa
- `pnpm-workspace.yaml` — đã tồn tại với `packages/*` và `apps/*`
- Root `package.json` — đã có Turbo scripts (`dev`, `build`, `clean`)
- `@bug-on/md3-tailwind` tsup config — đã có `dts: true`
- `@bug-on/md3-tokens` tsup config — đã có `dts: true`
- `peerDependencies` trong `md3-react` — đã đúng `"react": "^19.0.0"`
- `Typography` component — đã tồn tại và được export từ `src/index.ts`
- `tsup.config.ts` `md3-react` — đã có `external: ["react", "react-dom", "motion"]`

### ❌ Các vấn đề cần fix

| Package | Vấn đề | Severity |
|---------|---------|----------|
| `md3-react` | `tsup.config.ts` **thiếu `dts: true`** — type declarations không được bundle bởi tsup | 🔴 Critical |
| `md3-react` | CSS sub-path exports thiếu trường `types` | 🟠 High |
| `md3-tokens` | CSS sub-path exports trỏ vào `src/` thay vì `dist/` + thiếu `types` | 🟠 High |
| `md3-tailwind` | `export default md3Plugin as any` — mất IntelliSense | 🟡 Medium |
| `md3-tailwind` | Thiếu `exports` field trong `package.json` | 🟡 Medium |
| `md3-react` | `tsconfig.build.json` chưa xác nhận tồn tại | 🟡 Medium |

---

## 🗺️ File Structure (files affected)

```
bug-on-md3-expressive/
└── packages/
    ├── react/
    │   ├── package.json          ← FIX: CSS exports thêm types + object format
    │   ├── tsup.config.ts        ← FIX: thêm dts: true
    │   └── tsconfig.build.json   ← VERIFY / SIMPLIFY
    ├── tailwind/
    │   ├── package.json          ← FIX: thêm exports field
    │   └── src/index.ts          ← FIX: thay `as any` bằng typed export
    └── tokens/
        └── package.json          ← FIX: CSS exports → dist/ + thêm types
```

---

## 📦 Tech Stack

| Layer | Technology | Note |
|-------|------------|------|
| Build | tsup v8 | `dts: true` bundles declarations |
| Types | TypeScript 5.8.3 | strict mode |
| Workspace | pnpm + Turbo | đã configured |
| CSS typing | `.d.ts` module declaration | chuẩn cho CSS sub-paths |
| TW Plugin type | `ReturnType<typeof plugin>` | TW v4 compatible |

---

## 📋 Task Breakdown

### PHASE 1 — Critical Fixes (Build & Types)

---

#### TASK 1.1 — Add `dts: true` to `@bug-on/md3-react` tsup config

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🔴 P0 | **Estimate:** 5 min | **Dependencies:** None

**Context:** Package `md3-react` chưa có `dts: true` trong tsup → declarations chỉ được tạo bởi `tsc` thủ công sau. Khi host project resolve types theo `exports` field, sẽ lỗi nếu không có bundled `.d.ts`.

```
INPUT:  packages/react/tsup.config.ts (không có dts: true)
OUTPUT: tsup.config.ts với dts: true
VERIFY:
  pnpm --filter @bug-on/md3-react build
  ls packages/react/dist/*.d.ts → index.d.ts và index.d.mts phải tồn tại
```

**Rollback:** Revert `tsup.config.ts`, chạy lại `tsc -p tsconfig.build.json`

---

#### TASK 1.2 — Verify / simplify `tsconfig.build.json` for `@bug-on/md3-react`

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🔴 P0 | **Estimate:** 5 min | **Dependencies:** TASK 1.1

**Context:** Build script `"build": "tsup && tsc -p tsconfig.build.json"` tham chiếu file này. Sau khi có `dts: true` trong tsup, có thể bỏ bước `tsc` và đơn giản hóa thành `"build": "tsup"`.

```
INPUT:  Build script trong package.json
OUTPUT: Script đơn giản hóa HOẶC tsconfig.build.json được verify
VERIFY: pnpm --filter @bug-on/md3-react build exit code 0
```

---

### PHASE 2 — Exports Completeness

---

#### TASK 2.1 — Fix CSS exports trong `@bug-on/md3-react/package.json`

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🟠 P1 | **Estimate:** 10 min | **Dependencies:** TASK 1.1

**Context:** 4 CSS sub-paths export dưới dạng string → thiếu `types` field → lỗi trong TypeScript strict mode.

**Pattern:**
```json
// BEFORE:
"./index.css": "./dist/index.css"

// AFTER:
"./index.css": {
  "types": "./dist/index.css.d.ts",
  "default": "./dist/index.css"
}
```

Cần tạo các file `.d.ts` tương ứng (empty CSS module declarations) và copy chúng qua `scripts/copy-assets.js`.

```
INPUT:
  packages/react/package.json — 4 CSS exports dạng string
OUTPUT:
  package.json với 4 CSS exports dạng object có types field
  4 file .d.ts declarations cho CSS modules
VERIFY:
  import "@bug-on/md3-react/index.css" trong host TS không báo lỗi
```

---

#### TASK 2.2 — Fix CSS exports trong `@bug-on/md3-tokens/package.json`

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🟠 P1 | **Estimate:** 10 min | **Dependencies:** None

**Context:** 4 CSS exports đang trỏ vào `src/` thay vì `dist/`. Khi publish lên npm, `src/` không có trong `files` → "Cannot find module" sau khi install.

```json
// BEFORE (broken — src/ not in files):
"./colors.css": "./src/colors.css"

// AFTER:
"./colors.css": {
  "types": "./dist/colors.css.d.ts",
  "default": "./dist/colors.css"
}
```

Cần thêm script copy CSS files từ `src/` sang `dist/` trong build process.

```
INPUT:  packages/tokens/package.json — 4 CSS exports trỏ src/
OUTPUT:
  package.json với exports trỏ dist/ + types field
  Build script copy CSS sang dist/
VERIFY:
  ls packages/tokens/dist/*.css → 5 files (index.css + 4 subs)
  import "@bug-on/md3-tokens/colors.css" không lỗi
```

---

#### TASK 2.3 — Add `exports` field to `@bug-on/md3-tailwind/package.json`

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🟡 P2 | **Estimate:** 5 min | **Dependencies:** None

**Context:** Package chỉ có top-level `main`/`module`/`types`. Cần `exports` field cho `moduleResolution: bundler` (Next.js, Vite).

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}
```

```
INPUT:  packages/tailwind/package.json — thiếu exports
OUTPUT: package.json với exports field
VERIFY: import "@bug-on/md3-tailwind" trong host TS không lỗi
```

---

### PHASE 3 — TypeScript Type Quality

---

#### TASK 3.1 — Remove `as any` from `@bug-on/md3-tailwind` plugin export

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🟡 P2 | **Estimate:** 15 min | **Dependencies:** TASK 2.3

**Context:** `export default md3Plugin as any` vì Tailwind v4 plugin type. Cần loại bỏ `as any` để có IntelliSense.

**Tailwind v4 approach:** `tailwindcss/plugin` return type có thể được infer trực tiếp. Không cần `as any`:

```ts
// BEFORE:
// biome-ignore lint/suspicious/noExplicitAny: Tailwind plugin type is complex
export default md3Plugin as any;

// AFTER:
// tsup với dts: true sẽ infer type từ tailwindcss/plugin tự động
export default md3Plugin;
```

Nếu Biome vẫn báo lỗi về type complexity → dùng `Plugin` type từ tailwindcss hoặc suppress với comment có lý do rõ ràng.

```
INPUT:  packages/tailwind/src/index.ts dòng 172-173
OUTPUT: Export không có `as any`
VERIFY:
  Hover `import md3Plugin from "@bug-on/md3-tailwind"` trong VS Code
  → Hiển thị type thay vì `any`
  tsc --noEmit trong tailwind package không lỗi
```

**Rollback:** Revert to `as any` nếu Tailwind v4 types incompatible

---

### PHASE 4 — Peer Dependencies Documentation

---

#### TASK 4.1 — Document local dev pnpm.overrides pattern

**Agent:** `backend-specialist` | **Skill:** `clean-code`
**Priority:** 🟡 P2 | **Estimate:** 10 min | **Dependencies:** None

**Context:** Khi link local (workspace:*), nếu host project resolve React riêng → duplicate React → hooks fail. Pattern `pnpm.overrides` trong host project ngăn điều này.

**Pattern cần document:**
```json
// Trong host project's package.json:
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
```

```
INPUT:  CONTRIBUTING.md
OUTPUT:
  Verification: external array trong tsup.config.ts đúng (không thay đổi)
  CONTRIBUTING.md có section "Local Development" với pnpm.overrides guidance
VERIFY:
  pnpm --filter @bug-on/md3-react build
  grep "react" packages/react/dist/index.mjs → không có bundled React
```

---

### PHASE 5 — Typography Component Audit (Optional)

---

#### TASK 5.1 — Audit existing Typography component

**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**Priority:** 🔵 P3 (Optional) | **Estimate:** 10 min | **Dependencies:** None

**Context:** `Typography` component đã tồn tại (19KB, `src/ui/typography/typography.tsx`) và được export từ `src/index.ts`. Audit xem API đã intuitive chưa và có cần thêm variants không.

```
INPUT:  packages/react/src/ui/typography/typography.tsx
OUTPUT: Audit report — component đủ hay cần bổ sung?
VERIFY:
  <Typography variant="displayLarge">Text</Typography> renders OK
  All MD3 type scale variants accessible
```

---

## 🔗 Task Dependency Graph

```
TASK 1.1 ──────┬──→ TASK 1.2
               └──→ TASK 2.1

TASK 2.2 ← independent
TASK 2.3 ──→ TASK 3.1
TASK 4.1 ← independent
TASK 5.1 ← independent
```

**Wave execution:**
| Wave | Tasks | Parallelizable |
|------|-------|---------------|
| 1 | 1.1, 2.2, 2.3, 4.1 | ✅ Yes |
| 2 | 1.2, 2.1, 3.1 | ⚠️ 1.2 after 1.1 |
| 3 | 5.1 | ✅ Optional |

---

## ⚠️ Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| `dts: true` conflict với `tsc` (double emission) | 🔴 Build error | Simplify script to `tsup` only |
| Tailwind v4 không export `PluginCreator` | 🟡 Medium | Fallback: `ReturnType<typeof plugin>` |
| CSS `.d.ts` làm host TS config phức tạp | 🟡 Medium | Dùng `declare module '*.css'` pattern |
| Tokens CSS files chưa có copy script | 🟠 High | Thêm postbuild script copy css sang dist/ |

---

## 🔍 Phase X: Verification Checklist

```bash
# 1. Clean build
pnpm --filter "./packages/*" clean
turbo run build

# 2. Verify declarations
ls packages/react/dist/*.d.ts
ls packages/tailwind/dist/*.d.ts
ls packages/tokens/dist/*.d.ts

# 3. Verify CSS files in dist
ls packages/tokens/dist/*.css
ls packages/react/dist/*.css

# 4. Type check all
pnpm --filter "./packages/*" run lint

# 5. Security scan
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
```

### Final Checklist

- [ ] TASK 1.1: `dts: true` in `md3-react` tsup.config.ts
- [ ] TASK 1.2: `tsconfig.build.json` verified/simplified
- [ ] TASK 2.1: CSS exports in `md3-react` have `types` field
- [ ] TASK 2.2: CSS exports in `md3-tokens` point to `dist/` + have `types`
- [ ] TASK 2.3: `exports` field added to `md3-tailwind`
- [ ] TASK 3.1: Tailwind plugin exported without `as any`
- [ ] TASK 4.1: `pnpm.overrides` pattern documented
- [ ] TASK 5.1: Typography component audited (optional)
- [ ] All packages build successfully
- [ ] No TypeScript errors in any package
- [ ] No peer dependency warnings

---

## ✅ PHASE X COMPLETE

_To be filled after implementation_

- Build: ⬜ Pending
- Types: ⬜ Pending
- Lint: ⬜ Pending
- Date: —
