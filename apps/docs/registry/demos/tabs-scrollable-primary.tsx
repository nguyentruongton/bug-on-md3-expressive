/**
 * @file tabs-scrollable-primary.tsx
 * Demo: Scrollable Tabs — Primary variant.
 * Shows horizontal overflow scroll and 52px edge padding per MD3 spec.
 */

"use client";

import { Icon, Tab, Tabs, TabsContent, TabsList } from "@bug-on/md3-react";
import * as React from "react";

const MUSIC_TABS = [
	{ value: "pop", label: "Pop", icon: "music_note" },
	{ value: "rock", label: "Rock", icon: "cadence" },
	{ value: "jazz", label: "Jazz", icon: "piano" },
	{ value: "classical", label: "Classical", icon: "queue_music" },
	{ value: "hiphop", label: "Hip-Hop", icon: "headphones" },
	{ value: "electronic", label: "Electronic", icon: "equalizer" },
	{ value: "country", label: "Country", icon: "eda" },
] as const;

export default function TabsScrollablePrimaryDemo() {
	const [activeTab, setActiveTab] = React.useState("pop");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<p className="px-4 pt-4 pb-0 text-sm font-medium text-m3-on-surface-variant">
				Primary · Scrollable
			</p>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList variant="primary" scrollable={true} aria-label="Music genres">
					{MUSIC_TABS.map(({ value, label, icon }) => (
						<Tab
							key={value}
							value={value}
							icon={<Icon name={icon} className="size-6" />}
						>
							{label}
						</Tab>
					))}
				</TabsList>

				{MUSIC_TABS.map(({ value, label }) => (
					<TabsContent key={value} value={value} className="p-6">
						<p className="text-body-md text-m3-on-surface-variant">
							Browsing <strong className="text-m3-on-surface">{label}</strong>{" "}
							tracks and albums.
						</p>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
