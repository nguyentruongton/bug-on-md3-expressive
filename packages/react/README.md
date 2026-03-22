# @bug-on/md3-react

> ⚠️ **Work in progress** — Material Design 3 Expressive React Component Library

Thư viện UI React với đầy đủ animation, accessible (a11y), hỗ trợ Next.js App Router.

## Installation

```bash
npm install @bug-on/md3-react
# hoặc
pnpm add @bug-on/md3-react
```

## Peer Dependencies

```bash
npm install react react-dom
# Optional (cho animated components):
npm install motion
```

## Setup với TailwindCSS v4

```css
/* globals.css */
@import "@bug-on/md3-tailwind";
```

## Usage

```tsx
import { Button, useRipple } from '@bug-on/md3-react';

export default function Page() {
  return (
    <Button colorStyle="filled" size="md">
      Get Started
    </Button>
  );
}
```

## Components

| Component    | Description                                |
|--------------|--------------------------------------------|
| `Button`     | MD3 Expressive button, 5 variants, 5 sizes |
| `ButtonGroup`| Group toggle buttons                       |
| `Card`       | MD3 Card container                         |
| `CodeBlock`  | Syntax-highlighted code block              |

## Hooks

| Hook             | Description                                 |
|------------------|---------------------------------------------|
| `useRipple`      | MD3 Ripple effect (thuần DOM, no-lib)       |
| `useMediaQuery`  | SSR-safe responsive media query hook        |

## Accessibility

Tất cả components tuân thủ **WAI-ARIA** guidelines:
- Đầy đủ `aria-*` attributes
- Focus visible rõ ràng
- Keyboard navigation

## License

MIT
