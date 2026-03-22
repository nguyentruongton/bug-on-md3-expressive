"use client";

import { Button, Card } from "@bug-on/md3-react";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const presetColors = [
	{ name: "M3 Primary", hex: "#6750A4" },
	{ name: "Ocean Blue", hex: "#0061A4" },
	{ name: "Forest Green", hex: "#006D3B" },
	{ name: "Sunset Orange", hex: "#A45000" },
	{ name: "Royal Red", hex: "#B3261E" },
	{ name: "Deep Teal", hex: "#006A6A" },
	{ name: "Vibrant Pink", hex: "#9C4278" },
];

export default function SettingsPage() {
	const { sourceColor, setSourceColor, mode, setMode } = useTheme();

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-12 py-12">
			<div className="mb-12">
				<span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
					CUSTOMIZATION
				</span>
				<h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
					Settings
				</h1>
				<p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed">
					Personalize your experience by choosing a primary color and theme
					mode. Material Design 3 uses dynamic color to generate a harmonious
					palette.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Color Picker */}
				<Card variant="outlined" className="p-8 bg-m3-surface-container-lowest">
					<div className="flex items-center gap-3 mb-6">
						<Palette className="w-6 h-6 text-m3-primary" />
						<h2 className="text-2xl font-medium text-m3-on-surface">
							Dynamic Color
						</h2>
					</div>

					<p className="text-sm text-m3-on-surface-variant mb-8">
						Select a source color to generate a complete Material Design 3 color
						scheme.
					</p>

					<div className="grid grid-cols-4 gap-4 mb-8">
						{presetColors.map((color) => (
							<button
								type="button"
								key={color.hex}
								onClick={() => setSourceColor(color.hex)}
								className="group relative flex flex-col items-center gap-2"
								title={color.name}
							>
								<div
									className="w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
									style={{
										backgroundColor: color.hex,
										borderColor:
											sourceColor === color.hex
												? "var(--color-m3-primary)"
												: "transparent",
										boxShadow:
											sourceColor === color.hex
												? "0 0 0 2px var(--color-m3-surface), 0 0 0 4px var(--color-m3-primary)"
												: "none",
									}}
								>
									{sourceColor === color.hex && (
										<Check className="w-6 h-6 text-white" />
									)}
								</div>
							</button>
						))}

						{/* Custom Color Input */}
						<div className="flex flex-col items-center gap-2">
							<label htmlFor="custom-hex-color" className="sr-only">
								Choose Color
							</label>
							<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-m3-outline-variant hover:border-m3-primary transition-colors">
								<input
									id="custom-hex-color"
									type="color"
									value={sourceColor}
									onChange={(e) => setSourceColor(e.target.value)}
									className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
								/>
							</div>
						</div>
					</div>

					<div className="p-4 bg-m3-surface-container rounded-m3-lg">
						<div className="flex justify-between items-center mb-2">
							<span className="text-xs font-medium text-m3-on-surface-variant">
								CURRENT HEX
							</span>
							<span className="text-xs font-mono font-bold text-m3-primary uppercase">
								{sourceColor}
							</span>
						</div>
						<div className="h-2 w-full rounded-full bg-m3-outline-variant overflow-hidden">
							<div
								className="h-full bg-m3-primary transition-all duration-500"
								style={{ width: "100%", backgroundColor: sourceColor }}
							/>
						</div>
					</div>
				</Card>

				{/* Theme Mode */}
				<Card variant="outlined" className="p-8 bg-m3-surface-container-lowest">
					<div className="flex items-center gap-3 mb-6">
						{mode === "light" ? (
							<Sun className="w-6 h-6 text-m3-primary" />
						) : (
							<Moon className="w-6 h-6 text-m3-primary" />
						)}
						<h2 className="text-2xl font-medium text-m3-on-surface">
							Theme Mode
						</h2>
					</div>

					<p className="text-sm text-m3-on-surface-variant mb-8">
						Switch between light and dark themes. The dynamic color scheme will
						adapt accordingly.
					</p>

					<div className="flex flex-col gap-4">
						<Button
							colorStyle={mode === "light" ? "tonal" : "outlined"}
							className="justify-start gap-4 h-14 px-6"
							onClick={() => setMode("light")}
							icon={<Sun className="w-5 h-5" />}
						>
							Light Theme
							{mode === "light" && <Check className="ml-auto w-5 h-5" />}
						</Button>

						<Button
							colorStyle={mode === "dark" ? "tonal" : "outlined"}
							className="justify-start gap-4 h-14 px-6"
							onClick={() => setMode("dark")}
							icon={<Moon className="w-5 h-5" />}
						>
							Dark Theme
							{mode === "dark" && <Check className="ml-auto w-5 h-5" />}
						</Button>
					</div>
				</Card>
			</div>

			{/* Preview Section */}
			<section className="mt-16">
				<h2 className="text-2xl font-medium text-m3-on-surface mb-8">
					Palette Preview
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
					{[
						{
							label: "Primary",
							bg: "bg-m3-primary",
							text: "text-m3-on-primary",
						},
						{
							label: "Primary Container",
							bg: "bg-m3-primary-container",
							text: "text-m3-on-primary-container",
						},
						{
							label: "Secondary",
							bg: "bg-m3-secondary",
							text: "text-m3-on-secondary",
						},
						{
							label: "Secondary Container",
							bg: "bg-m3-secondary-container",
							text: "text-m3-on-secondary-container",
						},
						{
							label: "Tertiary",
							bg: "bg-m3-tertiary",
							text: "text-m3-on-tertiary",
						},
						{
							label: "Tertiary Container",
							bg: "bg-m3-tertiary-container",
							text: "text-m3-on-tertiary-container",
						},
						{
							label: "Surface",
							bg: "bg-m3-surface",
							text: "text-m3-on-surface",
						},
						{
							label: "Surface Variant",
							bg: "bg-m3-surface-variant",
							text: "text-m3-on-surface-variant",
						},
						{ label: "Error", bg: "bg-m3-error", text: "text-m3-on-error" },
						{
							label: "Error Container",
							bg: "bg-m3-error-container",
							text: "text-m3-on-error-container",
						},
						{ label: "Outline", bg: "bg-m3-outline", text: "text-white" },
						{
							label: "Container High",
							bg: "bg-m3-surface-container-high",
							text: "text-m3-on-surface",
						},
					].map((item) => (
						<div
							key={item.label}
							className={cn(
								"p-4 rounded-m3-lg flex flex-col justify-between min-h-[100px]",
								item.bg,
							)}
						>
							<span
								className={cn(
									"text-[10px] font-bold uppercase tracking-wider opacity-80",
									item.text,
								)}
							>
								{item.label}
							</span>
							<div
								className={cn(
									"w-6 h-6 rounded-full border border-black/10 self-end",
									item.bg,
								)}
							/>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
