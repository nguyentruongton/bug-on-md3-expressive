# MD3 Expressive Indicators - Specs Audit & Improvement Plan

Dựa trên việc khảo sát 8 tài liệu PDF về Material Design 3 Expressive cho `Loading Indicator` và `Progress Indicator`:

## 1. Kết quả Audit (Khảo sát Specs)

### Loading Indicator
- ✅ **Variants**: Code hỗ trợ `uncontained` và `contained` đúng như spec.
- ✅ **Animation**: Morphing 7 shape chuẩn xác.
- ✅ **Size**: Hỗ trợ override `size` linh hoạt 24dp-240dp. (Default container 38px hoàn toàn khớp với spec "shape container is 38dp").
- ✅ **A11y**: Đã có `role="progressbar"` và ép buộc `aria-label`.

### Progress Indicator
- ✅ **Variants & State**: Linear/Circular và Determinate/Indeterminate đều được hỗ trợ.
- ✅ **Shapes**: Flat và Wavy cho thẻ Linear được hỗ trợ với thuộc tính `amplitude` và `wavelength` khớp với định nghĩa của Spec.
- ✅ **Track Thickness**: MD3 Expressive yêu cầu "Configurable" -> Code hỗ trợ `trackHeight` prop (default 4dp).
- ✅ **Stop Indicator**: "Required if the track has a contrast below 3:1". Code có hỗ trợ thuộc tính `showStopIndicator={'auto'}` thông minh giúp bật/tắt stop indicator.
- ✅ **RTL**: RTL tự động flip qua CSS/JS.
- 🔴 **Vấn đề cần tinh chỉnh (Minor Improvement)**:
  - **Spec Guidelines (Active Indicator)**: *"When progress first begins, the active indicator appears as a dot." (Tại giá trị phần trăm thấp, thanh progress nên hiển thị như một chấm tròn).*
  - **Hiện trạng**: Với thẻ Linear Flat, nếu `value={0}`, `width` sẽ bằng `0%`, kết quả là active indicator biến mất hoàn toàn.
  - **Giải pháp**: Đặt `minWidth: trackHeight` (vd 4px) cho thẻ `active indicator` ở chế độ Determinate Linear Flat, đi kèm `borderRadius: 9999px`. Điều này sẽ hiển thị một chấm tròn (dot) ngay cả khi giá trị là `0%` hoặc giá trị cực nhỏ.

## 2. Các File Thay Đổi Đề Xuất

### `packages/react/src/ui/progress-indicator.tsx`
- **[MODIFY]**: Sửa luồng tính toán `width` của phần tử Linear Determinate Active Indicator. Thêm `minWidth` động dựa trên `trackHeight` prop.

```tsx
// Trước đây:
style={{ width: \`\${Math.max(0, Math.min(100, value))}%\` }}

// Đề xuất sửa thành:
style={{ 
  width: \`\${Math.max(0, Math.min(100, value))}%\`, 
  minWidth: \`\${trackHeight}px\` // <- Đảm bảo luôn hiện như 1 dấu chấm
}}
```

## 3. Kế Hoạch Test Cơ Bản
- Render `ProgressIndicator` với `value={0}` ở chế độ Linear Flat và đảm bảo quan sát thấy một dấu chấm 4x4 dp màu active ở lề trái (hoặc lề phải nếu đang ở context RTL).
