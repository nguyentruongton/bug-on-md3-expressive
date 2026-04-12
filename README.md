# Bug Ổn - Material Design 3 Expressive UI 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/)
[![Biome](https://img.shields.io/badge/linted%20with-Biome-60a5fa.svg)](https://biomejs.dev/)

> [!IMPORTANT]
> **Vibe Coding Project**: This library is crafted through the lens of "Vibe Coding"—leveraging advanced AI orchestration to translate design intent and "vibes" into high-performance, accessible code. It's about high-level architecture, aesthetic precision, and rapid iteration.

A modern, high-performance UI library system based on **Material Design 3 Expressive** principles. This project focuses on motion, shape, and visual hierarchy, providing a seamless bridge between design tokens and React components.

## 🚀 Project Structure (Monorepo)

Managed by [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/), featuring a modular architecture:

| Package | Description | Status |
| :--- | :--- | :--- |
| [`@bug-on/tokens`](./packages/tokens) | Design System Foundations (Color, Shape, Typography) | ✅ Ready |
| [`@bug-on/tailwind`](./packages/tailwind) | Tailwind CSS Plugin & Preset for MD3 Integration | ✅ Ready |
| [`@bug-on/react`](./packages/react) | MD3 Expressive React Components | 🛠 In Progress |
| [`docs`](./apps/docs) | Documentation & Component Showcase (Next.js) | ✨ Active |

## ✨ Key Features

- **Expressive Design**: Deep implementation of MD3's expressive patterns, focusing on rounded corners, dynamic motion, and bold typography.
- **Dynamic Theming**: Full support for Material Dynamic Color, allowing the entire UI to adapt to brand colors or user preferences.
- **Vibe-Driven Development**: Built with AI agents to ensure consistency, accessibility (A11y), and clean architectures without the manual overhead.
- **Strict A11y**: Every component is audited for screen readers and keyboard navigation.
- **Performance First**: Optimized with Biome and built for 2025 web standards.

## 🛠 Development Workflow

### 1. Prerequisites
Ensure you have [pnpm](https://pnpm.io/installation) v10+ installed.

```bash
# Clone the repository
git clone https://github.com/nguyentruongton/bug-on-md3-expressive.git

# Install dependencies
pnpm install
```

### 2. Common Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start all apps (Docs) and packages in watch mode |
| `pnpm build` | Build all packages and applications for production |
| `pnpm lint` | Run Biome linting |
| `pnpm format` | Run Biome formatter |
| `pnpm changeset` | Generate a new changeset for versioning |

## 📦 Release Process

We use [Changesets](https://github.com/changesets/changesets) and GitHub Actions with standard NPM Trusted Publishing (OIDC) for secure, automated versioning and publishing.

Please see our comprehensive [Releasing Guide](./RELEASING.md) for detailed instructions on creating versions and publishing the packages.

## 🤝 Contributing & Vibe Checks

We welcome contributions that align with our design "vibe". 
- Run `pnpm check` before opening a PR.
- Maintain the expressive aesthetic of Material Design 3.
- Focus on clean code and accessibility.

---

Built with vibes and ❤️ by **Bug Ổn**.
