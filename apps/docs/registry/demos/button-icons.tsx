import { Button } from "@bug-on/md3-react";
import { Plus, Send, Trash2 } from "lucide-react";

export default function ButtonWithIcons() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<Button colorStyle="filled" icon={<Plus className="w-5 h-5" />}>
				Leading Icon
			</Button>
			<Button
				colorStyle="tonal"
				icon={<Send className="w-5 h-5" />}
				iconPosition="trailing"
			>
				Trailing Icon
			</Button>
			<Button colorStyle="outlined" icon={<Trash2 className="w-5 h-5" />}>
				Delete
			</Button>
		</div>
	);
}
