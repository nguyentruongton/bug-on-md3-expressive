import { FAB } from "@bug-on/md3-react";
import { Pencil } from "lucide-react";

export default function FabLowered() {
	return (
		<FAB
			lowered
			colorStyle="primary"
			icon={<Pencil />}
			aria-label="Chỉnh sửa (lowered)"
		/>
	);
}
