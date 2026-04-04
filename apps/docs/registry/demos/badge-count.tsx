"use client";

import { Badge, BadgedBox, Icon } from "@bug-on/md3-react";

export default function BadgeCountDemo() {
	return (
		<div className="flex flex-wrap items-center gap-8">
			{/* Small count */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge>3</Badge>}>
					<Icon name="mail" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">3 messages</span>
			</div>

			{/* Count at boundary */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge max={99}>99</Badge>}>
					<Icon name="notifications" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">99 (exact)</span>
			</div>

			{/* Count exceeds max → shows "99+" */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge max={99}>150</Badge>}>
					<Icon name="notifications" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">150 → "99+"</span>
			</div>

			{/* Text label "NEW" */}
			<div className="flex flex-col items-center gap-2">
				<BadgedBox badge={<Badge>NEW</Badge>}>
					<Icon name="shopping_cart" size={28} className="text-m3-on-surface" />
				</BadgedBox>
				<span className="text-xs text-m3-on-surface-variant">Text label</span>
			</div>
		</div>
	);
}
