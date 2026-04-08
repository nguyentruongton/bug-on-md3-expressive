import { Divider } from "@bug-on/md3-react";

export default function DividerInsets() {
	return (
		<div className="flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-m3-outline-variant/60 bg-m3-surface">
			
			{/* Top group: Standard Inset */}
			<div className="flex flex-col">
				<div className="flex items-center gap-4 py-3 px-4">
					<div className="h-10 w-10 shrink-0 rounded-md bg-m3-secondary-container" />
					<div className="flex flex-col">
						<span className="text-sm font-medium text-m3-on-surface">Standard Item</span>
						<span className="text-xs text-m3-on-surface-variant">Without leading icon</span>
					</div>
				</div>
				
				{/* 16px indent */}
				<Divider variant="inset" insetStart="standard" />
				
				<div className="flex items-center gap-4 py-3 px-4">
					<div className="h-10 w-10 shrink-0 rounded-md bg-m3-secondary-container" />
					<div className="flex flex-col">
						<span className="text-sm font-medium text-m3-on-surface">Standard Item</span>
						<span className="text-xs text-m3-on-surface-variant">Secondary text</span>
					</div>
				</div>
			</div>

			{/* Middle separator between block groups uses full-bleed */}
			<Divider variant="full-bleed" />

			{/* Bottom group: Icon Inset */}
			<div className="flex flex-col">
				<div className="flex items-center gap-4 py-3 px-4">
					<div className="h-10 w-10 shrink-0 rounded-full bg-m3-primary text-m3-on-primary flex items-center justify-center">A</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-m3-on-surface">Avatar or Icon Item</span>
						<span className="text-xs text-m3-on-surface-variant">Leading icon present</span>
					</div>
				</div>
				
				{/* 72px indent */}
				<Divider variant="inset" insetStart="icon" />
				
				<div className="flex items-center gap-4 py-3 px-4">
					<div className="h-10 w-10 shrink-0 rounded-full bg-m3-primary text-m3-on-primary flex items-center justify-center">B</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-m3-on-surface">Avatar or Icon Item</span>
						<span className="text-xs text-m3-on-surface-variant">Secondary text</span>
					</div>
				</div>
			</div>
			
		</div>
	);
}
