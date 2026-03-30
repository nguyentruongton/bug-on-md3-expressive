/**
 * TypeScaleTokens - MD3 Expressive Typography Physical Tokens
 *
 * Port of androidx.compose.material3.tokens.TypeScaleTokens
 * Adapted for Web with Google Sans Flex Variable Font (ROND axis = 100).
 *
 * All font sizes use rem units based on 14px root (project default).
 * Reference: Material Design 3 Type Scale Tokens spec.
 */

const font = "'Google Sans Flex', system-ui, sans-serif";

export const TypeScaleTokens = {
	// ─── DISPLAY ────────────────────────────────────────────────────────────────
	DisplayLargeFont: font,
	DisplayLargeWeight: 400,
	DisplayLargeSize: "3.571rem", // 57sp → ~57px / 14 = 4.071, MD3 uses 57px on 16px base → 3.5625rem
	DisplayLargeLineHeight: "4rem", // 64px
	DisplayLargeTracking: "-0.25px",

	DisplayMediumFont: font,
	DisplayMediumWeight: 400,
	DisplayMediumSize: "2.857rem", // 45px
	DisplayMediumLineHeight: "3.286rem", // 52px
	DisplayMediumTracking: "0px",

	DisplaySmallFont: font,
	DisplaySmallWeight: 400,
	DisplaySmallSize: "2.571rem", // 36px
	DisplaySmallLineHeight: "3.143rem", // 44px
	DisplaySmallTracking: "0px",

	// ─── HEADLINE ───────────────────────────────────────────────────────────────
	HeadlineLargeFont: font,
	HeadlineLargeWeight: 400,
	HeadlineLargeSize: "2.286rem", // 32px
	HeadlineLargeLineHeight: "2.857rem", // 40px
	HeadlineLargeTracking: "0px",

	HeadlineMediumFont: font,
	HeadlineMediumWeight: 400,
	HeadlineMediumSize: "2rem", // 28px
	HeadlineMediumLineHeight: "2.571rem", // 36px
	HeadlineMediumTracking: "0px",

	HeadlineSmallFont: font,
	HeadlineSmallWeight: 400,
	HeadlineSmallSize: "1.714rem", // 24px
	HeadlineSmallLineHeight: "2.286rem", // 32px
	HeadlineSmallTracking: "0px",

	// ─── TITLE ──────────────────────────────────────────────────────────────────
	TitleLargeFont: font,
	TitleLargeWeight: 400,
	TitleLargeSize: "1.571rem", // 22px
	TitleLargeLineHeight: "2rem", // 28px
	TitleLargeTracking: "0px",

	TitleMediumFont: font,
	TitleMediumWeight: 500,
	TitleMediumSize: "1.143rem", // 16px
	TitleMediumLineHeight: "1.714rem", // 24px
	TitleMediumTracking: "0.15px",

	TitleSmallFont: font,
	TitleSmallWeight: 500,
	TitleSmallSize: "1rem", // 14px
	TitleSmallLineHeight: "1.429rem", // 20px
	TitleSmallTracking: "0.1px",

	// ─── BODY ───────────────────────────────────────────────────────────────────
	BodyLargeFont: font,
	BodyLargeWeight: 400,
	BodyLargeSize: "1.143rem", // 16px
	BodyLargeLineHeight: "1.714rem", // 24px
	BodyLargeTracking: "0.5px",

	BodyMediumFont: font,
	BodyMediumWeight: 400,
	BodyMediumSize: "1rem", // 14px
	BodyMediumLineHeight: "1.429rem", // 20px
	BodyMediumTracking: "0.25px",

	BodySmallFont: font,
	BodySmallWeight: 400,
	BodySmallSize: "0.857rem", // 12px
	BodySmallLineHeight: "1.143rem", // 16px
	BodySmallTracking: "0.4px",

	// ─── LABEL ──────────────────────────────────────────────────────────────────
	LabelLargeFont: font,
	LabelLargeWeight: 500,
	LabelLargeSize: "1rem", // 14px
	LabelLargeLineHeight: "1.429rem", // 20px
	LabelLargeTracking: "0.1px",

	LabelMediumFont: font,
	LabelMediumWeight: 500,
	LabelMediumSize: "0.857rem", // 12px
	LabelMediumLineHeight: "1.143rem", // 16px
	LabelMediumTracking: "0.5px",

	LabelSmallFont: font,
	LabelSmallWeight: 500,
	LabelSmallSize: "0.786rem", // 11px
	LabelSmallLineHeight: "1.143rem", // 16px
	LabelSmallTracking: "0.5px",

	// ─── EMPHASIZED (MD3 Expressive) ────────────────────────────────────────────
	// Emphasized styles share Font/Size/LineHeight/Tracking with baseline.
	// Only fontWeight is elevated to create visual emphasis.
	// Source: TypographyTokens.kt (Emphasized entries reference same scale)

	DisplayLargeEmphasizedFont: font,
	DisplayLargeEmphasizedWeight: 800,
	DisplayLargeEmphasizedSize: "3.571rem",
	DisplayLargeEmphasizedLineHeight: "4rem",
	DisplayLargeEmphasizedTracking: "-0.25px",

	DisplayMediumEmphasizedFont: font,
	DisplayMediumEmphasizedWeight: 800,
	DisplayMediumEmphasizedSize: "2.857rem",
	DisplayMediumEmphasizedLineHeight: "3.286rem",
	DisplayMediumEmphasizedTracking: "0px",

	DisplaySmallEmphasizedFont: font,
	DisplaySmallEmphasizedWeight: 800,
	DisplaySmallEmphasizedSize: "2.571rem",
	DisplaySmallEmphasizedLineHeight: "3.143rem",
	DisplaySmallEmphasizedTracking: "0px",

	HeadlineLargeEmphasizedFont: font,
	HeadlineLargeEmphasizedWeight: 800,
	HeadlineLargeEmphasizedSize: "2.286rem",
	HeadlineLargeEmphasizedLineHeight: "2.857rem",
	HeadlineLargeEmphasizedTracking: "0px",

	HeadlineMediumEmphasizedFont: font,
	HeadlineMediumEmphasizedWeight: 800,
	HeadlineMediumEmphasizedSize: "2rem",
	HeadlineMediumEmphasizedLineHeight: "2.571rem",
	HeadlineMediumEmphasizedTracking: "0px",

	HeadlineSmallEmphasizedFont: font,
	HeadlineSmallEmphasizedWeight: 800,
	HeadlineSmallEmphasizedSize: "1.714rem",
	HeadlineSmallEmphasizedLineHeight: "2.286rem",
	HeadlineSmallEmphasizedTracking: "0px",

	TitleLargeEmphasizedFont: font,
	TitleLargeEmphasizedWeight: 700,
	TitleLargeEmphasizedSize: "1.571rem",
	TitleLargeEmphasizedLineHeight: "2rem",
	TitleLargeEmphasizedTracking: "0px",

	TitleMediumEmphasizedFont: font,
	TitleMediumEmphasizedWeight: 700,
	TitleMediumEmphasizedSize: "1.143rem",
	TitleMediumEmphasizedLineHeight: "1.714rem",
	TitleMediumEmphasizedTracking: "0.15px",

	TitleSmallEmphasizedFont: font,
	TitleSmallEmphasizedWeight: 700,
	TitleSmallEmphasizedSize: "1rem",
	TitleSmallEmphasizedLineHeight: "1.429rem",
	TitleSmallEmphasizedTracking: "0.1px",

	BodyLargeEmphasizedFont: font,
	BodyLargeEmphasizedWeight: 700,
	BodyLargeEmphasizedSize: "1.143rem",
	BodyLargeEmphasizedLineHeight: "1.714rem",
	BodyLargeEmphasizedTracking: "0.5px",

	BodyMediumEmphasizedFont: font,
	BodyMediumEmphasizedWeight: 700,
	BodyMediumEmphasizedSize: "1rem",
	BodyMediumEmphasizedLineHeight: "1.429rem",
	BodyMediumEmphasizedTracking: "0.25px",

	BodySmallEmphasizedFont: font,
	BodySmallEmphasizedWeight: 700,
	BodySmallEmphasizedSize: "0.857rem",
	BodySmallEmphasizedLineHeight: "1.143rem",
	BodySmallEmphasizedTracking: "0.4px",

	LabelLargeEmphasizedFont: font,
	LabelLargeEmphasizedWeight: 800,
	LabelLargeEmphasizedSize: "1rem",
	LabelLargeEmphasizedLineHeight: "1.429rem",
	LabelLargeEmphasizedTracking: "0.1px",

	LabelMediumEmphasizedFont: font,
	LabelMediumEmphasizedWeight: 800,
	LabelMediumEmphasizedSize: "0.857rem",
	LabelMediumEmphasizedLineHeight: "1.143rem",
	LabelMediumEmphasizedTracking: "0.5px",

	LabelSmallEmphasizedFont: font,
	LabelSmallEmphasizedWeight: 800,
	LabelSmallEmphasizedSize: "0.786rem",
	LabelSmallEmphasizedLineHeight: "1.143rem",
	LabelSmallEmphasizedTracking: "0.5px",
} as const;

export type TypeScaleTokensType = typeof TypeScaleTokens;
