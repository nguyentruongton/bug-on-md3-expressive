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
| `Icon`       | Material Symbols variable font icon        |

## Icons

`<Icon />` renders [Material Symbols](https://fonts.google.com/icons) using a CSS variable font — zero SVG overhead, all 4 axes controllable as props.

### 1. Load the font

There are two ways to load the font depending on your use case.

#### Option A: CDN Mode (Default & easiest)

```tsx
// 1. Import CDN CSS (In your main app entry, e.g. layout.tsx / main.tsx)
import '@bug-on/md3-react/material-symbols-cdn.css';

// 2. Add Preconnect to <head> as early as possible for best performance
import { MaterialSymbolsPreconnect } from '@bug-on/md3-react';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <MaterialSymbolsPreconnect />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Option B: Self-Hosted Mode (Production / GDPR)

```tsx
// 1. Download font from: https://github.com/google/material-design-icons/tree/master/variablefont
// 2. Place it in your public/fonts/ directory
// 3. Import Self-hosted CSS
import '@bug-on/md3-react/material-symbols-self-hosted.css';

// Note: MaterialSymbolsPreconnect is NOT needed for self-hosting
```

> **Why `font-display: block`?**
> We specifically use `block` instead of `swap` for icon fonts to prevent layout shift. If `swap` is used, the browser renders the raw text (like "arrow_forward") until the font loads, which looks broken.

### 2. Basic usage

```tsx
import { Icon } from '@bug-on/md3-react';

<Icon name="home" />
<Icon name="arrow_forward" />
<Icon name="settings" variant="rounded" />
```

> **Note:** Icon names use `snake_case` ligatures — `"arrow_forward"`, not `"ArrowForward"`.

### 3. Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | *required* | Material Symbol name (snake_case) |
| `variant` | `'outlined' \| 'rounded' \| 'sharp'` | `'outlined'` | Font family variant |
| `fill` | `0 \| 1` | `0` | FILL axis — 0=outlined, 1=filled |
| `weight` | `100..700` | `400` | wght axis — stroke weight |
| `grade` | `-50 \| -25 \| 0 \| 100 \| 200` | `0` | GRAD axis — fine weight adjustment |
| `opticalSize` | `20 \| 24 \| 40 \| 48` | `24` | opsz axis + font-size |
| `size` | `number` | — | Explicit font-size override (px) |
| `animateFill` | `boolean` | `false` | Spring-animate FILL transitions |
| `className` | `string` | — | Additional Tailwind/CSS classes |

### 4. Variable font axes

```tsx
// Heavier weight — matches Bold typography
<Icon name="star" weight={700} />

// Filled, optimised for 48dp display
<Icon name="favorite" fill={1} opticalSize={48} />

// Dark background compensation (grade reduces visual weight)
<Icon name="home" grade={-25} className="text-white" />
```

### 5. Animated fill

```tsx
const [isLiked, setIsLiked] = useState(false);

<Icon
  name="favorite"
  fill={isLiked ? 1 : 0}
  animateFill
  className="text-red-500"
/>
```

When `animateFill` is true, the icon uses `motion/react` (`m.span`) to spring-animate the `font-variation-settings` transition — same critically-damped spring as button shape morphing.

### 6. As icon prop for other components

```tsx
<Button icon={<Icon name="add" />}>New item</Button>
<Button icon={<Icon name="send" fill={1} />} iconPosition="trailing">Send</Button>

<IconButton aria-label="Close" onClick={handleClose}>
  <Icon name="close" />
</IconButton>
```

### 7. Tailwind utility classes

The `@bug-on/md3-tailwind` plugin adds icon utility classes for CSS-only control:

```html
<!-- Variant -->
<span class="md-icon icon-rounded">home</span>

<!-- Fill -->
<span class="md-icon icon-fill-1">favorite</span>

<!-- Weight -->
<span class="md-icon icon-weight-300">star</span>

<!-- Grade (named aliases) -->
<span class="md-icon icon-grade-low">settings</span>   <!-- -25 -->
<span class="md-icon icon-grade-high">star</span>      <!-- 200 -->

<!-- Size (sets font-size + opsz axis together) -->
<span class="md-icon icon-size-48">home</span>
```

### 8. Production optimisation — Font subsetting

The full Material Symbols font is ~295 KB. For production, subset to only the icons you use:

```css
/* In your CSS, replace the CDN import with a subsetted URL */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_forward,close,home,settings&display=block');
```

Each icon adds ~1.7 KB. See [Google Fonts subsetting docs](https://developers.google.com/fonts/docs/material_symbols#use_the_icon_font_from_google_fonts).

### 9. Self-hosting

For offline/production use, see the self-hosting guide inside `material-symbols-self-hosted.css` (comments include `@font-face` declarations for all three variants).

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
