/**
 * @file tabs-scrollable-secondary.tsx
 * Demo: Scrollable Tabs — Secondary variant.
 * Shows horizontal overflow scroll and 52px edge padding per MD3 spec.
 */

"use client";

import { Tab, Tabs, TabsContent, TabsList } from "@bug-on/md3-react";
import * as React from "react";

const COUNTRY_TABS = [
	{ value: "vn", label: "Vietnam" },
	{ value: "us", label: "United States" },
	{ value: "jp", label: "Japan" },
	{ value: "kr", label: "South Korea" },
	{ value: "gb", label: "United Kingdom" },
	{ value: "de", label: "Germany" },
	{ value: "fr", label: "France" },
	{ value: "au", label: "Australia" },
] as const;

export default function TabsScrollableSecondaryDemo() {
	const [activeTab, setActiveTab] = React.useState("vn");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<p className="px-4 pt-4 pb-0 text-sm font-medium text-m3-on-surface-variant">
				Secondary · Scrollable
			</p>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList
					variant="secondary"
					scrollable={true}
					aria-label="Countries"
				>
					{COUNTRY_TABS.map(({ value, label }) => (
						<Tab key={value} value={value}>
							{label}
						</Tab>
					))}
				</TabsList>

				{COUNTRY_TABS.map(({ value, label }) => (
					<TabsContent key={value} value={value} className="p-6">
						<p className="text-body-md text-m3-on-surface-variant">
							Showing content for{" "}
							<strong className="text-m3-on-surface">{label}</strong>.
						</p>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
