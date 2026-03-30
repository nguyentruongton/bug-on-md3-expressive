## 🔍 Debug: CodeBlock breaking UI Layout

### 1. Symptom
When navigating to the "Code" tab in the component preview, the layout breaks. The code block expands beyond its expected container, pushing other layout elements like the TOC.

### 2. Information Gathered
- Error: UI expands horizontally.
- File: `packages/react/src/ui/code-block.tsx` and `packages/react/src/ui/scroll-area.tsx`.

### 3. Hypotheses
1. ❓ `<pre>` horizontal size overflowing parent: The code content forces `ComponentPreviewClient` to expand because a `min-w-0` is missing in flex containers.
2. ❓ Radix ScrollArea flex bug: `viewportClassName="flex flex-col"` causes the internal Radix `display: table` wrapper to behave incorrectly, stretching the parent container.
3. ❓ The `max-w-full` on `CodeBlock` might not be robust enough to contain `<pre>` without `w-full` and `overflow-hidden`.

### 4. Investigation
Let's test Hypothesis 1 & 2. We can add `min-w-0` classes to `CodeBlock` flex children and remove `flex-col` from the `viewportClassName`.
