"use client";

import { IconButton } from "@bug-on/md3-react";
import {
	Bookmark,
	Edit3,
	Heart,
	Plus,
	Search,
	Settings,
	Share2,
	Star,
	Trash2,
} from "lucide-react";

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
					<IconButton aria-label="Thêm">
						<Plus />
					</IconButton>
					<IconButton aria-label="Cài đặt">
						<Settings />
					</IconButton>
					<IconButton aria-label="Chỉnh sửa">
						<Edit3 />
					</IconButton>
					<IconButton aria-label="Chia sẻ" disabled>
						<Share2 />
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
					<IconButton aria-label="Thêm" colorStyle="filled">
						<Plus />
					</IconButton>
					<IconButton aria-label="Tìm kiếm" colorStyle="filled">
						<Search />
					</IconButton>
					<IconButton aria-label="Xóa" colorStyle="filled">
						<Trash2 />
					</IconButton>
					<IconButton aria-label="Thêm (disabled)" colorStyle="filled" disabled>
						<Plus />
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
					<IconButton aria-label="Yêu thích" colorStyle="tonal">
						<Heart />
					</IconButton>
					<IconButton aria-label="Đánh dấu sao" colorStyle="tonal">
						<Star />
					</IconButton>
					<IconButton aria-label="Chia sẻ" colorStyle="tonal">
						<Share2 />
					</IconButton>
					<IconButton
						aria-label="Chia sẻ (disabled)"
						colorStyle="tonal"
						disabled
					>
						<Share2 />
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
					<IconButton aria-label="Lưu" colorStyle="outlined">
						<Bookmark />
					</IconButton>
					<IconButton aria-label="Chỉnh sửa" colorStyle="outlined">
						<Edit3 />
					</IconButton>
					<IconButton aria-label="Cài đặt" colorStyle="outlined">
						<Settings />
					</IconButton>
					<IconButton
						aria-label="Lưu (disabled)"
						colorStyle="outlined"
						disabled
					>
						<Bookmark />
					</IconButton>
				</div>
			</div>
		</div>
	);
}
