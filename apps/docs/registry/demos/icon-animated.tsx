"use client";

import { Button, Icon } from "@bug-on/md3-react";
import { useState } from "react";

export default function IconAnimated() {
	const [isFilled, setIsFilled] = useState(false);

	return (
		<div className="flex flex-col items-center gap-6 p-6">
			<div className="flex justify-center bg-m3-surface-container-highest p-8 rounded-3xl">
				{/* `animateFill` magically interpolates the --md-icon-fill variable using framer-motion springs */}
				<Icon
					variant="rounded"
					size={48}
					fill={isFilled ? 1 : 0}
					animateFill
					className="text-m3-primary cursor-pointer select-none"
					onClick={() => setIsFilled(!isFilled)}
					name="star"
				/>
			</div>

			<Button onClick={() => setIsFilled(!isFilled)}>Toggle Fill State</Button>

			<p className="text-sm text-m3-on-surface-variant max-w-sm text-center">
				Click the icon or the button above. The{" "}
				<span className="font-mono text-xs p-1 bg-m3-surface-variant rounded">
					animateFill
				</span>{" "}
				prop enables hardware-accelerated spring animations when toggling
				between filled and unfilled states.
			</p>
		</div>
	);
}
