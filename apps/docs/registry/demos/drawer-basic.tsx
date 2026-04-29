import {
	Button,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
	Icon,
} from "@bug-on/md3-react";
import * as React from "react";

export default function DrawerBasicDemo() {
	const [open, setOpen] = React.useState(false);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button colorStyle="filled" icon={<Icon name="expand_less" />}>
					Open Drawer
				</Button>
			</DrawerTrigger>
			<DrawerPortal open={open}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Expressive Drawer</DrawerTitle>
						<DrawerDescription>
							This bottom sheet uses spring-based "Emphasized" motion and
							adheres to MD3 design standards.
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex flex-col gap-4 py-2">
						<div className="rounded-m3-medium bg-m3-surface-container p-4">
							<p className="text-m3-on-surface">
								Drawers are ideal for mobile-first interfaces. They provide
								supplemental content without losing the context of the current
								screen.
							</p>
						</div>

						<div className="flex items-center gap-3 px-1">
							<Icon name="info" className="text-m3-primary" />
							<span className="text-sm text-m3-on-surface-colorStyle">
								Try dragging the handle or clicking the scrim to close.
							</span>
						</div>
					</div>

					<DrawerFooter>
						<Button className="w-full" onClick={() => setOpen(false)}>
							Understand
						</Button>
						<Button
							colorStyle="text"
							className="w-full"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	);
}
