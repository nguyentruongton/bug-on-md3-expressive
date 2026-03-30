"use client";

import { Icon } from "@bug-on/md3-react";

export default function IconTailwind() {
	return (
		<div className="flex flex-col gap-8 p-6 items-center">
			<div className="flex gap-6 items-center flex-wrap justify-center text-m3-primary">
				{/* By default we can override properties with Tailwind arbitrary properties or custom variables */}
				<div className="flex flex-col items-center gap-2">
					<Icon
						className="text-m3-primary [--md-icon-variant:'Material_Symbols_Outlined']"
						name="search"
					/>
					<span className="text-xs text-m3-on-surface-variant font-mono">
						--md-icon-variant
					</span>
				</div>

				<div className="flex flex-col items-center gap-2">
					{/* Note: In tailwind v4 plugin we added `icon-fill`, `icon-weight`, etc. */}
					<Icon className="text-m3-secondary icon-fill" name="notifications" />
					<span className="text-xs text-m3-on-surface-variant font-mono">
						icon-fill
					</span>
				</div>

				<div className="flex flex-col items-center gap-2">
					<Icon className="text-m3-tertiary icon-weight-700" name="warning" />
					<span className="text-xs text-m3-on-surface-variant font-mono">
						icon-weight-700
					</span>
				</div>

				<div className="flex flex-col items-center gap-2">
					<Icon className="text-m3-error icon-grade-200" name="error" />
					<span className="text-xs text-m3-on-surface-variant font-mono">
						icon-grade-200
					</span>
				</div>

				<div className="flex flex-col items-center gap-2">
					<Icon className="text-[#3b82f6] icon-size-48" name="info" />
					<span className="text-xs text-m3-on-surface-variant font-mono">
						icon-size-48
					</span>
				</div>
			</div>

			<p className="text-sm text-m3-on-surface-variant max-w-[400px] text-center">
				The component gracefully handles Tailwind CSS variables using the{" "}
				<span className="font-mono text-xs">@bug-on/tailwind</span> plugin
				presets. CSS-based styling overrides React properties when explicitly
				declared.
			</p>
		</div>
	);
}
