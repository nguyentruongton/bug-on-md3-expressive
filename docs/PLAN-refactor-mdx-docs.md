# Kế Hoạch Đổi Trục Cấu Trúc Docs Sang MDX Remote Kiểu Shadcn

## MỤC TIÊU (TASK BREAKDOWN)

Chuyển đổi trang tài liệu (docs) từ hardcode JSX sang kiến trúc `next-mdx-remote` (Server Components) theo 3 phần chính (Option B). 
Giao diện bám sát chuẩn Material Web với bố cục 3 cột (Nav trái, Nội dung giữa, TOC phải chứa Usage, API, Accessibility).

### Giai Đoạn 1: Thiết Lập System & Thư Viện Parsing
- Cài đặt thư viện: `pnpm add next-mdx-remote gray-matter`. Yêu cầu `rehype-slug` để lấy `id` cho thẻ Heading (phục vụ TOC bắt dính). Trong project có sử dụng ScrollArea nên cũng cần kiểm tra xem có ảnh hưởng không?
- Cài đặt `<MDXContent />` Server Component ở `apps/docs/components/mdx/` để ánh xạ các thẻ cơ bản (h1, h2, table, code...) sang UI Component chuẩn của thư viện.
- Thiết lập typography cho prose trong `tailwind.config.ts`.

### Giai Đoạn 2: Xây Dựng Component Registry & Tự Động Bóc Tách Code
- Tạo thư mục `apps/docs/registry/` chứa các Component Demo độc lập. (Ví dụ: `registry/demos/fab-default.tsx`).
- Code `apps/docs/components/mdx/component-preview.tsx`:
  - Fetch mã nguồn trực tiếp (raw text) từ ổ đĩa bằng `fs.readFileSync(registry/...)`.
  - Tải động (Dynamic Import) hoặc `React.lazy` file Demo đó để render React Node.
  - Sử dụng giao diện tab "Preview | Code".

### Giai Đoạn 3: Setup Dynamic Route & Layout MDX
- Tạo Route Động (Catch-All): `apps/docs/app/components/[slug]/page.tsx`.
- Component `page.tsx` sẽ có quyền đọc file `.mdx` từ: `apps/docs/content/components/{slug}.mdx` sử dụng thư viện `gray-matter` (chặn metadata metadata cho SEO / title / description).
- Bố cục UI: `LayoutWrapper` hiện có cần chừa không gian biên phải cho component `<TableOfContents>` bám cuộn. Bên trái Sidebar vẫn giữ nguyên. Nội dung render ở giữa.
- Thử nghiệm trên bài viết `fab.mdx`. Gỡ bỏ phần map "FAB" trong cách cũ, di dời file sang `/content/components/fab.mdx`.

### Giai Đoạn 4: Trình Bày Chuẩn Content Material Web
- Định hình file MDX tiêu chuẩn với các phần bắt buộc:
  - Header (Tự sinh từ Frontmatter `title`)
  - Đoạn text giới thiệu 1-2 câu.
  - Thẻ `<ComponentPreview name="fab-default" />` (Demo)
  - `## Usage` (Code import, config cơ bản)
  - `## Accessibility` (Ghi chú về Keyboard, ARIA attributes)
  - `## API Reference` (Bảng Markdown Liệt kê Props)

---

## KIỂM DUYỆT (VERIFICATION CHECKLIST)
- [ ] Build NextJS 15 thành công không lỗi type MDX.
- [ ] Component `<ComponentPreview>` bóc tách code thành string chuẩn xác và render nút thật ở dạng tương tác 100%.
- [ ] Tính năng bôi bôi màu `rehype-pretty-code` / `shiki` hoặc `<CodeBlock>` hiển thị đúng style.
- [ ] `<TableOfContents>` (có sẵn) bên cột tay phải ăn khớp với ID của H2/H3 sinh ra từ `rehype-slug` (ví dụ: `#usage`, `#api-reference`). Scroll đến đâu, highlight mượt đến nấy.
- [ ] Migrate component FAB (và sau đó là Dialog, Button, v.v...) sang MDX thành công.

---

> 🔴 CẢNH BÁO KIẾN TRÚC:
> **Không được dùng `<CodeBlock>` tĩnh trong các file page.tsx cho nội dung nữa.** Từ giờ tất cả mọi giải pháp tài liệu sẽ đi qua ống dẫn MDX. Các component hỗ trợ (MDXComponents wrapper) cần được chia riêng biệt để dễ bảo trì CSS.
