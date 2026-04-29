**Title:** Navigation bar – Material Design 3

**Source:** [https://m3.material.io/components/navigation-bar/xr](https://m3.material.io/components/navigation-bar/xr)

---

# Page Structure Map
```text
Navigation bar – Material Design 3
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
│   ├── Horizontal alignment
│   └── Spatial panel alignment
└── Accessibility considerations
```

---

link

Copy linkLink copied

link

Copy linkLink copied

Extended reality (XR) interfaces have special design requirements, like showing apps in 3D space. Material has an XR-specific navigation bar with custom specs and guidance. See [XR developer documentation](http://developer.android.com/design/ui/xr/guides/foundations) for more details.

link

Copy linkLink copied

## Anatomy

link

Copy linkLink copied

![Diagram of navigation bar orbiter identifying 7 internal elements of the component.](https://lh3.googleusercontent.com/NW9kaqkcTarsiort-BDPnf0QKIkvHB7lo6Mbbh8SZUvS-c-EB3LLLFQrfeJMXk7uRlDFbNtkCWBCSRYRe00HwvDagwyWESwwQbf9Vpkiz-nKqw=s0)

1.  Container
2.  Icon
3.  Active indicator 
4.  Small badge (optional)
5.  Large badge (optional)
6.  Large badge label (optional)
7.  Label text

link

Copy linkLink copied

## Color & elevation

link

Copy linkLink copied

On XR, color is used to highlight elevated UI elements and orbiters Orbiters are floating elements that control the content within spatial panels. [More on orbiters](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters) . With [spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation), the navigation bar displays above the spatial panel In Android XR, a spatial panel is a container for UI elements, interactive components, and immersive content. [More on spatial panels](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-panels) , on the Z-axis. Color communicates elevation on UI elements and orbiters. Elevated nav bars can use any of these color options:

link

Copy linkLink copied

![4 versions of elevation color strategy.](https://lh3.googleusercontent.com/EYtK3dWA1t7RZze6HZnobQWRtKQiC_cuLBnJ_ceCPtbTbbqbc0E1LXNz2qCjRKTlibK7HZk1ks2RuQC1UWfAoSsRwrvlbySXSPEUSz8or2QO=s0)

1.  Surface container
2.  Surface container high
3.  Surface container highest
4.  Tertiary container

link

Copy linkLink copied

## Measurements

link

Copy linkLink copied

![Measurements and padding for navigation bar orbiter.](https://lh3.googleusercontent.com/sHMs2ZBzr0w6PdPaUdjH4C-qlDH0Otnv-tBwkRLU3cO6-8MyE9Kkrjupxd5Y9oLtniqIjoeTHjjkN4aojalS0--hvHAYjrufQQMw7tiIPfGOjg=s0)

Navigation bar orbiter padding and measurements

link

Copy linkLink copied

## Usage

link

Copy linkLink copied

In full space Full space is Android XR’s immersive mode and supports spatial components. [More on full space](https://developer.android.com/design/ui/xr/guides/foundations#modes) , a navigation bar can appear in an orbiter Orbiters are floating elements that control the content within spatial panels. [More on orbiters](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters) for a more immersive experience. Currently, spatial capabilities, such as orbiters, are only available in full space. In home space Home space is compatible with mobile and large screen apps, but doesn’t support spatial components. [More on home space](https://developer.android.com/design/ui/xr/guides/foundations#modes) , use a regular navigation bar on the same plane as the body content to mimic a 2D experience.

link

Copy linkLink copied

Navigation bar behavior and placement changing when going from a 2D to a 3D experience

link

Copy linkLink copied

## Behavior

link

Copy linkLink copied

### Global context

When placed in global context, the navigation bar orbiter is centered at the bottom of the app it controls. It stays anchored to the app during layout or content changes. This ensures navigation elements are easy to find and use.

link

Copy linkLink copied

A navigation bar orbiter centered and anchored to the bottom of the app

link

Copy linkLink copied

### Local context

When placed in local context, the navigation bar orbiter is centered at the bottom of the spatial panel it controls. It repositions in response to layout or content changes.

link

Copy linkLink copied

exclamation Caution

Use caution before placing a navigation bar in local context. If it contains navigation elements that affect the overall app, a navigation bar orbiter should be placed in global context.

link

Copy linkLink copied

## Placement

link

Copy linkLink copied

### Navigation context

The position of the navigation bar orbiter should communicate its navigational context:

-   Use **offset positioning** for global actions that affect the overall app experience
-   Use **inset positioning** for local actions that are specific to a spatial panel  

A navigation bar orbiter can either overlap or be positioned adjacent to spatial panels with a 20dp margin for visual separation.  

Position the navigation bar orbiter to reflect context: offset for global actions, inset for spatial panel-specific actions

link

Copy linkLink copied

### Inset positioning

Don’t obstruct content. To ensure a balanced and uncluttered layout, a navigation bar orbiter should overlap spatial panels by 12dp and no more than half their height.

close Don’t

Avoid overlapping an inset a navigation bar orbiter by more than half its height

link

Copy linkLink copied

### Horizontal alignment

The navigation bar orbiter placement shouldn't exceed the width of adjacent spatial panels.

close Don’t

The navigation bar orbiter shouldn’t exceed the width of the spatial panel

link

Copy linkLink copied

### Spatial panel alignment

A navigation bar orbiter should always be placed at the bottom of a spatial panel and within the immediate field of view (FOV). Follow common usability practices to make the experience easy to use and consistent across platforms.

Avoid placing the navigation bar orbiter at the top of a spatial panel, as this area is typically reserved for app bar orbiters or other critical UI elements.

close Don’t

Don't position a navigation bar orbiter at the top of a spatial panel. Position it at the bottom in the field of view to maintain usability and minimize interaction effort.

link

Copy linkLink copied

## Accessibility considerations

link

Copy linkLink copied