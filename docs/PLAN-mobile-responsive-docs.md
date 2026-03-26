# PLAN: Mobile Responsive Fix - Doc Pages

## Overview

Các trang documentation chưa responsive tốt trên mobile. Qua phân tích ảnh chụp và source code, xác định được các vấn đề cụ thể sau:

1. **Text/content bị cắt ngang** — card demo dùng `flex-row` + `justify-between` không wrap đúng trên mobile
2. **ButtonGroup / segmented button demo bị cắt** — container không có `overflow-x: scroll`
3. **Code block không scroll được** — `CodeBlock` component cần `overflow-x: auto`
4. **`TableOfContents` xuất hiện trên mobile** — cần ẩn trên mobile (chỉ hiện `xl:` trở lên)
5. **Padding trang không đồng đều** — `px-4 md:px-8` trên nhiều trang không nhất quán
6. **Navigation Drawer** mobile: search box bị ẩn (`hidden lg:block`), khó tìm kiếm từ mobile
7. **Live demo sliders/interactive components** bị overflow ngang

---

## Project Type: **WEB**

**Agent chính:** `frontend-specialist`

---

## Success Criteria

- [ ] Không có horizontal overflow trên bất kỳ trang nào ở viewport 375px (iPhone SE)
- [ ] Code blocks có thể scroll ngang mà không làm layout bị vỡ
- [ ] `TableOfContents` không còn xuất hiện trên mobile (< xl)
- [ ] Demo cards hiển thị đúng layout: description trên, demo dưới trên mobile
- [ ] Navigation drawer mobile có thể search
- [ ] Tất cả interactive demos vẫn hoạt động bình thường
- [ ] Lint pass: `pnpm lint` → 0 errors
- [ ] TypeScript: `pnpm tsc --noEmit` → 0 errors

---

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** — utility classes responsive
- **motion/react** (Framer Motion) — animation
- **@bug-on/md3-react** — component library riêng

---

## File Structure (Files Cần Sửa)

```
apps/docs/
├── app/
│   ├── components/
│   │   ├── buttons/page.tsx          [MODIFY] - fix card demo, TableOfContents
│   │   ├── button-groups/page.tsx    [MODIFY] - fix overflow demo container
│   │   ├── progress-indicators/page.tsx [MODIFY]
│   │   ├── loading-indicator/page.tsx   [MODIFY]
│   │   └── [slug]/page.tsx           [MODIFY - nếu có]
│   ├── styles/
│   │   └── typography/page.tsx       [MODIFY] - fix live ROND slider
│   └── get-started/page.tsx          [chỉ kiểm tra]
├── components/layout/
│   ├── layout-wrapper.tsx            [MODIFY] - kiểm tra padding
│   └── navigation-drawer.tsx         [MODIFY] - hiện search trên mobile
```

---

## Task Breakdown

### T1 — Fix `TableOfContents` visibility (P0)

**Agent:** `frontend-specialist` | **Skill:** `frontend-design`

**Vấn đề:** Component `TableOfContents` render trong `flex xl:flex-row` layout nhưng vẫn chiếm không gian trên mobile.

**Fix:**
```tsx
// Trước:
<div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12 flex flex-col xl:flex-row gap-12">
  <div className="flex-1 min-w-0"> ... </div>
  <TableOfContents items={tocItems} />  {/* vẫn hiện */}
</div>

// Sau — bọc TOC trong hidden xl:block:
  <div className="hidden xl:block">
    <TableOfContents items={tocItems} />
  </div>
```

**INPUT:** `buttons/page.tsx`, các trang khác có `<TableOfContents>`  
**OUTPUT:** TOC ẩn hoàn toàn dưới breakpoint xl  
**VERIFY:** `pnpm lint` + kiểm tra manual viewport 375px

---

### T2 — Fix Card Demo Layout (P0)

**Agent:** `frontend-specialist`

**Vấn đề:** Các card demo dùng pattern:
```tsx
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
  <div className="max-w-sm">...</div>   {/* description */}
  <div className="flex flex-wrap ...">  {/* demo buttons */}
```
→ Trên mobile, `max-w-sm` bị constrain, nhưng card cha có overflow. Cần đảm bảo toàn bộ wrap đúng.

**Fix:**
- Đảm bảo tất cả demo container (`flex flex-wrap`) cho phép wrap trên mobile
- Bỏ `min-h-75` gây chiều cao cố định không cần thiết
- Với ButtonGroup demo: thêm `overflow-x-auto` vào container của demo segments

**INPUT:** Tất cả `page.tsx` trong `app/components/`  
**OUTPUT:** Demo layout wrap đúng trên 375px  
**VERIFY:** Visual check trên mobile DevTools

---

### T3 — Fix Code Blocks Overflow (P1)

**Agent:** `frontend-specialist`

**Vấn đề:** Từ ảnh 3, code block bị cắt ngang trên mobile. Cần kiểm tra component `CodeBlock` trong `@bug-on/md3-react`.

**Action:**
1. Kiểm tra `CodeBlock` component trong `packages/react/src/`
2. Nếu không có `overflow-x: auto` → thêm wrapper `overflow-x-auto` trong doc pages
3. Pattern fix:
```tsx
<div className="overflow-x-auto rounded-xl">
  <CodeBlock code={...} />
</div>
```

**INPUT:** `packages/react/src/ui/code-block.tsx` (hoặc tương tự)  
**OUTPUT:** Code block scroll ngang ngay ngắn  
**VERIFY:** Paste code dài, kiểm tra trên mobile 375px

---

### T4 — Fix Typography/Styles Page (P1)

**Agent:** `frontend-specialist`

**Vấn đề:** Ảnh 1 cho thấy text bị cắt: "a variable font with..." bị cut off ở viewport 375px. Live slider demo ("Live ROND axis — 100") bị overflow.

**Fix:**
- Đảm bảo hero text dùng `break-words` hoặc `overflow-wrap: break-word`
- Slider card: thêm `max-w-full overflow-hidden` cho container slider
- Kiểm tra `px` padding đồng nhất

**INPUT:** `app/styles/typography/page.tsx`  
**OUTPUT:** Không còn text bị cắt  
**VERIFY:** Viewport 375px

---

### T5 — Fix Navigation Drawer Mobile Search (P2)

**Agent:** `frontend-specialist`

**Vấn đề:** Search input bị ẩn trên mobile (`hidden lg:block`). User mobile không có cách tìm component.

**Fix:**
```tsx
// Trước:
<div className="relative mb-4 px-4 shrink-0 hidden lg:block">

// Sau — hiện cả trên mobile:
<div className="relative mb-4 px-4 shrink-0">
```

Vì drawer mobile đã có backdrop và animation, search trong drawer sẽ hữu ích.

**INPUT:** `components/layout/navigation-drawer.tsx`  
**OUTPUT:** Search hiện trong cả drawer mobile và desktop  
**VERIFY:** Tapping "Components" → drawer mở → search visible

---

### T6 — Fix Layout Wrapper padding consistency (P2)

**Agent:** `frontend-specialist`

**Vấn đề:** Main content `mb-22 lg:mb-0` cho navigation rail. Cần kiểm tra không bị che khuất.

**Action:** Review và đảm bảo `mb-22` phù hợp với chiều cao nav rail (72px ≈ ~18 = 4.5rem → mb-20 thích hợp hơn). Kiểm tra trên nhiều viewport.

**INPUT:** `components/layout/layout-wrapper.tsx`  
**OUTPUT:** Content không bị bị che bởi nav rail  
**VERIFY:** Cuộn đến cuối trang trên mobile

---

## Phase X: Verification Checklist

```bash
# 1. Lint
cd /Users/stark/Documents/GitHub/bug-on-md3-expressive
pnpm lint

# 2. TypeScript
pnpm tsc --noEmit

# 3. Dev server (đã chạy)
# Kiểm tra manual: Chrome DevTools → Dimensions: 375x812 (iPhone SE)

# 4. Pages cần verify:
# - /components/buttons
# - /components/button-groups
# - /styles/typography
# - /components/progress-indicators
```

### Manual Test Steps (Mobile 375px)
1. Mở Chrome DevTools → Toggle Device: iPhone SE (375px)
2. Reload trang `/components/buttons`
3. ✅ Không có horizontal scrollbar trên page
4. ✅ Code block có thể scroll ngang
5. ✅ TableOfContents không xuất hiện
6. ✅ Demo cards show description trên + buttons dưới
7. Tap "Components" tab → drawer mở
8. ✅ Search box hiển thị
9. Mở trang `/styles/typography`
10. ✅ Không có text bị cắt, slider nằm trong bounds

---

*Plan created: 2026-03-26*  
*Agent: project-planner*
