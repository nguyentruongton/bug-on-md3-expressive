import { render } from "@testing-library/react";
import {
	Menu,
	MenuContent,
	MenuGroup,
	MenuItem,
} from "../../packages/react/src/ui/menu";

const Demo = () => (
	<Menu menuVariant="baseline" defaultOpen>
		<MenuContent>
			<MenuGroup index={0} count={1}>
				<MenuItem>Test</MenuItem>
			</MenuGroup>
		</MenuContent>
	</Menu>
);

const { container } = render(<Demo />);
console.log(container.innerHTML);
