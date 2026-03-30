import { FAB } from "@bug-on/md3-react";
import { Plus } from "lucide-react";

export default function FabLarge() {
	return (
		<FAB
			size="lg"
			colorStyle="tertiary"
			icon={<Plus />}
			aria-label="Thêm mới (large)"
		/>
	);
}
