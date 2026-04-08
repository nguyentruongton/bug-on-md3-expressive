# Fix Divider Wavy — Bo Tròn Leading & Trailing Ends

## Mô tả vấn đề

Shape `wavy` của `Divider` hiện tại render đầu **vuông** ở cả hai đầu (leading/trailing).
Nguyên nhân cốt lõi là **2 vấn đề kỹ thuật độc lập**:

| # | Vấn đề | Vị trí | Hệ quả |
|---|--------|--------|--------|
| 1 | `strokeLinecap="square"` | `divider.tsx` line 300 | Đầu path không bo tròn |
| 2 | SVG dùng `<pattern>` + tiled repeat | `divider.tsx` lines 283–302 | Wave bị cắt ngẫu nhiên ở leading/trailing |

### So sánh với `progress-indicator/linear-wavy.tsx`

```
Progress Indicator (ĐÚNG):
  strokeLinecap="round"                     ✅ Bo tròn
  Path tính từ capWidth → width-capWidth    ✅ Leading/trailing nằm trong container
  Sử dụng direct <path> ref                 ✅ Không tiled

Divider (SAI):
  strokeLinecap="square"                    ❌ Đầu vuông
  Sử dụng <pattern> tiled repeat            ❌ Cắt ngẫu nhiên ở 2 đầu
```

---

## Proposed Changes

### Thay đổi 1 — Thêm `useContainerWidth` hook nội bộ

```tsx
function useContainerWidth(): [React.RefCallback<HTMLDivElement>, number] {
  const [width, setWidth] = React.useState(0);
  const ref = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    ro.observe(node);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}
```

### Thay đổi 2 — Cập nhật `buildWavePath` signature

```ts
// Trước:
buildWavePath(width, amplitude, wavelength, yCenter)
// Sau:
buildWavePath(startX, endX, amplitude, wavelength, yCenter)
```

### Thay đổi 3 — Đổi render wavy block

| Trước | Sau |
|-------|-----|
| `<pattern>` tiled + `<rect fill="url(#...)">` | `<path d={buildWavePath(capWidth, width-capWidth, ...)}` |
| `strokeLinecap="square"` | `strokeLinecap="round"` |
| Static (không container-aware) | Dynamic với `useContainerWidth()` |

---

## Verification

```bash
pnpm --filter @bug-on-md3/react test -- --testPathPattern=divider
```

Visual: `http://localhost:3000/components/divider` → Shapes → Wavy → cả 2 đầu bo tròn.
