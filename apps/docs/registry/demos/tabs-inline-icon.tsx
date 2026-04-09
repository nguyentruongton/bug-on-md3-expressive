/**
 * @file tabs-inline-icon.tsx
 * Demo: Tabs with Inline Icons — keeping 48dp height with icons.
 */

"use client";

import { Icon, Tab, Tabs, TabsContent, TabsList } from "@bug-on/md3-react";
import * as React from "react";

export default function TabsInlineIconDemo() {
	const [activeTab, setActiveTab] = React.useState("home");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList variant="primary" scrollable={false} aria-label="Navigation">
					<Tab
						value="home"
						icon={<Icon name="home" className="size-5" />}
						inlineIcon={true}
					>
						Home
					</Tab>
					<Tab
						value="search"
						icon={<Icon name="search" className="size-5" />}
						inlineIcon={true}
					>
						Search
					</Tab>
					<Tab
						value="settings"
						icon={<Icon name="settings" className="size-5" />}
						inlineIcon={true}
					>
						Settings
					</Tab>
				</TabsList>

				<div className="p-6">
					<TabsContent value="home">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Home
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Welcome back to the dashboard.
						</p>
					</TabsContent>
					<TabsContent value="search">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Search
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Quickly find help or documents.
						</p>
					</TabsContent>
					<TabsContent value="settings">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Settings
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Manage your account preferences.
						</p>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
