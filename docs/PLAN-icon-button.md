# PLAN: Icon Button – MD3 Expressive UI Library

## Tổng quan

Triển khai component `IconButton` cho `@bug-on/md3-react` dựa trên:
- **Android Material 3 Expressive tokens** (XSmall → XLarge, Filled/Tonal/Outlined/Standard)
- **Source code hiện có** đã có đầy đủ logic shape morphing, ripple, loading/toggle
- **Tài liệu a11y & specs** (minimum touch target 48dp, aria-pressed, role="button")

Mục tiêu: refactor/hoàn thiện component IconButton hiện tại thành phiên bản **pixel-perfect** với MD3 Expressive, export đầy đủ từ package, và viết test toàn diện.

---

## Loại dự án

**WEB / UI Library** → Agent: `frontend-specialist` + skill `frontend-design`

---

## Tiêu chí thành công

- [ ] Component pass 100% token mapping so với Kotlin source files
- [ ] Shape morphing chính xác theo RADIUS_MAP từ ShapeKeyTokens
- [ ] Touch target 48x48dp cho xs/sm (a11y)
- [ ] aria-pressed, aria-label, aria-busy, aria-disabled đúng spec
- [ ] Outline width scale đúng per-size (1dp/1dp/1dp/2dp/3dp)
- [ ] Export đầy đủ từ packages/react/src/index.ts
- [ ] Test coverage 100% (unit + a11y)
- [ ] Build TypeScript không có lỗi

---

## Phân tích Token (nguồn sự thật)

### Kích thước & Icon (từ Token files)

| Size | Container | Icon | Shape Round    | Shape Square          | Pressed Shape  | Selected Round        | Selected Square |
|------|-----------|------|----------------|-----------------------|----------------|-----------------------|-----------------|
| XS   | 32dp      | 20dp | CornerFull(16) | CornerMedium(12)      | CornerSmall(8) | CornerMedium(12)      | CornerFull(16)  |
| SM   | 40dp      | 24dp | CornerFull(20) | CornerMedium(12)      | CornerSmall(8) | CornerMedium(12)      | CornerFull(20)  |
| MD   | 56dp      | 24dp | CornerFull(28) | CornerLarge(16)       | CornerMedium(12) | CornerLarge(16)     | CornerFull(28)  |
| LG   | 96dp      | 32dp | CornerFull(48) | CornerExtraLarge(28)  | CornerLarge(16)  | CornerExtraLarge(28) | CornerFull(48) |
| XL   | 136dp     | 40dp | CornerFull(68) | CornerExtraLarge(28)  | CornerLarge(16)  | CornerExtraLarge(28) | CornerFull(68) |

ShapeKeyTokens: CornerSmall=8, CornerMedium=12, CornerLarge=16, CornerExtraLarge=28, CornerFull=height/2

### Outline Width per Size

| Size | OutlineWidth | Tailwind class |
|------|-------------|----------------|
| XS   | 1dp         | border         |
| SM   | 1dp         | border         |
| MD   | 1dp         | border         |
| LG   | 2dp         | border-2       |
| XL   | 3dp         | border-[3px]   |

### Color Tokens

| Variant  | Unselected BG       | Unselected FG          | Selected BG     | Selected FG         |
|----------|---------------------|------------------------|-----------------|---------------------|
| standard | transparent         | on-surface-variant     | transparent     | primary             |
| filled   | surface-container   | on-surface-variant     | primary         | on-primary          |
| tonal    | secondary-container | on-secondary-container | secondary       | on-secondary        |
| outlined | transparent+border  | on-surface-variant     | inverse-surface | inverse-on-surface  |

---

## Bugs cần fix trong source hiện tại

### Bug 1: Outline width không scale theo size
Code dùng `border border-m3-outline-variant` cố định cho mọi size.
Fix: Thêm SIZE_OUTLINE_WIDTH map và apply dynamic theo size prop.

### Bug 2: cva import không dùng
Import `cva` từ class-variance-authority nhưng không sử dụng trong code.
Fix: Xoá import.

### Bug 3: Disabled overlay cho outlined variant
Outlined button không có background container → class `disabled:bg-m3-on-surface/12`
không nên apply cho outlined. Cần conditional class application.

### Bug 4: Thiếu export trong index.ts
`IconButton` chưa được export từ `packages/react/src/index.ts`.

### Bug 5: Thiếu test file
`icon-button.test.tsx` chưa tồn tại.

---

## Cấu trúc file sẽ thay đổi

```
packages/react/src/
├── ui/
│   ├── icon-button.tsx          [MODIFY] Fix bugs, chuẩn hóa tokens
│   └── icon-button.test.tsx     [NEW]    Unit + a11y tests
├── index.ts                     [MODIFY] Export IconButton
```

---

## Task Breakdown

### Task 1: Fix icon-button.tsx
**Agent:** frontend-specialist | **Skill:** frontend-design, clean-code
**Priority:** P0 (Blocker)

INPUT: icon-button.tsx hiện tại + token analysis
OUTPUT: icon-button.tsx đã fix
VERIFY: npx tsc --noEmit pass

- [ ] Xoá import cva không dùng
- [ ] Thêm SIZE_OUTLINE_WIDTH constant map
- [ ] Refactor colorStyles.outlined để dùng SIZE_OUTLINE_WIDTH dynamic
- [ ] Fix disabled state: không apply bg cho outlined variant
- [ ] Thêm JSDoc rõ ràng cho aria-label requirement

---

### Task 2: Verify RADIUS_MAP chính xác
**Agent:** frontend-specialist
**Priority:** P0
**Depends on:** Task 1

INPUT: RADIUS_MAP trong icon-button.tsx + token files
OUTPUT: RADIUS_MAP đúng với comment mapping token
VERIFY: Kiểm tra 5 size × 2 shape × 3 state

- [ ] XS: round=16, square=12, pressed=8, selectedRound=12, selectedSquare=16
- [ ] SM: round=20, square=12, pressed=8, selectedRound=12, selectedSquare=20
- [ ] MD: round=28, square=16, pressed=12, selectedRound=16, selectedSquare=28
- [ ] LG: round=48, square=28, pressed=16, selectedRound=28, selectedSquare=48
- [ ] XL: round=68, square=28, pressed=16, selectedRound=28, selectedSquare=68
- [ ] Thêm comment inline giải thích ShapeKeyToken → px value

---

### Task 3: Viết icon-button.test.tsx
**Agent:** frontend-specialist | **Skill:** testing-patterns
**Priority:** P1
**Depends on:** Task 1, Task 2

INPUT: icon-button.tsx đã hoàn chỉnh
OUTPUT: packages/react/src/ui/icon-button.test.tsx
VERIFY: npm run test pass 100%

Test cases:
- Rendering: render default, tất cả size, tất cả colorStyle, round/square
- A11y: aria-label, aria-pressed toggle, aria-disabled, aria-busy, touch target, role button
- Interaction: onClick, disabled block, loading block, ripple, keyboard
- Toggle: selected/unselected states
- Loading: LoadingIndicator, ProgressIndicator circular, content hidden
- CSS Classes: SIZE_STYLES, border outlined, disabled opacity

---

### Task 4: Export trong index.ts
**Agent:** frontend-specialist
**Priority:** P1
**Depends on:** Task 1

INPUT: packages/react/src/index.ts
OUTPUT: index.ts với export IconButton
VERIFY: Import hoạt động từ @bug-on/md3-react

- [ ] Thêm export type { BaseIconButtonProps, IconButtonProps } from "./ui/icon-button"
- [ ] Thêm export { IconButton } from "./ui/icon-button"

---

### Task 5: Final Verification
**Priority:** P2
**Depends on:** Task 1-4

```bash
npx tsc --noEmit
npm run lint
npm run test packages/react/src/ui/icon-button.test.tsx
npm run build -w @bug-on/md3-react
```

---

## Dependency Graph

```
Task 1 ──────────────────── Task 4
   │
Task 2
   │
Task 3
   │
Task 5 (final)
```

---

## Câu hỏi mở

> [!IMPORTANT]
> **Q1:** aria-label hiện đang optional trong type. Theo MD3 a11y spec, icon button BẮT BUỘC phải có accessible name. Enforce cứng required hay chỉ warn trong JSDoc?

> [!IMPORTANT]
> **Q2:** Có cần tạo demo page trong apps/docs cho IconButton không (tương tự Chip, Card), hay chỉ component + tests trong scope này?

> [!NOTE]
> **Q3:** cva được import nhưng không dùng. Có kế hoạch dùng sau này không? Nếu không, sẽ xoá.
