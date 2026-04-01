"use client";

import { Icon, IconButton } from "@bug-on/md3-react";

export default function IconButtonSizesDemo() {
	return (
		<div className="flex flex-col gap-8">
			<p className="text-sm text-m3-on-surface-variant max-w-2xl">
				5 sizes following MD3 Expressive ContainerHeight tokens. Each size has a
				precisely calibrated icon size and corner radius.
			</p>

			<div className="flex flex-wrap items-end gap-6 mb-8">
				{(
					[
						{
							size: "xs",
							label: "XS\n32dp / icon 20dp",
							colorStyle: "filled",
						},
						{
							size: "sm",
							label: "SM\n40dp / icon 24dp",
							colorStyle: "filled",
						},
						{
							size: "md",
							label: "MD\n56dp / icon 24dp",
							colorStyle: "filled",
						},
						{
							size: "lg",
							label: "LG\n96dp / icon 32dp",
							colorStyle: "filled",
						},
						{
							size: "xl",
							label: "XL\n136dp / icon 40dp",
							colorStyle: "filled",
						},
					] as const
				).map(({ size, label, colorStyle }) => (
					<div key={size} className="flex flex-col items-center gap-2">
						<IconButton
							aria-label={`Size ${size.toUpperCase()}`}
							colorStyle={colorStyle}
							size={size}
						>
							<Icon name="favorite" />
						</IconButton>
						<span className="text-xs text-m3-on-surface-variant text-center whitespace-pre-line">
							{label}
						</span>
					</div>
				))}
			</div>

			<div className="border-t border-m3-surface-variant pt-6">
				<p className="text-xs font-medium text-m3-primary uppercase tracking-wider mb-4">
					Touch target: xs & sm have 48×48dp minimum (WCAG 2.5.5)
				</p>
				<div className="flex flex-wrap items-center gap-4">
					<IconButton
						aria-label="XS touch target"
						size="xs"
						colorStyle="outlined"
					>
						<Icon name="settings" />
					</IconButton>
					<span className="text-xs text-m3-on-surface-variant italic">
						← 32dp button, 48dp tap area
					</span>
				</div>
			</div>
		</div>
	);
}
