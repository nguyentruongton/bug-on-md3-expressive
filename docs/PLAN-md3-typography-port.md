# Port MD3 Expressive Typography System (React/TypeScript)

## Mô tả

Port hệ thống Typography chuẩn Material Design 3 (MD3) Expressive từ Kotlin Jetpack Compose sang React/TypeScript, sử dụng Google Sans Flex Variable Font với trục `ROND: 100` làm mặc định. Hệ thống gồm 30 type styles (15 baseline + 15 emphasized).

**Nguồn tham chiếu (Kotlin):**
- `docs/m3/typography/Typography.kt` - Compose class chính
- `docs/m3/typography/TypographyTokens.kt` - 30 style definitions
- `docs/m3/typography/TypographyKeyTokens.kt` - enum 30 keys

---

## Proposed Changes

### Layer 0: CSS Global

#### [NEW] typography.css → `packages/react/src/ui/typography/typography.css`

Định nghĩa `@font-face` cho Google Sans Flex và CSS class áp dụng `font-variation-settings: "ROND" 100`.

```css
@font-face {
  font-family: 'Google Sans Flex';
  src: url('/fonts/GoogleSansFlex-VariableFont.woff2') format('woff2');
  font-weight: 100 1000;
  font-style: normal;
  font-display: swap;
}
.font-md3-expressive {
  font-family: 'Google Sans Flex', system-ui, sans-serif;
  font-variation-settings: "ROND" 100;
}
```

---

### Layer 1: TypeScale Tokens

#### [NEW] TypeScaleTokens.ts → `packages/react/src/ui/typography/TypeScaleTokens.ts`

Chứa **toàn bộ** giá trị gốc (Font, Weight, Size, LineHeight, Tracking) cho 15 baseline styles và 15 emphasized styles (30 styles × 5 properties = 90 token values). 

> **⚠️ Điều chỉnh so với yêu cầu ban đầu:** File `TypographyTokens.kt` gốc cho thấy Emphasized styles có đầy đủ `Font`, `Size`, `LineHeight`, `Tracking` riêng (không chỉ là `Weight`). Plan này sẽ implement đầy đủ để trung thực với nguồn Kotlin.

Các token Emphasized sẽ có cùng `Size`, `LineHeight`, `Tracking`, `Font` với baseline nhưng khác `fontWeight` (tăng lên để nhấn mạnh). Đây là cách MD3 Expressive định nghĩa "emphasized".

---

### Layer 2: Key Tokens Enum

#### [NEW] TypographyKeyTokens.ts → `packages/react/src/ui/typography/TypographyKeyTokens.ts`

TypeScript `enum` với 30 keys, tương tự Kotlin `enum class TypographyKeyTokens`.

---

### Layer 3: Typography Tokens Class

#### [NEW] TypographyTokens.ts → `packages/react/src/ui/typography/TypographyTokens.ts`

- Interface `TextStyle` (fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, fontVariationSettings)  
- `const DEFAULT_FONT_VARIATION = '"ROND" 100'` - mặc định toàn bộ styles
- Class `TypographyTokens(fontFamily?: string)` với 30 readonly properties

---

### Layer 4: Typography Context (React)

#### [NEW] Typography.tsx → `packages/react/src/ui/typography/Typography.tsx`

Port `Typography` class + `LocalTypography`/`fromToken()` từ Kotlin. Sử dụng React Context API:
- `Typography` class với 30 `TextStyle` properties + method `fromToken(key: TypographyKeyTokens)`
- `TypographyContext` (React.createContext)
- `TypographyProvider` component
- `useTypography()` hook

---

### Layer 5: Package Index

#### [NEW] index.ts → `packages/react/src/ui/typography/index.ts`

Re-export tất cả public APIs từ typography module.

#### [MODIFY] index.ts → `packages/react/src/index.ts`

Thêm exports cho typography system.

---

### Layer 6: App Integration

#### [MODIFY] globals.css → `apps/docs/app/globals.css`

Import `typography.css` (hoặc thêm `@font-face` trực tiếp nếu Next.js không hỗ trợ import từ package).

---

## Cấu trúc File Output

```
packages/react/src/ui/typography/
├── typography.css          [NEW] @font-face + .font-md3-expressive
├── TypeScaleTokens.ts      [NEW] 90 token values (30 styles × 5 props)
├── TypographyKeyTokens.ts  [NEW] enum 30 keys
├── TypographyTokens.ts     [NEW] TextStyle interface + class
├── Typography.tsx          [NEW] Context, Provider, Hook
└── index.ts                [NEW] Public API exports

packages/react/src/
└── index.ts                [MODIFY] Thêm typography exports

apps/docs/app/
└── globals.css             [MODIFY] Import font-face
```

---

## Verification Plan

### Automated Tests

```bash
# 1. TypeScript type checking (từ thư mục gốc)
pnpm --filter @bug-on/react tsc --noEmit

# 2. Lint check
pnpm --filter @bug-on/react run lint

# 3. Run existing tests (đảm bảo không regression)
pnpm --filter @bug-on/react test
```

**Unit test mới sẽ tạo:** `packages/react/src/test/typography.test.tsx`
- Test `TypographyTokens` tạo đúng 30 styles với `fontVariationSettings: '"ROND" 100'`
- Test `useTypography()` hook trả về Typography instance từ context
- Test `fromToken()` với mỗi `TypographyKeyTokens` enum value

### Manual Verification (Browser)

1. Chạy `pnpm dev` → mở `http://localhost:3000`
2. Mở DevTools > Elements, inspect bất kỳ text element nào được styled với typography
3. Kiểm tra `font-variation-settings: "ROND" 100` có trong computed styles
4. Kiểm tra `font-family: 'Google Sans Flex'` được áp dụng
5. **Yêu cầu font file:** Đặt `GoogleSansFlex-VariableFont.woff2` vào `apps/docs/public/fonts/` trước khi verify

---

## Phụ chú Technical

| Vấn đề | Giải pháp |
|--------|-----------|
| Kotlin `fontFamily ?: TypeScaleTokens.Font` | TypeScript: `fontFamily ?? TypeScaleTokens.BodyLargeFont` |
| Kotlin `staticCompositionLocalOf` | React: `createContext` với default value |
| Kotlin `@Immutable` | TypeScript: `readonly` + `Object.freeze` |
| Kotlin `copy()` | TypeScript: spread operator `{ ...style, ...overrides }` |
| Emphasized chỉ có WeightKey | Sẽ implement đầy đủ 5 props để trung thực với Kotlin nguồn |
