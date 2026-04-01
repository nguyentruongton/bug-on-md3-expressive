# PLAN: MD3 Expressive Checkbox Component

> **Agent:** `@frontend-specialist` + `@test-engineer`  
> **Project Type:** WEB — React Component Library  
> **Task Slug:** `md3-checkbox`

---

## 📋 Overview

Triển khai component **MD3 Expressive Checkbox** hoàn chỉnh cho package `@md3-expressive/react`. Component cần animation checkmark draw (pathLength), container fill transition, và tri-state (unchecked | checked | indeterminate) theo đúng chuẩn Material Design 3.

### Vấn đề cần giải quyết

| Yêu cầu | Mức độ phức tạp |
|---------|-----------------|
| Tri-state logic (unchecked → checked → indeterminate) | Trung bình |
| Framer Motion SVG pathLength animation | Cao |
| SVG path morphing (checkmark ↔ dash) | Cao |
| Container fill/drain animation | Trung bình |
| State layer (hover/focus/press) circular ring | Trung bình |
| `forwardRef` + controlled/uncontrolled modes | Trung bình |
| Full a11y: `aria-checked="mixed"`, `sr-only` input | Thấp |

---

## 🎯 Success Criteria

- [ ] `pnpm --filter @md3-expressive/react test` → **PASS** 0 failures
- [ ] `pnpm --filter @md3-expressive/react build` → **PASS** 0 TypeScript errors
- [ ] Checkbox render đúng 3 trạng thái: unchecked / checked / indeterminate
- [ ] Checkmark animate pathLength 0→1 khi check (MD3 Standard easing)
- [ ] Dash morph animate khi chuyển sang indeterminate
- [ ] Container fill animate background từ transparent → primary
- [ ] Không breaking changes các component hiện tại
- [ ] `aria-checked="mixed"` cho indeterminate, `"true"` cho checked, `"false"` cho unchecked
- [ ] `prefers-reduced-motion`: bỏ tất cả animation, instant state change

---

## 🧱 Tech Stack (Kế thừa từ dự án)

| Công nghệ | Vai trò |
|-----------|---------|
| React 18+ | UI framework |
| TypeScript (strict) | Type safety |
| Tailwind CSS v4 | Styling (token-based) |
| Framer Motion (`motion/react`) | Animation engine |
| `LazyMotion` + `domMax` | Bundle optimization |
| `class-variance-authority` (CVA) | Variant management |
| `Ripple` + `useRippleState` | State layer / ripple |
| Vitest + `@testing-library/react` | Testing |
| Biome | Linting/formatting |

---

## 📁 Files cần tạo/sửa

| File | Action |
|------|--------|
| `packages/react/src/ui/checkbox.tsx` | **[CREATE]** |
| `packages/react/src/ui/checkbox.test.tsx` | **[CREATE]** |
| `packages/react/src/index.ts` | **[UPDATE]** — thêm exports |

---

## 🔍 Phân tích Pattern Hiện Tại (từ codebase)

### Pattern chuẩn từ `button.tsx`

Tất cả components đều theo cấu trúc:
1. JSDoc block đầu file với `@file`, `@see`, spec URL
2. Import: `cva`, `motion/react` (`LazyMotion` + `domMax` + `m`), `React`, `cn`, shared utilities
3. Design tokens: object literals (`SIZE_STYLES`, `ROUND_RADIUS`, v.v.)
4. CVA variants
5. `forwardRef` component: `const XxxComponent = React.forwardRef<HTMLEl, Props>(...)`
6. `XxxComponent.displayName = "Xxx"`
7. `export const Xxx = React.memo(XxxComponent)`

### Pattern từ `chip.tsx` (state layer via CSS `before:`)

```tsx
"before:absolute before:inset-[-1px] before:pointer-events-none before:rounded-lg"
"before:transition-opacity before:duration-200 before:opacity-0"
"hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10]"
```

### Pattern từ `ripple.tsx`

- `useRippleState()` hook: trả về `{ ripples, onPointerDown, removeRipple }`
- `useReducedMotion()` từ `motion/react` để disable animations

### Tailwind Conventions trong dự án

```
m3-primary, m3-on-primary, m3-on-surface, m3-error, m3-on-error
text-m3-*, bg-m3-*, border-m3-*
focus-visible:ring-m3-*
disabled:opacity-[0.38] disabled:pointer-events-none
```

### Animation Constants (từ `shared/constants.ts`)

```ts
SPRING_TRANSITION_FAST  // { type: "spring", bounce: 0, duration: 0.2 }
SPRING_TRANSITION       // { type: "spring", bounce: 0, duration: 0.3 }
```

---

## 📐 Design Tokens (MD3 Spec)

| Token | Giá trị | Tailwind Class |
|-------|---------|----------------|
| Container size | 18x18px | `w-[18px] h-[18px]` |
| Container corner | 2dp | `rounded-sm` |
| State layer size | 40x40px | `w-10 h-10` |
| Touch target | 48x48px | `w-12 h-12` |
| Outline width unselected | 2dp | `border-2` |
| Outline width selected | 0dp | `border-0` |
| Focus indicator | 3dp offset 2dp | `outline-[3px] outline-offset-2` |
| Disabled opacity | 0.38 | `opacity-[0.38]` |
| Hover state layer | 8% | `opacity-[0.08]` |
| Focus/press state layer | 10% | `opacity-[0.10]` |

### Color Tokens Per State

| Trạng thái | Container | Border | Icon |
|-----------|-----------|--------|------|
| Unchecked | transparent | `m3-on-surface/38` | none |
| Checked | `m3-primary` | none | `m3-on-primary` |
| Indeterminate | `m3-primary` | none | `m3-on-primary` (dash) |
| Error + Unchecked | transparent | `m3-error` | none |
| Error + Checked | `m3-error` | none | `m3-on-error` |
| Disabled | opacity 0.38 trên tất cả | | |

---

## Animation Spec (Framer Motion)

### 1. Checkmark PathLength Animation

```
SVG path (check): M 4.5 9 L 9 13.5 L 13.5 4.5
Unchecked -> Checked: pathLength 0 -> 1, duration: 200ms, ease: [0.2, 0, 0, 1]
Checked -> Unchecked: pathLength 1 -> 0, duration: 100ms, ease: "easeOut"
```

### 2. Indeterminate Dash Morph

```
SVG path (dash): M 4.5 9 L 9 9 L 13.5 9
(3 diem de match so lenh voi checkmark - CRITICAL!)

animate({ d: dashPath }) duration: 200ms ease: [0.2, 0, 0, 1]
```

> **Critical:** Ca 2 paths PHAI co cung so lenh SVG de morph hoat dong.
> Dash dung 3 diem: `M 4.5 9 L 9 9 L 13.5 9` (diem giua o 9,9 thay vi 9,13.5)

### 3. Container Fill Animation

```
Unchecked -> Checked/Indeterminate:
  backgroundColor: transparent -> var(--color-m3-primary)
  borderWidth: 2px -> 0px
  duration: 150ms, ease: [0.3, 0, 1, 1] (MD3 FastEffects)

Checked/Indeterminate -> Unchecked:
  backgroundColor: var(--color-m3-primary) -> transparent
  borderWidth: 0px -> 2px
  duration: 100ms, ease: "easeOut"
```

### 4. State Layer

```
Dung CSS before: pseudo-element (consistent voi chip.tsx)
Hover:         before:opacity-[0.08]
Focus-visible: before:opacity-[0.10]
Active/Press:  before:opacity-[0.10]
Color:         before:bg-m3-on-surface (unselected) / before:bg-m3-primary (selected)
```

---

## State Logic

```typescript
type CheckboxState = 'unchecked' | 'checked' | 'indeterminate'

// Priority: state prop > indeterminate prop > checked prop
function resolveState(
  checked?: boolean,
  indeterminate?: boolean,
  state?: CheckboxState
): CheckboxState {
  if (state !== undefined) return state
  if (indeterminate) return 'indeterminate'
  return checked ? 'checked' : 'unchecked'
}

// Cycle cho uncontrolled tri-state click
const NEXT_STATE: Record<CheckboxState, CheckboxState> = {
  unchecked: 'checked',
  checked: 'indeterminate',
  indeterminate: 'unchecked',
}
```

---

## Component Architecture

### 2 Exports chinh

1. `Checkbox` - standard 2-state hoac indeterminate via prop
2. `TriStateCheckbox` - wrapper tien loi cho tri-state pattern

### Cau truc DOM

```
label.inline-flex.items-center.gap-2.cursor-pointer.select-none
  div.relative.inline-flex.items-center.justify-center.w-12.h-12.group  (touch target)
    div.absolute.rounded-full.w-10.h-10.pointer-events-none             (state layer)
      ::before (opacity animation via Tailwind)
    input[type=checkbox].sr-only.peer                                    (a11y control)
    m.div.relative.w-[18px].h-[18px].rounded-sm                         (visual box)
      m.svg.w-[18px].h-[18px]
        m.path (animated pathLength + d morph)
  span.text-sm.text-m3-on-surface                                       (label text)
```

---

## Task Breakdown

### Phase 1: Foundation

#### Task 1.1 - Khao sat biome.json & deps
- **Priority:** P0 (Blocker)
- **INPUT:** Root `biome.json`, `packages/react/package.json`
- **OUTPUT:** Biet indent (tab), quote style (double), import order
- **VERIFY:** biome config understood

#### Task 1.2 - Tao `checkbox.tsx` skeleton
- **Priority:** P0 | **Depends on:** 1.1
- **INPUT:** Pattern tu `button.tsx`, interfaces tu spec
- **OUTPUT:** File voi imports, TypeScript interfaces, empty component
- **VERIFY:** `tsc --noEmit` khong loi

---

### Phase 2: Core Logic + Animation

#### Task 2.1 - State Logic
- **Priority:** P1 | **Depends on:** 1.2
- **OUTPUT:** `resolveState()`, `NEXT_STATE` map, click handler
- **VERIFY:** 3 states cycle correctly

#### Task 2.2 - Visual Structure + A11y
- **Priority:** P1 | **Depends on:** 2.1
- **OUTPUT:** DOM anatomy, `aria-checked` correct per state, `sr-only` input
- **VERIFY:** Screen reader announces state correctly

#### Task 2.3 - Container Fill Animation
- **Priority:** P1 | **Depends on:** 2.2
- **OUTPUT:** `m.div` animate backgroundColor + borderWidth
- **VERIFY:** Fill 150ms FastEffects / drain 100ms smooth

#### Task 2.4 - Checkmark PathLength
- **Priority:** P1 | **Depends on:** 2.3
- **OUTPUT:** `m.path` animate pathLength 0 to 1, 200ms MD3 Standard
- **VERIFY:** Checkmark appears voi draw effect

#### Task 2.5 - Dash Morph (Indeterminate)
- **Priority:** P1 | **Depends on:** 2.4
- **OUTPUT:** SVG path morph checkmark <-> dash
- **VERIFY:** Morph khong jump, 3 states smooth

---

### Phase 3: Variants & Polish

#### Task 3.1 - Error State
- **Priority:** P2 | **Depends on:** 2.2
- **OUTPUT:** Error colors, `aria-invalid="true"`

#### Task 3.2 - Disabled State
- **Priority:** P2 | **Depends on:** 2.2
- **OUTPUT:** `opacity-[0.38]`, `pointer-events-none`, `disabled` + `aria-disabled`

#### Task 3.3 - Reduced Motion
- **Priority:** P2 | **Depends on:** 2.4, 2.5
- **OUTPUT:** `useReducedMotion()` -> instant state change

#### Task 3.4 - Label + ForwardRef
- **Priority:** P2 | **Depends on:** 2.2
- **OUTPUT:** Label wraps checkbox, `htmlFor` link, `ref` forward to hidden `<input>`

---

### Phase 4: Testing

#### Task 4.1 - Viet Test Suite (`checkbox.test.tsx`)
- **Priority:** P1 | **Depends on:** Tasks 2.x, 3.x
- **OUTPUT:** 20+ test cases
- **VERIFY:** `pnpm --filter @md3-expressive/react test` PASS

Test cases:
- renders unchecked by default
- renders checked when checked=true
- renders indeterminate when indeterminate=true
- renders with label text
- calls onCheckedChange(true) when unchecked clicked
- calls onCheckedChange(false) when checked clicked
- does not call onCheckedChange when disabled
- supports state prop: unchecked/checked/indeterminate
- calls onStateChange when state changes
- aria-invalid=true in error state
- disabled attribute + aria-disabled when disabled=true
- does not respond to click when disabled
- aria-checked correct for each state (true/false/mixed)
- associates label with input via htmlFor
- forwards ref to hidden input
- supports aria-label prop
- supports aria-labelledby prop
- renders with name and value props
- uncontrolled with defaultChecked
- toggles on Space key press

---

### Phase 5: Export & Integration

#### Task 5.1 - Update `index.ts`
- **Priority:** P3 | **Depends on:** 4.1 PASS
- **OUTPUT:**
  ```ts
  // Checkbox
  export type { CheckboxProps, CheckboxState, TriStateCheckboxProps } from './ui/checkbox'
  export { Checkbox, TriStateCheckbox } from './ui/checkbox'
  ```
- **VERIFY:** Build khong loi, types exported correctly

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SVG path morph khong smooth (khac so diem) | Cao | Cao | Luon dung 3-point paths cho ca check va dash |
| `animate={{ d }}` khong hoat dong voi Framer | Trung binh | Cao | Fallback sang opacity crossfade neu can |
| Container fill + border khong sync | Trung binh | Trung binh | Animate ca 2 trong cung `animate={{}}` object |
| `aria-checked="mixed"` khong announce dung | Thap | Cao | Test manual voi screen reader |
| prefers-reduced-motion conflict voi Framer | Thap | Trung binh | `useReducedMotion()` + conditional transition |

---

## Dependencies (khong them package moi)

- `motion/react` - `LazyMotion`, `domMax`, `m`, `useReducedMotion`, `AnimatePresence`
- `class-variance-authority` - CVA
- `./ripple` - `Ripple`, `useRippleState` (optional, cho ripple on click)
- `./shared/constants` - `SPRING_TRANSITION`, `SPRING_TRANSITION_FAST`
- `../lib/utils` - `cn`

---

## Phase X: Final Verification Checklist

```
[ ] pnpm --filter @md3-expressive/react test -> PASS (0 failures)
[ ] pnpm --filter @md3-expressive/react build -> PASS (0 TS errors)
[ ] pnpm biome check checkbox.tsx -> no errors
[ ] TypeScript strict: no `any` types, full inference

A11Y:
[ ] aria-checked="false" khi unchecked
[ ] aria-checked="true" khi checked
[ ] aria-checked="mixed" khi indeterminate
[ ] sr-only input la form control thuc su
[ ] visual div co aria-hidden="true"
[ ] forwardRef tro dung den <input>
[ ] label association via htmlFor

Animations:
[ ] Checkmark draw pathLength 0->1 (200ms, [0.2,0,0,1])
[ ] Dash morph smooth giua 3 states
[ ] Container fill/drain (150ms/100ms)
[ ] State layer hover/focus/press dung opacity
[ ] prefers-reduced-motion -> instant, no animation

Exports:
[ ] Checkbox exported tu index.ts
[ ] TriStateCheckbox exported tu index.ts
[ ] Types exported (CheckboxProps, CheckboxState, TriStateCheckboxProps)
[ ] Khong breaking changes component hien tai
```

---

*Ke hoach tao boi `@project-planner` - 01/04/2026*
