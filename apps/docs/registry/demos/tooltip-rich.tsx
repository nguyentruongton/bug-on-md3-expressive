import { Button, RichTooltip, TooltipBox } from "@bug-on/md3-react";

export default function TooltipRich() {
	return (
		<div className="flex flex-col items-center justify-center gap-12 py-12">
			<TooltipBox
				tooltip={
					<RichTooltip
						title="New Feature"
						action={
							<div className="flex w-full justify-end gap-2 px-2">
								<Button colorStyle="text">Learn more</Button>
							</div>
						}
					>
						Rich tooltips provide additional context for users, potentially
						including titles and interactive action buttons.
					</RichTooltip>
				}
				placement="bottom"
			>
				<Button>Hover me (Rich Tooltip)</Button>
			</TooltipBox>

			<TooltipBox
				tooltip={
					<RichTooltip
						title="Grant Permissions"
						caret={{ enabled: true }}
						action={
							<div className="mt-2 flex w-full justify-end gap-2">
								<Button colorStyle="text">Settings</Button>
								<Button colorStyle="text">Allow</Button>
							</div>
						}
					>
						Rich tooltips can point exactly to elements using a caret. Click
						this button to try the Click trigger example.
					</RichTooltip>
				}
				placement="top"
				trigger={["click"]}
			>
				<Button colorStyle="tonal">Click to view (Rich + Caret)</Button>
			</TooltipBox>
		</div>
	);
}
