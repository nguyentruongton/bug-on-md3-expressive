/**
 * @file tabs-secondary.tsx
 * Demo: Secondary Tabs (Fixed layout) — text-only variant with divider.
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

export default function TabsSecondaryDemo() {
	const [activeTab, setActiveTab] = React.useState("all");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList
					variant="secondary"
					scrollable={false}
					aria-label="Inbox filter"
				>
					<Tab value="all">All</Tab>
					<Tab value="unread" badge={<Badge>12</Badge>}>
						Unread
					</Tab>
					<Tab
						value="starred"
						icon={<Icon name="star" className="size-5" />}
						inlineIcon={true}
						badge={<Badge />}
					>
						Starred
					</Tab>
					<Tab value="sent">Sent</Tab>
				</TabsList>

				<TabsContent value="all" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							All Messages
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							Showing all 128 messages in your inbox.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="unread" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Unread Messages
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							You have 12 unread messages.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="starred" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Starred Messages
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							5 messages have been starred for quick access.
						</p>
					</div>
				</TabsContent>

				<TabsContent value="sent" className="p-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-title-md font-semibold text-m3-on-surface">
							Sent Messages
						</h3>
						<p className="text-body-md text-m3-on-surface-variant">
							View all messages you have sent.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
