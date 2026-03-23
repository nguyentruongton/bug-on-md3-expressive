"use client";

import { Card, CodeBlock, TableOfContents } from "@bug-on/md3-react";
import {
  TypographyProvider,
  useTypography,
} from "@bug-on/md3-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ─── Type Scale Preview Row ───────────────────────────────────────────────────

interface TypeScaleRowProps {
  label: string;
  description: string;
  style: React.CSSProperties;
  sample: string;
}

function TypeScaleRow({ label, description, style, sample }: TypeScaleRowProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-5 border-b border-m3-surface-variant last:border-0">
      <div className="w-52 shrink-0">
        <p className="text-xs font-mono font-semibold text-m3-primary">{label}</p>
        <p className="text-xs text-m3-on-surface-variant mt-0.5">{description}</p>
      </div>
      <p className="flex-1" style={style}>
        {sample}
      </p>
    </div>
  );
}

// ─── Inner component that consumes the typography context ─────────────────────

function TypographyShowcase() {
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
    [t]
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
    [t]
  );

  return (
    <>
      <section id="baseline" className="mb-20 scroll-mt-24">
        <h2 className="text-2xl font-medium text-m3-on-surface mb-8">
          Baseline Styles (15)
        </h2>
        <Card
          variant="outlined"
          className="p-6 md:p-8 bg-m3-surface-container-lowest"
        >
          {baselineRows.map((row) => (
            <TypeScaleRow key={row.label} {...row} />
          ))}
        </Card>
      </section>

      <section id="emphasized" className="mb-20 scroll-mt-24">
        <h2 className="text-2xl font-medium text-m3-on-surface mb-8">
          Emphasized Styles — MD3 Expressive (15)
        </h2>
        <Card
          variant="outlined"
          className="p-6 md:p-8 bg-m3-surface-container-lowest"
        >
          {emphasizedRows.map((row) => (
            <TypeScaleRow key={row.label} {...row} />
          ))}
        </Card>
      </section>
    </>
  );
}

// ─── ROND Playground ──────────────────────────────────────────────────────────

function RondPlayground() {
  const [rond, setRond] = useState(100);

  const previewStyle: React.CSSProperties = {
    fontFamily: "'Google Sans Flex', system-ui, sans-serif",
    fontVariationSettings: `"ROND" ${rond}`,
    fontSize: "2rem",
    fontWeight: 400,
    lineHeight: 1.3,
    transition: "font-variation-settings 0.2s ease",
  };

  return (
    <section id="rond-playground" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-medium text-m3-on-surface mb-8">
        Variable Font Axes — ROND Playground
      </h2>
      <Card
        variant="outlined"
        className="p-6 md:p-8 flex flex-col gap-8 bg-m3-surface-container-lowest"
      >
        {/* Description */}
        <div className="max-w-2xl">
          <p className="text-m3-on-surface-variant leading-relaxed">
            Google Sans Flex is a variable font. The{" "}
            <code className="font-mono text-sm bg-m3-surface-container px-1.5 py-0.5 rounded">
              ROND
            </code>{" "}
            axis controls corner roundness — from{" "}
            <strong>sharp (0)</strong> to{" "}
            <strong>fully rounded (100)</strong>. The{" "}
            <code className="font-mono text-sm bg-m3-surface-container px-1.5 py-0.5 rounded">
              TypographyProvider
            </code>{" "}
            applies this globally via{" "}
            <code className="font-mono text-sm bg-m3-surface-container px-1.5 py-0.5 rounded">
              fontVariationAxes
            </code>.
          </p>
        </div>

        {/* Slider control */}
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center justify-between">
            <label
              htmlFor="rond-slider"
              className="text-sm font-medium text-m3-on-surface"
            >
              ROND axis
            </label>
            <span className="font-mono text-sm font-semibold text-m3-primary">
              {rond}
            </span>
          </div>
          <input
            id="rond-slider"
            type="range"
            min={0}
            max={100}
            step={1}
            value={rond}
            onChange={(e) => setRond(Number(e.target.value))}
            className="w-full accent-m3-primary"
          />
          <div className="flex justify-between text-xs text-m3-on-surface-variant">
            <span>0 — Sharp</span>
            <span>100 — Fully Rounded</span>
          </div>
        </div>

        {/* Live preview */}
        <div className="p-6 bg-m3-surface-container rounded-m3-xl">
          <p
            className="text-m3-on-surface"
            style={previewStyle}
          >
            The quick brown fox jumps over the lazy dog
          </p>
          <p
            className="mt-2 text-m3-on-surface"
            style={{
              ...previewStyle,
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Almost before we knew it, we had left the ground.
          </p>
        </div>

        {/* Code hint */}
        <div className="rounded-m3-md overflow-hidden">
          <CodeBlock
            code={`<TypographyProvider fontVariationAxes={{ ROND: ${rond} }}>
  <App />
</TypographyProvider>`}
          />
        </div>
      </Card>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const usageCode = `import { TypographyProvider, useTypography } from '@bug-on/md3-react';

// 1. Wrap your app
<TypographyProvider>
  <App />
</TypographyProvider>

// 2. Consume in a component
function MyComponent() {
  const typography = useTypography();
  return <p style={typography.bodyLarge}>Hello world</p>;
}

// 3. Custom font + variable axes
<TypographyProvider
  fontFamily="'Inter', sans-serif"
  fontVariationAxes={{ ROND: 50 }}
>
  <App />
</TypographyProvider>

// 4. Override a single style via copy()
const boldBody = typography.copy({ bodyLarge: { fontWeight: 700 } });`;

const tocItems = [
  { id: "baseline", label: "Baseline Styles" },
  { id: "emphasized", label: "Emphasized Styles" },
  { id: "rond-playground", label: "ROND Playground" },
  { id: "code-example", label: "Code Example" },
];

export default function TypographyPage() {
  const [rond, setRond] = useState(100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12 flex flex-col xl:flex-row gap-12">
      <div className="flex-1 min-w-0">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8">
          <Link
            className="text-m3-primary font-medium text-sm hover:underline"
            href="/foundations"
          >
            Foundations
          </Link>
          <ChevronRight className="w-4 h-4 text-m3-on-surface-variant" />
          <span className="text-m3-on-surface text-sm font-bold">
            Typography
          </span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <span className="text-m3-primary font-medium tracking-wide uppercase text-sm">
            MATERIAL DESIGN 3 EXPRESSIVE
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal tracking-tight mt-2 mb-6">
            Typography
          </h1>
          <p className="text-lg sm:text-xl text-m3-on-surface-variant leading-relaxed max-w-2xl">
            MD3 Expressive provides 30 text styles — 15 baseline and 15
            emphasized — powered by Google Sans Flex, a variable font with the{" "}
            <code className="font-mono text-base bg-m3-surface-container px-1.5 py-0.5 rounded">
              ROND
            </code>{" "}
            roundness axis set to maximum by default.
          </p>
        </div>

        {/* ROND slider that wraps the type showcase */}
        <section id="font-axes-control" className="mb-8">
          <Card
            variant="filled"
            className="p-4 md:p-6 bg-m3-secondary-container flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-m3-on-secondary-container">
                Live ROND axis —{" "}
                <span className="font-mono">{rond}</span>
              </p>
              <p className="text-xs text-m3-on-secondary-container/70 mt-0.5">
                Adjusts{" "}
                <code className="font-mono">fontVariationAxes.ROND</code> on
                the provider below, affecting all 30 styles simultaneously.
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
        </section>

        {/* Wrap the showcase in a provider reflecting the live ROND value */}
        <TypographyProvider fontVariationAxes={{ ROND: rond }}>
          <TypographyShowcase />
        </TypographyProvider>

        {/* Separate ROND playground with its own internal state */}
        <RondPlayground />

        {/* Code Example */}
        <section id="code-example" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-medium text-m3-on-surface mb-8">
            Code Example
          </h2>
          <CodeBlock code={usageCode} />
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
