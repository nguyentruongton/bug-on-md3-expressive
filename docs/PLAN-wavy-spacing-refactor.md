# PLAN: Wavy Circular — Track/Active Indicator Radii Separation

## Mục tiêu

Hiện tại, track background và active indicator đang dùng **cùng radius** (same circle).  
Theo MD3 Expressive, chúng phải ở **hai radii khác nhau**, cách nhau `space = 4dp`.

---

## Phân tích MD3 Spec (từ hình)

### Tokens
| Token | Value |
|---|---|
| `circular.with-wave.size` | 48dp |
| `active-indicator.thickness` | 4dp |
| `track.thickness` | 4dp |
| `track-active-indicator-space` | **4dp** ← khoảng cách giữa 2 circles |
| `wave.amplitude` | 1.6dp |
| `wave.wavelength` | 15dp |

### Geometry (size=48, trackHeight=4, space=4)

```
Outer boundary (48dp) = radius 24 from center
                                            ←  24
Active indicator outer edge               ←  24  (fits within 48dp)
Active indicator center radius            ←  22  = 24 - trackHeight/2
Active indicator inner edge               ←  20  = 22 - 2

[SPACE 4dp]

Track outer edge                          ←  16  = 20 - 4 (space)
Track center radius                       ←  14  = 16 - 2
Track inner edge                          ←  12  = 14 - 2

Formula:
  activeRadius = (size - trackHeight) / 2         = (48 - 4) / 2 = 22
  trackRadius  = activeRadius - space - trackHeight = 22 - 4 - 4 = 14
```

### Kết quả mong đợi
- Track (flat circle): radius nhỏ hơn (inner) → màu nhạt
- Active indicator (wavy arc): radius lớn hơn (outer) → màu chủ

---

## Proposed Changes

### `packages/react/src/ui/progress-indicator.tsx`

#### 1. Thêm prop `space` vào `CircularProgressProps`
```ts
space?: number; // gap between track and active indicator, default 4
```

#### 2. Cập nhật radius calculation trong `CircularProgress`
```ts
// Trước (cùng radius):
const radius = (size - trackHeight) / 2;

// Sau (hai radii riêng biệt):
const activeRadius = (size - trackHeight) / 2;
const trackRadius  = activeRadius - space - trackHeight;
```

#### 3. Cập nhật SVG rendering

**Determinate wavy:**
- Track `<path>` dùng `generateWavyCircularPath(center, trackRadius, ...)`
- Active indicator `<m.path>` dùng `generateWavyCircularPath(center, activeRadius, ...)`

**Indeterminate wavy:**
- Track `<circle>` dùng `r={trackRadius}`
- Active indicator `<m.path>` trong spinner SVG dùng `activeRadius`

**Flat (mọi trường hợp):**
- Track `<circle>` dùng `r={activeRadius}` (giữ nguyên hành vi hiện tại)
- Active indicator dùng `r={activeRadius}` (không đổi)

> Với flat, không áp dụng spacing vì không có spec yêu cầu — nên flat giữ nguyên hành vi hiện tại.

#### 4. `viewBox` sizing adjustment
SVG cần đủ lớn để hiển thị cả hai circles. Do active indicator vẫn fit trong `size` (radius 22 + trackHeight/2 = 24 = size/2), không cần thay đổi `viewBox`.

#### 5. Cập nhật `generateWavyCircularPath` call sites
Truyền đúng `activeRadius` hoặc `trackRadius` vào hàm tùy theo element.

---

## Props mới

```ts
interface CircularProgressProps {
  // ...existing props...
  /**
   * Gap between track circle and active indicator circle (px).
   * MD3 spec: 4dp. Only used when shape="wavy".
   * @default 4
   */
  space?: number;
}
```

---

## Verification Plan

### Automated Tests
```bash
cd packages/react && npm run test
# File: src/test/progress-indicator.test.tsx
# Expects: 59 tests pass
```

### Build Check
```bash
cd packages/react && npm run build
# Expects: ESM + CJS build success, no TypeScript errors
```

### Manual Visual Check
Sau khi build, mở `http://localhost:3000/components/progress-indicator`:
1. **Circular Wavy Indeterminate**: track (nhạt) phải ở radius nhỏ hơn so với arc wavy xoay
2. **Circular Wavy Determinate 70%**: track wavy ở trong, active indicator wavy ở ngoài — rõ khoảng cách giữa 2
3. **Circular Wavy Thick (8dp)**: tương tự với trackHeight=8, space default vẫn 4

---

## Files bị ảnh hưởng

| File | Thay đổi |
|------|----------|
| `packages/react/src/ui/progress-indicator.tsx` | Thêm prop `space`, tách 2 radii, cập nhật render |
| `packages/react/src/test/progress-indicator.test.tsx` | Thêm test case cho spacing |
| `apps/docs/.../progress-indicator/page.tsx` | Không cần đổi (dùng default) |

---

## Phase X — Complete Checklist
- [ ] Thêm prop `space` với default 4
- [ ] Tính `trackRadius` và `activeRadius` riêng biệt  
- [ ] Cập nhật determininate wavy render
- [ ] Cập nhật indeterminate wavy render (track dùng trackRadius)
- [ ] Build + tests pass
- [ ] Visual check trên browser
