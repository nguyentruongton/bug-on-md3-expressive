/**
 * @file shared/touch-target.tsx
 *
 * Invisible 48×48dp touch-target expander for small interactive elements.
 *
 * WCAG 2.5.5 (Level AA) requires interactive targets to be at least 44×44 CSS pixels.
 * MD3 specifies a minimum 48dp touch target for all interactive components.
 * For button sizes XS (32dp) and SM (40dp) that are smaller than this minimum,
 * an invisible absolutely-positioned `<span>` is overlaid to extend the
 * effective tap area without affecting visual layout.
 *
 * @see https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
 * @see https://m3.material.io/foundations/accessible-design/accessibility-basics
 */

// ─────────────────────────────────────────────────────────────────────────────
// TouchTarget Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Invisible 48×48dp touch area expander — satisfies WCAG 2.5.5 + MD3 spec.
 *
 * Place as a direct child of any interactive element whose visual size is
 * smaller than 48dp (e.g. `xs`/`sm` buttons and icon buttons).
 * The parent element **must** have `position: relative`.
 *
 * @remarks
 * - Hidden from assistive technologies via `aria-hidden="true"`.
 * - `pointer-events: none` ensures it does not intercept click events.
 * - Centred with `left: 50% / top: 50%` + negative translate for symmetry.
 *
 * @example
 * ```tsx
 * // Used inside a 32dp XS button:
 * <button className="relative h-8 w-auto ...">
 *   <TouchTarget />
 *   Label
 * </button>
 * ```
 *
 * @see https://m3.material.io/components/buttons/specs (Touch target section)
 */
export function TouchTarget() {
	return (
		<span
			aria-hidden="true"
			className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-12 min-h-12 cursor-pointer pointer-events-none"
		/>
	);
}
