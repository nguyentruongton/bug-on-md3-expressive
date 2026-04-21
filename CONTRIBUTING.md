# Contributing to Bug Ổn MD3 Expressive

First off, thank you for taking the time to contribute! 🎉

This project is built with care around **Material Design 3 Expressive** principles, and we welcome contributions that align with our design vision and code quality standards.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### 🐞 Reporting Bugs

Before creating a bug report, please check if the issue already exists. When you create a bug report, include as many details as possible using the [bug report template](./.github/ISSUE_TEMPLATE/bug_report.md).

**A good bug report includes:**
- A clear and descriptive title
- Steps to reproduce the behavior
- Expected vs. actual behavior
- Screenshots or screen recordings if applicable
- Your environment (OS, Node version, browser)

### 💡 Suggesting Features

Feature requests are welcome! Use the [feature request template](./.github/ISSUE_TEMPLATE/feature_request.md) and provide:
- A clear description of the problem you're trying to solve
- Your proposed solution
- How it aligns with MD3 Expressive design principles

### 🔧 Code Contributions

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to let others know you're working on it
3. Fork the repository and create your branch from `main`
4. Follow the [development setup](#development-setup) guide
5. Make your changes and submit a pull request

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- [pnpm](https://pnpm.io/installation) v10+

### Installation

```bash
# Clone your fork
git clone https://github.com/<your-username>/bug-on-md3-expressive.git
cd bug-on-md3-expressive

# Install dependencies
pnpm install

# Start the docs app in development mode
pnpm dev
```

### Project Structure

| Package | Location | Description |
|---------|----------|-------------|
| `@bug-on/tokens` | `packages/tokens/` | Design tokens (Color, Shape, Typography) |
| `@bug-on/tailwind` | `packages/tailwind/` | Tailwind CSS plugin for MD3 |
| `@bug-on/react` | `packages/react/` | React component library |
| Docs App | `apps/docs/` | Next.js documentation site |

### Useful Commands

```bash
pnpm dev          # Start all packages in watch mode
pnpm build        # Build all packages
pnpm lint         # Run Biome linting
pnpm format       # Auto-format code with Biome
pnpm check        # Run Biome linting + formatting check
```

### Local Development (Linking)

When testing the library in a host project via local linking (e.g., using `workspace:*` or `pnpm link`), you may encounter duplicate React errors ("invalid hook call"). This happens because the host and the library each resolve their own copy of React.

**Fix:** Add `pnpm.overrides` to your **host project's** `package.json` to force a single React instance:

```json
{
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
```

Then run `pnpm install` in your host project to apply the override.

> `$react` is a shorthand that resolves to the version declared in your host's `dependencies` — it tells pnpm to deduplicate React across all nested packages.

---

## Pull Request Process

1. **Fork and branch**: Create a branch with a descriptive name (e.g., `fix/button-focus-ring`, `feat/new-chip-variant`)
2. **Keep PRs small**: One feature or fix per PR
3. **Write tests**: Add unit tests for new components where applicable
4. **Pass all checks**: Ensure `pnpm check` runs with 0 errors and 0 warnings
5. **Update docs**: If adding a new component, include a demo in the docs app
6. **Fill the template**: Complete the PR template when submitting

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new Chip component
fix: resolve button focus ring on Safari
docs: update getting started guide
chore: bump dependencies
```

---

## Style Guidelines

### Design Principles

- Follow **Material Design 3 Expressive** specifications
- Prioritize **accessibility (a11y)**: every component must support keyboard navigation and screen readers
- Use **motion intentionally**: animations should be meaningful, not decorative
- Support **dynamic theming** via the `ThemeProvider`

### Code Standards

- **TypeScript strict mode**: no `any`, no `@ts-ignore`, no non-null assertions (`!`)
- **Biome**: all code must pass `pnpm check` with zero warnings
- **Accessibility**: follow WCAG 2.1 AA standards — include proper ARIA attributes, focus management, and keyboard handlers
- **Component API**: keep prop names consistent with existing components

### Component Checklist

Before submitting a new component PR, verify:

- [ ] TypeScript types are strict and exported
- [ ] Component supports `className` prop for style overrides
- [ ] Keyboard navigation works correctly
- [ ] Screen reader labels are present (`aria-label`, `aria-labelledby`, etc.)
- [ ] Component is exported from `packages/react/src/index.ts`
- [ ] A demo is added under `apps/docs/components/registry/demos/`
- [ ] `pnpm check` passes with 0 errors and 0 warnings

---

## Changesets (Versioning)

This project uses [Changesets](https://github.com/changesets/changesets) for versioning. When your PR includes a change that users should know about:

```bash
pnpm changeset   # Follow the interactive prompts
```

Select the affected packages and choose a bump type (`patch`, `minor`, or `major`).

---

Thank you for contributing! Built with vibes and by **Bug Ổn**.
