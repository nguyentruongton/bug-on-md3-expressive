# @bug-on/md3-tokens

> Core Material Design 3 Expressive CSS Design Tokens.

This library provides all absolutely necessary design tokens required to enforce the Material Design 3 Expressive system in your project via raw CSS variables (Customer Properties).

---

## 📦 Installation

To install the package:

```bash
npm install @bug-on/md3-tokens
# or
pnpm add @bug-on/md3-tokens
```

---

## 🛠️ Usage

This package acts purely as a stylesheet registry and contains no JavaScript application logic or React components. 

To map the design tokens into your CSS tree, you simply need to import it into your application's global stylesheet (e.g., `globals.css`, `index.css`).

```css
/* In your core App CSS */
@import "@bug-on/md3-tokens/index.css";
```

### Granular Imports
If you only wish to utilize an isolated sector of the design tokens (to avoid framework conflicts), you may import tokens granularly:

```css
/* Only inject dynamic M3 color tokens */
@import "@bug-on/md3-tokens/colors.css";

/* Only inject shape variables */
@import "@bug-on/md3-tokens/shape.css";

/* Only inject elevation configuration */
@import "@bug-on/md3-tokens/elevation.css";

/* Only typography scaling sizes */
@import "@bug-on/md3-tokens/typography.css";
```

---

## 🎨 Token Architecture

This package exposes raw CSS Variables following Google's naming conventions:
- `--md-sys-color-primary`: Core action color
- `--md-sys-color-error`: Error signaling layer
- `--md-sys-shape-corner-extra-large`: Radius token
- `--md-sys-elevation-level3`: Dimensional shadowing logic

In most scenarios, a developer **SHOULD NEVER** manually type out these CSS variables. We strongly recommend using the **`@bug-on/md3-tailwind`** Plugin to automatically bridge these tokens into ready-to-use functional Tailwind CSS utility classes (e.g. converting it to `bg-m3-primary`).

## ⚖️ License
MIT
