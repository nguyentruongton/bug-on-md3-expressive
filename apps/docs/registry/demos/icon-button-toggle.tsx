"use client";

import { Icon, IconButton } from "@bug-on/md3-react";
import { useState } from "react";

export default function IconButtonToggleDemo() {
	const [likedFilled, setLikedFilled] = useState(false);
	const [likedTonal, setLikedTonal] = useState(false);
	const [bookmarkedOutlined, setBookmarkedOutlined] = useState(false);
	const [starredStandard, setStarredStandard] = useState(false);

	const [shapeFilled, setShapeFilled] = useState(false);
	const [shapeTonal, setShapeTonal] = useState(false);

	return (
		<div className="flex flex-col gap-10">
			<p className="text-sm text-m3-on-surface-variant max-w-2xl">
				Toggle icon buttons morph shape when selected:{" "}
				<strong>round → square</strong> (or vice versa). The transition is
				driven by spring animation using exact <code>CornerFull</code> →{" "}
				<code>CornerMedium/ExtraLarge</code> values from MD3 ShapeKeyTokens.
				Click any button below to see it live.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{/* Filled toggle */}
				<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
					<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
						Filled Toggle
					</p>
					<div className="flex items-center gap-6">
						<IconButton
							aria-label={likedFilled ? "Bỏ thích" : "Thích"}
							colorStyle="filled"
							variant="toggle"
							selected={likedFilled}
							onClick={() => setLikedFilled(!likedFilled)}
							size="md"
						>
							<Icon
								name="favorite"
								className={likedFilled ? "fill-current" : ""}
							/>
						</IconButton>
						<span className="text-sm text-m3-on-surface-variant italic">
							{likedFilled
								? "Selected → square shape, primary fill"
								: "Unselected → round shape, surface-container"}
						</span>
					</div>
				</div>

				{/* Tonal toggle */}
				<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
					<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
						Tonal Toggle
					</p>
					<div className="flex items-center gap-6">
						<IconButton
							aria-label={likedTonal ? "Bỏ đánh dấu" : "Đánh dấu"}
							colorStyle="tonal"
							variant="toggle"
							selected={likedTonal}
							onClick={() => setLikedTonal(!likedTonal)}
							size="md"
						>
							<Icon name="star" className={likedTonal ? "fill-current" : ""} />
						</IconButton>
						<span className="text-sm text-m3-on-surface-variant italic">
							{likedTonal
								? "Selected → secondary fill"
								: "Unselected → secondary-container"}
						</span>
					</div>
				</div>

				{/* Outlined toggle */}
				<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
					<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
						Outlined Toggle
					</p>
					<div className="flex items-center gap-6">
						<IconButton
							aria-label={bookmarkedOutlined ? "Bỏ lưu" : "Lưu"}
							colorStyle="outlined"
							variant="toggle"
							selected={bookmarkedOutlined}
							onClick={() => setBookmarkedOutlined(!bookmarkedOutlined)}
							size="md"
						>
							<Icon
								name="bookmark"
								className={bookmarkedOutlined ? "fill-current" : ""}
							/>
						</IconButton>
						<span className="text-sm text-m3-on-surface-variant italic">
							{bookmarkedOutlined
								? "Selected → inverse-surface, no border"
								: "Unselected → bordered, transparent bg"}
						</span>
					</div>
				</div>

				{/* Standard toggle */}
				<div className="flex flex-col gap-4 p-6 bg-m3-surface-container rounded-m3-xl">
					<p className="text-xs font-medium text-m3-primary uppercase tracking-wider">
						Standard Toggle
					</p>
					<div className="flex items-center gap-6">
						<IconButton
							aria-label={starredStandard ? "Bỏ gắn sao" : "Gắn sao"}
							colorStyle="standard"
							variant="toggle"
							selected={starredStandard}
							onClick={() => setStarredStandard(!starredStandard)}
							size="md"
						>
							<Icon
								name="star"
								className={starredStandard ? "fill-current" : ""}
							/>
						</IconButton>
						<span className="text-sm text-m3-on-surface-variant italic">
							{starredStandard
								? "Selected → primary color"
								: "Unselected → on-surface-variant"}
						</span>
					</div>
				</div>
			</div>

			{/* Shape comparison */}
			<div className="border-t border-m3-surface-variant pt-8">
				<p className="text-xs font-medium text-m3-primary uppercase tracking-wider mb-4">
					Round vs Square Shape (click to toggle)
				</p>
				<div className="flex flex-wrap items-end gap-6">
					<div className="flex flex-col items-center gap-2">
						<IconButton
							aria-label={shapeFilled ? "Bỏ thích" : "Thích"}
							colorStyle="filled"
							variant="toggle"
							selected={shapeFilled}
							shape="round"
							size="md"
							onClick={() => setShapeFilled(!shapeFilled)}
						>
							<Icon
								name="favorite"
								className={shapeFilled ? "fill-current" : ""}
							/>
						</IconButton>
						<span className="text-xs text-m3-on-surface-variant">
							shape=&quot;round&quot;
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<IconButton
							aria-label={shapeTonal ? "Bỏ thích" : "Thích"}
							colorStyle="tonal"
							variant="toggle"
							selected={shapeTonal}
							shape="square"
							size="md"
							onClick={() => setShapeTonal(!shapeTonal)}
						>
							<Icon
								name="favorite"
								className={shapeTonal ? "fill-current" : ""}
							/>
						</IconButton>
						<span className="text-xs text-m3-on-surface-variant">
							shape=&quot;square&quot;
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
