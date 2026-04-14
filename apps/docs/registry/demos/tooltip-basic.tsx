import { Button, PlainTooltip, TooltipBox } from "@bug-on/md3-react";

export default function TooltipBasic() {
	return (
		<div className="flex flex-col items-center justify-center gap-12 py-12">
			<div className="flex flex-wrap items-center justify-center gap-8">
				<TooltipBox
					tooltip={<PlainTooltip>Save changes</PlainTooltip>}
					placement="top"
				>
					<Button colorStyle="filled">Hover Top</Button>
				</TooltipBox>

				<TooltipBox
					tooltip={<PlainTooltip>Delete item</PlainTooltip>}
					placement="bottom"
				>
					<Button colorStyle="tonal">Hover Bottom</Button>
				</TooltipBox>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-8">
				<TooltipBox
					tooltip={
						<PlainTooltip caret={{ enabled: true }}>
							Account settings
						</PlainTooltip>
					}
					placement="left"
				>
					<Button colorStyle="outlined">Hover Left (Caret)</Button>
				</TooltipBox>

				<TooltipBox
					tooltip={
						<PlainTooltip caret={{ enabled: true }}>Help center</PlainTooltip>
					}
					placement="right"
				>
					<Button colorStyle="outlined">Hover Right (Caret)</Button>
				</TooltipBox>
			</div>
		</div>
	);
}
