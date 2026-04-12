import { Button, PlainTooltip, TooltipBox } from "@bug-on/md3-react";

export default function TooltipInteraction() {
	return (
		<div className="flex flex-col items-center justify-center gap-12 py-12">
			<div className="flex flex-wrap items-center justify-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium text-secondary">
						Hover (Default)
					</span>
					<TooltipBox
						tooltip={<PlainTooltip>Triggered by Hover</PlainTooltip>}
						trigger={["hover"]}
					>
						<Button colorStyle="outlined">Hover me</Button>
					</TooltipBox>
				</div>

				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium text-secondary">Focus</span>
					<TooltipBox
						tooltip={<PlainTooltip>Triggered on Focus (Tab)</PlainTooltip>}
						trigger={["focus"]}
					>
						<Button colorStyle="outlined">Focus me</Button>
					</TooltipBox>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium text-secondary">Click</span>
					<TooltipBox
						tooltip={
							<PlainTooltip caret={{ enabled: true }}>
								Triggered by Click
							</PlainTooltip>
						}
						trigger={["click"]}
					>
						<Button colorStyle="tonal">Click me</Button>
					</TooltipBox>
				</div>

				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium text-secondary">
						Long Press (Mobile)
					</span>
					<TooltipBox
						tooltip={<PlainTooltip>Long press 500ms to view</PlainTooltip>}
						trigger={["long-press"]}
					>
						<Button colorStyle="filled">Long press</Button>
					</TooltipBox>
				</div>
			</div>
		</div>
	);
}
