**Title:** Navigation rail – Material Design 3

**Source:** [https://m3.material.io/components/navigation-rail/xr](https://m3.material.io/components/navigation-rail/xr)

---

# Page Structure Map
```text
Navigation rail – Material Design 3
├── Variants
├── Anatomy
├── Color & elevation
├── Measurements
├── Usage
├── Behavior
│   ├── Global context
│   └── Local context
├── Placement
│   ├── Navigation context
│   ├── Inset positioning
│   ├── Vertical alignment
│   └── Spatial panel alignment
├── Spatialized FAB
└── Accessibility considerations
```

---

link

Copy linkLink copied

link

Copy linkLink copied

Extended reality (XR) interfaces have special design requirements, like showing apps in 3D space. Material has XR-specific navigation rails with custom specs and guidance. See [XR developer documentation](http://developer.android.com/design/ui/xr/guides/foundations) for more details.

link

Copy linkLink copied

## Variants

link

Copy linkLink copied

There are two variants of navigation rail orbiters Orbiters are floating elements that control the content within spatial panels. [More on orbiters](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters) : the contained FAB and spatialized FAB navigation rails.

link

Copy linkLink copied

![Navigation bar orbiters with a contained FAB and a spatialized FAB.](https://lh3.googleusercontent.com/dPJqjYJCk9bPHeSRMvYPWuDtexUzZDMRBk6vNciqpu5z0dQG30QbaVle64vcI2dusE8aqPEUqFra47gf6R870mBGAhYghroP90OYqWugm180=s0)

1.  Contained FAB rail
2.  Spatialized FAB rail

link

Copy linkLink copied

## Anatomy

link

Copy linkLink copied

![Diagram of navigation rail orbiter identifying 9 internal elements of the component.](https://lh3.googleusercontent.com/rU4TAGNiKzJj6z-L-jcKcfsZTlzzuIycA30T85HGQ_JyBo49apcjkI9TKY5yvPo4-heaO-X5nfrETlyizfZ9_FlQaV-z9BZQFNZ1S7N-MP-y=s0)

1.  Container
2.  Active indicator
3.  Large badge (optional)
4.  Badge (optional)
5.  Large badge label (optional)
6.  Label text
7.  Icon
8.  Embedded or spatialized FAB (optional)
9.  Menu icon (optional)

link

Copy linkLink copied

## Color & elevation

link

Copy linkLink copied

On XR, color is used to highlight elevated UI elements and orbiters. With [spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation), the navigation bar displays above the spatial panel In Android XR, a spatial panel is a container for UI elements, interactive components, and immersive content. [More on spatial panels](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-panels) , on the Z-axis. Color communicates elevation on UI elements and orbiters. Elevated nav rails can use any of these color options:

link

Copy linkLink copied

![4 versions of elevation color strategy.](https://lh3.googleusercontent.com/M6OH6zh7_zTrkS1zUDj-eceTyjgUMahrpEPl6WDJMMAuoODDcaGHDbMtZDzxApkri7IjSHwtCZnBxQnucLJCwA_zJawPO2gSn5i8Qo7-DxNp=s0)

1.  Surface container with tertiary FAB
2.  Surface container high with tertiary fixed dim FAB
3.  Surface container highest with tertiary fixed dim FAB
4.  Tertiary container with primary FAB

link

Copy linkLink copied

## Measurements

link

Copy linkLink copied

![Measurements and padding for navigation rail orbiter with contained FAB.](https://lh3.googleusercontent.com/rLe0xRyUvCeR1tXOPjPJ-hELWYJVzjkIMhHriNOGkHBiJEzAGt7hAMOrn9O5uGpAapq6A1uzhFSbP9u7GChXoBzMVpGj-MJ_q72tJBrP0X0avA=s0)

Navigation rail orbiter padding and measurements with contained FAB

![Measurements and padding for navigation rail orbiter with spatialized FAB.](https://lh3.googleusercontent.com/VGWnkF5eQPdJ2RNo4C0VAmVigdGhBqswyXKAYq0cQgHfCPwPFHm7JKlRPkOgAHxPTtww-Wmm2TnRan4iae_giCyC0KgU76nsh_2z6K2-lW-7=s0)

Navigation rail orbiter padding and measurements with spatialized FAB

link

Copy linkLink copied

## Usage

link

Copy linkLink copied

In full space Full space is Android XR’s immersive mode and supports spatial components. [More on full space](https://developer.android.com/design/ui/xr/guides/foundations#modes) , a navigation rail can appear in an orbiter Orbiters are floating elements that control the content within spatial panels. [More on orbiters](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters) for a more immersive experience. Currently, spatial capabilities, such as orbiters, are only available in full space. In home space Home space is compatible with mobile and large screen apps, but doesn’t support spatial components [More on home space](https://developer.android.com/design/ui/xr/guides/foundations#modes) , use a regular navigation rail on the same plane as the body content to mimic a 2D experience.

link

Copy linkLink copied

Navigation rail orbiter behavior and placement changing when going from a 2D to a 3D experience

link

Copy linkLink copied

## Behavior

link

Copy linkLink copied

### Global context

Intended for global navigation, a nav rail orbiter should be centered along the left or right edge of the app it controls. It stays anchored to the app during layout or content changes to ensure controls are easy to find. 

link

Copy linkLink copied

check Do

A navigation rail orbiter should be placed in global context, centered and anchored to the left or right of the app

link

Copy linkLink copied

### Local context

Don’t place a navigation rail orbiter in local context or [between spatial panels](https://m3.material.io/m3/pages/navigation-rail/xr#519a112b-51d6-4200-96a9-54af92fb787d). Local placement can make controls hard to find. Nav rails are designed for app-level navigation, so should only use the global context.

link

Copy linkLink copied

close Don’t

Avoid placing a navigation rail orbiter in local context. It can be hard to find if placed between two spatial panels.

link

Copy linkLink copied

## Placement

link

Copy linkLink copied

### Navigation context

The position of the navigation rail orbiter should communicate its navigational context:

-   Use **offset positioning Offset positioning is when orbiters are placed adjacent to spatial panels without overlap. [More on offset positioning](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters)** for global actions that affect the overall app experience
-   Use **inset positioning Inset positioning is when orbiters overlap with spatial panels. [More on inset positioning](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters)** for local actions that are specific to a spatial panel

A navigation rail orbiter can either overlap or be positioned adjacent to spatial panels with a 20dp margin for visual separation.

Position the navigation rail orbiter to reflect context: offset for global actions, inset for spatial panel-specific actions

link

Copy linkLink copied

### Inset positioning

Don’t obstruct content. To ensure a balanced and uncluttered layout, a navigation rail orbiter should overlap spatial panels by 12dp and no more than half their width.

close Don’t

Avoid overlapping an inset navigation rail orbiter by more than half its width

link

Copy linkLink copied

### Vertical alignment

A navigation rail orbiter can be aligned to the top, middle, or center of spatialized panels, providing different levels of visual prominence and accessibility.

Align the navigation rail orbiter based on the specific design and user experience goals for the application.

Align the navigation rail orbiter at the top, middle, or center of spatialized panels

link

Copy linkLink copied

The navigation rail orbiter placement shouldn't exceed the height of adjacent spatial panels.

close Don’t

The navigation rail orbiter shouldn’t exceed the height of the spatial panel

link

Copy linkLink copied

### Spatial panel alignment

Avoid placing a navigation rail orbiter between spatial panels. This negatively affects the interface structure.

For layouts that span more than two spatial panels, consider using a navigation bar orbiter.

close Don’t

Don't place a navigation rail orbiter between spatial panels

link

Copy linkLink copied

## Spatialized FAB

link

Copy linkLink copied

There are two variants of navigation rail orbiters with different FAB treatments:

-   **Contained FAB rail:** A contained FAB within the rail. This offers a compact and familiar layout.

-   **Spatialized FAB rail:** The FAB becomes an orbiter of it’s own and is placed outside the navigation rail orbiter. Use this for higher emphasis and a distinct spatial effect.

Use the spatialized FAB rail to emphasize key actions and leverage XR hierarchy. Use the contained FAB rail to be more subtle, and align the experience with the baseline navigation bar.

Choose between a navigation rail orbiter with a contained FAB or a spatialized FAB

link

Copy linkLink copied

To maintain visual association, place the spatialized FAB in close proximity to the navigation rail orbiter. Material recommends a 20dp margin.

The spatialized FAB can be placed above or below the navigation rail orbiter.

Position the spatialized FAB close to the navigation rail orbiter

link

Copy linkLink copied

While the spatialized FAB and navigation rail orbiter are typically positioned together, their placement is adaptable.

exclamation Caution

Use caution when positioning spatialized FABs. Keep them within the height of adjacent spatial panels

link

Copy linkLink copied

## Accessibility considerations

link

Copy linkLink copied