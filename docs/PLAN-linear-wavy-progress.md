# Overview
Refactor, sửa lỗi hiển thị của Linear Progress Indicator dạng wavy (gợn sóng) trong `packages/react/src/ui/progress-indicator.tsx`. Nâng cấp phương thức vẽ SVG (chuyển đường cong từ thuật toán Quadratic `Q` sang Cubic Bezier `C`) nhằm đảm bảo biên độ (amplitude) và bước sóng (wavelength) render đẹp, mượt mà và chính xác theo chuẩn Material Design 3 Expressive, tương tự như cách đã triển khai cho Circular progress wavy. Code phải tuân thủ nghiêm ngặt các tiêu chuẩn về Accessibility (a11y).

# Project Type
WEB

# Success Criteria
- Hàm `generateWavyPath` sử dụng biểu diễn Cubic Bezier (`C`) thay vì Quadratic (`Q`) tạo ra đường sóng sin (sine wave) chân thực.
- Kích thước render đáp ứng dựa trên các biến `amplitude` (biên độ) và `wavelength` (bước sóng) tuỳ chỉnh.
- SVG viewBox / chiều cao tổng thể không bóp nghẹt hay giới hạn nét chấm đầu (strokeLinecap="round").
- Animation tại state `indeterminate` có tính cuộn liên tục (xTranslate shift qua viewbox) theo spec MD3. Tính lượn sóng mượt ở mọi resolution.
- Responsive không bóp méo hình dạng (chỉ thay đổi container width).
- Hỗ trợ chuẩn RTL, thuộc tính trợ năng đầy đủ.

# Tech Stack
- React
- Motion (Framer Motion) dùng để animate thuộc tính `pathLength`, `pathOffset` hoặc translate.
- SVG / TypeScript

# File Structure
- `packages/react/src/ui/progress-indicator.tsx`

# Task Breakdown

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| 1 | ✅ Refactor `generateWavyLinearPath` | `frontend-specialist` | `frontend-design`, `clean-code` | P0 | None | **INPUT**: Hàm cũ. **OUTPUT**: Thuật toán Android Kotlin port (controlOffset=0.3642), path centered tại y=0. **VERIFY**: TS pass ✅ |
| 2 | ✅ Determinate: clipPath rect | `frontend-specialist` | `frontend-design` | P1 | 1 | **INPUT**: `pathLength` animation. **OUTPUT**: `<m.rect>` trong `<clipPath>` animated bằng pixel. **VERIFY**: TS pass ✅ |
| 3 | ✅ Indeterminate: fix scroll + speed prop | `frontend-specialist` | `frontend-design` | P1 | 2 | **INPUT**: `x: [-wavelength, 0]`. **OUTPUT**: `x: [0, -wavelength]`, `duration: speed`. **VERIFY**: TS pass ✅ |
| 4 | Visual + A11y Audit | `test-engineer` | `webapp-testing` | P2 | 3 | Manual browser check, accessibility_checker.py |

## ✅ PHASE X
- [x] TypeScript: `npx tsc --noEmit` (packages/react) — ✅ Pass
- [x] Biome lint (packages/react) — ✅ 0 errors  
- [ ] Manual visual verify in browser
- [ ] A11y: `accessibility_checker.py`
