import { Divider } from "@bug-on/md3-react";

export default function DividerOrientations() {
	return (
		<div className="flex w-full max-w-sm flex-row items-center justify-around gap-8">
			{/* Horizontal Example */}
			<div className="flex w-32 flex-col items-center gap-4">
				<span className="text-sm font-medium text-m3-on-surface-variant">
					Horizontal
				</span>
				<Divider orientation="horizontal" />
			</div>

			{/* Vertical Examples */}
			<div className="flex h-32 flex-row items-center gap-12">
				<div className="flex h-full flex-row items-center gap-4">
					<span className="text-sm font-medium text-m3-on-surface-variant xl:-rotate-90">
						Vertical
					</span>
					<Divider orientation="vertical" />
				</div>
				<div className="flex h-full flex-row items-center gap-4">
					<span className="text-sm font-medium text-m3-on-surface-variant xl:-rotate-90">
						Inset
					</span>
					<Divider orientation="vertical" variant="inset" />
				</div>
			</div>
		</div>
	);
}
