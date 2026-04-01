import { FAB, Icon } from "@bug-on/md3-react";

export default function FabMedium() {
	return (
		<FAB
			size="md"
			colorStyle="secondary"
			icon={<Icon name="edit" />}
			aria-label="Chỉnh sửa (medium)"
		/>
	);
}
