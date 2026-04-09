"use client";

import { Icon, useTheme } from "@bug-on/md3-react";

export function ThemeDemo() {
	const { sourceColor, setSourceColor, mode, setMode } = useTheme();

	const presets = [
		{ name: "Default", color: "#6750A4" },
		{ name: "Ocean", color: "#006494" },
		{ name: "Forest", color: "#386a20" },
		{ name: "Sunrise", color: "#8b418f" },
		{ name: "Crimson", color: "#b91d1d" },
	];

	return (
		<div className="my-8 rounded-m3-xl border border-m3-outline-variant bg-m3-surface-container-low p-6 shadow-sm">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				{/* Color Picker Section */}
				<div className="flex-1">
					<label
						htmlFor="md3-source-color-picker"
						className="block text-sm font-medium text-m3-on-surface mb-3"
					>
						Source Color (Hex)
					</label>
					<div className="flex items-center gap-3">
						<div className="relative group">
							<input
								id="md3-source-color-picker"
								type="color"
								value={sourceColor}
								onChange={(e) => setSourceColor(e.target.value)}
								className="w-12 h-12 rounded-m3-full border-none cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-m3-primary"
								title="Choose a custom color"
							/>
							<div
								className="absolute inset-0 rounded-m3-full pointer-events-none border border-m3-outline group-hover:border-m3-primary transition-colors"
								style={{ backgroundColor: sourceColor }}
							/>
						</div>
						<input
							id="md3-source-color-text"
							type="text"
							value={sourceColor}
							onChange={(e) => setSourceColor(e.target.value)}
							className="px-4 py-2 bg-m3-surface rounded-m3-lg border border-m3-outline focus:border-m3-primary focus:outline-none font-mono text-sm uppercase text-m3-on-surface"
							placeholder="#000000"
						/>
					</div>
				</div>

				{/* Theme Mode Toggle */}
				<div className="flex flex-col">
					<span
						id="theme-mode-label"
						className="block text-sm font-medium text-m3-on-surface mb-3"
					>
						Theme Mode
					</span>
					<div
						role="group"
						aria-labelledby="theme-mode-label"
						className="flex bg-m3-surface-container-highest rounded-m3-full p-1 border border-m3-outline-variant"
					>
						<button
							type="button"
							onClick={() => setMode("light")}
							className={`flex items-center gap-2 px-4 py-2 rounded-m3-full transition-all ${
								mode === "light"
									? "bg-m3-primary text-m3-on-primary shadow-md"
									: "text-m3-on-surface-variant hover:bg-m3-surface-variant/50"
							}`}
						>
							<Icon name="light_mode" size={18} />
							<span className="text-sm font-medium">Light</span>
						</button>
						<button
							type="button"
							onClick={() => setMode("dark")}
							className={`flex items-center gap-2 px-4 py-2 rounded-m3-full transition-all ${
								mode === "dark"
									? "bg-m3-primary text-m3-on-primary shadow-md"
									: "text-m3-on-surface-variant hover:bg-m3-surface-variant/50"
							}`}
						>
							<Icon name="dark_mode" size={18} />
							<span className="text-sm font-medium">Dark</span>
						</button>
					</div>
				</div>
			</div>

			{/* Preset Colors */}
			<div className="mt-8">
				<span
					id="presets-label"
					className="block text-sm font-medium text-m3-on-surface-variant mb-3"
				>
					Quick Presets
				</span>
				<div
					role="group"
					aria-labelledby="presets-label"
					className="flex flex-wrap gap-3"
				>
					{presets.map((p) => (
						<button
							key={p.color}
							type="button"
							onClick={() => setSourceColor(p.color)}
							className={`flex items-center gap-2 px-3 py-1.5 rounded-m3-lg border transition-all ${
								sourceColor.toLowerCase() === p.color.toLowerCase()
									? "border-m3-primary bg-m3-primary-container text-m3-on-primary-container"
									: "border-m3-outline-variant bg-m3-surface hover:bg-m3-surface-variant/20 text-m3-on-surface"
							}`}
						>
							<div
								className="w-3 h-3 rounded-m3-full"
								style={{ backgroundColor: p.color }}
							/>
							<span className="text-xs font-medium">{p.name}</span>
						</button>
					))}
				</div>
			</div>

			<p className="mt-6 text-xs text-m3-on-surface-variant bg-m3-surface-variant/30 p-3 rounded-m3-md border border-m3-outline-variant/30 leading-normal italic">
				Thử đổi màu hoặc theme để thấy toàn bộ trang tài liệu này cập nhật
				tokens theo thuật toán Material Design 3.
			</p>
		</div>
	);
}
