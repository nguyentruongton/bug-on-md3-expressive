# PLAN: Drawer Responsive Layout Fix

## 📋 Mô tả vấn đề

Khi NavigationDrawer được mở trên desktop (≥ lg), nó sử dụng `position: static` nhưng không tham gia đúng vào flex layout của LayoutWrapper. Main content bị cắt hoặc overflow.

Trang có 4 vùng cần hiển thị đồng thời:
- Navigation Rail (w-22, shrink-0)
- Navigation Drawer (w-65)
- Main Content (flex-1)
- TOC Sidebar (w-56, xl+ only)

### Root Cause

Trong navigation-drawer.tsx line 70:
animate={{ width: "auto", ... }} → flex layout không biết trước width → main không co lại đúng.

LayoutWrapper có overflow-hidden → content bị clip khi layout không đúng.

---

## 🎯 Mục tiêu

| Breakpoint | Hành vi |
|---|---|
| < lg (mobile) | Drawer là overlay fixed, backdrop che màn hình |
| ≥ lg (desktop) | Drawer inline flex row, main co lại đúng, không overflow |
| xl+ | Rail + Drawer + Main + TOC đều hiển thị đầy đủ |

---

## 🛠️ Thay đổi đề xuất

### Phase 1: navigation-drawer.tsx — Tách width khỏi animation

Approach: Dùng wrapper div static với lg:w-65 shrink-0 chiếm space trong flex row.
Inner motion.nav chỉ animate opacity + x (không animate width).

Tách 2 render path:
- Desktop (lg+): Wrapper div giữ space, nav animate opacity+x
- Mobile (<lg): Fixed overlay, animate width từ 0 như cũ

### Phase 2: layout-wrapper.tsx — Thêm min-w-0 vào main

Thêm min-w-0 vào element main để cho phép flex item co lại nhỏ hơn content size của nó → main không overflow khi drawer chiếm thêm space.

### Phase 3: Kiểm tra TocDesktopSidebar

TocDesktopSidebar đã có shrink-0 → OK, không cần thay đổi.

---

## 📐 Layout Model mục tiêu (xl+)

LayoutWrapper: flex-row, gap-6, p-6, overflow-hidden
├── NavigationRail: w-22, shrink-0
├── NavigationDrawer wrapper (div): w-65, shrink-0 [lg+]
│   └── motion.nav: animate opacity+x (KHÔNG animate width)
├── main: flex-1, min-w-0, overflow-hidden
│   └── ScrollArea: scrollable
└── TocDesktopSidebar: w-56, shrink-0 (xl+ only)

Width tại lg (1024px):
1024 - 24(pad) - 88(rail) - 24(gap) - 260(drawer) - 24(gap) = ~604px cho main → OK

---

## ✅ Verification

| Scenario | Expected |
|---|---|
| Mở drawer ở lg (1024px) | Main co lại, không bị cắt |
| Mở drawer + TOC ở xl+ | 4 vùng đầy đủ, không overflow |
| Toggle drawer | Animation mượt, layout reflow đúng |
| Mobile (<lg) | Drawer overlay, backdrop OK |
| Resize mobile→desktop | Behavior chuyển đổi đúng |

---

## Open Questions

Q1 — Animation: Giữ slide+fade hay chỉ fade ở desktop?
Q2 — Auto-close: Tự động đóng drawer khi resize xuống mobile?

---

## Files thay đổi

| File | Loại |
|---|---|
| apps/docs/components/layout/navigation-drawer.tsx | MODIFY |
| apps/docs/components/layout/layout-wrapper.tsx | MODIFY |
