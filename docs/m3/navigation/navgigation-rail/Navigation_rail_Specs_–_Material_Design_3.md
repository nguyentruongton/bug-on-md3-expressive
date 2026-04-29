**Title:** Navigation rail – Material Design 3

**Source:** [https://m3.material.io/components/navigation-rail/specs](https://m3.material.io/components/navigation-rail/specs)

---

# Page Structure Map
```text
Navigation rail – Material Design 3
├── Variants
│   └── Baseline variants
├── Configurations
├── Tokens & specs
├── Anatomy
├── Color
├── States
├── Measurements
├── Common layouts
└── Baseline navigation rail
    ├── Tokens & specs
    ├── Color
    ├── States
    ├── Measurements
    └── Configurations
```

---

link

Copy linkLink copied

## Variants

link

Copy linkLink copied

![2 variants of navigation rails.](https://lh3.googleusercontent.com/iQ9mPuq7sZfsnSF_EfYMxQdypYp9K_fDEGHm0-4zuKdHXU48Kf7zItSC0hxmu3QW_ugdX67kQeQlrkgs7GzF6Kpo1FFERw1SFlVd6DCQC5gm=s0)

1.  Collapsed navigation rail

2.  Expanded navigation rail

link

Copy linkLink copied

### Baseline variants

link

Copy linkLink copied

The baseline navigation rail is no longer recommended, and should be replaced by the collapsed navigation rail. [View baseline tokens](https://m3.material.io/m3/pages/navigation-rail/specs#d4d97764-20ec-496f-a6f3-0d423940ec5a)

link

Copy linkLink copied

![Baseline navigation rail.](https://lh3.googleusercontent.com/_GDghBF084KxFoboNpBiBukL7eC9btnn0Mb6Jk_768f3C75CzUZ_lS1sJyKteHLGeR2sa__sSE-baRgcdfAxgBR3jxoUV13DucOJj2FXrDM=s0)

1.  The baseline navigation rail is no longer recommended

link

Copy linkLink copied

| 
Variant

 | 

M3

 | 

M3 Expressive

 |
| --- | --- | --- |
| 

Collapsed navigation rail  

 | 

\--

 | 

Available

 |
| 

Expanded navigation rail   

 | 

\--

 | 

Available

 |
| 

Navigation rail (baseline)  

 | 

Available

 | 

Not recommended.

Use **collapsed navigation rail**.  

 |

link

Copy linkLink copied

## Configurations

link

Copy linkLink copied

![Standard and modal layouts of navigation rail.](https://lh3.googleusercontent.com/Q6opw4o2Z-4QOi0ydyk2R1MLywKayfVfAMWjKN6nvzz6OZzoJOGsl_BvoY_XaQp0dSV2iH4gwgEJ0tYqAXEKQKJy1Gko4-M5s1umRBx2MaHD=s0)

1.  Expanded layout: standard
2.  Expanded layout: modal

link

Copy linkLink copied

| 
Category

 | 

Configuration

 | 

M3

 | 

      M3 Expressive

 |
| --- | --- | --- | --- |
| 

Expanded layout

 | 

Standard (default)

 | 

Available as navigation drawer Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail. [More on navigation drawers](https://m3.material.io/m3/pages/navigation-drawer/overview)  

 | 

Available

 |
| 

Modal

 | 

Available as navigation drawer Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail. [More on navigation drawers](https://m3.material.io/m3/pages/navigation-drawer/overview)  

 | 

Available

 |
| 

Expanded behavior

 | 

Hide when collapsed

 | 

\--

 | 

Available

 |

link

Copy linkLink copied

## Tokens & specs

link

Copy linkLink copied

link

Copy linkLink copied

Nav rail item active indicator color

md.comp.nav-rail.item.active.indicator.color

#E8DEF8

Nav rail item active label text color

md.comp.nav-rail.item.active.label-text.color

#625B71

Nav rail item inactive label text color

md.comp.nav-rail.item.inactive.label-text.color

#49454F

Nav rail item active icon color

md.comp.nav-rail.item.active.icon.color

#4A4458

Nav rail item inactive icon color

md.comp.nav-rail.item.inactive.icon.color

#49454F

Nav rail item active hovered state layer color

md.comp.nav-rail.item.active.hovered.state-layer.color

#4A4458

Nav rail item active hovered state layer opacity

md.comp.nav-rail.item.active.hovered.state-layer.opacity

0.08

Nav rail item inactive hovered state layer color

md.comp.nav-rail.item.inactive.hovered.state-layer.color

#4A4458

Nav rail item active focused state layer color

md.comp.nav-rail.item.active.focused.state-layer.color

#4A4458

Nav rail item active focused state layer opacity

md.comp.nav-rail.item.active.focused.state-layer.opacity

0.1

Nav rail item inactive focused state layer color

md.comp.nav-rail.item.inactive.focused.state-layer.color

#4A4458

Nav rail item active pressed state layer color

md.comp.nav-rail.item.active.pressed.state-layer.color

#4A4458

Nav rail item active pressed state layer opacity

md.comp.nav-rail.item.active.pressed.state-layer.opacity

0.1

Nav rail item inactive pressed state layer color

md.comp.nav-rail.item.inactive.pressed.state-layer.color

#4A4458

Close

link

Copy linkLink copied

## Anatomy

link

Copy linkLink copied

![9 elements of collapsed and expanded navigation rails.](https://lh3.googleusercontent.com/zju3SaKNZtIg8oswdNqjqbU2pgzAazbfcyzRL_wo1UneMQSp9D6yIVFbPDeEtmh09MwYuYYHofz5j6DGbwBVO9cBdpqUxwJehXqI242Tz80bUg=s0)

Collapsed and expanded navigation rail elements:

1.  Container
2.  Menu (optional)
3.  FAB or Extended FAB (optional)
4.  Icon
5.  Active indicator
6.  Label text
7.  Large badge (optional)
8.  Large badge label (optional)
9.  Small badge (optional)

link

Copy linkLink copied

## Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/m3/pages/design-tokens/overview)

link

Copy linkLink copied

![Color roles of 9 elements of collapsed and expanded navigation rails in light and dark color schemes.](https://lh3.googleusercontent.com/d3PlE8MkpZrvAvwFNjnOiUQXi8R7ep0qmhurwSRvAq_yf3Eb44NIbzr78sGxD1gNgCLxhWdlVv_Mti8eRMPEi3Nn0WQRUnjZNO_XRFQt6Yan=s0)

Navigation rail color roles used for light and dark schemes:

1.  Surface container (optional)

2.  On secondary container

3.  Secondary container

4.  Secondary (vertical), On secondary container (horizontal)

5.  On surface variant

6.  On surface variant

7.  Error

8.  On error

9.  Error

link

Copy linkLink copied

## States

States States show the interaction status of a component or UI element. [More on states](https://m3.material.io/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or an interactive element.

The navigation item’s target area always spans the full width of the nav rail, even if the item container hugs its contents.

link

Copy linkLink copied

![4 states of collapsed navigation rails.](https://lh3.googleusercontent.com/1IxCo2XIMga54ROSNhrWET0gIRcndin6fwUN_DdJMu2VZ4PFpdW1-c-vio2nIOXxmj3p_tGkbBc1N0KGdzg6iuqMCS1_ZsgFG1FfzS6Fppk=s0)

link

Copy linkLink copied

![4 states of expanded navigation rails.](https://lh3.googleusercontent.com/uvOYTNSaWtfWdqdoR0tVR9eCjmd4f-AEfdMVEacZJc0VwURGK8_8FeAvzOY4Kr3sV9YzZfIF-gguMC8haBwaeJB7tgykjwBvSFhlQtuC4AzahA=s0)

1.  Enabled
2.  Hovered
3.  Focused
4.  Pressed

link

Copy linkLink copied

## Measurements

link

Copy linkLink copied

![Padding and measurements for expanded and collapsed navigation rails.](https://lh3.googleusercontent.com/RTqY8bTqiMpwcsU_pJkWy9rMeFIjRoSs3m15t8w64kdPnvtTTTE6_Dklo68o5dm4vNj_CA14xM6FrVZkyBtYlf4hcPjBAMOTQ3rvBDY60BrmGw=s0)

Navigation rail padding and size measurements

link

Copy linkLink copied

## Common layouts

link

Copy linkLink copied

![4 common layouts of collapsed navigation rail.](https://lh3.googleusercontent.com/Q7TK1on1e6Srj9rXvfTaKHDKgYKSh07xaPRGq0zatThZiQkiwf-UMR1-H60g1esYikZSHRedr3h-lkPoU4ICPljobiH8pOBRjSINWIs7ANcD=s0)

link

Copy linkLink copied

![4 common layouts of expanded navigation rail.](https://lh3.googleusercontent.com/z_uzDW3EjZiO_WRnWUJem6qKFygJFreR0EX_C_F4b4gyUdaq1KV9KFpJqgJpBWstqQ1O-CdNp0N6b7mAK8Xp6CkIKHupoRyeHFQkqfLEpnI=s0)

1.  Three navigation items 
2.  Three navigation items with a menu
3.  Three navigation items with a FAB
4.  Three navigation items with a menu and FAB

link

Copy linkLink copied

link

Copy linkLink copied

## Baseline navigation rail

link

Copy linkLink copied

![8 elements of baseline navigation rail.](https://lh3.googleusercontent.com/ADBFvMHXuRRv0_6Z-N3tRHlMrh88FQQszAdMrNhAM-p2IdU_v8QQRA0cezT6n2vPpVmhQ7R8saOYcTsI1okUonFMqT8GzmCfjymxB9hHPv8=s0)

1.  Container
2.  Menu icon (optional)
3.  Icon
4.  Active indicator
5.  Label text
6.  Large badge label (optional)
7.  Large badge (optional)
8.  Badge (optional)

link

Copy linkLink copied

### Tokens & specs

link

Copy linkLink copied

Navigation rail container color

md.comp.navigation-rail.container.color

#FEF7FF

Navigation rail container shape

md.comp.navigation-rail.container.shape

0

Navigation rail container width

md.comp.navigation-rail.container.width

80dp

Navigation rail container elevation

md.comp.navigation-rail.container.elevation

0

Navigation rail label font

md.comp.navigation-rail.label-text.font

Roboto

Navigation rail label line height

md.comp.navigation-rail.label-text.line-height

16pt

Navigation rail label size

md.comp.navigation-rail.label-text.size

12pt

Navigation rail label weight

md.comp.navigation-rail.label-text.weight

500

Navigation rail active label weight

md.comp.navigation-rail.active.label-text.weight

700

Navigation rail label tracking

md.comp.navigation-rail.label-text.tracking

0.5pt

Label text type style

md.comp.navigation-rail.label-text.type

Roboto

500

12pt

0.5pt

16pt

Navigation rail label active text color

md.comp.navigation-rail.active.label-text.color

#1D1B20

Navigation rail label inactive text color

md.comp.navigation-rail.inactive.label-text.color

#49454F

Navigation rail label font family

md.comp.navigation-rail.label-text.font-family

Roboto

Navigation rail label font size

md.comp.navigation-rail.label-text.font-size

12pt

Navigation rail label letter spacing

md.comp.navigation-rail.label-text.letter-spacing

0.5pt

Navigation rail icon size

md.comp.navigation-rail.icon.size

24dp

Navigation rail active icon color

md.comp.navigation-rail.active.icon.color

#4A4458

Navigation rail inactive icon color

md.comp.navigation-rail.inactive.icon.color

#49454F

Navigation rail menu icon color

md.comp.navigation-rail.menu.icon.color

#49454F

Navigation rail menu icon size

md.comp.navigation-rail.menu.icon.size

24dp

Navigation rail badge color

md.comp.navigation-rail.badge.color

#B3261E

Navigation rail badge size

md.comp.navigation-rail.badge.size

6dp

Navigation rail badge shape

md.comp.navigation-rail.badge.shape

3dp

Navigation rail active indicator color

md.comp.navigation-rail.active-indicator.color

#E8DEF8

Navigation rail active indicator height

md.comp.navigation-rail.active-indicator.height

32dp

Navigation rail no label active indicator height

md.comp.navigation-rail.no-label.active-indicator.height

56dp

Navigation rail active indicator shape

md.comp.navigation-rail.active-indicator.shape

Circular

Navigation rail no label active indicator shape

md.comp.navigation-rail.no-label.active-indicator.shape

Circular

Navigation rail active indicator width

md.comp.navigation-rail.active-indicator.width

56dp

Navigation rail large badge size

md.comp.navigation-rail.large-badge.size

16dp

Navigation rail large badge shape

md.comp.navigation-rail.large-badge.shape

8dp

Navigation rail large badge color

md.comp.navigation-rail.large-badge.color

#B3261E

Navigation rail large badge label font family

md.comp.navigation-rail.large-badge-label.font-family

Roboto

Navigation rail large badge label font

md.comp.navigation-rail.large-badge-label.font

Roboto

Navigation rail large badge label line height

md.comp.navigation-rail.large-badge-label.line-height

16pt

Navigation rail large badge label size

md.comp.navigation-rail.large-badge-label.size

11pt

Navigation rail large badge label weight

md.comp.navigation-rail.large-badge-label.weight

500

Navigation rail large badge label tracking

md.comp.navigation-rail.large-badge-label.tracking

0.5pt

Navigation rail large badge label type style

md.comp.navigation-rail.large-badge-label.type

Roboto

500

11pt

0.5pt

16pt

Navigation rail large badge label color

md.comp.navigation-rail.large-badge-label.color

#FFFFFF

Navigation rail active hover label text color

md.comp.navigation-rail.active.hover.label-text.color

#1D1B20

Navigation rail inactive hover label text color

md.comp.navigation-rail.inactive.hover.label-text.color

#1D1B20

Navigation rail active hover state layer color

md.comp.navigation-rail.active.hover.state-layer.color

#1D1B20

Navigation rail inactive hover state layer color

md.comp.navigation-rail.inactive.hover.state-layer.color

#1D1B20

Navigation rail hover state layer opacity

md.comp.navigation-rail.hover.state-layer.opacity

0.08

Navigation rail menu hover state layer color

md.comp.navigation-rail.menu.hover.state-layer.color

#1D1B20

Navigation rail menu hover state layer opacity

md.comp.navigation-rail.menu.hover.state-layer.opacity

0.08

Navigation rail active hover icon color

md.comp.navigation-rail.active.hover.icon.color

#4A4458

Navigation rail inactive hover icon color

md.comp.navigation-rail.inactive.hover.icon.color

#1D1B20

Navigation rail menu hover icon color

md.comp.navigation-rail.menu.hover.icon.color

#1D1B20

Navigation rail focus label text color

md.comp.navigation-rail.active.focus.label-text.color

#1D1B20

Navigation rail inactive focus label text color

md.comp.navigation-rail.inactive.focus.label-text.color

#1D1B20

Navigation rail active focus state layer color

md.comp.navigation-rail.active.focus.state-layer.color

#1D1B20

Navigation rail inactive focus state layer color

md.comp.navigation-rail.inactive.focus.state-layer.color

#1D1B20

Navigation rail active focus state layer color

md.comp.navigation-rail.focus.state-layer.opacity

0.1

Navigation rail menu focus state layer color

md.comp.navigation-rail.menu.focus.state-layer.color

#1D1B20

Navigation rail menu focus state layer opacity

md.comp.navigation-rail.menu.focus.state-layer.opacity

0.1

Navigation rail active focus icon color

md.comp.navigation-rail.active.focus.icon.color

#4A4458

Navigation rail inactive focus icon color

md.comp.navigation-rail.inactive.focus.icon.color

#1D1B20

Navigation rail menu focus icon color

md.comp.navigation-rail.menu.focus.icon.color

#1D1B20

Navigation rail active pressed label text color

md.comp.navigation-rail.active.pressed.label-text.color

#1D1B20

Navigation rail inactive pressed label text color

md.comp.navigation-rail.inactive.pressed.label-text.color

#1D1B20

Navigation rail active pressed state layer color

md.comp.navigation-rail.active.pressed.state-layer.color

#1D1B20

Navigation rail inactive pressed state layer color

md.comp.navigation-rail.inactive.pressed.state-layer.color

#1D1B20

Navigation rail pressed state layer opacity

md.comp.navigation-rail.pressed.state-layer.opacity

0.1

Navigation rail menu pressed state layer color

md.comp.navigation-rail.menu.pressed.state-layer.color

#1D1B20

Navigation rail menu pressed state layer opacity

md.comp.navigation-rail.menu.pressed.state-layer.opacity

0.1

Navigation rail active pressed icon color

md.comp.navigation-rail.active.pressed.icon.color

#4A4458

Navigation rail inactive pressed icon color

md.comp.navigation-rail.inactive.pressed.icon.color

#1D1B20

Navigation rail menu pressed icon color

md.comp.navigation-rail.menu.pressed.icon.color

#1D1B20

Close

link

Copy linkLink copied

### Color

link

Copy linkLink copied

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/m3/pages/design-tokens/overview)

link

Copy linkLink copied

![8 color roles of baseline navigation rail.](https://lh3.googleusercontent.com/bYdm_ngSm_bDBlh7cCiignDkbte5hHytBrpjYGp_9BfBLH1hF2zPxV-Oqdm6nn8fSHRROojsHBUwN5etdowcM8IHoq2XH1Qy7rRFtshsl5ca=s0)

Navigation rail color roles used for light and dark themes:

1.  On secondary container
2.  Secondary container
3.  On surface
4.  On surface variant
5.  On surface variant
6.  Error
7.  On error
8.  Error

link

Copy linkLink copied

### States

link

Copy linkLink copied

States are visual representations used to communicate the status of a component or interactive element.

link

Copy linkLink copied

![8 states of baseline navigation rail.](https://lh3.googleusercontent.com/q4Ce0kmHkUU63AUNns9xbrnQx2UlJBT9dfmW-RzlP1iM5biz8sOwR4G7BU8pEmGTbMSy2nnmyYzPFBNwQdyM6b8tJ20dhgkmDEF86WcUpVE=s0)

Navigation rail states:

1.  Enabled (on active destination)
2.  Hovered (on active destination)
3.  Focused (on active destination)
4.  Pressed (on active destination)
5.  Enabled (on inactive destination)
6.  Hovered (on inactive destination)
7.  Focused (on inactive destination)
8.  Pressed (on inactive destination)

link

Copy linkLink copied

### Measurements

link

Copy linkLink copied

![Baseline nav rail size measurements.](https://lh3.googleusercontent.com/PsBusqTr-OE5bCxYRV_i7_t-UpABd6wh-bbKu-mzMDv5-O3eoKvh-B144jLbqI5sf4B63G0hAv5k0m_hf7qTNA6ktxvfRVdk0cILpP3kghqk=s0)

Navigation rail size measurements

![Baseline nav rail padding and margin measurements.](https://lh3.googleusercontent.com/HCDSa0-MhFtUTT-jj2x4OG8rghWPku3boxc3_KKZzParDgXb2n-nNyXxh-eq8DyOgLXlqmxFHoc2sShKRMWf8m2DKVLHdtpCfsY9_7GGTFA=s0)

Navigation rail padding and margin measurements

link

Copy linkLink copied

### Configurations

Common arrangements of elements within a navigation rail.

link

Copy linkLink copied

![5 configurations of the baseline navigation rail.](https://lh3.googleusercontent.com/0ArxFOIUj1oF4bmcdt98kcylfvstmfHlWXRI2sVpFC5UG246qn6yr4185ERKim5I5IYDjTqDnWX_fMqGE_nrXr_7dJj5H7sCznQWP5SfkX4h=s0)

1.  With a menu
2.  With a FAB
3.  With menu and FAB, without labels
4.  All destinations with text labels
5.  With menu, FAB, and label text for all destinations

vertical\_align\_top