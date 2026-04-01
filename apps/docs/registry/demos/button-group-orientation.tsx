"use client";

import { Button, ButtonGroup, Icon } from "@bug-on/md3-react";
import React from "react";

export default function ButtonGroupOrientationDemo() {
	const [selectedView, setSelectedView] = React.useState("List");

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
			<div className="p-8 flex flex-col items-center gap-6 border border-m3-outline-variant rounded-xl bg-m3-surface-container-lowest">
				<h3 className="text-sm font-bold text-m3-on-surface-variant uppercase tracking-wider">
					Vertical Standard
				</h3>
				<ButtonGroup orientation="vertical" className="w-full max-w-60">
					<Button
						colorStyle="outlined"
						className="justify-start"
						icon={<Icon name="add" size={16} />}
					>
						New Task
					</Button>
					<Button
						colorStyle="outlined"
						className="justify-start"
						icon={<Icon name="check" size={16} />}
					>
						Mark Done
					</Button>
					<Button
						colorStyle="tonal"
						className="justify-start"
						icon={<Icon name="close" size={16} />}
					>
						Dismiss
					</Button>
				</ButtonGroup>
			</div>

			<div className="p-8 flex flex-col items-center gap-6 border border-m3-outline-variant rounded-xl bg-m3-surface-container-lowest">
				<h3 className="text-sm font-bold text-m3-on-surface-variant uppercase tracking-wider">
					Vertical Connected
				</h3>
				<ButtonGroup
					variant="connected"
					orientation="vertical"
					className="w-40"
				>
					{["List", "Grid", "Calendar"].map((view) => (
						<Button
							key={view}
							variant="toggle"
							selected={selectedView === view}
							onClick={() => setSelectedView(view)}
							className="justify-start"
						>
							{view}
						</Button>
					))}
				</ButtonGroup>
			</div>
		</div>
	);
}
