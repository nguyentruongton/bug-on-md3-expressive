import { Divider } from "@bug-on/md3-react";

export default function DividerShapes() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-8">
			<div className="flex flex-col gap-4">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Flat (Default)
				</span>
				<Divider shape="flat" />
			</div>

			<div className="flex flex-col gap-4">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Wavy (Smooth Default)
				</span>
				{/* Now uses new expressive defaults: amplitude 1.5, wavelength 32 */}
				<Divider shape="wavy" />
			</div>

			<div className="flex flex-col gap-4">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Wavy (Compact)
				</span>
				<Divider shape="wavy" waveConfig={{ amplitude: 2, wavelength: 32 }} />
			</div>

			<div className="flex flex-col gap-4">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Wavy (Thick)
				</span>
				<Divider
					shape="wavy"
					waveConfig={{ amplitude: 4, wavelength: 40, strokeWidth: 4 }}
				/>
			</div>
		</div>
	);
}
