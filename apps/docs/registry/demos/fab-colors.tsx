"use client";

import { FAB, Icon } from "@bug-on/md3-react";

const COLOR_VARIANTS = [
	{ colorStyle: "primary", label: "Primary" },
	{ colorStyle: "secondary", label: "Secondary" },
	{ colorStyle: "tertiary", label: "Tertiary" },
	{ colorStyle: "surface", label: "Surface" },
] as const;

const ICONS = ["edit", "add", "share", "star"];

export default function FabColors() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-6">
			{COLOR_VARIANTS.map(({ colorStyle, label }, i) => {
				const iconName = ICONS[i];
				return (
					<div key={colorStyle} className="flex flex-col items-center gap-2">
						<FAB
							colorStyle={colorStyle}
							icon={<Icon name={iconName} />}
							aria-label={label}
						/>
						<span className="text-xs text-m3-on-surface-variant">{label}</span>
					</div>
				);
			})}
		</div>
	);
}
