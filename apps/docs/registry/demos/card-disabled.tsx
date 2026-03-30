import { Card } from "@bug-on/md3-react";

export default function CardDisabled() {
	return (
		<div className="flex flex-wrap items-start justify-center gap-4">
			<Card
				variant="elevated"
				className="p-6 max-w-xs"
				onClick={() => undefined}
				disabled
			>
				<h3 className="font-medium text-m3-on-surface mb-2">
					Disabled Elevated
				</h3>
				<p className="text-sm text-m3-on-surface-variant">
					Cannot interact or receive focus.
				</p>
			</Card>

			<Card variant="filled" className="p-6 max-w-xs" disabled>
				<h3 className="font-medium text-m3-on-surface mb-2">Disabled Filled</h3>
				<p className="text-sm text-m3-on-surface-variant">
					Opacity reduced to 38% with <code>aria-disabled="true"</code>.
				</p>
			</Card>

			<Card
				variant="outlined"
				className="p-6 max-w-xs"
				href="/disabled"
				disabled
			>
				<h3 className="font-medium text-m3-on-surface mb-2">Disabled Link</h3>
				<p className="text-sm text-m3-on-surface-variant">
					<code>href</code> is removed from the DOM when disabled.
				</p>
			</Card>
		</div>
	);
}
