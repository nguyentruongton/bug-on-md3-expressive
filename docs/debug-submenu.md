## 🔍 Debug: SubMenu ẩn khi hover
### 1. Symptom
Khi di chuyển chuột từ Menu chính sang SubMenu, SubMenu bị ẩn thay vì giữ nguyên trạng thái mở.

### 2. Information Gathered
- Component: `SubMenu` (dựa trên Radix UI `DropdownMenu.Sub`).
- Lỗi này thường xảy ra khi Radix không nhận được sự kiện hover một cách chính xác do cấu trúc DOM bị thay đổi hoặc do animation làm mất focus/hover context.
- Trong quá trình cập nhật SubMenu, tôi đã bọc nội dung bằng `<AnimatePresence>`. Khi `<DropdownMenu.SubContent>` render có thuộc tính `asChild`, Radix mong đợi Element ngay bên dưới là thẻ trực tiếp mà nó có thể attach event listeners. `m.div` có thể đang cản trở hoặc Radix đóng SubMenu do pointer events.

### 3. Hypotheses
1. ❓ `<m.div>` của Framer Motion đang chặn các sự kiện pointer do Radix mount sai cách.
2. ❓ Việc dùng `forceMount` bên trong `<AnimatePresence>` kết hợp với Radix `SubContent` khiến element bị unmount không đúng lúc. Radix có prop `open` và `onOpenChange`, có thể `open` state bên trong `SubMenu` đang bị force-close do pointer leaves trigger mà không enter `SubContent` đúng cách.
3. ❓ Padding giữa trigger và content quá lớn khiến chuột rời khỏi vùng an toàn.

### 4. Investigation
Radix `DropdownMenu.Sub` tự động quản lý logic "hover vùng an toàn" giữa trigger và content. Nếu `SubContent` bị unmount quá nhanh do React state, Radix không thể giữ lại. Nhìn vào file `sub-menu.tsx`:
- Dòng 48: `const [open, setOpen] = React.useState(false);`
- Nhưng `DropdownMenu.Sub` của Radix KHÔNG CẦN phải controlled state. Bằng cách tự quản lý state `open`, tôi đã vô tình chèn lên logic tự động cực tốt của Radix (cụ thể là logic tính toán polygon để giữ submenu khi chuột đi qua phần góc).

**Testing hypothesis 2:** Tôi sẽ xóa controlled state `open` tự tạo và sử dụng uncontrolled logic của Radix, chỉ kết hợp với AnimatePresence. Khoan, nếu tôi bỏ controlled state, làm sao `AnimatePresence` biết khi nào mở/đóng? 

Hãy dùng `DropdownMenu.Sub` không có prop `open`, nhưng làm sao để animate exit?
Đây là mẫu chuẩn kết hợp Radix + AnimatePresence: không sử dụng `useState` cho `open` ở SubMenu mà tạo một custom content component dùng context hoặc forwardRef để lấy trạng thái mở, HOẶC không dùng AnimatePresence ở level SubMenu mà chỉ dùng CSS transition, HOẶC dùng DropdownMenu.Portal + forceMount và phụ thuộc vào state của Radix.

### 5. Root Cause
🎯 **Controlled state tự tạo ghi đè logic hover của Radix:** SubMenu của Radix dùng một cơ chế gọi là "safe area" polygon. Khi chuột rời khỏi trigger và đi chéo xuống submenu, Radix tính toán polygon này để không đóng submenu. Tuy nhiên, bằng việc tự set state `open` bằng `useState`, và không truyền đúng các event vào trigger/content, submenu bị đóng ngay khi chuột rời khỏi trigger, do trigger mất hover.

### 6. Fix
Bỏ controlled `open` state trong `SubMenu` và uỷ quyền quản lý trạng thái hover an toàn cho Radix UI. Sử dụng một component trung gian (`SubMenuPresence`) render *bên trong* `<DropdownMenu.SubContent asChild forceMount>`. Component này đọc prop `data-state` được truyền xuống bởi Radix để kích hoạt `<AnimatePresence>`. 

```tsx
// Before (Lỗi: Tự quản lý state, phá vỡ logic hover của Radix)
const [open, setOpen] = React.useState(false);
<DropdownMenu.Sub open={open} onOpenChange={setOpen}>
  ...
  <AnimatePresence>
    {open && <DropdownMenu.SubContent asChild forceMount><m.div/></DropdownMenu.SubContent>}
  </AnimatePresence>
</DropdownMenu.Sub>

// After (Sửa: Radix tự quản lý, đọc data-state cho Framer Motion)
<DropdownMenu.Sub>
  ...
  <DropdownMenu.SubContent asChild forceMount>
    <SubMenuPresence side={side} colorVariant={colorVariant}>
      {children}
    </SubMenuPresence>
  </DropdownMenu.SubContent>
</DropdownMenu.Sub>

// Wrapper đọc `data-state` từ Radix
const SubMenuPresence = React.forwardRef(({ "data-state": dataState, ...props }, ref) => {
  const open = dataState === "open";
  return (
    <AnimatePresence>
      {open && <m.div ref={ref} {...props} variants={...} />}
    </AnimatePresence>
  );
});
```

### 7. Prevention
🛡️ Khi làm việc với các components của Radix UI như Dropdown, Select, HoverCard, tuyệt đối không tự chèn `useState` để quản lý `open` trừ khi thực sự cần controlled mode (ví dụ: mở bằng phím tắt đặc biệt bên ngoài). Logic tính toán vùng chuột (safe polygon area) của Radix phụ thuộc hoàn toàn vào luồng sự kiện nội bộ của nó. Để kết hợp với các thư viện animation như Framer Motion, luôn sử dụng pattern `forceMount` ở Content và dùng wrapper đọc `data-state` để điều khiển `AnimatePresence`.

### 8. Root Cause 2 (Primitive Conflict)
🎯 **Radix Primitive Conflict:** Mặc dù đã sửa AnimatePresence, lỗi vẫn xảy ra. Nguyên nhân là do cấu trúc lồng nhau của các Radix Primitives. Trong `SubMenu`, `trigger` là một `<MenuItem>`. Component `MenuItem` luôn luôn được render như là một `<DropdownMenu.Item>` (hoặc Checkbox/Radio Item). Khi `SubMenu` bọc nó bằng `<DropdownMenu.SubTrigger asChild>`, cấu trúc DOM trở thành `<SubTrigger> -> <Item> -> <div>`. Radix UI không cho phép một `SubTrigger` đồng thời lại là một `Item`. `Item` xử lý sự kiện click để ĐÓNG menu, trong khi `SubTrigger` xử lý click/hover để MỞ SubMenu. Sự xung đột này khiến Radix huỷ bỏ sự kiện hover hoặc safe polygon vì nó nhận các event listeners đè lên nhau.

### 9. Fix 2
Sửa `MenuItem` để nó hỗ trợ một prop đặc biệt `isSubTrigger`. Khi cờ này bằng `true`, `MenuItem` sẽ bỏ qua `DropdownMenu.Item` và sử dụng `DropdownMenu.SubTrigger` làm primitive chính thức. Trong `SubMenu`, ta clone element `trigger` và truyền `isSubTrigger: true` vào nó.

```tsx
// Trong menu-item.tsx:
const ItemPrimitive = isSubTrigger 
    ? DropdownMenu.SubTrigger 
    : isCheckbox ? DropdownMenu.CheckboxItem ...

// Trong sub-menu.tsx:
<DropdownMenu.Sub>
    {React.isValidElement(trigger) 
        ? React.cloneElement(trigger, { isSubTrigger: true })
        : <DropdownMenu.SubTrigger asChild><div>{trigger}</div></DropdownMenu.SubTrigger>}
</DropdownMenu.Sub>
```

### 10. Prevention 2
🛡️ Luôn đảm bảo không lồng ghép các Radix Primitives có vai trò tương tự nhau hoặc xung đột nhau (như Item và SubTrigger, Trigger và Item...). Khi tạo ra một component trung gian (như `MenuItem`), cần có cơ chế (thông qua props) để chuyển đổi underlying primitive tuỳ thuộc vào context mà nó được sử dụng (ví dụ trong một SubMenu).
