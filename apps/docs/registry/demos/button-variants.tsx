import { Button } from "@bug-on/md3-react";

export default function ButtonVariants() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<Button colorStyle="elevated">Elevated</Button>
			<Button colorStyle="filled">Filled</Button>
			<Button colorStyle="tonal">Tonal</Button>
			<Button colorStyle="outlined">Outlined</Button>
			<Button colorStyle="text">Text</Button>
		</div>
	);
}
