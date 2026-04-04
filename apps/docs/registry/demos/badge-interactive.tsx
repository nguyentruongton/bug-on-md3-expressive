"use client";

import { Badge, BadgedBox, Button, Icon } from "@bug-on/md3-react";
import * as React from "react";

export default function BadgeInteractiveDemo() {
	const [count, setCount] = React.useState(0);

	return (
		<div className="flex flex-col items-center gap-6">
			<div className="flex items-center gap-8">
				<BadgedBox
					badge={
						count > 0 ? (
							<Badge max={99} key="badge">
								{count}
							</Badge>
						) : null
					}
				>
					<Icon name="notifications" size={32} className="text-m3-on-surface" />
				</BadgedBox>

				<BadgedBox
					badge={
						count > 0 ? <Badge key="dot" aria-label={`${count} items`} /> : null
					}
				>
					<Icon name="mail" size={32} className="text-m3-on-surface" />
				</BadgedBox>
			</div>

			<div className="flex gap-3">
				<Button
					colorStyle="tonal"
					onClick={() => setCount((c) => Math.max(0, c - 1))}
					icon={<Icon name="remove" />}
					aria-label="Giảm số"
				>
					Giảm
				</Button>

				<Button
					colorStyle="filled"
					onClick={() => setCount((c) => c + 1)}
					icon={<Icon name="add" />}
					aria-label="Thêm thông báo"
				>
					Thêm thông báo
				</Button>

				<Button
					colorStyle="outlined"
					onClick={() => setCount(0)}
					aria-label="Xoá tất cả"
				>
					Xoá
				</Button>
			</div>

			<p className="text-sm text-m3-on-surface-variant">
				Count: <strong className="text-m3-on-surface">{count}</strong>
				{count > 99 && " (hiển thị: 99+)"}
			</p>
		</div>
	);
}
