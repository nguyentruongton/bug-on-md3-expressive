# Kế hoạch Publish v0.1 lên NPM

## 1. Mục tiêu hiện tại (Goal Description)
Publish phiên bản `v0.1.0` của các package thuộc thư viện `bug-on/md3` lên thư viện NPM công khai thông qua CI/CD GitHub Actions.
Tổ chức (Organization) trên NPM đã được khởi tạo thành công tại `https://www.npmjs.com/settings/bug-on/packages`.

## 2. Thông tin Metadata cập nhật
Tất cả các file `package.json` của từng modules (react, tailwind, tokens) sẽ được chèn thêm các metadata:
- **Author:** Bug Ổn
- **Repository:** `https://github.com/nguyentruongton/bug-on-md3-expressive.git`
- **License:** MIT
- **Keywords:** `react`, `tailwind`, `material-design-3`, `md3`, `ui-library`, `components`, `bug-on`.

## 3. Cấu hình CI/CD (GitHub Actions)
Tạo workflow file `.github/workflows/release.yml` để sử dụng `changesets/action`.
- **Triggers:** Khi có nhánh được merge vào `main`.
- **Flow hoạt động:**
  1. Khi có thay đổi trong thư mục `.changeset`, Action sẽ tự động mở 1 Pull Request có tên "Version Packages".
  2. Khi Pull Request này được merge vào `main`, `changesets/action` sẽ tự trigger lệnh `pnpm run release` để publish các package lên NPM.
- **Yêu cầu Security:** 
  - Admin (người dùng) cần setting biến `NPM_TOKEN` trong trang cấu hình Secrets của Repository trên Github.

## 4. Các bước thực hiện (Task Breakdown)
1. Cập nhật `package.json` của 3 sub-packages.
2. Cập nhật `package.json` của root project.
3. Tạo file Github workflow `.github/workflows/release.yml`.
4. Commit và push lên nhánh nhánh mới hoặc trực tiếp `main`.

## 5. Kế hoạch kiểm tra
- Người dùng vào `Settings -> Secrets and variables -> Actions` trên Github để thêm rỗng `NPM_TOKEN` (lấy từ npmjs.com).
- Đẩy code thay đổi (có chứa `.changeset/`) lên GitHub để trigger Action.
- Mở PR tạo bởi Changeset bot và merge.
- Theo dõi workflow publish thành công.
