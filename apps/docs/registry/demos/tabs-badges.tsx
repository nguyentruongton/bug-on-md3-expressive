/**
 * @file tabs-badges.tsx
 * Demo: Tabs with Badges — showing various badge types and positions.
 */

"use client";

import { Badge, Icon, Tab, Tabs, TabsContent, TabsList } from "@bug-on/md3-react";
import * as React from "react";

export default function TabsBadgesDemo() {
	const [activeTab, setActiveTab] = React.useState("mail");

	return (
		<div className="relative w-full rounded-md border border-m3-outline-variant overflow-hidden bg-m3-surface">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList variant="primary" scrollable={false} aria-label="Notifications">
					{/* Stacked Icon + Count Badge */}
					<Tab
						value="mail"
						icon={<Icon name="mail" className="size-6" />}
						badge={<Badge>12</Badge>}
					>
						Mail
					</Tab>

					{/* Stacked Icon + Dot Badge */}
					<Tab
						value="chat"
						icon={<Icon name="chat" className="size-6" />}
						badge={<Badge />}
					>
						Chat
					</Tab>

					{/* Text only + Large count badge */}
					<Tab
						value="updates"
						badge={<Badge max={99}>150</Badge>}
					>
						Updates
					</Tab>

					{/* Inline icon + Badge */}
					<Tab
						value="events"
						icon={<Icon name="event" className="size-5" />}
						inlineIcon={true}
						badge={<Badge>New</Badge>}
					>
						Events
					</Tab>
				</TabsList>

				<div className="p-6">
					<TabsContent value="mail">
						<p className="text-body-md text-m3-on-surface-variant">Check your recent emails. You have 12 unread.</p>
					</TabsContent>
					<TabsContent value="chat">
						<p className="text-body-md text-m3-on-surface-variant">Unread messages in your active chats.</p>
					</TabsContent>
					<TabsContent value="updates">
						<p className="text-body-md text-m3-on-surface-variant">System updates and notifications (over 99+).</p>
					</TabsContent>
					<TabsContent value="events">
						<p className="text-body-md text-m3-on-surface-variant">New upcoming events in your calendar.</p>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
