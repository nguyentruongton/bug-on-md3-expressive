# Plan: Icon Demo Use Cases

## Overview
The goal is to provide comprehensive, interactive documentation and demo use cases for the newly implemented Material Symbols variable font `<Icon />` component. This will help users understand how to use the varying font axes (FILL, wght, GRAD, opsz), the `animateFill` spring animations, and Tailwind utility classes.

## Project Type
**WEB** (Next.js Documentation App)

## Success Criteria
- [ ] Users can view and interact with different Material Symbol variants.
- [ ] A clear demonstration of the variable font axes (Fill, Weight, Grade, Optical Size).
- [ ] Visual demonstration of `animateFill` using `motion/react`.
- [ ] Explanation and demonstration of Tailwind utility classes for icons.
- [ ] Code examples are copy-pasteable and work out of the box in the Component Registry.

## File Structure

```text
apps/docs/
├── content/components/
│   └── icons.mdx                        (New MDX documentation file)
│
├── registry/components/
│   ├── icon-basic.tsx                   (Demo: Basic usage & variants)
│   ├── icon-axes.tsx                    (Demo: Variable font axes customization)
│   ├── icon-animated.tsx                (Demo: Interactive 'animateFill' toggle)
│   └── icon-tailwind.tsx                (Demo: Tailwind CSS utility classes)
│
└── app/globals.css                      (Ensure css is importing the font)
```

## Task Breakdown

### Task 1: Create Demo Registry Components
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Description:** Implement the interactive React components to showcase the features of the `<Icon />` component.
- **INPUT:** `<Icon />` props (variant, fill, weight, grade, opticalSize, size, animateFill).
- **OUTPUT:** 4x `tsx` component files in `apps/docs/registry/components/`.
- **VERIFY:** Components render locally and respond correctly to prop/state changes.

### Task 2: Register Components in Registry Index
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Description:** Export the newly created demo components in the `components.ts` (or `registry/index.tsx`) file so the MDX `<ComponentPreview />` block can load them dynamically.
- **INPUT:** New `icon-*.tsx` components.
- **OUTPUT:** Updated registry map.
- **VERIFY:** No TypeScript import errors.

### Task 3: Write MDX Documentation (`icons.mdx`)
- **Agent:** `project-planner` (or `frontend-specialist` acting as technical writer)
- **Skill:** `documentation-templates`
- **Description:** Create the `icons.mdx` file detailing how to install, configure (import CSS), and use the component, utilizing `<ComponentPreview name="icon-..." />`.
- **INPUT:** Knowledge of `@bug-on/md3-react` Icon component API.
- **OUTPUT:** `apps/docs/content/components/icons.mdx` file.
- **VERIFY:** MDX compiles cleanly and displays the custom demo components visually on the docs site.

### Task 4: Fonts & CSS Integration Check
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Description:** Verify the docs application is importing `@bug-on/md3-react/material-symbols.css` or has equivalent CDN/font support setup, so the icons actually load in the documentation previews.
- **INPUT:** `apps/docs` CSS configuration.
- **OUTPUT:** Necessary `import` lines in `layout.tsx` or `globals.css` if not already present.
- **VERIFY:** Icons display as standard ligature glyphs and do not fall back to plain text.

---

## Open Questions (Socratic Gate)

> [!WARNING] User input required:
> 1. **Interactive Playground:** Do you want `icon-axes.tsx` to include an interactive control panel (e.g., Sliders) for the user to tweak `fill`, `grade`, `weight`, and `opsz` directly in the docs?
> 2. **Font Loading Strategy:** For the docs site specifically, should we use the CDN `@import` inside `globals.css`, or configure Next.js `next/font/google` (or self-host via `/public`) to prevent any FOUT on the site?
> 3. **Sidebar Navigation:** I assume `icons` should be added to the Sidebar navigation configuration (likely `apps/docs/lib/source.ts` or similar). Is this correct, or is the routing automated from MDX files?

---

## Validation Plan (Phase X Checklist)

- [ ] Lint: `npm run lint` inside `apps/docs`
- [ ] TS Check: `npx tsc --noEmit` inside `apps/docs`
- [ ] Visual QA: Preview on `http://localhost:3000/docs/components/icons`.
