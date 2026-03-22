# Kế hoạch triển khai MD3 Expressive Progress & Loading Indicators

## Phân Tích Yêu Cầu
- **Dự Án**: Triển khai `LoadingIndicator` và `ProgressIndicator` chuẩn Material Design 3 Expressive.
- **Project Type**: WEB (`frontend-specialist`).
- **Tech Stack**: React, TypeScript, Tailwind CSS v4, Framer Motion (Motion 12).
- **Quyết định thiết kế**: 
  - Bỏ qua fallback cho LoadingIndicator. 
  - ProgressIndicator kiểu wavy cho phép nhận override tuỳ chỉnh `amplitude`, `wavelength`. 
  - Hỗ trợ RTL ưu tiên tối ưu tự động dựa trên HTML context thay vì explicit prop lặp lại.

## Danh sách Task (Task Breakdown)

### Task 1: Khởi tạo Tokens & Tailwind
- **Agent**: `frontend-specialist` (`tailwind-patterns`)
- **Action**: Bổ sung variables cho indicator (`#6750A4`, container `#E8DEF8`, v.v.) vào `packages/tokens/src/colors.css`. Khai báo custom utility nếu cần thiết phục vụ animation bên `packages/tailwind/src/plugin.ts`.
- **Verify**: Sử dụng `class` mới trong ứng dụng thử để check màu render chính xác.

### Task 2: Triển khai LoadingIndicator Component
- **Agent**: `frontend-specialist` (`react-best-practices`, `frontend-design`)
- **Action**: Tạo `packages/react/src/ui/loading-indicator.tsx`. Code `SVG path morphing` qua 7 trạng thái chuẩn MD3 bằng Framer Motion. Xây cấu trúc responsive (24dp-240dp) kèm tuỳ chọn `Contained`/`Uncontained`. Gắn props `aria-label` và `role="progressbar"`.
- **Verify**: Component render morphing trơn tru, DevTools test nhận a11y role chuẩn xác.

### Task 3: Triển khai ProgressIndicator Component
- **Agent**: `frontend-specialist` (`react-best-practices`)
- **Action**: Tạo `packages/react/src/ui/progress-indicator.tsx`. Hỗ trợ Linear & Circular style. Xử lý trạng thái Indeterminate/Determinate, kiểu Wavy (mở cấu hình amplitude/wavelength), tự động RTL bằng html tag support và tự động ép bật Stop Indicator ở Track tương phản < 3:1.
- **Verify**: Chuyển đổi Flat và Wavy chạy tốt, test LTR/RTL ở root document hiển thị đúng luồng animate.

### Task 4: Unit Testing & Tài liệu
- **Agent**: `test-engineer`, `documentation-writer`
- **Action**: Viết Unit Test cho 2 components. Cập nhật ví dụ trên `apps/docs`.
- **Verify**: Test Passed, Coverage đủ phủ qua các variant Contained, Wavy và RTL.

## ✅ PHASE X: Verification Checklist
- [ ] Chạy `npm run lint && npx tsc --noEmit`.
- [ ] Security Scan: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] UX Audit: `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] A11y & Contrast: Tool tự test tỷ lệ 3:1 và check label bắt buộc.
- [ ] E2E/Unit test cho các components chạy pass 100%.
