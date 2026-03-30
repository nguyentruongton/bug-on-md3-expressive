import { FAB } from "@bug-on/md3-react";
import { Pencil } from "lucide-react";

export default function FabMedium() {
	return (
		<FAB
			size="md"
			colorStyle="secondary"
			icon={<Pencil />}
			aria-label="Chỉnh sửa (medium)"
		/>
	);
}
