import {
	AlertCircle,
	Bell,
	Calendar,
	CheckSquare,
	CircleDot,
	Clock,
	Columns,
	CreditCard,
	FolderOpen,
	GalleryHorizontal,
	Layers,
	LayoutPanelTop,
	List,
	Loader2,
	Menu,
	MenuSquare,
	MessageCircle,
	MessageSquare,
	Minus,
	MoreHorizontal,
	MoreVertical,
	MousePointerClick,
	PanelBottom,
	PanelLeft,
	PanelRight,
	Plus,
	PlusSquare,
	Radio,
	ScrollText,
	Search,
	SlidersHorizontal,
	SplitSquareHorizontal,
	Tag,
	ToggleRight,
	Type,
	Wrench,
} from "lucide-react";

export const componentCategories = [
	{
		title: "Buttons",
		items: [
			{
				name: "Button groups",
				description:
					"Button groups organize buttons and add interactions between them",
				icon: Layers,
			},
			{
				name: "Buttons",
				description: "Buttons prompt most actions in a UI",
				icon: MousePointerClick,
			},
			{
				name: "Extended FABs",
				description:
					"Extended floating action buttons (extended FABs) help people take primary actions",
				icon: PlusSquare,
			},
			{
				name: "FAB menu",
				description:
					"The floating action button (FAB) menu opens from a FAB to display multiple related actions",
				icon: Menu,
			},
			{
				name: "Floating action buttons (FABs)",
				description:
					"Floating action buttons (FABs) help people take primary actions",
				icon: Plus,
			},
			{
				name: "Icon buttons",
				description: "Icon buttons help people take actions with a single tap",
				icon: CircleDot,
				href: "/components/icon-buttons",
			},
			{
				name: "Segmented buttons",
				description:
					"Segmented buttons help people select options, switch views, or sort elements",
				icon: Columns,
			},
			{
				name: "Split buttons",
				description:
					"Split buttons open a menu to give people more options related to an action",
				icon: SplitSquareHorizontal,
			},
		],
	},
	{
		title: "Date & time pickers",
		items: [
			{
				name: "Date pickers",
				description:
					"Date pickers let people select a date, or a range of dates",
				icon: Calendar,
			},
			{
				name: "Time pickers",
				description: "Time pickers help people select and set a specific time",
				icon: Clock,
			},
		],
	},
	{
		title: "Loading & progress",
		items: [
			{
				name: "Loading indicator",
				description:
					"Loading indicators show the progress of a process for a short wait time",
				icon: Loader2,
				href: "/components/loading-indicator",
			},
			{
				name: "Progress indicators",
				description:
					"Progress indicators show the status of a process in real time",
				icon: MoreHorizontal,
				href: "/components/progress-indicator",
			},
		],
	},
	{
		title: "Navigation",
		items: [
			{
				name: "Navigation bar",
				description:
					"Navigation bars let people switch between UI views on smaller devices",
				icon: PanelBottom,
			},
			{
				name: "Navigation drawer",
				description:
					"Navigation drawers let people switch between UI views on larger devices",
				icon: PanelLeft,
			},
			{
				name: "Navigation rail",
				description:
					"Navigation rails let people switch between UI views on mid-sized devices",
				icon: MoreVertical,
			},
		],
	},
	{
		title: "Sheets",
		items: [
			{
				name: "Bottom sheets",
				description:
					"Bottom sheets show secondary content anchored to the bottom of the screen",
				icon: PanelBottom,
			},
			{
				name: "Side sheets",
				description:
					"Side sheets show secondary content anchored to the side of the screen",
				icon: PanelRight,
			},
		],
	},
	{
		title: "All other components",
		items: [
			{
				name: "App bars",
				description:
					"App bars are placed at the top of the screen to help people navigate through a product",
				icon: LayoutPanelTop,
			},
			{
				name: "Badges",
				description:
					"Badges show notifications, counts, or status information on navigation items and icons",
				icon: Bell,
			},
			{
				name: "Cards",
				description: "Cards display content and actions about a single subject",
				icon: CreditCard,
			},
			{
				name: "Carousel",
				description:
					"Carousels show a collection of items that can be scrolled on and off the screen",
				icon: GalleryHorizontal,
			},
			{
				name: "Checkbox",
				description:
					"Checkboxes let users select one or more items from a list, or turn an item on or off",
				icon: CheckSquare,
			},
			{
				name: "Chips",
				description:
					"Chips help people enter information, make selections, filter content, or trigger actions",
				icon: Tag,
				href: "/components/chips",
			},
			{
				name: "Dialogs",
				description: "Dialogs provide important prompts in a user flow",
				icon: MessageSquare,
				href: "/components/dialogs",
			},
			{
				name: "Divider",
				description:
					"Dividers are thin lines that group content in lists or other containers",
				icon: Minus,
			},
			{
				name: "Lists",
				description:
					"Lists are continuous, vertical indexes of text and images",
				icon: List,
			},
			{
				name: "Menus",
				description: "Menus display a list of choices on a temporary surface",
				icon: MenuSquare,
			},
			{
				name: "Radio button",
				description:
					"Radio buttons let people select one option from a set of options",
				icon: Radio,
			},
			{
				name: "Search",
				description:
					"Search lets people enter a keyword or phrase to get relevant information",
				icon: Search,
			},
			{
				name: "Sliders",
				description:
					"Sliders allow users to make selections from a range of values",
				icon: SlidersHorizontal,
			},
			{
				name: "Snackbar",
				description:
					"Snackbars show short updates about app processes at the bottom of the screen",
				icon: AlertCircle,
			},
			{
				name: "Switch",
				description: "Switches toggle the selection of an item on and off",
				icon: ToggleRight,
			},
			{
				name: "Tabs",
				description: "Tabs organize content across different screens and views",
				icon: FolderOpen,
			},
			{
				name: "Text fields",
				description: "Text fields let users enter text into a UI",
				icon: Type,
			},
			{
				name: "Toolbars",
				description:
					"Toolbars display frequently used actions relevant to the current page",
				icon: Wrench,
			},
			{
				name: "Scroll Area",
				description:
					"Scroll areas provide custom, cross-browser scrollbars for overflowing content",
				icon: ScrollText,
				href: "/components/scroll-area",
			},
			{
				name: "Tooltips",
				description: "Tooltips display brief labels or messages",
				icon: MessageCircle,
			},
		],
	},
];
