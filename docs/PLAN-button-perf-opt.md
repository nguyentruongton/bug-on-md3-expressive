# PLAN-button-perf-opt

## Goal

Tối ưu hiệu năng render của `Button` và `ButtonGroup` mà **không phá vỡ UI hiện tại**, không thay đổi API công khai, không làm đỏ test.

---

## Phân tích vấn đề hiện tại

### `button.tsx` (433 dòng)

| Vấn đề | Vị trí | Tác động |
|--------|--------|----------|
| Không có `React.memo` | `Button` export | Re-render không cần thiết khi parent thay đổi |
| Inline objects mới mỗi lần render | `mergedStyle`, `ariaBusy`, `animate` props | Object identity thay đổi → Motion re-animate |
| `SIZE_TO_PX` lookup (chuỗi `if/else` dài) | L362–370, L379–387 | Dễ tối ưu thành lookup table, giảm bytecode |
| Handler `onClick` tạo closure inline | L284–290 | `useCallback` clean hơn |
| Handler `onKeyDown` tạo closure inline | L292–301 | `useCallback` đồng nhất |
| `labelText` tính lại mỗi lần | L236–239 | `useMemo` để tránh string manipulation thêm |

### `button-group.tsx` (260 dòng)

| Vấn đề | Vị trí | Tác động |
|--------|--------|----------|
| Không có `React.memo` | `ButtonGroup` export | Re-render khi parent thay đổi |
| `childrenArray` tính lại mỗi render | L72–74 | `useMemo` với `children` dep |
| `handlePointerLeave` / `handlePointerUp` tạo inline | L88–89 | `useCallback` |
| `dynamicStyle` object tạo mới mỗi render của mỗi child | map callback | Không cache được nhưng có thể tránh object spread thừa |
| `React.cloneElement` loop không có memoized callback | L92–253 | Cân nhắc tách item thành sub-component memo |

---

## Tasks

- [x] **T1 – `Button`: `React.memo` + tách size-to-px helper**
  - Bọc `Button` với `React.memo`
  - Extract `getSizeIconPx(size)` → trả về `number`
  - Verify: `button.test.tsx` vẫn pass, không cần thay đổi test

- [x] **T2 – `Button`: `useMemo` & `useCallback` cho handlers**
  - `labelText` → `useMemo([children])`
  - `mergedStyle` → `useMemo([size, style])`
  - `iconClass` → đã là lookup, wrap `useMemo([size])`
  - `onClickHandler` → `useCallback([loading, onClick])`
  - `onKeyDownHandler` → `useCallback([loading, onClick, onKeyDown])`
  - Verify: test không đỏ, tất cả behavior giữ nguyên

- [x] **T3 – `ButtonGroup`: `React.memo` + `useMemo` cho childrenArray**
  - Bọc `ButtonGroup` với `React.memo`
  - `childrenArray` & `count` → `useMemo([children])`
  - `handlePointerLeave` / `handlePointerUp` → `useCallback([])`
  - Verify: `button-group.test.tsx` vẫn pass

- [x] **T4 – `ButtonGroup`: Tách `ButtonGroupItem` sub-component (nếu cần)**
  - Chỉ làm nếu profiling cho thấy clone lặp gây chậm
  - Không làm nếu không cần thiết (YAGNI rule)
  - Verify: Không thay đổi API `ButtonGroup`

---

## Tech Stack

- **React.memo** – ngăn re-render khi props không thay đổi
- **useMemo / useCallback** – tránh tạo object/function mới mỗi render
- **Framer Motion** – không thay đổi, giữ nguyên animate props
- TypeScript strict – không thêm `any`

---

## Ràng buộc quan trọng

> [!IMPORTANT]
> - Không thay đổi bất kỳ API prop nào
> - Không thay đổi class CSS / animation spec
> - `React.memo` không đủ nếu props là object/function inline từ parent → chỉ tối ưu bên trong component
> - `useMemo` chỉ áp dụng cho tính toán tốn CPU hoặc object identity quan trọng

---

## Verification Plan

### Automated Tests (chạy từ `packages/react`)

```bash
# Chạy tất cả test
pnpm test

# Hoặc chạy riêng 2 file
pnpm test src/ui/button.test.tsx
pnpm test src/ui/button-group.test.tsx
```

> Test runner: **Vitest**, config trong `packages/react/vitest.config.ts`

### Manual Verification

1. Server đang chạy: `pnpm dev` (xem terminal hiện tại)
2. Mở `http://localhost:3000` trong trình duyệt
3. Điều hướng tới trang có Button demo
4. Kiểm tra:
   - Nút hiển thị đúng (filled, outlined, tonal, text, elevated)
   - Toggle button morphing shape hoạt động
   - Loading state hiển thị LoadingIndicator
   - Ripple effect khi click
   - ButtonGroup connected / standard đúng border-radius

---

## Done When

- [x] Tất cả test trong `button.test.tsx` và `button-group.test.tsx` pass
- [x] UI không thay đổi (kiểm tra manual)
- [x] TypeScript không báo lỗi mới
- [x] Không có regression về animation/morphing
