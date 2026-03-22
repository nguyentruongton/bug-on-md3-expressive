import type {
	ComponentPropsWithoutRef,
	ComponentPropsWithRef,
	ElementType,
	ReactNode,
} from "react";

/** MD3 button color variants */
export type MD3ColorStyle =
	| "elevated"
	| "filled"
	| "tonal"
	| "outlined"
	| "text";

/** MD3 Expressive button sizes */
export type MD3Size = "xs" | "sm" | "md" | "lg" | "xl";

/** MD3 shape families */
export type MD3Shape = "round" | "square";

/** Helper: PolyMorphic component ref */
export type PolymorphicRef<C extends ElementType> =
	ComponentPropsWithRef<C>["ref"];

/** Helper: Props cho polymorphic components */
export type PolymorphicProps<C extends ElementType, Props = object> = Props &
	Omit<ComponentPropsWithoutRef<C>, keyof Props> & {
		as?: C;
		children?: ReactNode;
	};
