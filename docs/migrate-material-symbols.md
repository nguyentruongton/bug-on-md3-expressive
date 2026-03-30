# Migrate lucide-react → Material Symbols Variable Font

**Project Type:** WEB — Library Package  
**Agent:** `frontend-specialist`  
**Status:** 🟡 PLANNING

---

## Overview

Thay thế dependency `lucide-react` (^0.477.0) trong `packages/react` bằng **Material Symbols Variable Font** — font icon của Google được render bằng CSS ligatures. Tạo component `<Icon />` mới hỗ trợ đầy đủ 4 axes biến thể của variable font (`FILL`, `wght`, `GRAD`, `opsz`), có thể animate qua `motion/react`, và tuỳ biến qua Tailwind utilities.

> **Quan trọng:** `lucide-react` hiện tại KHÔNG được dùng trong bất kỳ component nào của codebase (Button, FAB, IconButton, Chip đều nhận `icon?: React.ReactNode` từ bên ngoài). Việc xóa chỉ là clean up dependency — không làm bể API.

---

## Success Criteria

- [ ] `<Icon name="home" />` render đúng symbol Material Symbols
- [ ] Cả 3 variants `outlined | rounded | sharp` hoạt động
- [ ] 4 variable font axes (`fill`, `weight`, `grade`, `opticalSize`) phản ánh đúng vào `font-variation-settings`
- [ ] `animateFill` prop tạo spring animation via `motion/react`
- [ ] TypeScript strict mode passes (0 errors)
- [ ] Vitest tests pass cho tất cả test cases
- [ ] `lucide-react` không còn trong `package.json`
- [ ] CSS export `@bug-on/md3-react/material-symbols.css` hoạt động
- [ ] Tailwind utilities `icon-outlined`, `icon-fill-1`, `icon-weight-700`, v.v. hoạt động
- [ ] README.md có section Icons đầy đủ

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Icon render | CSS font ligatures | Zero JS overhead, variable font axes |
| Animation | `motion/react` (m.span) | Đồng nhất với button.tsx pattern, native `font-variation-settings` animation |
| Styling | Tailwind v4 utilities + CSS vars | Tuỳ biến qua `--md-icon-*` CSS variables |
| Tailwind plugin | `tailwindcss/plugin` API | Đồng nhất với `packages/tailwind/src/index.ts` hiện tại |
| Build | `tsup` + `copy-assets.js` | `material-symbols.css` follow pattern của `typography.css` |
| Tests | Vitest + @testing-library/react | Đồng nhất với test suite hiện tại |

---

## Codebase Context

### Patterns hiện tại cần theo:
- `button.tsx`: `LazyMotion + domMax, m.span, React.forwardRef, React.memo`
- `constants.ts`: `SPRING_TRANSITION_FAST` spring config (type: spring, bounce: 0, duration: 0.2)
- `copy-assets.js`: Copy từ `src/assets/` → `dist/assets/` + path rewrite
- `tsup.config.ts`: entry `src/index.ts`, `onSuccess: "node scripts/copy-assets.js"`
- `packages/tailwind/src/index.ts`: `plugin({ addBase, addUtilities })` pattern

### Files hiện tại KHÔNG được chỉnh sửa:
- `src/ui/button.tsx`, `fab.tsx`, `icon-button.tsx`, `chip.tsx`
- Bất kỳ component nào đã tồn tại

---

## File Structure

```
packages/
├── react/
│   ├── src/
│   │   ├── assets/
│   │   │   └── material-symbols.css     ← [NEW] Google Fonts CDN + self-host guide
│   │   ├── ui/
│   │   │   ├── icon.tsx                 ← [NEW] Icon component
│   │   │   └── icon.test.tsx            ← [NEW] Vitest tests
│   │   └── index.ts                     ← [MODIFY] Add Icon exports
│   ├── package.json                     ← [MODIFY] Remove lucide-react, add CSS export
│   └── tsup.config.ts                   ← [MODIFY if needed] Check CSS copy handled
│
└── tailwind/
    └── src/
        └── index.ts                     ← [MODIFY] Add icon plugin utilities
```

---

## Task Breakdown

### TASK 01 — Tailwind Icon Plugin
**Agent:** `frontend-specialist`  
**Skill:** `tailwind-patterns`  
**Priority:** P0 (blocker cho Icon component)  
**Estimated:** 5–8 phút

**INPUT:** `packages/tailwind/src/index.ts` (existing plugin)  
**OUTPUT:** Thêm addBase + addUtilities mới cho icon utilities  
**VERIFY:** Import `icon-outlined`, `icon-fill-1`, `icon-weight-700` trong consumer app compile success

**Công việc:**
1. Thêm vào `addBase` — CSS variables cho base `.md-icon` class:
   ```css
   .md-icon {
     font-family: var(--md-icon-font, 'Material Symbols Outlined');
     font-weight: normal;
     font-style: normal;
     font-size: var(--md-icon-size, 24px);
     line-height: 1;
     display: inline-block;
     white-space: nowrap;
     word-wrap: normal;
     direction: ltr;
     text-rendering: optimizeLegibility;
     -webkit-font-smoothing: antialiased;
     font-variation-settings:
       'FILL' var(--md-icon-fill, 0),
       'wght' var(--md-icon-weight, 400),
       'GRAD' var(--md-icon-grade, 0),
       'opsz' var(--md-icon-opsz, 24);
   }
   ```

2. Thêm vào `addUtilities` — icon variant classes:
   ```
   .icon-outlined → font-family: 'Material Symbols Outlined'
   .icon-rounded  → font-family: 'Material Symbols Rounded'
   .icon-sharp    → font-family: 'Material Symbols Sharp'
   .icon-fill-0   → --md-icon-fill: 0
   .icon-fill-1   → --md-icon-fill: 1
   .icon-weight-{100|200|300|400|500|600|700} → --md-icon-weight: {n}
   .icon-grade-low     → --md-icon-grade: -25
   .icon-grade-default → --md-icon-grade: 0
   .icon-grade-high    → --md-icon-grade: 200
   .icon-size-{20|24|40|48} → font-size: {n}px + --md-icon-opsz: {n}
   ```

> ⚠️ **Lưu ý Tailwind v4:** Dự án này dùng Tailwind v4 (CSS-first config). Cần kiểm tra xem plugin API (`tailwindcss/plugin`) vẫn còn tương thích không — hiện tại `packages/tailwind/src/index.ts` đã dùng nó thành công.

---

### TASK 02 — Material Symbols CSS Setup
**Agent:** `frontend-specialist`  
**Skill:** `frontend-design`  
**Priority:** P0  
**Estimated:** 3–5 phút

**INPUT:** Không có (file mới)  
**OUTPUT:** `packages/react/src/assets/material-symbols.css`  
**VERIFY:** File tồn tại, import từ consumer `@import '@bug-on/md3-react/material-symbols.css'` resolve

**Công việc:**
1. Tạo `packages/react/src/assets/material-symbols.css`:
   ```css
   /* Material Symbols — Variable font with FILL axis for animation support */
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block');
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block');
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block');
   ```
2. Thêm comment hướng dẫn self-host và subsetting (icon_names parameter)

> ⚠️ **`display=block`** thay vì `swap` — ngăn FOUT (Flash of Unstyled Text) vì icon render bằng ligature, fallback text sẽ hiển thị tên icon như "home" nếu dùng `swap`.

---

### TASK 03 — Icon Component
**Agent:** `frontend-specialist`  
**Skill:** `clean-code`, `react-best-practices`  
**Priority:** P1 (depends on TASK 01)  
**Estimated:** 10–15 phút

**INPUT:** `constants.ts` (SPRING_TRANSITION_FAST), `button.tsx` (pattern reference)  
**OUTPUT:** `packages/react/src/ui/icon.tsx`  
**VERIFY:** TypeScript strict compile passes, component renders in Storybook/docs

**Công việc:**
1. Interface `IconProps` với đầy đủ props (name, variant, fill, weight, grade, opticalSize, size, animateFill, className, style)
2. `VARIANT_FONT` lookup map
3. Component với `React.forwardRef`:
   - Branch: `animateFill === true` → `m.span` với `animate={{ fontVariationSettings }}` + `transition={SPRING_TRANSITION_FAST}`
   - Default → plain `<span>`
   - Cả hai: `className={cn('md-icon select-none', className)}`, `aria-hidden="true"`, `style` computed
4. Wrap `m.span` branch trong `<LazyMotion features={domMax} strict>`
5. `Icon.displayName = 'Icon'`
6. `export const Icon = React.memo(IconComponent)`

**Type chi tiết:**
```typescript
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  variant?: 'outlined' | 'rounded' | 'sharp';
  fill?: 0 | 1;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -50 | -25 | 0 | 100 | 200;
  opticalSize?: 20 | 24 | 40 | 48;
  size?: number;
  animateFill?: boolean;
}
```

**Computed style:**
```typescript
const fontVariationSettings = `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`;
const computedStyle = {
  fontFamily: VARIANT_FONT[variant],
  fontSize: size ? `${size}px` : `${opticalSize}px`,
  fontVariationSettings,
  ...style,
};
```

> ⚠️ **React 19 strict mode + LazyMotion:** Cần `strict` prop trên LazyMotion giống button.tsx (đã verify hoạt động).

---

### TASK 04 — Vitest Tests
**Agent:** `frontend-specialist`  
**Skill:** `testing-patterns`, `tdd-workflow`  
**Priority:** P2 (depends on TASK 03)  
**Estimated:** 8–12 phút

**INPUT:** `icon.tsx` component  
**OUTPUT:** `packages/react/src/ui/icon.test.tsx`  
**VERIFY:** `pnpm test` trong `packages/react` passes tất cả cases

**Test cases (8 cases):**
1. ✅ Renders text content (icon name) — `getByText('home')`
2. ✅ Default variant `outlined` → fontFamily contains "Material Symbols Outlined"
3. ✅ `variant="rounded"` → fontFamily contains "Material Symbols Rounded"
4. ✅ `variant="sharp"` → fontFamily contains "Material Symbols Sharp"
5. ✅ `fill=1, weight=700, grade=200, opticalSize=48` → `font-variation-settings` chứa đúng values
6. ✅ `animateFill=false` → renders `<span>` (không có motion data attrs)
7. ✅ `animateFill=true` → renders element với motion attributes
8. ✅ `aria-hidden="true"` được set
9. ✅ `className` được merge đúng với `md-icon`

> **Lưu ý:** `animateFill=true` test cần mock `motion/react` hoặc check DOM attributes như `data-framer-appear-id` / class selectors. Có thể check `element.tagName` không đủ vì m.span vẫn render `span`.

---

### TASK 05 — Update package exports
**Agent:** `backend-specialist`  
**Priority:** P2 (depends on TASK 02, 03)  
**Estimated:** 3–5 phút

**INPUT:** `packages/react/src/index.ts`, `packages/react/package.json`  
**OUTPUT:** Icon exported, lucide-react removed, CSS export added  
**VERIFY:** `pnpm build` thành công, `dist/` chứa đúng files

**Công việc:**

A. `packages/react/src/index.ts` — thêm sau IconButton exports:
```typescript
export type { IconProps } from './ui/icon';
export { Icon } from './ui/icon';
```

B. `packages/react/package.json`:
- Xóa `"lucide-react": "^0.477.0"` khỏi `dependencies`
- Thêm vào `exports`:
  ```json
  "./material-symbols.css": {
    "style": "./dist/material-symbols.css",
    "default": "./dist/material-symbols.css"
  }
  ```

> ⚠️ **Package.json exports path:** Hiện tại `typography.css` export trỏ đến `./dist/typography.css` (root dist, không phải `dist/assets/`). Cần đồng nhất — material-symbols.css sẽ được copy thẳng ra `dist/` bởi `copy-assets.js`.

---

### TASK 06 — Update copy-assets.js
**Agent:** `backend-specialist`  
**Priority:** P2 (depends on TASK 02, 05)  
**Estimated:** 3–5 phút

**INPUT:** `packages/react/scripts/copy-assets.js`  
**OUTPUT:** Script copy thêm `material-symbols.css` ra `dist/`  
**VERIFY:** Sau `pnpm build`, `dist/material-symbols.css` tồn tại

**Công việc:**
Thêm vào `copy-assets.js`:
```javascript
const srcMaterialCss = path.join(__dirname, '../src/assets/material-symbols.css');
const distMaterialCss = path.join(__dirname, '../dist/material-symbols.css');

if (fs.existsSync(srcMaterialCss)) {
  fs.copyFileSync(srcMaterialCss, distMaterialCss);
  console.log('✅ Copied material-symbols.css to dist/material-symbols.css');
}
```

> ⚠️ `material-symbols.css` chỉ có Google Fonts `@import` URLs, không có local font path → KHÔNG cần path rewrite như `typography.css`.

---

### TASK 07 — Update README.md
**Agent:** `frontend-specialist`  
**Skill:** `documentation-templates`  
**Priority:** P3 (không block build/tests)  
**Estimated:** 5–8 phút

**INPUT:** `packages/react/README.md` (nếu tồn tại)  
**OUTPUT:** Section "Icons" được thêm  
**VERIFY:** Docs đầy đủ theo checklist

**Section cần có:**
- Import font: `import '@bug-on/md3-react/material-symbols.css'`
- Basic usage: `<Icon name="home" />`
- Variants: outlined/rounded/sharp
- Variable font props: fill, weight, grade, opticalSize
- Animated fill: `<Icon name="favorite" fill={isLiked ? 1 : 0} animateFill />`
- Typography grade matching
- Production: font subsetting với `&icon_names=`
- Self-hosting guide

---

## Dependency Graph

```
TASK 01 (Tailwind plugin) ──────────────────┐
                                             │
TASK 02 (material-symbols.css) ─────────────┤
                                             ↓
TASK 03 (Icon component) ──────────── TASK 04 (Tests)
         │
         └──────────────── TASK 05 (Exports) ── TASK 06 (copy-assets)
                                    │
                                    └──────── TASK 07 (README)
```

**Parallel:** TASK 01 + TASK 02 có thể làm song song (độc lập).  
**Serial:** TASK 03 → TASK 04 (test cần component), TASK 02 → TASK 06 (copy cần file).

---

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| `font-variation-settings` animation không smooth | Low | Medium | `SPRING_TRANSITION_FAST` (bounce:0) đã được test trên button |
| Tailwind v4 plugin API incompatibility | Low | High | `packages/tailwind/src/index.ts` đã dùng `tailwindcss/plugin` thành công |
| LazyMotion duplicate error trong tests | Medium | Low | Mock motion/react trong test setup hoặc dùng `AnimatePresence` wrapper |
| `lucide-react` được import ngầm ở đâu đó | Low | High | Grep `lucide` trước khi xóa |
| FOUT với Google Fonts CDN | Low | Medium | `display=block` ngăn FOUT, nhưng cần network |

---

## Pre-Implementation Checklist

- [ ] Grep `lucide-react` imports trong toàn bộ `packages/react/src/` để confirm không có usage
- [ ] Verify Tailwind v4 plugin API còn dùng được với `addBase` + `addUtilities`
- [ ] Xác nhận `pnpm test` hiện tại chạy thành công (baseline)

---

## Phase X: Verification Checklist

```bash
# 1. TypeScript strict check
cd packages/react && pnpm lint

# 2. Unit tests
cd packages/react && pnpm test

# 3. Build
cd packages/react && pnpm build

# 4. Verify dist outputs
ls packages/react/dist/material-symbols.css  # must exist
ls packages/react/dist/index.js              # must have "use client"

# 5. Check no lucide-react import remains
grep -r "lucide-react" packages/react/src/  # must be empty

# 6. Biome lint
pnpm --filter @bug-on/md3-react exec biome check .
```

### Rule Compliance
- [ ] No purple/violet hex codes (N/A — không có màu)
- [ ] Socratic Gate respected ✅
- [ ] Pattern đồng nhất với button.tsx ✅

---

*Plan created: 2026-03-30 | Task: migrate-material-symbols*
