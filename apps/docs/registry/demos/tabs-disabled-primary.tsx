/**
 * @file tabs-disabled-primary.tsx
 * Demo: Primary Tabs with disabled state and text-only (no icon).
 */

"use client";

import { Tab, Tabs, TabsContent, TabsList } from "@bug-on/md3-react";
import * as React from "react";

export default function TabsDisabledPrimaryDemo() {
	const [activeTab, setActiveTab] = React.useState("overview");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<p className="px-4 pt-4 pb-0 text-sm font-medium text-m3-on-surface-variant">
				Primary · Text-only · Disabled tab
			</p>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList
					variant="primary"
					scrollable={false}
					aria-label="Product sections"
				>
					<Tab value="overview">Overview</Tab>
					<Tab value="specs">Specifications</Tab>
					<Tab value="reviews" disabled>
						Reviews
					</Tab>
				</TabsList>

				<TabsContent value="overview" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Product Overview
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							A high-level summary of the product features, benefits, and use
							cases.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="specs" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Technical Specifications
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Detailed dimensions, materials, and technical requirements.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
