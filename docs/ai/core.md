# Core Principles & Architecture (AI Guide)

This guide helps AI agents understand how to write code for the `@bug-on/md3-react` library.

## 1. The Mental Model: MD3 Expressive
Unlike standard MD3, **Expressive** focus on:
- **Shape Morphing**: Components don't just change color; they change shape (e.g., a `Button` might go from a Pill to a Rounded Square when selected).
- **Spring Animations**: Use `SPRING_TRANSITION` (300ms equivalent) and `SPRING_TRANSITION_FAST` (200ms equivalent) for all transitions. Avoid `duration` based CSS transitions where possible.
- **Dynamic Color**: Colors are derived from CSS variables like `--m3-primary`, `--m3-surface-container-low`, etc.

## 2. Theme Management
The library uses a global provider. Always wrap your app in `MD3ThemeProvider`.

```tsx
import { MD3ThemeProvider } from "@bug-on/md3-react";

function App() {
  return (
    <MD3ThemeProvider mode="system" theme={customTheme}>
      <Main />
    </MD3ThemeProvider>
  );
}
```

## 3. Polymorphism (`asChild`)
Most components use the `asChild` pattern from Radix UI. This allows you to pass a custom element (like a Next.js `Link`) and have it receive the component's styles and logic.

```tsx
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```
**AI Warning**: When using `asChild`, ensure the child is a single valid React element.

## 4. Animation & Motion
We use `motion/react` (Framer Motion).
- **Layout Animations**: Use `layout` or `layoutId` for smooth transitions between states.
- **Ripples**: Use `useRippleState` hook if creating custom interactive elements.

## 5. Tailwind Integration
We use Tailwind v4. The plugin automatically generates classes based on MD3 color roles:
- `bg-m3-primary`, `text-m3-on-primary`
- `bg-m3-surface-container-high`
- `border-m3-outline`

## 6. Icons
We use **Material Symbols** (Variable Font).
- Use the `<Icon name="..." />` component.
- The weight, grade, and optical size are handled automatically via CSS.
