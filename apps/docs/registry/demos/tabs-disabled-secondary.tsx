/**
 * @file tabs-disabled-secondary.tsx
 * Demo: Secondary Tabs with disabled state and Icon + Label variant.
 */

"use client";

import { Icon, Tab, Tabs, TabsContent, TabsList } from "@bug-on/md3-react";
import * as React from "react";

export default function TabsDisabledSecondaryDemo() {
	const [activeTab, setActiveTab] = React.useState("details");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<p className="px-4 pt-4 pb-0 text-sm font-medium text-m3-on-surface-variant">
				Secondary · Icon + Label · Disabled tab
			</p>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList variant="secondary" scrollable={false} aria-label="Account settings">
					<Tab value="details" icon={<Icon name="person" className="size-6" />}>
						Details
					</Tab>
					<Tab value="security" icon={<Icon name="lock" className="size-6" />}>
						Security
					</Tab>
					<Tab
						value="billing"
						icon={<Icon name="credit_card" className="size-6" />}
						disabled
					>
						Billing
					</Tab>
				</TabsList>

				<TabsContent value="details" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Account Details
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Manage your personal information and profile settings.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="security" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Security Settings
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Update your password and two-factor authentication preferences.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
