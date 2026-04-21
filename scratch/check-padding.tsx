import { render } from "@testing-library/react";
import {
	Menu,
	MenuContent,
	MenuGroup,
	MenuItem,
	MenuTrigger,
} from "../../packages/react/src/ui/menu";
import { ThemeProvider } from "../../packages/react/src/ui/theme";

const Demo = () => (
	<ThemeProvider>
		<Menu menuVariant="baseline" defaultOpen>
			<MenuTrigger>Trigger</MenuTrigger>
			<MenuContent>
				<MenuGroup index={0} count={1}>
					<MenuItem>Default Corners</MenuItem>
				</MenuGroup>
			</MenuContent>
		</Menu>
	</ThemeProvider>
);

const { container, debug } = render(<Demo />);
console.log(document.body.innerHTML);
