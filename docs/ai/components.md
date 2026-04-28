# Component Reference (AI-Optimized, Source-Verified)

> All APIs verified directly from source code. Do not guess props — use only what is documented here.

---

## Setup Requirements

```tsx
// 1. Import CSS (REQUIRED — icons will not render without this)
import "@bug-on/md3-react/index.css";
import "@bug-on/md3-react/material-symbols.css"; // if using <Icon>

// 2. Wrap the app in providers
import { MD3ThemeProvider, SnackbarProvider } from "@bug-on/md3-react";

function Root() {
  return (
    <MD3ThemeProvider mode="system">
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </MD3ThemeProvider>
  );
}
```

---

## 1. Icon

Material Symbols variable font component. Always `aria-hidden="true"` — add labels to the parent.

```tsx
import { Icon } from "@bug-on/md3-react";

// Basic
<Icon name="home" />

// Full API
<Icon
  name="favorite"          // string — snake_case icon name (REQUIRED)
  variant="outlined"       // "outlined" | "rounded" | "sharp" (default: "outlined")
  fill={1}                 // 0 | 1 (default: 0)
  weight={400}             // 100–700 (default: 400)
  grade={0}                // -50 | -25 | 0 | 100 | 200 (default: 0)
  opticalSize={24}         // 20 | 24 | 40 | 48 (default: 24)
  size={24}                // number | "inherit" — overrides font-size in px
  animateFill              // boolean — spring-animates FILL axis on change
/>
```

> **AI Gotcha**: Icon names are `snake_case`. Never `ArrowForward` — always `arrow_forward`.

---

## 2. Button

5 color styles, 5 sizes, shape morphing, icon, loading, toggle, and `asChild` support.

```tsx
import { Button } from "@bug-on/md3-react";

// Standard button
<Button
  colorStyle="filled"      // "elevated" | "filled" | "tonal" | "outlined" | "text" (default: "filled")
  size="sm"                // "xs" | "sm" | "md" | "lg" | "xl" (default: "sm")
  shape="round"            // "round" | "square" (default: "round")
  icon={<Icon name="add" />}      // leading/trailing icon
  iconPosition="leading"   // "leading" | "trailing" (default: "leading")
  loading={false}          // boolean
  loadingVariant="loading-indicator" // "loading-indicator" | "circular"
  disabled={false}
  asChild={false}          // boolean — merge props onto child element
>
  Label
</Button>

// Toggle button — REQUIRES variant="toggle" AND selected prop
<Button variant="toggle" selected={isActive} onClick={toggle}>
  Filter
</Button>

// asChild with Next.js Link
<Button asChild size="lg">
  <Link href="/page">Go</Link>
</Button>
```

> **AI Gotcha**: `variant="toggle"` is **required** together with `selected: boolean`. TypeScript enforces this — omitting either will cause a type error.

---

## 3. IconButton

Icon-only button. `aria-label` is **required** (no visible text).

```tsx
import { IconButton } from "@bug-on/md3-react";

<IconButton
  aria-label="Close"           // string — REQUIRED
  colorStyle="standard"        // "standard" | "filled" | "tonal" | "outlined" (default: "standard")
  size="sm"                    // "xs" | "sm" | "md" | "lg" | "xl" (default: "sm")
  shape="round"                // "round" | "square" (default: "round")
  loading={false}
  loadingVariant="loading-indicator"
  onClick={handleClose}
>
  <Icon name="close" />
</IconButton>

// Toggle variant — REQUIRES variant="toggle" AND selected prop
<IconButton
  variant="toggle"
  selected={isBookmarked}
  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
  colorStyle="filled"
  onClick={toggleBookmark}
>
  <Icon name="bookmark" />
</IconButton>
```

---

## 4. FAB (Floating Action Button)

```tsx
import { FAB, FABPosition } from "@bug-on/md3-react";

<FAB
  icon={<Icon name="edit" />}   // ReactNode — REQUIRED
  size="md"                     // "sm" | "md" | "lg" | "xl" (default: "md")
  colorStyle="primary"          // "primary" | "secondary" | "tertiary" | "surface" (default: "primary")
  extended={false}              // boolean — reveals label with animated width expansion
  lowered={false}               // boolean — reduces shadow elevation
  loading={false}
  visible={true}                // boolean — controls entrance/exit scale animation
  aria-label="New post"         // REQUIRED for icon-only FABs
>
  New Post                      {/* shown only when extended={true} */}
</FAB>

// Fixed positioning helper
<FABPosition position="bottom-right"> // "bottom-right" | "bottom-left" | "top-right" | "top-left"
  <FAB icon={<Icon name="add" />} aria-label="Add" />
</FABPosition>
```

> **AI Gotcha**: `FABPosition` requires the **parent** to have `position: relative` (or `position: fixed/absolute`).

---

## 5. Badge & BadgedBox

```tsx
import { Badge, BadgedBox } from "@bug-on/md3-react";

// Dot badge (decorative, no content)
<Badge />

// Numbered badge
<Badge max={99}>150</Badge>    // renders "99+"

// Text badge
<Badge>NEW</Badge>

// Custom colors
<Badge containerColor="#6750A4" contentColor="#fff">3</Badge>

// BadgedBox — positions badge at top-trailing corner of anchor
<BadgedBox badge={<Badge max={99}>{count}</Badge>}>
  <Icon name="notifications" />
</BadgedBox>

// badgeSize overrides auto-detection
<BadgedBox badge={<Badge />} badgeSize="small">
  <Icon name="mail" />
</BadgedBox>
```

---

## 6. Card

Static, interactive-button, or link card with MD3 elevation.

```tsx
import { Card } from "@bug-on/md3-react";

// Static card (div)
<Card variant="elevated">
  <div className="p-4">Content</div>
</Card>

// Interactive button card (adds ripple + elevation on hover)
<Card variant="filled" onClick={() => alert("clicked!")}>
  <div className="p-4">Click me</div>
</Card>

// Link card (renders as <a>)
<Card variant="outlined" href="/home">
  <div className="p-4">Navigate</div>
</Card>

// Props
// variant: "elevated" | "filled" | "outlined" (default: "elevated")
// interactive: boolean — force interactive even without onClick
// disabled: boolean
// href: string — renders as <a>
// target: "_blank" | "_self" | "_parent" | "_top"
```

---

## 7. Chip

4 semantic variants for different use cases.

```tsx
import { Chip } from "@bug-on/md3-react";

// Assist chip — smart actions
<Chip variant="assist" label="Share" onClick={share} />

// Filter chip — toggleable selection with animated checkmark
<Chip
  variant="filter"
  label="Unread"
  selected={showUnread}
  onClick={toggle}
  leadingIcon={<Icon name="mail" />}   // replaced by checkmark when selected
/>

// Input chip — entity representation (tag)
<Chip
  variant="input"
  label="React"
  onRemove={() => removeTag("React")}  // adds ✕ close button
  avatar={<img src="..." />}            // takes priority over leadingIcon
/>

// Suggestion chip — contextual recommendations
<Chip variant="suggestion" label="Try this" elevated onClick={suggest} />

// Shared props:
// label: ReactNode — REQUIRED
// elevated: boolean — adds elevation shadow
// selected: boolean — for filter/input
// disabled: boolean
// leadingIcon: ReactNode
// trailingIcon: ReactNode
```

---

## 8. Checkbox

2-state and tri-state support.

```tsx
import { Checkbox, TriStateCheckbox } from "@bug-on/md3-react";

// Controlled 2-state
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
  label="Accept terms"
/>

// With error state
<Checkbox
  checked={false}
  onCheckedChange={() => {}}
  error
  label="Required field"
  aria-describedby="err-msg"
/>

// Tri-state (unchecked | checked | indeterminate)
<TriStateCheckbox
  state={parentState}           // "unchecked" | "checked" | "indeterminate"
  onStateChange={setParentState}
  label="Select all"
/>

// Indeterminate visual override
<Checkbox
  checked={false}
  indeterminate           // forces indeterminate visual regardless of checked
  onCheckedChange={() => {}}
/>
```

---

## 9. Switch

```tsx
import { Switch } from "@bug-on/md3-react";

<Switch
  checked={isOn}                    // boolean — REQUIRED (controlled)
  onCheckedChange={setIsOn}         // (checked: boolean) => void — REQUIRED
  label="Wi-Fi"                     // string — wraps in <label>
  disabled={false}
  thumbContent={<Icon name="check" size={16} />}  // icon inside thumb
  icons={false}             // show thumbContent in both states
  showOnlySelectedIcon={false} // show thumbContent only when checked
  ariaLabel="Toggle Wi-Fi"   // used when no label prop
  // Color overrides:
  checkedTrackColor="..."
  uncheckedTrackColor="..."
  checkedThumbColor="..."
  uncheckedThumbColor="..."
/>
```

---

## 10. RadioButton

```tsx
import { RadioButton, RadioGroup } from "@bug-on/md3-react";

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioButton value="a" label="Option A" />
  <RadioButton value="b" label="Option B" />
  <RadioButton value="c" label="Option C" disabled />
</RadioGroup>
```

---

## 11. TextField

Full-featured input with floating label, error states, icons, and imperative handle.

```tsx
import { TextField } from "@bug-on/md3-react";
import type { TextFieldHandle } from "@bug-on/md3-react";

// Basic
<TextField label="Email" type="email" variant="outlined" />

// Full API
<TextField
  variant="filled"          // "filled" | "outlined" (default: "filled")
  label="Username"
  type="text"               // "text" | "email" | "number" | "password" | "search" | "tel" | "url" | "textarea"
  value={val}
  onChange={(value, event) => setVal(value)}  // NOTE: first arg is string, not event
  placeholder="Enter text"
  supportingText="Helper text"
  error={hasError}
  errorText="This field is required"
  required
  maxLength={100}           // enables character counter
  leadingIcon={<Icon name="search" />}
  trailingIconMode="clear"  // "none" | "clear" | "password-toggle" | "custom"
  trailingIcon={<Icon name="check" />}  // used with trailingIconMode="custom"
  prefixText="$"
  suffixText=".00"
  disabled={false}
  readOnly={false}
  fullWidth
  dense                     // reduced height (48px instead of 56px)
  // For textarea type:
  rows={4}
  autoResize
  maxRows={8}
  scrollAreaType="hover"    // "hover" | "scroll" | "always" | "none"
/>

// Imperative handle
const ref = useRef<TextFieldHandle>(null);
<TextField ref={ref} label="Search" />
ref.current?.focus();
ref.current?.clear();
ref.current?.getValue();
```

> **AI Gotcha**: `onChange` receives `(value: string, event)` NOT `(event)`. The first argument is the new value string.

---

## 12. Tabs

```tsx
import { Tabs, TabsList, Tab, TabsContent } from "@bug-on/md3-react";

// Controlled
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList variant="primary"> {/* "primary" | "secondary" — REQUIRED */}
    <Tab value="flights" icon={<Icon name="flight" />}>Flights</Tab>
    <Tab value="hotels" disabled>Hotels</Tab>
    <Tab value="trips" icon={<Icon name="map" />} inlineIcon>Trips</Tab>
  </TabsList>
  <TabsContent value="flights">Flights content</TabsContent>
  <TabsContent value="hotels">Hotels content</TabsContent>
  <TabsContent value="trips">Trips content</TabsContent>
</Tabs>

// Uncontrolled
<Tabs defaultValue="flights">
  ...
</Tabs>

// Tab props:
// value: string — REQUIRED, must match TabsContent value
// icon: ReactNode
// inlineIcon: boolean — icon beside label (48dp height) vs stacked (64dp)
// disabled: boolean
// badge: ReactNode

// TabsList props:
// variant: "primary" | "secondary" — REQUIRED
// scrollable: boolean (default: false) — horizontal scroll with 52px edge padding
// backgroundColor: string
```

---

## 13. NavigationRail

```tsx
import { NavigationRail, NavigationRailItem } from "@bug-on/md3-react";

<NavigationRail
  variant="collapsed"         // "collapsed" | "expanded" | "modal" (default: "collapsed")
  labelVisibility="labeled"   // "labeled" | "auto" | "unlabeled" (default: "labeled")
  fab={<FAB icon={<Icon name="edit" />} size="md" aria-label="Compose" />}
  header={<img src="logo.png" />}
  footer={<NavigationRailItem ... />}
>
  <NavigationRailItem
    selected={current === "home"}   // boolean — REQUIRED
    icon={<Icon name="home" />}     // ReactNode — REQUIRED (use <Icon> for fill animation)
    label="Home"
    onClick={() => setCurrent("home")}
    disabled={false}
    badge={3}              // badge content shown on icon
  />
  <NavigationRailItem selected={current === "search"} icon={<Icon name="search" />} label="Search" onClick={() => setCurrent("search")} />
</NavigationRail>

// Modal variant (drawer-style, slides in from left)
<NavigationRail variant="modal" open={isOpen} onClose={() => setIsOpen(false)}>
  ...
</NavigationRail>
```

> **AI Gotcha**: When using `<Icon>` for the `icon` prop, `NavigationRail` automatically adds `fill={selected ? 1 : 0}` and `animateFill` — no need to set these manually.

---

## 14. AppBar

```tsx
import {
  SmallAppBar, SearchAppBar, BottomAppBar,
  LargeFlexibleAppBar, MediumFlexibleAppBar, DockedToolbar
} from "@bug-on/md3-react";

// Small (most common)
<SmallAppBar
  title="Dashboard"
  leadingIcon={<IconButton aria-label="Menu" onClick={openMenu}><Icon name="menu" /></IconButton>}
  trailingIcons={[
    <IconButton key="search" aria-label="Search"><Icon name="search" /></IconButton>
  ]}
/>

// Search app bar
<SearchAppBar placeholder="Search..." />

// Bottom app bar (mobile)
<BottomAppBar
  leadingIcons={[...]}
  fab={<FAB icon={<Icon name="add" />} size="md" aria-label="Add" lowered />}
/>
```

---

## 15. Dialog

Based on Radix UI. Use `Dialog` > `DialogTrigger` > `DialogContent` compound pattern.

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogBody,
  DialogFooter, DialogClose, DialogIcon,
  DialogFullScreenContent
} from "@bug-on/md3-react";

// Controlled
const [open, setOpen] = useState(false);
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent hideCloseButton={false}>
    <DialogHeader>
      <DialogIcon><Icon name="warning" /></DialogIcon>
      <DialogTitle>Confirmation</DialogTitle>
    </DialogHeader>
    <DialogBody>Are you sure you want to delete this?</DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button colorStyle="text">Cancel</Button>
      </DialogClose>
      <Button colorStyle="filled" onClick={confirmDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Full-screen dialog
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button>Edit</Button></DialogTrigger>
  <DialogFullScreenContent
    title="Edit Profile"
    actionLabel="Save"
    onAction={handleSave}
    showDivider
  >
    <p>Full screen content here</p>
  </DialogFullScreenContent>
</Dialog>
```

> **AI Gotcha**: `DialogBody` uses `ScrollArea` internally and has a max-height of `calc(85dvh - 200px)`. For very short dialogs you may want to pass `className="max-h-none"`.

---

## 16. Drawer (Bottom Sheet)

Vaul-based bottom sheet.

```tsx
import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose
} from "@bug-on/md3-react";

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Sheet</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Settings</DrawerTitle>
    </DrawerHeader>
    <p className="p-4">Sheet content here</p>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button colorStyle="tonal">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## 17. Snackbar

Imperative toast system. One at a time — subsequent calls are queued.

```tsx
import { SnackbarProvider, useSnackbar } from "@bug-on/md3-react";

// 1. Wrap app (or section) in provider — ONCE
<SnackbarProvider>
  <App />
</SnackbarProvider>

// 2. Use in any descendant
function SaveButton() {
  const { showSnackbar } = useSnackbar();

  const handleSave = async () => {
    const result = await showSnackbar({
      message: "Changes saved",
      actionLabel: "Undo",           // optional action button
      withDismissAction: false,      // show X close button
      actionOnNewLine: false,        // stack action below message
      duration: "short",             // "short" (4s) | "long" (7s) | number (ms)
    });

    if (result === "action-performed") undoSave();
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

---

## 18. Tooltip

```tsx
import { PlainTooltip, RichTooltip, TooltipBox } from "@bug-on/md3-react";

// Plain tooltip
<PlainTooltip content="Helpful hint">
  <IconButton aria-label="Help"><Icon name="help" /></IconButton>
</PlainTooltip>

// Rich tooltip (title + description + actions)
<RichTooltip
  title="More information"
  description="This is a detailed explanation."
>
  <IconButton aria-label="Info"><Icon name="info" /></IconButton>
</RichTooltip>
```

---

## 19. Slider

```tsx
import { Slider, RangeSlider } from "@bug-on/md3-react";

// Single value
<Slider
  defaultValue={[50]}
  min={0}
  max={100}
  step={1}
  // variant: "continuous" | "discrete" (default: "continuous")
  // orientation: "horizontal" | "vertical"
/>

// Range slider (two handles)
<RangeSlider defaultValue={[20, 80]} min={0} max={100} step={5} />
```

---

## 20. ScrollArea

Custom scrollbar matching MD3 styles.

```tsx
import { ScrollArea } from "@bug-on/md3-react";

<ScrollArea
  type="hover"              // "auto" | "always" | "scroll" | "hover" (default: "hover")
  orientation="vertical"   // "vertical" | "horizontal" | "both"
  className="h-64"
>
  <div>Long content...</div>
</ScrollArea>
```

---

## 21. Menu

Dropdown menus with shape morphing, submenus, and context menu.

```tsx
import {
  Menu, MenuTrigger, MenuContent,
  MenuItem, MenuDivider, MenuGroup,
  SubMenu, ContextMenu, ContextMenuTrigger, ContextMenuContent
} from "@bug-on/md3-react";

<Menu>
  <MenuTrigger asChild>
    <IconButton aria-label="More options"><Icon name="more_vert" /></IconButton>
  </MenuTrigger>
  <MenuContent>
    <MenuItem icon={<Icon name="edit" />} onSelect={handleEdit}>Edit</MenuItem>
    <MenuDivider />
    <MenuGroup>
      <MenuItem onSelect={handleCopy}>Copy</MenuItem>
      <MenuItem onSelect={handlePaste}>Paste</MenuItem>
    </MenuGroup>
    <SubMenu trigger={<MenuItem>More options</MenuItem>}>
      <MenuContent>
        <MenuItem onSelect={handleA}>Option A</MenuItem>
      </MenuContent>
    </SubMenu>
  </MenuContent>
</Menu>

// Context menu (right-click)
<ContextMenu>
  <ContextMenuTrigger>
    <div>Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <MenuItem onSelect={handleCut}>Cut</MenuItem>
    <MenuItem onSelect={handleCopy}>Copy</MenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## 22. Divider

```tsx
import { Divider } from "@bug-on/md3-react";

<Divider />                          // horizontal line
<Divider orientation="vertical" />  // vertical line
```

---

## 23. ButtonGroup

Groups related buttons with shared borders and shape logic.

```tsx
import { ButtonGroup, Button } from "@bug-on/md3-react";

<ButtonGroup>
  <Button colorStyle="outlined">Day</Button>
  <Button colorStyle="outlined">Week</Button>
  <Button colorStyle="outlined">Month</Button>
</ButtonGroup>
```

---

## 24. Progress Indicators

```tsx
import { ProgressIndicator } from "@bug-on/md3-react";

// Linear (determinate)
<ProgressIndicator variant="linear" value={65} max={100} />

// Linear (indeterminate)
<ProgressIndicator variant="linear" />

// Circular (determinate)
<ProgressIndicator variant="circular" value={65} max={100} size={48} />

// Circular (indeterminate)
<ProgressIndicator variant="circular" size={48} color="currentColor" />
```

---

## 25. Theme Provider & Hooks

```tsx
import { MD3ThemeProvider, useTheme, useThemeMode } from "@bug-on/md3-react";

// Provider
<MD3ThemeProvider
  mode="system"             // "light" | "dark" | "system" (default: "system")
  theme={customColorScheme} // optional — generated from generateM3Theme()
>
  <App />
</MD3ThemeProvider>

// Hooks (inside provider)
const { mode, setMode, effectiveMode } = useThemeMode();
// effectiveMode: "light" | "dark" — resolved system preference

const { theme } = useTheme();
```

---

## 26. Typography

```tsx
import { Typography, TypographyProvider } from "@bug-on/md3-react";

// Provider (optional — sets font)
<TypographyProvider>
  <App />
</TypographyProvider>

// Typography component
<Typography variant="headline-large">Page Title</Typography>
<Typography variant="body-medium" as="p">Body text</Typography>

// Variants: display-large, display-medium, display-small,
//           headline-large, headline-medium, headline-small,
//           title-large, title-medium, title-small,
//           body-large, body-medium, body-small,
//           label-large, label-medium, label-small
```

---

## 27. Ripple (Low-level)

For custom interactive components.

```tsx
import { Ripple, useRippleState } from "@bug-on/md3-react";

function CustomButton({ children, onClick }) {
  const { ripples, onPointerDown, removeRipple } = useRippleState({
    disabled: false,
  });

  return (
    <button
      className="relative overflow-hidden"
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <Ripple ripples={ripples} onRippleDone={removeRipple} />
      {children}
    </button>
  );
}
```

---

## 28. Text (Raw)

Simple span with MD3 typography styles.

```tsx
import { Text } from "@bug-on/md3-react";

<Text as="p" variant="body-medium" className="text-m3-on-surface">
  Paragraph content
</Text>
```

---

## 29. CodeBlock

Syntax-highlighted code display.

```tsx
import { CodeBlock } from "@bug-on/md3-react";

<CodeBlock language="tsx">
  {`const x = 1;`}
</CodeBlock>
```

---

## 30. TableOfContents

Auto-generated TOC from headings.

```tsx
import { TableOfContents } from "@bug-on/md3-react";

<TableOfContents
  items={[
    { id: "section-1", label: "Introduction", level: 1 },
    { id: "section-2", label: "Usage", level: 2 },
  ]}
  activeId={activeSection}
/>
```

---

## Quick Common Mistakes

| Mistake | Correct |
|---------|---------|
| `<Icon name="ArrowForward" />` | `<Icon name="arrow_forward" />` |
| `<Button variant="toggle">` (no `selected`) | Must also pass `selected={boolean}` |
| `<IconButton>` (no `aria-label`) | TypeScript error — `aria-label` is required |
| `onChange={e => setValue(e.target.value)}` on TextField | `onChange={(value) => setValue(value)}` (first arg is string) |
| `<TabsList>` (no `variant`) | `variant` prop is required on `TabsList` |
| Using `useSnackbar()` outside `<SnackbarProvider>` | Throws error — ensure provider wraps the tree |
| Setting custom FAB position without `position: relative` on parent | `FABPosition` uses `absolute` — parent must be positioned |
