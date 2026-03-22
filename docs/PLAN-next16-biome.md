# PLAN-next16-biome: Upgrade Next.js & Integrate Biome

Nâng cấp dự án lên Next.js 16, kích hoạt Turbo Pack và thay thế hoàn toàn ESLint/Prettier bằng Biome cho toàn bộ monorepo.

## User Review Required

> [!IMPORTANT]
> - **Next.js 16 Breaking Changes**: Một số API như `headers()`, `cookies()`, `params` trong App Router có thể yêu cầu `await`. Một số cấu hình trong `next.config.js` như `experimental.dynamicIO` thay bằng `cacheComponents`.
> - **Biome Migration**: Việc xóa bỏ hoàn toàn ESLint/Prettier có thể gây ra sai khác nhỏ trong cách format code và các rule linting.
> - **Turbo Pack**: Tôi sẽ kích hoạt `--turbo` cho script `dev`.

## Proposed Changes

### Root Configuration

#### [MODIFY] [package.json](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/package.json)
- Thêm `biome` vào `devDependencies`.
- Thêm các script: `pnpm format`, `pnpm lint`, `pnpm check`.
- Xóa bỏ các dependency liên quan đến Prettier và ESLint ở root.

#### [NEW] [biome.json](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/biome.json)
Tạo file cấu hình Biome dùng chung cho toàn dự án.

#### [DELETE] [.eslintrc.json](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/.eslintrc.json)
Xóa bỏ file cấu hình ESLint ở root.

---

### Apps & Packages

#### [MODIFY] [apps/docs/package.json](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/package.json)
- Nâng cấp `next` lên `v16.1.6`.
- Nâng cấp `react`, `react-dom`, `@types/react`, `@types/react-dom` lên bản mới nhất.
- Cập nhật script `dev` để thêm flag `--turbo`.
- Xóa `eslint`, `eslint-config-next`, và các plugin liên quan.

#### [MODIFY] [packages/*/package.json](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/*/package.json)
- Cập nhật dependency và xóa bỏ ESLint/Prettier.

#### [MODIFY] [turbo.json](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/turbo.json)
- Cập nhật pipeline để sử dụng `biome` thay cho `eslint`.

---

## Verification Plan

### Automated Tests
- Chạy `biome check .` để kiểm tra linting và formatting cho toàn bộ dự án.
- Chạy `pnpm build` để đảm bảo Next.js 16 build thành công.
- Chạy `pnpm dev` và truy cập `apps/docs` để xác nhận Turbo Pack.

### Manual Verification
- Kiểm tra lại các trang chính trong `apps/docs`.
- Kiểm tra Biome formatter hoạt động trên file thực tế.
