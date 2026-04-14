import { Button, PlainTooltip, TooltipBox } from "@bug-on/md3-react";

export default function TooltipAccessibility() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-12">
			<div className="max-w-md space-y-4 rounded-xl border border-outline-variant p-6 text-center">
				<h3 className="text-lg font-bold text-on-surface">
					Accessibility Audit (A11y)
				</h3>
				<p className="text-sm text-secondary">
					Use the <strong>Tab</strong> key to navigate focus to the button
					below. The tooltip will automatically appear. Press{" "}
					<strong>Escape</strong> to close.
				</p>
				<div className="flex justify-center gap-4 py-4">
					<TooltipBox
						tooltip={<PlainTooltip>Confirm subscription</PlainTooltip>}
					>
						<Button colorStyle="filled">Subscribe Now</Button>
					</TooltipBox>

					<TooltipBox
						tooltip={
							<PlainTooltip caret={{ enabled: true }}>
								Cancel and return
							</PlainTooltip>
						}
					>
						<Button colorStyle="text">Cancel</Button>
					</TooltipBox>
				</div>
				<ul className="list-inside list-disc text-left text-xs text-secondary-container">
					<li>role="tooltip" for content section</li>
					<li>aria-describedby links anchor and tooltip</li>
					<li>Keyboard dismiss support via ESC</li>
					<li>Graceful focus/blur management</li>
				</ul>
			</div>
		</div>
	);
}
