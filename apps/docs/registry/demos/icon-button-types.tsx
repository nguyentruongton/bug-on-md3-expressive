"use client";

import { Icon, IconButton } from "@bug-on/md3-react";

export default function IconButtonTypesDemo() {
	return (
		<div className="flex flex-col gap-10">
			{/* Standard */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Standard
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						Low emphasis. No container background. Suitable for toolbars and
						secondary actions. Uses <code>on-surface-variant</code> color; turns{" "}
						<code>primary</code> when selected.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<IconButton aria-label="Add">
						<Icon name="add" />
					</IconButton>
					<IconButton aria-label="Settings">
						<Icon name="settings" />
					</IconButton>
					<IconButton aria-label="Edit">
						<Icon name="edit" />
					</IconButton>
					<IconButton aria-label="Share" disabled>
						<Icon name="share" />
					</IconButton>
				</div>
			</div>

			{/* Filled */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Filled
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						High emphasis with a <code>surface-container</code> background. Use
						for the primary icon action. Selected state switches to{" "}
						<code>primary</code> fill.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<IconButton aria-label="Add" colorStyle="filled">
						<Icon name="add" />
					</IconButton>
					<IconButton aria-label="Search" colorStyle="filled">
						<Icon name="search" />
					</IconButton>
					<IconButton aria-label="Delete" colorStyle="filled">
						<Icon name="delete" />
					</IconButton>
					<IconButton aria-label="Add (disabled)" colorStyle="filled" disabled>
						<Icon name="add" />
					</IconButton>
				</div>
			</div>

			{/* Tonal */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-m3-surface-variant pb-8">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Filled Tonal
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						Middle-ground emphasis using <code>secondary-container</code>.
						Selected state switches to <code>secondary</code>. Softer than
						filled.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<IconButton aria-label="Favorite" colorStyle="tonal">
						<Icon name="favorite" />
					</IconButton>
					<IconButton aria-label="Star" colorStyle="tonal">
						<Icon name="star" />
					</IconButton>
					<IconButton aria-label="Share" colorStyle="tonal">
						<Icon name="share" />
					</IconButton>
					<IconButton
						aria-label="Share (disabled)"
						colorStyle="tonal"
						disabled
					>
						<Icon name="share" />
					</IconButton>
				</div>
			</div>

			{/* Outlined */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
				<div className="max-w-sm">
					<h3 className="text-lg font-medium text-m3-on-surface mb-2">
						Outlined
					</h3>
					<p className="text-sm text-m3-on-surface-variant">
						Medium emphasis with a border (width scales per size: 1–3dp). No
						fill. Selected state uses <code>inverse-surface</code> fill and
						removes the border.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<IconButton aria-label="Save" colorStyle="outlined">
						<Icon name="bookmark" />
					</IconButton>
					<IconButton aria-label="Edit" colorStyle="outlined">
						<Icon name="edit" />
					</IconButton>
					<IconButton aria-label="Settings" colorStyle="outlined">
						<Icon name="settings" />
					</IconButton>
					<IconButton
						aria-label="Save (disabled)"
						colorStyle="outlined"
						disabled
					>
						<Icon name="bookmark" />
					</IconButton>
				</div>
			</div>
		</div>
	);
}
