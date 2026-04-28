"use client";

import { Button, ButtonGroup, Icon, useTheme } from "@bug-on/md3-react";

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
				<fieldset className="flex flex-col border-none p-0 m-0">
					<legend className="block text-sm font-medium text-m3-on-surface mb-3">
						Theme Mode
					</legend>
					<ButtonGroup variant="connected" size="sm">
						<Button
							variant="toggle"
							selected={mode === "light"}
							onClick={() => setMode("light")}
							icon={<Icon name="light_mode" />}
						>
							Light
						</Button>
						<Button
							variant="toggle"
							selected={mode === "dark"}
							onClick={() => setMode("dark")}
							icon={<Icon name="dark_mode" />}
						>
							Dark
						</Button>
						<Button
							variant="toggle"
							selected={mode === "system"}
							onClick={() => setMode("system")}
							icon={<Icon name="settings_brightness" />}
						>
							System
						</Button>
					</ButtonGroup>
				</fieldset>
			</div>

			{/* Preset Colors */}
			<fieldset className="mt-8 border-none p-0 m-0">
				<legend className="block text-sm font-medium text-m3-on-surface-variant mb-3">
					Quick Presets
				</legend>
				<ButtonGroup variant="standard" morphingWidth={true} size="xs">
					{presets.map((p) => (
						<Button
							key={p.color}
							variant="toggle"
							selected={sourceColor.toLowerCase() === p.color.toLowerCase()}
							onClick={() => setSourceColor(p.color)}
							icon={
								<div
									className="w-3 h-3 rounded-m3-full"
									style={{ backgroundColor: p.color }}
								/>
							}
						>
							{p.name}
						</Button>
					))}
				</ButtonGroup>
			</fieldset>

			<p className="mt-6 text-xs text-m3-on-surface-variant bg-m3-surface-variant/30 p-3 rounded-m3-md border border-m3-outline-variant/30 leading-normal italic">
				Thử đổi màu hoặc theme để thấy toàn bộ trang tài liệu này cập nhật
				tokens theo thuật toán Material Design 3.
			</p>
		</div>
	);
}
