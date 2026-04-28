// Re-export the MD3 Tailwind plugin from @bug-on/md3-tailwind.
// This allows users to reference the plugin directly from @bug-on/md3-react
// without installing @bug-on/md3-tailwind separately.
//
// Usage in CSS (Tailwind v4):
//   @import "@bug-on/md3-react/index.css";
//   @plugin "@bug-on/md3-react/plugin";
//
// Usage in tailwind.config.ts (Tailwind v3):
//   import md3Plugin from "@bug-on/md3-react/plugin";
//   export default { plugins: [md3Plugin] };
export { default } from "@bug-on/md3-tailwind";
