# PLAN: Tabs MD3 Audit & Alignment

**Slug:** `tabs-md3-audit`
**Project Type:** WEB — React component library
**Agent:** `frontend-specialist` + skill `frontend-design`

---

## 📋 Overview

Kiểm tra và cải thiện component Tabs hiện tại (`packages/react/src/ui/tabs/`) để đảm bảo tuân thủ chính xác đặc tả MD3 dựa trên:

1. **Google Reference** — `docs/m3/tabs/google/internal/` (Lit Web Component)
2. **MD3 Spec** — [m3.material.io/components/tabs](https://m3.material.io/components/tabs/overview)
3. **Material Web Docs** — [github.com/material-components/material-web/tabs](https://github.com/material-components/material-web/blob/main/docs/components/tabs.md)

---

## 🎯 Success Criteria

- [ ] ARIA đúng: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`
- [ ] Keyboard navigation: `ArrowLeft/Right`, `Home`, `End`, `Enter/Space` — đúng WAI-ARIA Tabs pattern
- [ ] Disabled tabs: Không nhận focus qua keyboard, không thể select
- [ ] Indicator animation khớp reference: Primary = content width, Secondary = full-width
- [ ] Design tokens đúng: Height 48dp / 64dp, indicator 3dp, padding scrollable 52px
- [ ] Focus ring shape: 8px border-radius (không phải `rounded-full`)
- [ ] RTL (Right-to-Left) support: ArrowLeft/Right hoán đổi khi `dir="rtl"`
- [ ] `auto-activate` mode: Focus = Select (khi bật)

---

## 🔍 Gap Analysis — Google Reference vs. Current Implementation

### 🔴 Critical Issues

| # | Vấn đề | Google Reference | Current Impl | File |
|---|--------|-----------------|--------------|------|
| 1 | **Disabled tabs vẫn nhận keyboard focus** | Google bỏ qua disabled tabs trong navigation | Keyboard nav vẫn có thể focus tabs disabled | `tab.tsx:100-141` |
| 2 | **Thiếu `autoActivate` mode** | `autoActivate` prop: focus = select ngay | Không có prop này | `tabs.tsx` |
| 3 | **`aria-disabled` dùng thay vì skip trong navigation** | Disabled tabs bị skip hoàn toàn trong ArrowKey loop | disabled attr nhưng keyboard vẫn move focus đến chúng | `tab.tsx:182` |
| 4 | **Missing `inline-icon` variant** | Primary tab có `inline-icon` attribute: icon nằm ngang label | Không có variant này | `tab.tsx` |

### 🟡 Medium Issues

| # | Vấn đề | Google Reference | Current Impl | File |
|---|--------|-----------------|--------------|------|
| 5 | **Focus ring shape sai** | Focus ring shape = 8px | `rounded-none` không có shape 8px | `tab.tsx:197-199` |
| 6 | **RTL không được xử lý** | Google detect RTL rồi đảo chiều Arrow keys | Không có RTL handling | `tab.tsx:100-141` |
| 7 | **`scrollToTab` không có** | Google auto-scroll active tab vào viewport | Không có auto-scroll | `tabs-list.tsx` |
| 8 | **Indicator z-index** | Active tab có `z-index: 1` để indicator hiển thị đè lên inactive tab | Thiếu z-index management | `tab.tsx` |
| 9 | **`focusout` handler** | Google restore focus về activeTab khi blur khỏi tablist | Thiếu `focusout` handler | `tabs.tsx` |

### 🟢 Minor Issues

| # | Vấn đề | Google Reference | Current Impl | File |
|---|--------|-----------------|--------------|------|
| 10 | **Indicator `border-radius`** | `var(--_active-indicator-shape)` = 3dp spec token | `rounded-full` (hardcoded pill) | `tab.tsx:262` |
| 11 | **`defaultValue` fallback** | Nếu không có `defaultValue`, Google auto-select tab đầu tiên | `defaultValue = ""` có thể match sai | `tabs.tsx:39` |

---

## 📁 Files Affected

```
packages/react/src/ui/tabs/
├── tabs.tsx          [MODIFY] — Thêm auto-activate, focusout handler
├── tabs-list.tsx     [MODIFY] — Thêm scrollToTab logic  
├── tab.tsx           [MODIFY] — Fix disabled nav, RTL, focus ring, inline-icon, z-index
├── tabs.tokens.ts    [MODIFY] — Thêm indicator border-radius token
├── tabs.types.ts     [MODIFY] — Thêm autoActivate, inlineIcon props
└── tabs-content.tsx  [NO CHANGE] — Đã đúng
```

---

## ✅ Task Breakdown

### Phase 1 — Critical Fixes (Blocking)

#### TASK-01: Fix keyboard navigation — Skip disabled tabs

**Priority:** P0 — Critical | **Agent:** `frontend-specialist`

**INPUT:** `tab.tsx` handleKeyDown — không skip disabled tabs
**OUTPUT:** 
- `handleKeyDown` skip tabs có `disabled=true` khi ArrowLeft/Right
- Context expose thêm `disabledValues: Set<string>` để tabs biết peer nào disabled
- Helper `getNextEnabledTab(direction)` wrap-around skip disabled

**VERIFY:**
- [ ] ArrowRight trên tab trước disabled → focus nhảy qua, đến tab tiếp theo enabled
- [ ] Tab disabled không thể select bằng Enter/Space

---

#### TASK-02: Thêm `autoActivate` mode

**Priority:** P0 | **Agent:** `frontend-specialist`

**INPUT:** `tabs.tsx`, `tabs.types.ts`
**OUTPUT:**
- Thêm prop `autoActivate?: boolean` vào `TabsProps` và `TabsContextValue`
- Khi `autoActivate=true`, focus di chuyển = select ngay

**VERIFY:**
- [ ] `<Tabs autoActivate>` — ArrowRight tự động select tab tiếp theo
- [ ] Default (`autoActivate=false`) — ArrowRight chỉ focus, không select

---

#### TASK-03: Fix `focusout` — Restore focus về activeTab

**Priority:** P0 | **Agent:** `frontend-specialist`

**INPUT:** `tabs-list.tsx`
**OUTPUT:**
- `onBlur` handler trên tablist: nếu focus rời khỏi tablist (`!contains(relatedTarget)`) → reset `focusedValue` về `value` (activeTab)

**VERIFY:**
- [ ] ArrowRight focus sang tab 3, click ra ngoài, Tab lại → focus về active tab

---

### Phase 2 — Medium Fixes

#### TASK-04: Fix focus ring shape — 8px

**Priority:** P1 | **Agent:** `frontend-specialist`

**INPUT:** `tab.tsx:197-199`
**OUTPUT:** `focus-visible:rounded-[8px]` (thay `rounded-none`)

**VERIFY:**
- [ ] Focus ring có border-radius 8px (không phải 0 hoặc full)

---

#### TASK-05: Thêm RTL support

**Priority:** P1 | **Agent:** `frontend-specialist`

**INPUT:** `tab.tsx` handleKeyDown, `tabs-list.tsx`
**OUTPUT:**
- Detect `dir="rtl"` từ computed style của tablist
- Đảo chiều ArrowLeft/ArrowRight khi RTL
- Pass `isRtl` qua context

**VERIFY:**
- [ ] `dir="rtl"`: ArrowLeft đi đến tab tiếp theo (hướng cuối đến đầu)

---

#### TASK-06: Thêm `inline-icon` variant

**Priority:** P1 | **Agent:** `frontend-specialist`

**INPUT:** `tab.tsx`, `tabs.types.ts`
**OUTPUT:**
- Thêm prop `inlineIcon?: boolean` vào `TabProps`
- Khi `inlineIcon=true`: content wrapper dùng `flex-row` (icon cạnh label)
- Height vẫn 48dp (không tăng lên 64dp)

**VERIFY:**
- [ ] `<Tab icon={<Icon/>} inlineIcon>Label</Tab>` → icon và label nằm ngang
- [ ] Height = 48dp (containerHeight, không phải containerHeightWithIcon)

---

#### TASK-07: Thêm `scrollToTab` utility

**Priority:** P1 | **Agent:** `frontend-specialist`

**INPUT:** `tabs-list.tsx`
**OUTPUT:**
- Khi active tab thay đổi trong scrollable mode → `scrollIntoView({ behavior: 'smooth', inline: 'nearest' })`
- Triggered sau click và sau keyboard navigation

**VERIFY:**
- [ ] Scrollable tabs: ArrowRight nhiều lần → active tab luôn visible

---

### Phase 3 — Minor Polish

#### TASK-08: Fix `defaultValue` fallback

**Priority:** P2 | **Agent:** `frontend-specialist`

**INPUT:** `tabs.tsx:39`
**OUTPUT:** Nếu `defaultValue=""` và không match bất kỳ tab nào → auto-select tab đầu tiên khi tabs được registered

**VERIFY:**
- [ ] `<Tabs>` không có `defaultValue` → tab đầu tiên được active

---

#### TASK-09: Update indicator border-radius token

**Priority:** P2 | **Agent:** `frontend-specialist`

**INPUT:** `tabs.tokens.ts`, `tab.tsx`
**OUTPUT:**
```typescript
// tabs.tokens.ts
indicatorBorderRadius: 3, // 3dp per MD3 spec (not full pill)
```
Update `tab.tsx` dùng `style={{ borderRadius: TabsTokens.indicatorBorderRadius }}` thay vì `rounded-full`

**VERIFY:**
- [ ] Indicator có border-radius 3px, không phải pill

---

#### TASK-10: Thêm `z-index: 1` cho active tab

**Priority:** P2 | **Agent:** `frontend-specialist`

**INPUT:** `tab.tsx`
**OUTPUT:** `style={{ zIndex: isActive ? 1 : 0 }}`

**VERIFY:**
- [ ] Indicator animation khi slide không bị clip bởi inactive tab bên cạnh

---

## 🔗 Dependency Graph

```
TASK-01 (skip disabled) ──┐
TASK-02 (auto-activate) ──┼──→ TASK-03 (focusout restore)
                          
TASK-09 (tokens) ──→ TASK-10 (z-index)
TASK-05 (RTL) ──→ TASK-07 (scrollToTab)

TASK-04 (focus ring) ← independent
TASK-06 (inline-icon) ← independent
TASK-08 (defaultValue) ← independent
```

**Serial:** TASK-01 trước TASK-02, TASK-02 trước TASK-03
**Parallel:** TASK-04, TASK-06, TASK-08 có thể làm song song

---

## 🧪 Phase X: Verification Checklist

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Accessibility
python .agent/skills/frontend-design/scripts/accessibility_checker.py http://localhost:3000/components/tabs

# UX audit
python .agent/skills/frontend-design/scripts/ux_audit.py .
```

### Manual A11y Checklist

- [ ] `role="tablist"` trên container
- [ ] `role="tab"` + `aria-selected={true|false}` trên mỗi tab
- [ ] `role="tabpanel"` + `aria-labelledby` trên panel
- [ ] Chỉ 1 tab có `tabIndex=0` tại mọi thời điểm
- [ ] Disabled tab bị skip trong keyboard navigation
- [ ] Focus ring 8px visible

> [!NOTE]
> **Disabled Tab Focus Policy Decision:** Google Web Component dùng `disabled` HTML attribute nên tab không nhận browser focus tự nhiên. Trong React, ta dùng `tabIndex={isFocused ? 0 : -1}` + skip disabled trong arrow key logic. **Quyết định: skip disabled hoàn toàn**, không cho `focusedValue` đặt vào disabled tab.

> [!IMPORTANT]
> Sau khi được approve, thực hiện theo thứ tự: Phase 1 → Phase 2 → Phase 3 → Phase X.
> Không mix tasks từ nhiều phase trong cùng một commit.
