/**
 * @file switch.stories.tsx
 * MD3 Expressive Switch — all usage patterns and states.
 *
 * Can be used as:
 * 1. Storybook stories (if Storybook is configured)
 * 2. Standalone demo component for the docs app
 *
 * Covers all 7 patterns from the MD3 Switch specification:
 * 1. Basic toggle
 * 2. With label
 * 3. With icons (both states)
 * 4. With only selected icon
 * 5. Disabled (checked)
 * 6. Disabled (unchecked)
 * 7. All states grid
 */

"use client";

import * as React from "react";
import { Switch } from "./switch";

// ─── Icon helper ──────────────────────────────────────────────────────────────

/** Simple check icon using SVG (no external icon dependency). @internal */
function CheckIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			width={16}
			height={16}
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="3,8 6.5,11.5 13,5" />
		</svg>
	);
}

/** Simple close/X icon for unselected state. @internal */
function CloseIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			width={16}
			height={16}
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			aria-hidden="true"
		>
			<line x1="4" y1="4" x2="12" y2="12" />
			<line x1="12" y1="4" x2="4" y2="12" />
		</svg>
	);
}

// ─── Story 1: Basic ───────────────────────────────────────────────────────────

/** Basic stateful switch — no label, no icons. */
export function Basic() {
	const [checked, setChecked] = React.useState(false);
	return (
		<div className="flex flex-col gap-4">
			<p className="text-sm text-neutral-500">
				State: <strong>{checked ? "On" : "Off"}</strong>
			</p>
			<Switch
				checked={checked}
				onCheckedChange={setChecked}
				ariaLabel="Basic switch"
			/>
		</div>
	);
}

// ─── Story 2: With Label ──────────────────────────────────────────────────────

/** Switch with a visible text label using htmlFor linkage. */
export function WithLabel() {
	const [checked, setChecked] = React.useState(true);
	return (
		<Switch checked={checked} onCheckedChange={setChecked} label="Wi-Fi" />
	);
}

// ─── Story 3: With Icons (both states) ───────────────────────────────────────

/**
 * Switch showing icons in both checked and unchecked states.
 * Uses check icon when on, close icon when off.
 */
export function WithIcons() {
	const [checked, setChecked] = React.useState(false);
	return (
		<div className="flex flex-col gap-4">
			<Switch
				checked={checked}
				onCheckedChange={setChecked}
				icons
				thumbContent={checked ? <CheckIcon /> : <CloseIcon />}
				label="Notifications"
			/>
		</div>
	);
}

// ─── Story 4: Only Selected Icon ─────────────────────────────────────────────

/**
 * Switch showing the icon only in the checked (selected) state.
 * Unselected state has no icon.
 */
export function WithOnlySelectedIcon() {
	const [checked, setChecked] = React.useState(false);
	return (
		<Switch
			checked={checked}
			onCheckedChange={setChecked}
			showOnlySelectedIcon
			thumbContent={<CheckIcon />}
			label="Dark mode"
		/>
	);
}

// ─── Story 5: Disabled (checked) ─────────────────────────────────────────────

/** Disabled switch in the checked (on) state. */
export function DisabledChecked() {
	return (
		<Switch
			checked
			onCheckedChange={() => {}}
			disabled
			label="Always on (disabled)"
		/>
	);
}

// ─── Story 6: Disabled (unchecked) ───────────────────────────────────────────

/** Disabled switch in the unchecked (off) state. */
export function DisabledUnchecked() {
	return (
		<Switch
			checked={false}
			onCheckedChange={() => {}}
			disabled
			label="Unavailable feature (disabled)"
		/>
	);
}

// ─── Story 7: All States Grid ─────────────────────────────────────────────────

/**
 * Grid displaying all Switch state combinations:
 * - Enabled: checked / unchecked
 * - Disabled: checked / unchecked
 * - With icons: checked / unchecked
 * - With only selected icon: checked / unchecked
 */
export function AllStatesGrid() {
	const [checkedMap, setCheckedMap] = React.useState<Record<string, boolean>>({
		enabled_on: true,
		enabled_off: false,
		icons_on: true,
		icons_off: false,
		selected_icon_on: true,
		selected_icon_off: false,
	});

	const toggle = (key: string) =>
		setCheckedMap((prev) => ({ ...prev, [key]: !prev[key] }));

	const Row = ({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}) => (
		<div className="flex items-center gap-6">
			<span className="w-48 text-sm text-neutral-500 shrink-0">{title}</span>
			{children}
		</div>
	);

	return (
		<div className="flex flex-col gap-6 p-4">
			<Row title="Enabled (unchecked)">
				<Switch
					checked={checkedMap.enabled_off}
					onCheckedChange={() => toggle("enabled_off")}
					ariaLabel="Enabled unchecked"
				/>
			</Row>
			<Row title="Enabled (checked)">
				<Switch
					checked={checkedMap.enabled_on}
					onCheckedChange={() => toggle("enabled_on")}
					ariaLabel="Enabled checked"
				/>
			</Row>
			<Row title="Disabled (unchecked)">
				<Switch
					checked={false}
					onCheckedChange={() => {}}
					disabled
					ariaLabel="Disabled unchecked"
				/>
			</Row>
			<Row title="Disabled (checked)">
				<Switch
					checked
					onCheckedChange={() => {}}
					disabled
					ariaLabel="Disabled checked"
				/>
			</Row>
			<Row title="With icons (off)">
				<Switch
					checked={checkedMap.icons_off}
					onCheckedChange={() => toggle("icons_off")}
					icons
					thumbContent={checkedMap.icons_off ? <CheckIcon /> : <CloseIcon />}
					ariaLabel="With icons unchecked"
				/>
			</Row>
			<Row title="With icons (on)">
				<Switch
					checked={checkedMap.icons_on}
					onCheckedChange={() => toggle("icons_on")}
					icons
					thumbContent={checkedMap.icons_on ? <CheckIcon /> : <CloseIcon />}
					ariaLabel="With icons checked"
				/>
			</Row>
			<Row title="Selected icon only (off)">
				<Switch
					checked={checkedMap.selected_icon_off}
					onCheckedChange={() => toggle("selected_icon_off")}
					showOnlySelectedIcon
					thumbContent={<CheckIcon />}
					ariaLabel="Selected icon only unchecked"
				/>
			</Row>
			<Row title="Selected icon only (on)">
				<Switch
					checked={checkedMap.selected_icon_on}
					onCheckedChange={() => toggle("selected_icon_on")}
					showOnlySelectedIcon
					thumbContent={<CheckIcon />}
					ariaLabel="Selected icon only checked"
				/>
			</Row>
		</div>
	);
}

// ─── Master Demo ──────────────────────────────────────────────────────────────

/**
 * All switch stories in one scrollable demo page.
 * Used by the docs app to showcase all variants.
 */
export function SwitchDemo() {
	return (
		<div className="flex flex-col gap-10 p-8 max-w-2xl">
			<section>
				<h2 className="text-xl font-semibold mb-4">1. Basic</h2>
				<Basic />
			</section>
			<section>
				<h2 className="text-xl font-semibold mb-4">2. With Label</h2>
				<WithLabel />
			</section>
			<section>
				<h2 className="text-xl font-semibold mb-4">
					3. With Icons (Both States)
				</h2>
				<WithIcons />
			</section>
			<section>
				<h2 className="text-xl font-semibold mb-4">4. Only Selected Icon</h2>
				<WithOnlySelectedIcon />
			</section>
			<section>
				<h2 className="text-xl font-semibold mb-4">5. Disabled (Checked)</h2>
				<DisabledChecked />
			</section>
			<section>
				<h2 className="text-xl font-semibold mb-4">6. Disabled (Unchecked)</h2>
				<DisabledUnchecked />
			</section>
			<section>
				<h2 className="text-xl font-semibold mb-4">7. All States Grid</h2>
				<AllStatesGrid />
			</section>
		</div>
	);
}
