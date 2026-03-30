import { Button } from "@bug-on/md3-react";

export default function ButtonSizes() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<Button size="xs" colorStyle="tonal">
				Extra Small
			</Button>
			<Button size="sm" colorStyle="tonal">
				Small
			</Button>
			<Button size="md" colorStyle="tonal">
				Medium
			</Button>
			<Button size="lg" colorStyle="tonal">
				Large
			</Button>
			<Button size="xl" colorStyle="tonal">
				Extra Large
			</Button>
		</div>
	);
}
