import { Button, Card } from "@bug-on/md3-react";
import { Image as ImageIcon } from "lucide-react";

export default function CardVariants() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
			{/* Elevated */}
			<Card variant="elevated" className="flex flex-col">
				<div className="h-28 bg-m3-primary-container/30 flex items-center justify-center text-m3-primary mb-4 rounded-t-m3-lg">
					<ImageIcon className="w-8 h-8 opacity-50" />
				</div>
				<div className="px-6 pb-6 flex flex-col flex-1">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Elevated
					</h3>
					<p className="text-m3-on-surface-variant text-sm mb-6 flex-1">
						Uses shadow to create depth and separation from the background.
					</p>
					<div className="flex gap-2 justify-end">
						<Button colorStyle="tonal">Explore</Button>
					</div>
				</div>
			</Card>

			{/* Filled */}
			<Card variant="filled" className="flex flex-col">
				<div className="h-28 bg-m3-secondary-container/30 flex items-center justify-center text-m3-secondary mb-4 rounded-t-m3-lg">
					<ImageIcon className="w-8 h-8 opacity-50" />
				</div>
				<div className="px-6 pb-6 flex flex-col flex-1">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Filled
					</h3>
					<p className="text-m3-on-surface-variant text-sm mb-6 flex-1">
						Uses a surface color fill for subtle contrast and emphasis.
					</p>
					<div className="flex gap-2 justify-end">
						<Button colorStyle="tonal">Explore</Button>
					</div>
				</div>
			</Card>

			{/* Outlined */}
			<Card variant="outlined" className="flex flex-col">
				<div className="h-28 bg-m3-surface-variant/20 border-b border-m3-outline-variant flex items-center justify-center mb-4 rounded-t-m3-lg">
					<ImageIcon className="w-8 h-8 opacity-50" />
				</div>
				<div className="px-6 pb-6 flex flex-col flex-1">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Outlined
					</h3>
					<p className="text-m3-on-surface-variant text-sm mb-6 flex-1">
						Clean boundary with no elevation or fill — lowest visual emphasis.
					</p>
					<div className="flex gap-2 justify-end">
						<Button colorStyle="tonal">Explore</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
