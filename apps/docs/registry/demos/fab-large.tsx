import { FAB, Icon } from "@bug-on/md3-react";

export default function FabLarge() {
	return (
		<FAB
			size="lg"
			colorStyle="tertiary"
			icon={<Icon name="add" />}
			aria-label="Thêm mới (large)"
		/>
	);
}
