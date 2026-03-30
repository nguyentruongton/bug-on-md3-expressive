"use client";

import { Button, ButtonGroup } from "@bug-on/md3-react";
import React from "react";

export default function ButtonGroupConnectedDemo() {
	const [selectedDay, setSelectedDay] = React.useState("Day");

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-4">
			<div className="flex flex-col items-center gap-4 w-full">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Default Size (sm) - Inner Radius: 8px
				</span>
				<div className="w-full overflow-x-auto pb-2 flex justify-start md:justify-center">
					<ButtonGroup variant="connected" showCheck className="min-w-max">
						{["Day", "Week", "Month", "Year"].map((item) => (
							<Button
								key={`sm-${item}`}
								variant="toggle"
								selected={selectedDay === item}
								onClick={() => setSelectedDay(item)}
							>
								{item}
							</Button>
						))}
					</ButtonGroup>
				</div>
			</div>

			<div className="flex flex-col items-center gap-4 w-full mt-8">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Large Size (lg) - Inner Radius: 16px
				</span>
				<div className="w-full overflow-x-auto pb-2 flex justify-start md:justify-center">
					<ButtonGroup
						variant="connected"
						size="lg"
						showCheck
						className="min-w-max"
					>
						{["Day", "Week", "Month", "Year"].map((item) => (
							<Button
								key={`lg-${item}`}
								variant="toggle"
								selected={selectedDay === item}
								onClick={() => setSelectedDay(item)}
							>
								{item}
							</Button>
						))}
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
}
