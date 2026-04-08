# PLAN: Snackbar Component (MD3 Expressive)

**Task slug:** `snackbar-component`
**Agent:** `@frontend-specialist`
**Phase:** Planning Only

---

## 📋 Overview

Implement một **Snackbar** component đầy đủ theo chuẩn Material Design 3 Expressive, bao gồm:

- Component `Snackbar` (UI thuần)
- `SnackbarHost` (host container quản lý queue hiển thị)
- `SnackbarProvider` + `useSnackbar` hook (Context API cho imperative API)
- `useSnackbarState` hook (low-level state hook cho `SnackbarHost`)
- Test suite hoàn chỉnh (10 test cases)
- Export đầy đủ trong `packages/react/src/index.ts`

**Không dùng** bên ngoài library (`react-hot-toast`, `sonner`, v.v.)

---

## 🧩 Architecture Decision

### Promise-based Imperative API

```
showSnackbar(visuals) → Promise<SnackbarResult>
  SnackbarResult = 'action-performed' | 'dismissed'
```

### Queue với ref-based mutex

```
type QueueItem = { visuals: SnackbarVisuals; resolve: (r: SnackbarResult) => void }
queue: React.MutableRefObject<QueueItem[]>
```

Khi `SnackbarHost` unmount giữa chừng → resolve tất cả pending items với `'dismissed'`.

### State Machine

```
idle → showing → (auto-dismiss sau duration) → idle → dequeue next
                → user clicks action → resolve 'action-performed' → idle
                → user clicks dismiss → resolve 'dismissed' → idle
```

---

## 📁 Files to Create/Modify

### 1. [NEW] `packages/react/src/ui/snackbar/index.ts`
Re-export tất cả từ `snackbar.tsx`.

### 2. [NEW] `packages/react/src/ui/snackbar/snackbar.tsx`

#### Types

```typescript
/** Duration preset hoặc custom ms */
export type SnackbarDuration = 'short' | 'long' | number;
// short = 4000ms, long = 7000ms (theo MD3 spec)

/** Kết quả trả về từ showSnackbar() */
export type SnackbarResult = 'action-performed' | 'dismissed';

/** Nội dung hiển thị */
export interface SnackbarVisuals {
  message: string;
  actionLabel?: string;
  withDismissAction?: boolean;
  actionOnNewLine?: boolean;  // true → Column layout (action bên dưới text)
  duration?: SnackbarDuration;
  className?: string;
}

/** Data nội bộ khi đang hiển thị */
export interface SnackbarData {
  visuals: SnackbarVisuals;
  id: string;
  resolve: (result: SnackbarResult) => void;
}

/** Props cho component Snackbar */
export interface SnackbarProps {
  data: SnackbarData;
  className?: string;
}

/** Props cho SnackbarHost */
export interface SnackbarHostProps {
  state: ReturnType<typeof useSnackbarState>;
  className?: string;
}
```

#### Hooks

```typescript
// Low-level hook — dùng trong SnackbarHost
export function useSnackbarState(): {
  current: SnackbarData | null;
  showSnackbar: (visuals: SnackbarVisuals) => Promise<SnackbarResult>;
}

// High-level hook — dùng trong components con của SnackbarProvider
export function useSnackbar(): {
  showSnackbar: (visuals: SnackbarVisuals) => Promise<SnackbarResult>;
}
```

#### Components

```tsx
// 1. Snackbar — pure display component
export function Snackbar({ data, className }: SnackbarProps): JSX.Element

// 2. SnackbarHost — renders AnimatePresence + Snackbar với queue management
export function SnackbarHost({ state, className }: SnackbarHostProps): JSX.Element

// 3. SnackbarProvider — Context provider cho toàn app
export function SnackbarProvider({ children }: { children: React.ReactNode }): JSX.Element
```

#### Queue Logic (ref-based mutex)

```typescript
// Trong useSnackbarState:
const queueRef = useRef<Array<{ visuals: SnackbarVisuals; resolve: (r: SnackbarResult) => void }>>([]);
const [current, setCurrent] = useState<SnackbarData | null>(null);

function showSnackbar(visuals: SnackbarVisuals): Promise<SnackbarResult> {
  return new Promise((resolve) => {
    if (current === null) {
      // Hiển thị ngay
      setCurrent({ visuals, id: crypto.randomUUID(), resolve });
    } else {
      // Enqueue
      queueRef.current.push({ visuals, resolve });
    }
  });
}

// Khi 1 snackbar dismiss → dequeue next
function handleDismiss(result: SnackbarResult) {
  current?.resolve(result);
  const next = queueRef.current.shift();
  if (next) {
    setCurrent({ visuals: next.visuals, id: crypto.randomUUID(), resolve: next.resolve });
  } else {
    setCurrent(null);
  }
}
```

#### Animation (Framer Motion — KHÔNG dùng CSS transition)

```tsx
// Snackbar enter: slide lên từ bottom + fade in
// Snackbar exit: slide xuống + fade out
const SNACKBAR_ANIM = {
  initial: { opacity: 0, y: 48, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.2, duration: 0.4 } },
  exit: { opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
};
```

#### Styles

- Background: `bg-m3-inverse-surface`
- Text: `text-m3-inverse-on-surface`
- Action button text: `text-m3-inverse-primary`
- Dismiss icon: `text-m3-inverse-on-surface`
- Shape: `rounded-[4px]` → MD3 spec dùng ExtraSmall shape (4dp)
- Position: fixed, bottom-4, left-1/2, transform, z-50
- Min width: 288dp, Max width: 568dp

#### Accessibility

```tsx
<motion.div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  ...
>
```

---

### 3. [MODIFY] `packages/react/src/index.ts`

Thêm vào cuối file (sau radiio-button exports, trước ripple):

```typescript
// Snackbar — MD3 Expressive imperative toast
export type {
  SnackbarVisuals,
  SnackbarData,
  SnackbarDuration,
  SnackbarResult,
  SnackbarProps,
  SnackbarHostProps,
} from './ui/snackbar';
export {
  Snackbar,
  SnackbarHost,
  SnackbarProvider,
  useSnackbar,
  useSnackbarState,
} from './ui/snackbar';
```

---

### 4. [NEW] `packages/react/src/ui/snackbar/snackbar.test.tsx`

#### Test Cases (10 tests — pattern theo `dialog.test.tsx`)

| # | Test | Kỹ thuật |
|---|------|----------|
| 1 | Renders message | `render` + `getByText` |
| 2 | Renders action button | `actionLabel` prop → `getByRole('button')` |
| 3 | Action click resolves `'action-performed'` | `userEvent.click` + `await promise` |
| 4 | Auto-dismiss sau duration | `vi.useFakeTimers()` + `vi.advanceTimersByTime(4000)` |
| 5 | Dismiss button click | `withDismissAction=true` → click → resolves `'dismissed'` |
| 6 | Queue behavior | Show 1 → show 2 → snackbar 2 xuất hiện sau khi 1 dismiss |
| 7 | `actionOnNewLine` layout | Assert Column flex-direction rendering |
| 8 | Accessibility | `role="status"`, `aria-live="polite"` |
| 9 | Custom className | className prop applied to container |
| 10 | SnackbarProvider + useSnackbar | Provider wraps → hook returns working `showSnackbar` |

---

## 🔗 Dependencies

| Thư viện | Đã có | Dùng cho |
|----------|-------|---------|
| `motion/react` | ✅ | AnimatePresence, motion |
| `class-variance-authority` (cva) | ✅ | variant className (nếu cần) |
| `cn()` từ `../lib/utils` | ✅ | className merging |
| `React` context, hooks | ✅ | useContext, useRef, useState |

**Không** cần install thêm dependency nào.

---

## 📌 Coding Conventions (theo codebase)

| Rule | Pattern |
|------|---------|
| Exports | Named exports, không dùng `default` |
| Types | JSDoc trên mọi exported type/component |
| Imports | `import * as React from "react"` |
| Motion | `motion/react` (KHÔNG dùng `framer-motion`) |
| Colors | `var(--md-sys-color-*)` qua Tailwind tokens (`text-m3-*`, `bg-m3-*`) |
| Format | Theo `biome.json` (tab indent, no semicolons tùy config) |

---

## ✅ Verification Plan

### Build Check
```bash
cd packages/react && pnpm build
```

### Test
```bash
cd packages/react && pnpm test snackbar
```

### Lint
```bash
pnpm biome check packages/react/src/ui/snackbar/
```

### Manual
- Preview SnackbarProvider wrapping app và gọi `useSnackbar().showSnackbar(...)` từ một button
- Kiểm tra queue: click 3 snackbar nhanh → đúng thứ tự FIFO
- Verify animation enter/exit bằng trình duyệt
- Screen reader test với VoiceOver (macOS): announce `role="status"` khi snackbar xuất hiện

---

## 🗂️ Task Breakdown

```
[ ] Phase 1: Types & Interfaces (snackbar.tsx)
    [ ] SnackbarDuration, SnackbarResult, SnackbarVisuals
    [ ] SnackbarData, SnackbarProps, SnackbarHostProps

[ ] Phase 2: useSnackbarState hook
    [ ] Queue ref (`queueRef`)
    [ ] showSnackbar() → Promise<SnackbarResult>
    [ ] handleDismiss() → dequeue logic
    [ ] Cleanup on unmount (resolve all pending as 'dismissed')

[ ] Phase 3: Snackbar component (pure UI)
    [ ] motion.div với SNACKBAR_ANIM
    [ ] role="status", aria-live="polite"
    [ ] Auto-dismiss timer (useEffect + clearTimeout)
    [ ] actionOnNewLine → flex-col layout
    [ ] Action button (text-m3-inverse-primary)
    [ ] Dismiss IconButton (withDismissAction)

[ ] Phase 4: SnackbarHost
    [ ] AnimatePresence bao ngoài
    [ ] Fixed container (bottom-4, center, z-50)

[ ] Phase 5: SnackbarProvider + useSnackbar
    [ ] React.createContext
    [ ] SnackbarProvider (wraps SnackbarHost)
    [ ] useSnackbar hook với error boundary nếu không có Provider

[ ] Phase 6: index.ts barrel export
    [ ] snackbar/index.ts
    [ ] packages/react/src/index.ts

[ ] Phase 7: Test suite (snackbar.test.tsx)
    [ ] Tests 1–5 (basic + auto-dismiss)
    [ ] Test 6 (queue)
    [ ] Tests 7–10 (layout + a11y + className + provider)

[ ] Phase 8: Verification
    [ ] pnpm build (no type errors)
    [ ] pnpm test snackbar (all 10 pass)
    [ ] pnpm biome check (no lint errors)
```

---

## ⚠️ Edge Cases & Notes

1. **Auto-dismiss timer** phải `clearTimeout` khi component unmount và khi action/dismiss được click trước khi timer hết
2. **Queue FIFO**: dùng `shift()` để lấy item đầu, `push()` để thêm vào cuối
3. **crypto.randomUUID()** — đảm bảo key unique cho AnimatePresence (nếu môi trường không hỗ trợ, fallback `Math.random().toString(36)`)
4. **SnackbarProvider unmount**: cleanup queueRef bằng `useEffect` return, resolve tất cả pending với `'dismissed'`
5. **actionOnNewLine**: khi `true` → layout `flex-col`, action button nằm dưới text; khi `false` → `flex-row`, action bên phải text

---

*Plan created by `@project-planner` agent*
*Task: snackbar-component*
*File: `docs/PLAN-snackbar-component.md`*
