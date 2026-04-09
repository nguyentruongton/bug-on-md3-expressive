# @bug-on/md3-tailwind

> Tailwind CSS v4 Plugin for Material Design 3 Expressive.

This package is a core dependency of the `@bug-on` ecosystem. It acts as a bridge between the MD3 design system and Tailwind CSS by generating standard CSS utility classes conforming strictly to the Google Material Design 3 specifications. This package is fully redesigned to natively support the **Tailwind CSS v4** engine (CSS-first configuration).

---

## 📦 Installation

To install this package independently (note: included automatically if you install `@bug-on/md3-react`):

```bash
npm install @bug-on/md3-tailwind
# or
pnpm add @bug-on/md3-tailwind
```

Required peer dependency:
```bash
npm install tailwindcss@^4.0.0
```

---

## 🛠️ Usage (Tailwind v4)

Unlike older versions requiring a massive `tailwind.config.ts`, Tailwind v4 allows you to declare plugins directly within the CSS source. Add the following to your global stylesheet (e.g., `globals.css`):

```css
/* Import Tailwind core layer */
@import "tailwindcss";

/* 1. Register the @bug-on MD3 plugin */
@plugin "@bug-on/md3-tailwind";

/* 2. Import MD3 Tokens (Required to prevent undefined variable mapping) */
@import "@bug-on/md3-tokens/index.css";
```

### Generated Utilities
By registering this plugin, your Tailwind environment gains access to the following utilities out-of-the-box:

- **M3 Colors:** Extensive utility classes mapped to MD3 token system (e.g., `m3-primary`, `m3-secondary`, `m3-surface`).
  *Examples:* `bg-m3-primary`, `text-m3-on-primary`, `border-m3-outline`.

- **Elevation (3D Shadows):** Support for 5 levels of true MD3 elevations.
  *Examples:* `shadow-m3-elevation-1`, `shadow-m3-elevation-3`.

- **Shape (Radii):** Soft borders matching component standards.
  *Examples:* `rounded-m3-extra-small`, `rounded-m3-large`.

- **Typography:** Ready CSS classes mapping to Material Heading, Body, Label variations.
  *Examples:* `text-m3-display-large`, `text-m3-body-medium`, `text-m3-label-small`.

---

## 💡 Using alongside MD3 React

This package only provides text/class-based UI utilities. To leverage complex and pre-composed components safely along with animations, refer to the installation steps documented in `@bug-on/md3-react`.

## ⚖️ License
MIT
