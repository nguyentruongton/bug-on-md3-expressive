# Plan: Card MD3 Expressive Audit & Enhancements

## Phase -1: Context & Request Analysis
- **Goal:** Kiểm tra và so sánh component `card.tsx` hiện tại với tài liệu Specs/Guidelines của MD3 Expressive. Lên kế hoạch bổ sung các điểm còn thiếu.
- **Project Type:** WEB (`frontend-specialist`)
- **Current State:** Đã có `card.tsx` với 3 variants, có hook animate elevation bằng Framer Motion, có component `Ripple`, có hỗ trợ `m.a` cho link.
- **Missing/Deficient areas (dựa trên MD3 Spec & UI Image):**
  1. **Interactive State Layer:** Thiếu lớp phủ màu (overlay) khi Hover (8%), Focus (10%), Pressed (10%). MD3 yêu cầu mọi interactive surface phải có State Layer phản hồi.
  2. **Tiêu điểm bán phím (Focus-visible):** Hiện tại animation elevation chỉ bắt sự kiện `whileHover` và `whileTap`, bỏ quên `whileFocus` (khi user dùng phím Tab). Focus ring hoặc State Layer focus cũng chưa rõ ràng.
  3. **Độ tương phản Shadow (UI/CSS):** Trong ảnh chụp UI, bóng của thẻ Elevated gần như không thể nhận thấy (quá mờ). MD3 Expressive quy định Elevation 1 (~1dp) phải tạo đủ độ tách biệt khỏi nền `m3-surface`. Cần tinh chỉnh lại `SHADOW` scale.
  4. **Outlined Variant Interaction:** Theo MD3, border thẻ Outlined (hiện là `outline-variant`) sẽ phải đổi sang màu `m3-outline` (đậm hơn) khi được Focus/Pressed. Hiện code chưa xử lý chuyển màu border.

---

## Phase 0: Socratic Gate (User Questions)
> 🛑 *Vui lòng trả lời các câu hỏi sau trước khi tôi bắt đầu code (Phase 3):*
1. **State Layer:** Bạn muốn implement State Layer (hover/focus overlay) bằng custom Framer Motion variants hay CSS classes thông thường (ví dụ group-hover, v.v.)?
2. **Shadow Values:** Việc bóng đổ trên Elevated Card trong ảnh rất mờ có phải do file config Tailwind của bạn quy định giá trị shadow nhỏ không? Ta có nên ghi đè shadow inline đậm hơn một chút cho chuẩn MD3?
3. **Link Override:** Với component `<Card href="...">`, hiện tab target có thể cần thêm các focus-visible states rõ hơn, bạn có muốn tích hợp custom focus ring chung của dự án không?

---

## Phase 1: Solutioning & Architecture (Draft)
Nếu bạn đồng ý tiến hành, tôi sẽ áp dụng các giải pháp sau:
- Mở rộng `useCardElevation` để support `whileFocus` (Framer motion có hỗ trợ focus events nhưng thường cần kết nối qua React events hoặc `whileFocus` prop).
- Thêm một thẻ `<div>` absolute inset-0 làm **State Layer**. Layer này sẽ nhận styling màu `bg-m3-on-surface` và opacity được điều khiển qua Framer Motion (hover=0.08, focus=0.10, press=0.10).
- Cập nhật logic của biến thể `outlined` để đổi màu border khi `isFocused` hoặc `isHovered`.

---

## Phase 2: Implementation Tasks
Ngay sau khi bạn duyệt, `frontend-specialist` sẽ thực hiện:
- [x] **T1:** Viết lại hook/logic để quản lý Focus và Hover state (React states hoặc Motion variants) để đồng bộ cho cả State Layer và Border color.
- [x] **T2:** Bổ sung thẻ `<div className="absolute inset-0 pointer-events-none ...">` làm State Layer vào `interactive` branch của Card.
- [x] **T3:** Gắn Focus event (`onFocus`, `onBlur`) để trigger Elevation và Layer.
- [x] **T4:** Cập nhật CSS/Tailwind cho `outlined` variant để tương tác chuyển màu viền.
- [x] **T5:** Cập nhật Unit Tests trong `card.test.tsx` (thêm test cho Hover overlay và Focus state).

---

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass (0 errors)
- Tests: ✅ Pass (23/23 card tests)
- Design Compliance: ✅ MD3 State Layer applied via `::before` pseudo element. Focus-visible trigger confirmed.
- Build: ✅ Success
- Date: 2026-03-26

---

## Phase X: Verification
- Chạy toàn bộ test file: `pnpm --filter @bug-on/md3-react test` (đảm bảo pass >115 tests).
- Chạy Type check: `pnpm --filter @bug-on/md3-react lint`.
- Chạy Dev server để kiểm tra UI (Review trực quan Shadow và Overlay).
