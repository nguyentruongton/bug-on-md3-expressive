import { Divider } from "@bug-on/md3-react";

export default function DividerVariants() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-8">
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-m3-on-surface-variant">Full-bleed</span>
				<Divider variant="full-bleed" />
			</div>
			
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-m3-on-surface-variant">Inset</span>
				<Divider variant="inset" />
			</div>
			
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-m3-on-surface-variant">Middle-inset</span>
				<Divider variant="middle-inset" />
			</div>
			
			<div className="flex flex-col">
				<Divider variant="subheader" />
				<span className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-m3-on-surface-variant">
					Settings
				</span>
			</div>
		</div>
	);
}
