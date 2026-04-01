import { FAB, Icon } from "@bug-on/md3-react";

export default function FabLowered() {
	return (
		<FAB
			lowered
			colorStyle="primary"
			icon={<Icon name="edit" />}
			aria-label="Chỉnh sửa (lowered)"
		/>
	);
}
