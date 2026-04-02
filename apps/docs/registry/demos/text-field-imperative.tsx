"use client";

import type { TextFieldHandle } from "@bug-on/md3-react";
import { TextField } from "@bug-on/md3-react";
import * as React from "react";

export default function TextFieldImperativeDemo() {
	const ref = React.useRef<TextFieldHandle>(null);
	const [log, setLog] = React.useState<string[]>([]);

	const addLog = (msg: string) =>
		setLog((prev) => [`→ ${msg}`, ...prev].slice(0, 5));

	return (
		<div className="flex flex-col gap-5 w-full max-w-sm">
			<TextField
				ref={ref}
				label="Imperative control"
				defaultValue="Edit me"
				supportingText="Use the buttons below to control this field"
			/>

			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => {
						ref.current?.focus();
						addLog("focus()");
					}}
					className="px-4 py-2 rounded-full bg-m3-primary text-m3-on-primary text-sm font-medium"
				>
					Focus
				</button>
				<button
					type="button"
					onClick={() => {
						ref.current?.blur();
						addLog("blur()");
					}}
					className="px-4 py-2 rounded-full bg-m3-secondary-container text-m3-on-secondary-container text-sm font-medium"
				>
					Blur
				</button>
				<button
					type="button"
					onClick={() => {
						ref.current?.clear();
						addLog("clear()");
					}}
					className="px-4 py-2 rounded-full bg-m3-error-container text-m3-on-error-container text-sm font-medium"
				>
					Clear
				</button>
				<button
					type="button"
					onClick={() => {
						const val = ref.current?.getValue() ?? "";
						addLog(`getValue() = "${val}"`);
					}}
					className="px-4 py-2 rounded-full border border-m3-outline text-m3-on-surface text-sm font-medium"
				>
					Get Value
				</button>
			</div>

			{log.length > 0 && (
				<div className="rounded-xl bg-m3-surface-container p-3 space-y-1">
					{log.map((entry, i) => (
						<p
							// biome-ignore lint/suspicious/noArrayIndexKey: log entries are append-only
							key={i}
							className="text-xs font-mono text-m3-on-surface-variant"
						>
							{entry}
						</p>
					))}
				</div>
			)}
		</div>
	);
}
