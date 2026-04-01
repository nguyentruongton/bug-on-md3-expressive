import { Button, Icon } from "@bug-on/md3-react";

export default function ButtonWithIcons() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<Button colorStyle="filled" icon={<Icon name="add" size={20} />}>
				Leading Icon
			</Button>
			<Button
				colorStyle="tonal"
				icon={<Icon name="send" size={20} />}
				iconPosition="trailing"
			>
				Trailing Icon
			</Button>
			<Button colorStyle="outlined" icon={<Icon name="delete" size={20} />}>
				Delete
			</Button>
		</div>
	);
}
