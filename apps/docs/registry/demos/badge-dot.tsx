"use client";

import { Badge, BadgedBox, Icon } from "@bug-on/md3-react";

export default function BadgeDotDemo() {
	return (
		<div className="flex flex-wrap items-center gap-8">
			{/* Mail icon with dot badge */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge aria-label="New message" />}>
					<Icon name="mail" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">Mail</span>
			</div>

			{/* Notifications with dot badge */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge aria-label="New notification" />}>
					<Icon name="notifications" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">
					Notifications
				</span>
			</div>

			{/* Chat with dot badge */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge aria-label="New chat" />}>
					<Icon name="chat" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">Chat</span>
			</div>
		</div>
	);
}
