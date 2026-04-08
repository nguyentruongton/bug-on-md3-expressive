/**
 * @file snackbar/index.ts
 * Barrel re-export for the MD3 Expressive Snackbar component system.
 */
export type {
	SnackbarData,
	SnackbarDuration,
	SnackbarHostProps,
	SnackbarProps,
	SnackbarResult,
	SnackbarVisuals,
	UseSnackbarStateReturn,
} from "./snackbar";
export {
	Snackbar,
	SnackbarHost,
	SnackbarProvider,
	useSnackbar,
	useSnackbarState,
} from "./snackbar";
