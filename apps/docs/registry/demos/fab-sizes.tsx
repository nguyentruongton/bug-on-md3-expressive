"use client";

import { FAB } from "@bug-on/md3-react";
import { Pencil } from "lucide-react";

export default function FabSizes() {
	return (
		<div className="flex flex-wrap items-end justify-center gap-8">
			{(["sm", "md", "lg", "xl"] as const).map((size) => (
				<div key={size} className="flex flex-col items-center gap-3">
					<FAB
						size={size}
						icon={<Pencil />}
						aria-label={`FAB kích thước ${size}`}
					/>
					<span className="text-xs text-m3-on-surface-variant capitalize">
						{size.toUpperCase()} (
						{size === "sm"
							? "40dp"
							: size === "md"
								? "56dp"
								: size === "lg"
									? "96dp"
									: "136dp"}
						)
					</span>
				</div>
			))}
		</div>
	);
}
