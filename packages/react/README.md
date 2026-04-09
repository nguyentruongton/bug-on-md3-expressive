# @bug-on/md3-react

> ⚠️ **Work in progress** — Material Design 3 Expressive React Component Library

A high-performance React UI component library built following the [Material Design 3 Expressive](https://m3.material.io/) design language. It brings smooth animations, robust accessibility (a11y), and first-class support for SSR and Next.js App Router.

To function correctly with full access to Design Tokens (colors, typography, shape, elevation) and CSS utilities, the ecosystem is built across 3 core packages:
- `@bug-on/md3-react` (Component logic & UI)
- `@bug-on/md3-tailwind` (TailwindCSS v4 plugin providing the system's utilities)
- `@bug-on/md3-tokens` (Core CSS variables & Design tokens)

---

## 📦 Installation

Install the React component package alongside its required core packages:

```bash
npm install @bug-on/md3-react @bug-on/md3-tailwind @bug-on/md3-tokens
# or
pnpm add @bug-on/md3-react @bug-on/md3-tailwind @bug-on/md3-tokens
```

Additionally, ensure you have the required **Peer Dependencies** installed in your project:
```bash
npm install react react-dom
# Optional (Required only if you intend to use animated components like Fab, Tabs, Dialog...):
npm install motion
```

---

## 🛠️ Setup & Configuration

This library relies strictly on **Tailwind CSS v4**. You must configure both the library's plugin and token system into your Tailwind and global CSS layers.

Add the following to your root CSS file (often `globals.css` or `index.css`):

```css
/* 1. Import Tailwind CSS core */
@import "tailwindcss";

/* 2. Inject the MD3 Ecosystem Plugin */
@plugin "@bug-on/md3-tailwind";

/* 3. Import Core CSS Tokens (Color, Shape, Typography, Elevation) */
@import "@bug-on/md3-tokens/index.css";

/* 4. Import specific typography classes explicitly for the React components */
@import "@bug-on/md3-react/typography.css";
```

### Setup Icons (Font Symbol)
The library provides an `<Icon />` component using the variable `Material Symbols Outlined` font. Ensure you load the font stylesheet at the root of your application:

```tsx
// app/layout.tsx or src/main.tsx
import '@bug-on/md3-react/material-symbols-cdn.css';
import { MaterialSymbolsPreconnect } from '@bug-on/md3-react';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Preconnect resources for significantly faster icon rendering */}
        <MaterialSymbolsPreconnect />
      </head>
      <body>{children}</body>
    </html>
  );
}
```
*(If you need offline support, use the self-hosted alternative by importing `@bug-on/md3-react/material-symbols-self-hosted.css`)*

---

## 🚀 Usage

Once the setup is complete, you are ready to use the components!

```tsx
import { Button, Icon } from '@bug-on/md3-react';

export default function Page() {
  return (
    <div className="p-8 bg-m3-surface min-h-screen">
      <Button colorStyle="filled" size="md" icon={<Icon name="add" />}>
        Get Started
      </Button>
    </div>
  );
}
```

---

## 🧩 Components Available

| Component    | Description                                |
|--------------|--------------------------------------------|
| `Button`     | MD3 Expressive button, 5 variants, 5 sizes |
| `IconButton` | Icon toggle buttons                        |
| `Fab`        | Floating Action Button                     |
| `Tabs`       | MD3 Tabs (Scrollable, Animating indicator) |
| `Card`       | MD3 Card container                         |
| `Dialog`     | Fully Accessible Modal/Dialog component    |
| `Menu`       | Dropdown menus                             |
| `CodeBlock`  | Syntax-highlighted code block              |
| `Icon`       | Material Symbols variable font icon        |

## ⚖️ License
MIT
