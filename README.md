# Bug Ổn - Material Design 3 Expressive UI 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

> [!IMPORTANT]
> **Vibe Coding Project**: This library is crafted through the lens of "Vibe Coding"—leveraging advanced AI orchestration to translate design intent and "vibes" into high-performance, accessible code.

A modern, high-performance UI library system based on **Material Design 3 Expressive** principles. This project focuses on motion, shape, and visual hierarchy, providing a seamless bridge between design tokens and React components. Fully compatible with **Tailwind CSS v4**.

---

## 📦 Monorepo Structure

Managed by [Turborepo](https://turbo.build/), featuring a modular architecture:

| Package | Description | Status |
| :--- | :--- | :--- |
| [`@bug-on/md3-react`](./packages/react) | Core React Components & Theme Provider | ✅ Ready (v3.0.1) |
| [`@bug-on/md3-tailwind`](./packages/tailwind) | Tailwind v3/v4 Plugin for MD3 Integration | ✅ Ready |
| [`@bug-on/md3-tokens`](./packages/tokens) | Design System Foundations (Color, Shape) | ✅ Ready |
| [`docs`](./apps/docs) | [Documentation & Showcase](https://bug-on.vercel.app) | ✨ Active |

---

## 🚀 Quick Start (Usage)

To use Bug On MD3 Expressive in your project:

### 1. Install
```bash
npm install @bug-on/md3-react motion
```

### 2. Configure Tailwind (v4)
Add the following to your main CSS file:
```css
@import "tailwindcss";
@import "@bug-on/md3-react/index.css"; /* Tokens & Base styles */
@plugin "@bug-on/md3-react/plugin";    /* MD3 Elevation & Utilities */
```

### 3. Setup Provider
```tsx
import { MD3ThemeProvider } from "@bug-on/md3-react";

export default function App({ children }) {
  return (
    <MD3ThemeProvider sourceColor="#6750A4">
      {children}
    </MD3ThemeProvider>
  );
}
```

---

## ✨ Key Features

- **Expressive Design**: Deep implementation of MD3's expressive patterns, focusing on rounded corners, dynamic motion, and bold typography.
- **Dynamic Theming**: Full support for Material Dynamic Color (Material You).
- **Tailwind Native**: Seamless integration with Tailwind CSS v4 and v3.
- **A11y First**: Every component is audited for screen readers and keyboard navigation.
- **Modern Stack**: Built with React 19, Framer Motion, and Radix UI primitives.

---

## 🛠 Development (Monorepo)

### 1. Setup
```bash
git clone https://github.com/nguyentruongton/bug-on-md3-expressive.git
pnpm install
```

### 2. Commands
| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start Docs and packages in watch mode |
| `pnpm build` | Build all packages for production |
| `pnpm changeset` | Generate a new changeset for versioning |

---

## 🤝 Contributing & Vibe Checks

We welcome contributions that align with our design "vibe". 
- Maintain the expressive aesthetic of Material Design 3.
- Focus on clean code and accessibility.

Built with vibes and ❤️ by **Bug Ổn**.
