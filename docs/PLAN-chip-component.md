# MD3 Expressive Chip Component

Xây dựng component `Chip` cho thư viện `@bug-on/md3-react` tuân theo Material Design 3 Expressive, với 4 variants: **assist**, **filter**, **input**, **suggestion**. Tích hợp Ripple effect, animation checkmark cho filter chip, và đảm bảo a11y đầy đủ.

---

## Phân Tích Token (từ *.kt files)

| Token Category | Assist | Filter (Unselected) | Filter (Selected) | Input (Unselected) | Input (Selected) | Suggestion |
|---|---|---|---|---|---|---|
| Container BG | transparent | transparent | `secondary-container` | transparent | `secondary-container` | transparent |
| Border | `outline-variant` | `outline-variant` | **none** | `outline-variant` | **none** | `outline-variant` |
| Label | `on-surface` | `on-surface-variant` | `on-secondary-container` | `on-surface-variant` | `on-secondary-container` | `on-surface-variant` |
| Leading Icon | `primary` | `primary` | `on-secondary-container` | `on-surface-variant` | `primary` | `primary` |
| Trailing Icon | `on-surface-variant` | - | `on-secondary-container` | `on-surface-variant` | `on-secondary-container` | - |
| Elevated BG | `surface-container-low` | `surface-container-low` | `secondary-container` | N/A | N/A | `surface-container-low` |
| Disabled (Container) | 12% `on-surface` | 12% `on-surface` | 12% `on-surface` | 12% `on-surface` | 12% `on-surface` | 12% `on-surface` |
| Disabled (Border) | 12% `on-surface` | 12% `on-surface` | - | 12% `on-surface` | - | 12% `on-surface` |
| Disabled (Text/Icon) | 38% `on-surface` | 38% `on-surface` | 38% `on-surface` | 38% `on-surface` | 38% `on-surface` | 38% `on-surface` |

### Kích thước & Padding

- **Container height**: `32px` (`h-8`)
- **Shape**: `rounded-lg` (8px = `CornerSmall`)
- **Icon size**: `18px` (`w-[18px] h-[18px]`)
- **Avatar size** (Input only): `24px` (`w-6 h-6`) + `rounded-full`
- **Padding logic** (từ Chip.kt AssistChipDefaults / FilterChipDefaults):
  - Không có icon: `px-4` (16px start+end)
  - Có leading icon/avatar: `pl-2 pr-4`
  - Có trailing icon: `pl-4 pr-2`
  - Cả hai: `pl-2 pr-2`

---

## Proposed Changes

### 1. Component: `chip.tsx`

#### [NEW] `packages/react/src/ui/chip.tsx`

**Kiến trúc:**

```
ChipProps interface
  ↓
Chip (forwardRef) 
  ↓ uses
  ├── cva chipVariants (base + variant-specific classes)
  ├── useRipple() từ ./ripple.tsx (cùng pattern với card.tsx)
  ├── Ripple component từ ./ripple.tsx 
  ├── CheckmarkIcon (internal SVG inline, animated)
  └── LazyMotion + m.button từ motion/react (nếu elevated cần shadow animation)
```

**Props Interface:**

```typescript
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';
  elevated?: boolean;      // Assist, Filter (unselected), Suggestion
  selected?: boolean;      // Filter, Input
  label: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  avatar?: React.ReactNode; // Input only; priority > leadingIcon
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Input chip remove
}
```

**Styling Strategy:**

```typescript
// cva base classes
const chipVariants = cva(
  'inline-flex items-center gap-1 h-8 rounded-lg text-label-large ' +
  'relative overflow-hidden cursor-pointer select-none ' +
  'transition-all duration-200 ease-in-out ' +
  'focus-visible:outline-none ' +
  'active:scale-[0.98] ' +
  'before:absolute before:inset-0 before:pointer-events-none ' +
  'before:transition-opacity before:duration-200 before:rounded-lg ' +
  'hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10]',
  {
    variants: {
      variant: {
        assist: 'border border-m3-outline-variant text-m3-on-surface before:bg-m3-on-surface',
        filter: 'border text-m3-on-surface-variant before:bg-m3-on-surface-variant',
        input: 'border border-m3-outline-variant text-m3-on-surface-variant before:bg-m3-on-surface-variant',
        suggestion: 'border border-m3-outline-variant text-m3-on-surface-variant before:bg-m3-on-surface-variant',
      },
      selected: {
        true: '',
        false: '',
      },
      elevated: {
        true: 'border-transparent',
        false: '',
      },
      disabled: {
        true: 'opacity-[0.38] pointer-events-none',
        false: '',
      },
    }
  }
)
```

**State/conditional classes** được tính toán bằng `cn()` runtime:
- `filter + selected`: `bg-m3-secondary-container text-m3-on-secondary-container border-transparent`
- `input + selected`: `bg-m3-secondary-container text-m3-on-secondary-container border-transparent`
- `elevated + !selected`: `bg-m3-surface-container-low shadow-m3-level1 border-transparent`
- `disabled`: override với opacity

**Filter Checkmark Animation:**

```tsx
// AnimatePresence để mount/unmount animated checkmark
<AnimatePresence initial={false}>
  {showCheckmark && (
    <m.span
      key="checkmark"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 18, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className="overflow-hidden flex items-center"
      aria-hidden="true"
    >
      <CheckIcon size={18} />
    </m.span>
  )}
</AnimatePresence>
```

Lưu ý: `showCheckmark = (variant === 'filter' && selected === true && !leadingIcon)`  
Nếu có `leadingIcon` và `selected`, thì replace leadingIcon bằng checkmark.

**Input Chip Remove Button:**

```tsx
<button
  type="button"
  onClick={onRemove}
  aria-label={`Remove ${typeof label === 'string' ? label : 'item'}`}
  tabIndex={0}
  className="..."
>
  <CloseIcon size={18} />
</button>
```

**Ripple Integration** (cùng pattern với card.tsx):

```tsx
const { ripples, onPointerDown, removeRipple } = useRipple();
// Trong JSX:
<Ripple ripples={ripples} onRippleDone={removeRipple} />
```

**Padding calc logic:**

```tsx
const hasLeading = !!avatar || !!showCheckmark || !!leadingIcon;
const hasTrailing = !!trailingIcon || !!onRemove;

const paddingClass = cn(
  !hasLeading && !hasTrailing && 'px-4',
  hasLeading && !hasTrailing && 'pl-2 pr-4',
  !hasLeading && hasTrailing && 'pl-4 pr-2',
  hasLeading && hasTrailing && 'px-2',
);
```

**Role & ARIA:**
- Filter chip: `role="checkbox"`, `aria-checked={selected}`
- Input chip: `role="button"` (container), trailing remove = tabbable `<button>`
- Assist/Suggestion: `role="button"` (default `<button>`)

**Accessibility – disabled border state** (MD3 spec: 12% opacity):

Dùng CSS variable với opacity modifier thay vì Tailwind opacity class vì cần áp dụng cho chính màu border:

```
disabled:border-m3-outline-variant/12 
disabled:bg-m3-on-surface/12  (cho selected chips)
```

---

### 2. Test: `chip.test.tsx`

#### [NEW] `packages/react/src/ui/chip.test.tsx`

Pattern tham chiếu từ `card.test.tsx`:
- Import: `@testing-library/react`, `vitest`
- Mock `motion/react` với `useReducedMotion: () => false`
- Describe groups: render, variants, states, a11y, interactions

**Test cases:**

| Group | Test |
|---|---|
| **Render** | renders với label text; renders container `<button>` |
| **Variants** | assist: có class border-m3-outline-variant; filter unselected: text-m3-on-surface-variant; filter selected: bg-m3-secondary-container; input: có trailing X button; suggestion: border-m3-outline-variant |
| **Elevated** | elevated=true: bg-m3-surface-container-low; elevated=false: không có |
| **Selected** | filter selected → checkmark visible; filter unselected → no checkmark; input selected → bg-m3-secondary-container |
| **Disabled** | pointer-events-none; opacity-[0.38]; aria-disabled="true" |
| **Ripple** | pointerDown → Ripple span xuất hiện (aria-hidden='true') |
| **onRemove** | input chip → trailing button tồn tại; click → onRemove called |
| **A11y** | filter: role=checkbox, aria-checked; input remove: aria-label="Remove <label>" |
| **Keyboard** | focus outline visible; remove button tabbable |

---

### 3. Export: `index.ts`

#### [MODIFY] `packages/react/src/index.ts`

Thêm vào cuối section components:

```typescript
export type { ChipProps } from './ui/chip';
export { Chip } from './ui/chip';
```

---

## Verification Plan

### Automated Tests

```bash
# Run toàn bộ test suite cho package react
cd packages/react && npx vitest run src/ui/chip.test.tsx

# Hoặc run tất cả tests:
cd packages/react && npx vitest run

# TypeScript type check:
cd packages/react && npx tsc --noEmit
```

### Kiểm tra lint:

```bash
cd packages/react && npx eslint src/ui/chip.tsx src/ui/chip.test.tsx
```

### Manual Verification

Sau khi implementation hoàn tất, kiểm tra trực quan tại docs app (đang chạy `pnpm dev`):

1. Tạo demo page hoặc Storybook entry để hiển thị 4 variants
2. Kiểm tra:
   - Filter chip: click → checkmark animate in (expand horizontal + fade in)
   - Input chip: trailing X button accessible bằng Tab; click X → onRemove fired
   - Elevated: box-shadow level1 hiển thị đúng
   - Disabled: opacity 38%, không click được
   - Ripple effect hiện khi click
   - Keyboard: Tab focus → visible outline; Enter/Space → onClick fired

---

## File Checklist

- [ ] `packages/react/src/ui/chip.tsx` — Component implementation
- [ ] `packages/react/src/ui/chip.test.tsx` — Test suite
- [ ] `packages/react/src/index.ts` — Export chip

---

## Ghi Chú Editor

- Dùng `Ripple` và `useRipple` từ `./ripple.tsx` (không phải `../hooks/useRipple`) — cùng pattern card.tsx
- Dùng `LazyMotion + domMax + m.*` từ `motion/react` cho animated checkmark
- SVG checkmark và close icon dùng inline SVG (không phụ thuộc icon library ngoài)
- Tất cả colors dùng CSS variable classes prefix `m3-` (vd: `text-m3-on-surface`)
- `text-label-large` typography class (từ typography system hiện có)
