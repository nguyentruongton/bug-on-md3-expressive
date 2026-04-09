/**
 * @file tabs-primary.tsx
 * Demo: Primary Tabs (Fixed layout) — icon + label variant.
 */

"use client";

import {
	Badge,
	Icon,
	Tab,
	Tabs,
	TabsContent,
	TabsList,
} from "@bug-on/md3-react";
import * as React from "react";

export default function TabsPrimaryDemo() {
	const [activeTab, setActiveTab] = React.useState("flights");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList
					variant="primary"
					scrollable={false}
					aria-label="Travel sections"
				>
					<Tab
						value="flights"
						icon={<Icon name="flight" className="size-6" />}
						badge={<Badge>3</Badge>}
					>
						Flights
					</Tab>
					<Tab value="trips" icon={<Icon name="luggage" className="size-6" />}>
						Trips
					</Tab>
					<Tab
						value="explore"
						icon={<Icon name="travel_explore" className="size-6" />}
					>
						Explore
					</Tab>
				</TabsList>

				<TabsContent value="flights" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Available Flights
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Browse and book flights to your destination. Search by date,
							price, and airline.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="trips" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Your Trips
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							View and manage your upcoming and past trips. Access boarding
							passes and itineraries.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="explore" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Explore Destinations
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Discover popular destinations and travel inspiration curated for
							you.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
