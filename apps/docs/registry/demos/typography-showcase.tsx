"use client";

import { Card, TypographyProvider, useTypography } from "@bug-on/md3-react";
import { useMemo, useState } from "react";

interface TypeScaleRowProps {
	label: string;
	description: string;
	style: React.CSSProperties;
	sample: string;
}

function TypeScaleRow({
	label,
	description,
	style,
	sample,
}: TypeScaleRowProps) {
	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-5 border-b border-m3-surface-variant last:border-0">
			<div className="w-52 shrink-0">
				<p className="text-xs font-mono font-semibold text-m3-primary">
					{label}
				</p>
				<p className="text-xs text-m3-on-surface-variant mt-0.5">
					{description}
				</p>
			</div>
			<p className="flex-1" style={style}>
				{sample}
			</p>
		</div>
	);
}

function TypographyShowcaseInner() {
	const t = useTypography();

	const baselineRows: TypeScaleRowProps[] = useMemo(
		() => [
			{
				label: "displayLarge",
				description: "57px · weight 400",
				style: t.displayLarge as React.CSSProperties,
				sample: "Display Large",
			},
			{
				label: "displayMedium",
				description: "45px · weight 400",
				style: t.displayMedium as React.CSSProperties,
				sample: "Display Medium",
			},
			{
				label: "displaySmall",
				description: "36px · weight 400",
				style: t.displaySmall as React.CSSProperties,
				sample: "Display Small",
			},
			{
				label: "headlineLarge",
				description: "32px · weight 400",
				style: t.headlineLarge as React.CSSProperties,
				sample: "Headline Large",
			},
			{
				label: "headlineMedium",
				description: "28px · weight 400",
				style: t.headlineMedium as React.CSSProperties,
				sample: "Headline Medium",
			},
			{
				label: "headlineSmall",
				description: "24px · weight 400",
				style: t.headlineSmall as React.CSSProperties,
				sample: "Headline Small",
			},
			{
				label: "titleLarge",
				description: "22px · weight 400",
				style: t.titleLarge as React.CSSProperties,
				sample: "Title Large",
			},
			{
				label: "titleMedium",
				description: "16px · weight 500",
				style: t.titleMedium as React.CSSProperties,
				sample: "Title Medium",
			},
			{
				label: "titleSmall",
				description: "14px · weight 500",
				style: t.titleSmall as React.CSSProperties,
				sample: "Title Small",
			},
			{
				label: "bodyLarge",
				description: "16px · weight 400",
				style: t.bodyLarge as React.CSSProperties,
				sample: "The quick brown fox jumps over the lazy dog",
			},
			{
				label: "bodyMedium",
				description: "14px · weight 400",
				style: t.bodyMedium as React.CSSProperties,
				sample: "The quick brown fox jumps over the lazy dog",
			},
			{
				label: "bodySmall",
				description: "12px · weight 400",
				style: t.bodySmall as React.CSSProperties,
				sample: "The quick brown fox jumps over the lazy dog",
			},
			{
				label: "labelLarge",
				description: "14px · weight 500",
				style: t.labelLarge as React.CSSProperties,
				sample: "Label Large",
			},
			{
				label: "labelMedium",
				description: "12px · weight 500",
				style: t.labelMedium as React.CSSProperties,
				sample: "Label Medium",
			},
			{
				label: "labelSmall",
				description: "11px · weight 500",
				style: t.labelSmall as React.CSSProperties,
				sample: "Label Small",
			},
		],
		[t],
	);

	const emphasizedRows: TypeScaleRowProps[] = useMemo(
		() => [
			{
				label: "displayLargeEmphasized",
				description: "57px · weight 800",
				style: t.displayLargeEmphasized as React.CSSProperties,
				sample: "Display Large",
			},
			{
				label: "displayMediumEmphasized",
				description: "45px · weight 800",
				style: t.displayMediumEmphasized as React.CSSProperties,
				sample: "Display Medium",
			},
			{
				label: "displaySmallEmphasized",
				description: "36px · weight 800",
				style: t.displaySmallEmphasized as React.CSSProperties,
				sample: "Display Small",
			},
			{
				label: "headlineLargeEmphasized",
				description: "32px · weight 800",
				style: t.headlineLargeEmphasized as React.CSSProperties,
				sample: "Headline Large",
			},
			{
				label: "headlineMediumEmphasized",
				description: "28px · weight 800",
				style: t.headlineMediumEmphasized as React.CSSProperties,
				sample: "Headline Medium",
			},
			{
				label: "headlineSmallEmphasized",
				description: "24px · weight 800",
				style: t.headlineSmallEmphasized as React.CSSProperties,
				sample: "Headline Small",
			},
			{
				label: "titleLargeEmphasized",
				description: "22px · weight 700",
				style: t.titleLargeEmphasized as React.CSSProperties,
				sample: "Title Large",
			},
			{
				label: "titleMediumEmphasized",
				description: "16px · weight 700",
				style: t.titleMediumEmphasized as React.CSSProperties,
				sample: "Title Medium",
			},
			{
				label: "titleSmallEmphasized",
				description: "14px · weight 700",
				style: t.titleSmallEmphasized as React.CSSProperties,
				sample: "Title Small",
			},
			{
				label: "bodyLargeEmphasized",
				description: "16px · weight 700",
				style: t.bodyLargeEmphasized as React.CSSProperties,
				sample: "The quick brown fox jumps over the lazy dog",
			},
			{
				label: "bodyMediumEmphasized",
				description: "14px · weight 700",
				style: t.bodyMediumEmphasized as React.CSSProperties,
				sample: "The quick brown fox jumps over the lazy dog",
			},
			{
				label: "bodySmallEmphasized",
				description: "12px · weight 700",
				style: t.bodySmallEmphasized as React.CSSProperties,
				sample: "The quick brown fox jumps over the lazy dog",
			},
			{
				label: "labelLargeEmphasized",
				description: "14px · weight 800",
				style: t.labelLargeEmphasized as React.CSSProperties,
				sample: "Label Large",
			},
			{
				label: "labelMediumEmphasized",
				description: "12px · weight 800",
				style: t.labelMediumEmphasized as React.CSSProperties,
				sample: "Label Medium",
			},
			{
				label: "labelSmallEmphasized",
				description: "11px · weight 800",
				style: t.labelSmallEmphasized as React.CSSProperties,
				sample: "Label Small",
			},
		],
		[t],
	);

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h3 className="text-xl font-medium text-m3-on-surface mb-6">
					Baseline Styles (15)
				</h3>
				<Card variant="outlined" className="p-4 sm:p-6 bg-m3-surface">
					{baselineRows.map((row) => (
						<TypeScaleRow key={row.label} {...row} />
					))}
				</Card>
			</div>

			<div>
				<h3 className="text-xl font-medium text-m3-on-surface mb-6">
					Emphasized Styles — MD3 Expressive (15)
				</h3>
				<Card variant="outlined" className="p-4 sm:p-6 bg-m3-surface">
					{emphasizedRows.map((row) => (
						<TypeScaleRow key={row.label} {...row} />
					))}
				</Card>
			</div>
		</div>
	);
}

export default function TypographyShowcaseDemo() {
	const [rond, setRond] = useState(100);

	return (
		<div className="flex flex-col gap-6">
			<Card
				variant="filled"
				className="p-4 bg-m3-surface-container flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-m3-outline-variant"
			>
				<div className="flex-1">
					<p className="text-sm font-semibold text-m3-on-surface">
						Live ROND axis —{" "}
						<span className="font-mono text-m3-primary">{rond}</span>
					</p>
					<p className="text-xs text-m3-on-surface-variant mt-1">
						Adjusts <code>fontVariationAxes.ROND</code>, affecting all 30
						styles.
					</p>
				</div>
				<input
					type="range"
					min={0}
					max={100}
					step={1}
					value={rond}
					onChange={(e) => setRond(Number(e.target.value))}
					className="w-full sm:w-48 accent-m3-primary"
					aria-label="ROND axis value"
				/>
			</Card>

			<TypographyProvider fontVariationAxes={{ ROND: rond }}>
				<TypographyShowcaseInner />
			</TypographyProvider>
		</div>
	);
}
