# Plan: Migrate sang Monorepo Token-first Architecture

> MD3 Expressive UI Library — pnpm + Turborepo + 3 Packages

---

## Tổng quan

Chuyển Next.js app hiện tại sang monorepo với **token-first architecture**: tokens là source of truth, Tailwind chỉ là adapter, React components là consumer.

### Triết lý thiết kế

```
CSS Variables (tokens)  ←  Source of truth, không framework
      ↑
Tailwind v4 Plugin      ←  Ánh xạ utilities → CSS vars (adapter)
      ↑
React Components        ←  Source TSX (dùng Tailwind utilities)
      ↑
Next.js / Vite App      ←  Consumer (đọc source, scan Tailwind classes)
```

**Resilience**: Khi Tailwind v5 ra → chỉ `md3-tailwind` cần update. Tokens và components không đổi.

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **`code-block.tsx` import nội bộ** — `CodeBlock` đang import `Card` từ `@/components/ui/card`. Trong monorepo, đây là internal import trong cùng package (OK). Giữ cả 5 components trong cùng package `@bug-on/md3-react`.

> [!IMPORTANT]
> **Source package, không compile**: `@bug-on/md3-react` publish **TypeScript source** (không build dist/). Consumer phải thêm `transpilePackages` vào `next.config.ts` (Next.js) hoặc config Vite resolve. Đây là **trade-off có chủ ý** để Tailwind scan được class names.

> [!CAUTION]
> **Breaking change duy nhất trong code**: Các file trong `components/ui/*.tsx` có `import { cn } from "@/lib/utils"` và `import { Card } from "@/components/ui/card"` sẽ được đổi sang relative imports. Không thay đổi bất kỳ logic nào.

---

## Cấu trúc thư mục sau migrate

```
bug-on-md3-expressive/              ← git root
├── apps/
│   └── docs/                       ← Next.js 15 (toàn bộ app hiện tại)
│       ├── app/                    ← giữ nguyên
│       ├── components/             ← chỉ layout + standalone
│       │   ├── layout/
│       │   ├── ComponentCard.tsx
│       │   ├── Sidebar.tsx
│       │   └── theme-provider.tsx
│       ├── hooks/
│       ├── lib/
│       ├── next.config.ts          ← thêm transpilePackages
│       ├── tsconfig.json
│       ├── postcss.config.mjs
│       └── package.json
│
├── packages/
│   ├── tokens/                     ← @bug-on/md3-tokens
│   │   ├── src/
│   │   │   ├── colors.css          ← CSS vars: --md-sys-color-*
│   │   │   ├── elevation.css       ← utility classes: elevation-0..5
│   │   │   ├── shape.css           ← CSS vars: --md-sys-shape-*
│   │   │   ├── typography.css      ← CSS vars: --md-sys-typescale-*
│   │   │   ├── motion.ts           ← JS: duration, easing, spring specs
│   │   │   └── index.ts            ← re-export motion tokens
│   │   ├── dist/
│   │   │   └── index.css           ← merged CSS (build output)
│   │   ├── package.json
│   │   └── tsup.config.ts
│   │
│   ├── tailwind/                   ← @bug-on/md3-tailwind
│   │   ├── src/
│   │   │   └── index.ts            ← Tailwind v4 plugin
│   │   ├── package.json
│   │   └── tsup.config.ts
│   │
│   └── react/                      ← @bug-on/md3-react
│       ├── src/
│       │   ├── ui/
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── button-group.tsx
│       │   │   ├── code-block.tsx
│       │   │   └── toc.tsx
│       │   ├── lib/
│       │   │   └── utils.ts        ← copy từ lib/utils.ts
│       │   └── index.ts            ← barrel export
│       └── package.json
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                    ← root scripts
├── .gitignore                      ← update
└── README.md                       ← update
```

---

## Nội dung từng file mới / thay đổi

### Root files

#### [NEW] `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### [REPLACE] `package.json` (root)

```json
{
  "name": "bug-on-md3-expressive",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "typescript": "5.9.3"
  },
  "packageManager": "pnpm@10.0.0"
}
```

#### [NEW] `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

### `packages/tokens/` — `@bug-on/md3-tokens`

Package **zero-framework dependency** — chỉ CSS variables và JavaScript objects.

#### [NEW] `packages/tokens/package.json`

```json
{
  "name": "@bug-on/md3-tokens",
  "version": "0.1.0",
  "description": "Material Design 3 Expressive design tokens",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./colors.css": "./src/colors.css",
    "./elevation.css": "./src/elevation.css",
    "./shape.css": "./src/shape.css",
    "./typography.css": "./src/typography.css",
    "./index.css": "./dist/index.css"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "5.9.3"
  }
}
```

#### [NEW] `packages/tokens/src/colors.css`

```css
/* MD3 System Color Tokens — Light Theme */
:root {
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005D;
  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #E8DEF8;
  --md-sys-color-on-secondary-container: #1D192B;
  --md-sys-color-tertiary: #7D5260;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #FFD8E4;
  --md-sys-color-on-tertiary-container: #31111D;
  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #F9DEDC;
  --md-sys-color-on-error-container: #410E0B;
  --md-sys-color-surface: #FEF7FF;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-surface-variant: #E7E0EB;
  --md-sys-color-on-surface-variant: #49454F;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-surface-container-low: #F7F2FA;
  --md-sys-color-surface-container: #F3EDF7;
  --md-sys-color-surface-container-high: #ECE6F0;
  --md-sys-color-surface-container-highest: #E6E0E9;
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;
}

/* Dark Theme overrides */
[data-theme="dark"],
.dark {
  --md-sys-color-primary: #D0BCFF;
  --md-sys-color-on-primary: #381E72;
  --md-sys-color-primary-container: #4F378B;
  --md-sys-color-on-primary-container: #EADDFF;
  --md-sys-color-secondary: #CCC2DC;
  --md-sys-color-on-secondary: #332D41;
  --md-sys-color-tertiary: #EFB8C8;
  --md-sys-color-on-tertiary: #492532;
  --md-sys-color-error: #F2B8B5;
  --md-sys-color-on-error: #601410;
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #E6E1E5;
  --md-sys-color-surface-variant: #49454F;
  --md-sys-color-on-surface-variant: #CAC4D0;
  --md-sys-color-surface-container-lowest: #0F0D13;
  --md-sys-color-surface-container-low: #1D1B20;
  --md-sys-color-surface-container: #211F26;
  --md-sys-color-surface-container-high: #2B2930;
  --md-sys-color-surface-container-highest: #36343B;
  --md-sys-color-outline: #938F99;
  --md-sys-color-outline-variant: #49454F;
}
```

#### [NEW] `packages/tokens/src/shape.css`

```css
:root {
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 9999px;
}
```

#### [NEW] `packages/tokens/src/motion.ts`

```ts
/**
 * MD3 Expressive Motion Tokens
 * Framework-agnostic JS objects. Compatible với motion/react (framer-motion).
 * @see https://m3.material.io/styles/motion/overview
 */

/** Duration in milliseconds */
export const duration = {
  short1: 50,   short2: 100,  short3: 150,  short4: 200,
  medium1: 250, medium2: 300, medium3: 350, medium4: 400,
  long1: 450,   long2: 500,   long3: 550,   long4: 600,
  extraLong1: 700, extraLong2: 800, extraLong3: 900, extraLong4: 1000,
} as const;

/** Cubic bezier easing curves */
export const easing = {
  standard:               [0.2, 0, 0, 1]    as [number, number, number, number],
  standardAccelerate:     [0.3, 0, 1, 1]    as [number, number, number, number],
  standardDecelerate:     [0, 0, 0, 1]      as [number, number, number, number],
  emphasized:             [0.2, 0, 0, 1]    as [number, number, number, number],
  emphasizedAccelerate:   [0.3, 0, 0.8, 0.15] as [number, number, number, number],
  emphasizedDecelerate:   [0.05, 0.7, 0.1, 1.0] as [number, number, number, number],
} as const;

/** Spring presets for motion/react */
export const spring = {
  /** Default interactive elements */
  default: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 },
  /** Small interactions: ripple, badge */
  snappy:  { type: "spring" as const, stiffness: 600, damping: 25 },
  /** Layout shifts: cards, dialogs */
  gentle:  { type: "spring" as const, stiffness: 300, damping: 20 },
  /** Hero / expressive transitions */
  bouncy:  { type: "spring" as const, stiffness: 400, damping: 15 },
} as const;

export const motionTokens = { duration, easing, spring };
```

#### [NEW] `packages/tokens/src/index.ts`

```ts
export { motionTokens, duration, easing, spring } from './motion';
```

#### [NEW] `packages/tokens/tsup.config.ts`

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
});
```

> **`index.css`**: Tạo bằng script Node.js riêng hoặc dùng `vite-plugin-css-injected-by-js`. Đơn giản nhất: consumer import từng CSS file riêng (`./colors.css`, `./shape.css`).

---

### `packages/tailwind/` — `@bug-on/md3-tailwind`

Tailwind v4 plugin ánh xạ `m3-*` Tailwind utilities → MD3 CSS vars.

#### [NEW] `packages/tailwind/package.json`

```json
{
  "name": "@bug-on/md3-tailwind",
  "version": "0.1.0",
  "description": "Tailwind CSS v4 plugin for Material Design 3 Expressive",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  },
  "peerDependencies": {
    "tailwindcss": ">=4.0.0"
  },
  "devDependencies": {
    "tailwindcss": "4.1.11",
    "tsup": "^8.0.0",
    "typescript": "5.9.3"
  }
}
```

#### [NEW] `packages/tailwind/tsup.config.ts`

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['tailwindcss'],
});
```

#### [NEW] `packages/tailwind/src/index.ts`

```ts
/**
 * @bug-on/md3-tailwind — Tailwind CSS v4 Plugin
 *
 * Maps MD3 token utilities → CSS custom properties.
 * Consumer must import @bug-on/md3-tokens CSS files before this plugin.
 *
 * Usage in globals.css:
 *   @import "@bug-on/md3-tokens/colors.css";
 *   @import "@bug-on/md3-tokens/shape.css";
 *   @import "tailwindcss";
 *   @plugin "@bug-on/md3-tailwind";
 */
import plugin from 'tailwindcss/plugin';

export default plugin(function ({ addBase, addUtilities }) {
  // Bridge: Tailwind @theme vars → MD3 CSS vars
  addBase({
    ':root': {
      '--color-m3-primary':                     'var(--md-sys-color-primary)',
      '--color-m3-on-primary':                  'var(--md-sys-color-on-primary)',
      '--color-m3-primary-container':           'var(--md-sys-color-primary-container)',
      '--color-m3-on-primary-container':        'var(--md-sys-color-on-primary-container)',
      '--color-m3-secondary':                   'var(--md-sys-color-secondary)',
      '--color-m3-on-secondary':                'var(--md-sys-color-on-secondary)',
      '--color-m3-secondary-container':         'var(--md-sys-color-secondary-container)',
      '--color-m3-on-secondary-container':      'var(--md-sys-color-on-secondary-container)',
      '--color-m3-tertiary':                    'var(--md-sys-color-tertiary)',
      '--color-m3-on-tertiary':                 'var(--md-sys-color-on-tertiary)',
      '--color-m3-tertiary-container':          'var(--md-sys-color-tertiary-container)',
      '--color-m3-on-tertiary-container':       'var(--md-sys-color-on-tertiary-container)',
      '--color-m3-error':                       'var(--md-sys-color-error)',
      '--color-m3-on-error':                    'var(--md-sys-color-on-error)',
      '--color-m3-surface':                     'var(--md-sys-color-surface)',
      '--color-m3-on-surface':                  'var(--md-sys-color-on-surface)',
      '--color-m3-surface-variant':             'var(--md-sys-color-surface-variant)',
      '--color-m3-on-surface-variant':          'var(--md-sys-color-on-surface-variant)',
      '--color-m3-surface-container-low':       'var(--md-sys-color-surface-container-low)',
      '--color-m3-surface-container':           'var(--md-sys-color-surface-container)',
      '--color-m3-surface-container-high':      'var(--md-sys-color-surface-container-high)',
      '--color-m3-surface-container-highest':   'var(--md-sys-color-surface-container-highest)',
      '--color-m3-outline':                     'var(--md-sys-color-outline)',
      '--color-m3-outline-variant':             'var(--md-sys-color-outline-variant)',
      // Shape
      '--radius-m3-none': 'var(--md-sys-shape-corner-none, 0px)',
      '--radius-m3-xs':   'var(--md-sys-shape-corner-extra-small, 4px)',
      '--radius-m3-sm':   'var(--md-sys-shape-corner-small, 8px)',
      '--radius-m3-md':   'var(--md-sys-shape-corner-medium, 12px)',
      '--radius-m3-lg':   'var(--md-sys-shape-corner-large, 16px)',
      '--radius-m3-xl':   'var(--md-sys-shape-corner-extra-large, 28px)',
      '--radius-m3-full': 'var(--md-sys-shape-corner-full, 9999px)',
    },
  });

  // MD3 Elevation utilities
  addUtilities({
    '.elevation-0': { boxShadow: 'none' },
    '.elevation-1': { boxShadow: '0px 1px 2px 0px rgba(0,0,0,.3), 0px 1px 3px 1px rgba(0,0,0,.15)' },
    '.elevation-2': { boxShadow: '0px 1px 2px 0px rgba(0,0,0,.3), 0px 2px 6px 2px rgba(0,0,0,.15)' },
    '.elevation-3': { boxShadow: '0px 1px 3px 0px rgba(0,0,0,.3), 0px 4px 8px 3px rgba(0,0,0,.15)' },
    '.elevation-4': { boxShadow: '0px 2px 3px 0px rgba(0,0,0,.3), 0px 6px 10px 4px rgba(0,0,0,.15)' },
    '.elevation-5': { boxShadow: '0px 4px 4px 0px rgba(0,0,0,.3), 0px 8px 12px 6px rgba(0,0,0,.15)' },
  });
});
```

> [!IMPORTANT]
> **Tailwind v4 `@plugin` API**: Load plugin qua `@plugin "@bug-on/md3-tailwind"` trong CSS thay vì `plugins: []` trong `tailwind.config.js`. Nếu Tailwind v5 thay đổi plugin API, chỉ file này cần update.

---

### `packages/react/` — `@bug-on/md3-react`

Source-only package — không `dist/`. Consumer transpile bằng Next.js / Vite.

#### [NEW] `packages/react/package.json`

```json
{
  "name": "@bug-on/md3-react",
  "version": "0.1.0",
  "description": "Material Design 3 Expressive React components",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    }
  },
  "files": ["src"],
  "scripts": {
    "lint": "tsc --noEmit",
    "clean": "echo 'source-only, nothing to clean'"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "motion": ">=11.0.0"
  },
  "dependencies": {
    "@bug-on/md3-tokens": "workspace:*",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "lucide-react": "^0.553.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "5.9.3"
  }
}
```

#### [NEW] `packages/react/src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### [COPY + MODIFY] `packages/react/src/ui/*.tsx`

Thay đổi duy nhất — chỉ đổi import path, không đổi logic:

| File | Thay đổi |
|------|----------|
| `button.tsx` | `'@/lib/utils'` → `'../lib/utils'` |
| `card.tsx` | `'@/lib/utils'` → `'../lib/utils'` |
| `button-group.tsx` | `'@/lib/utils'` → `'../lib/utils'` |
| `toc.tsx` | `'@/lib/utils'` → `'../lib/utils'` |
| `code-block.tsx` | `'@/lib/utils'` → `'../lib/utils'`; `'@/components/ui/card'` → `'./card'` |

#### [NEW] `packages/react/src/index.ts`

```ts
// Components
export { Button } from './ui/button';
export type { ButtonProps } from './ui/button';

export { Card } from './ui/card';
export type { CardProps } from './ui/card';

export { ButtonGroup } from './ui/button-group';
export type { ButtonGroupProps } from './ui/button-group';

export { CodeBlock } from './ui/code-block';
export { TableOfContents } from './ui/toc';

// Utilities
export { cn } from './lib/utils';
```

#### [NEW] `packages/react/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

### `apps/docs/` — Next.js Docs Site

#### [MODIFY] `apps/docs/next.config.ts`

```diff
const nextConfig: NextConfig = {
+  transpilePackages: ['@bug-on/md3-react'],
   reactStrictMode: true,
   // ... existing config
};
```

#### [REPLACE] `apps/docs/app/globals.css`

```css
/* 1. MD3 Design Tokens (CSS custom properties) */
@import "@bug-on/md3-tokens/colors.css";
@import "@bug-on/md3-tokens/shape.css";

/* 2. Tailwind CSS */
@import "tailwindcss";

/* 3. MD3 Tailwind Plugin (maps utilities → tokens) */
@plugin "@bug-on/md3-tailwind";

/* 4. Scan @bug-on/md3-react source for Tailwind classes */
@source "../../packages/react/src";

/* Base styles */
body {
  background-color: var(--color-m3-surface);
  color: var(--color-m3-on-surface);
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--color-m3-outline-variant);
  border-radius: var(--radius-m3-full);
}
::-webkit-scrollbar-thumb:hover { background: var(--color-m3-outline); }
```

#### [NEW] `apps/docs/package.json`

```json
{
  "name": "docs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "clean": "next clean"
  },
  "dependencies": {
    "@bug-on/md3-react": "workspace:*",
    "@bug-on/md3-tokens": "workspace:*",
    "@bug-on/md3-tailwind": "workspace:*",
    "@google/genai": "^1.17.0",
    "@hookform/resolvers": "^5.2.1",
    "@material/material-color-utilities": "^0.4.0",
    "autoprefixer": "^10.4.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.553.0",
    "motion": "^12.23.24",
    "next": "^15.4.9",
    "postcss": "^8.5.6",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.11",
    "@tailwindcss/typography": "^0.5.19",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "9.39.1",
    "eslint-config-next": "16.0.8",
    "tailwindcss": "4.1.11",
    "tw-animate-css": "^1.4.0",
    "typescript": "5.9.3"
  }
}
```

#### Import thay thế trong `apps/docs`

```
# Cũ                              # Mới
@/components/ui/button          → @bug-on/md3-react
@/components/ui/card            → @bug-on/md3-react
@/components/ui/button-group    → @bug-on/md3-react
@/components/ui/code-block      → @bug-on/md3-react
@/components/ui/toc             → @bug-on/md3-react
```

---

## Migration Commands — Step by Step

### Bước 0: Tạo git branch

```bash
git checkout -b feat/monorepo-migration
```

### Bước 1: Tạo cấu trúc thư mục

```bash
mkdir -p apps/docs \
  packages/tokens/src \
  packages/tailwind/src \
  packages/react/src/{ui,lib}
```

### Bước 2: Copy UI components (TRƯỚC KHI move)

```bash
cp components/ui/button.tsx       packages/react/src/ui/
cp components/ui/card.tsx         packages/react/src/ui/
cp components/ui/button-group.tsx packages/react/src/ui/
cp components/ui/code-block.tsx   packages/react/src/ui/
cp components/ui/toc.tsx          packages/react/src/ui/
cp lib/utils.ts                   packages/react/src/lib/utils.ts
```

### Bước 3: Move Next.js app → apps/docs

```bash
mv app hooks lib apps/docs/
mkdir -p apps/docs/components
mv components/layout                apps/docs/components/
mv components/ComponentCard.tsx     apps/docs/components/
mv components/Sidebar.tsx           apps/docs/components/
mv components/theme-provider.tsx    apps/docs/components/
mv next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs \
   next-env.d.ts .env.example       apps/docs/
rm -rf components/ui  # đã copy sang packages/react
```

### Bước 4: Fix imports trong packages/react

```bash
# Fix @/lib/utils → ../lib/utils
find packages/react/src/ui -name "*.tsx" \
  -exec sed -i '' "s|from '@/lib/utils'|from '../lib/utils'|g" {} \;

# Fix code-block.tsx: @/components/ui/card → ./card
sed -i '' "s|from '@/components/ui/card'|from './card'|g" \
  packages/react/src/ui/code-block.tsx
```

### Bước 5: Tạo tất cả file config mới

Tạo thủ công theo nội dung trên:
- `pnpm-workspace.yaml`
- `package.json` (root — replace)
- `turbo.json`
- `packages/tokens/package.json` + `tsup.config.ts` + `src/colors.css` + `src/shape.css` + `src/motion.ts` + `src/index.ts`
- `packages/tailwind/package.json` + `tsup.config.ts` + `src/index.ts`
- `packages/react/package.json` + `tsconfig.json` + `src/index.ts`
- `apps/docs/package.json` (replace)

### Bước 6: Update apps/docs config

```bash
# Modify next.config.ts: thêm transpilePackages
# Replace globals.css theo nội dung mới ở trên

# Fix imports @/components/ui/* → @bug-on/md3-react
grep -rl "@/components/ui" apps/docs/ --include="*.tsx" --include="*.ts"
# Xem danh sách file cần sửa, thay thế thủ công hoặc:
find apps/docs -name "*.tsx" -o -name "*.ts" | \
  xargs grep -l "@/components/ui" | \
  xargs sed -i '' "s|from '@/components/ui/[a-z-]*'|from '@bug-on/md3-react'|g"
```

> [!CAUTION]
> Sau khi chạy sed, **kiểm tra từng file** vì named imports sẽ được merge vào một import statement từ `@bug-on/md3-react`. Nếu file import nhiều components từ khác nhau, cần gộp thủ công:
> ```ts
> // Trước
> import { Button } from '@/components/ui/button';
> import { Card } from '@/components/ui/card';
> // Sau
> import { Button, Card } from '@bug-on/md3-react';
> ```

### Bước 7: Install & chạy

```bash
rm -f package-lock.json
rm -rf node_modules apps/docs/node_modules
pnpm install
pnpm --filter @bug-on/md3-tokens build
pnpm --filter @bug-on/md3-tailwind build
pnpm --filter @bug-on/md3-react lint
pnpm --filter docs dev
```

---

## Verification Plan

### Automated

```bash
# 1. Tokens build
pnpm --filter @bug-on/md3-tokens build
# Expected: packages/tokens/dist/ có index.js, index.mjs, index.d.ts

# 2. Tailwind plugin build
pnpm --filter @bug-on/md3-tailwind build
# Expected: packages/tailwind/dist/ có index.js

# 3. React package TypeScript check
pnpm --filter @bug-on/md3-react lint
# Expected: 0 errors

# 4. Full Turborepo build
pnpm turbo build
# Expected: tất cả tasks exit 0
```

### Manual — Visual

```bash
pnpm turbo dev
# Mở http://localhost:3000
```

Checklist:
- [ ] Trang chủ load, không console error
- [ ] `/components/buttons` — Button variants đúng màu MD3 (primary = #6750A4)
- [ ] Click Button → ripple animation chạy
- [ ] Hover Card → lift animation (`y: -4`) chạy
- [ ] Dark mode (class `.dark` on `<html>`): colors đổi sang dark palette

---

## Rủi ro

| Rủi ro | Mức | Giải pháp |
|--------|-----|-----------|
| `@source` không scan được packages/react | Medium | Verify với `pnpm --filter docs build` + check generated CSS |
| Tailwind v4 `@plugin` API thay đổi | Low | Fallback: import CSS vars trực tiếp, không dùng plugin |
| `sed` thay thế sai imports | Medium | Kiểm tra thủ công 100% after sed |
| pnpm version conflict | Low | Khai báo `packageManager` ở root |
| `motion` version conflict (11 vs 12) | Low | `">=11.0.0"` cho peerDeps là đủ |

---

## Consumer Setup (public README)

### Next.js

```bash
npm install @bug-on/md3-tokens @bug-on/md3-tailwind @bug-on/md3-react motion
```

```ts
// next.config.ts
transpilePackages: ['@bug-on/md3-react']
```

```css
/* globals.css */
@import "@bug-on/md3-tokens/colors.css";
@import "@bug-on/md3-tokens/shape.css";
@import "tailwindcss";
@plugin "@bug-on/md3-tailwind";
@source "../../node_modules/@bug-on/md3-react/src";
```

```tsx
import { Button, Card } from '@bug-on/md3-react';
```

### Vite + React

```ts
// vite.config.ts
import path from 'path';

export default {
  resolve: {
    alias: {
      '@bug-on/md3-react': path.resolve('./node_modules/@bug-on/md3-react/src'),
    },
  },
}
```

```css
/* main.css */
@import "@bug-on/md3-tokens/colors.css";
@import "@bug-on/md3-tokens/shape.css";
@import "tailwindcss";
@plugin "@bug-on/md3-tailwind";
```
