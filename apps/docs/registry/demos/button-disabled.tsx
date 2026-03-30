import { Button } from "@bug-on/md3-react";

export default function ButtonDisabled() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<Button colorStyle="elevated" disabled>
				Elevated
			</Button>
			<Button colorStyle="filled" disabled>
				Filled
			</Button>
			<Button colorStyle="tonal" disabled>
				Tonal
			</Button>
			<Button colorStyle="outlined" disabled>
				Outlined
			</Button>
			<Button colorStyle="text" disabled>
				Text
			</Button>
		</div>
	);
}
