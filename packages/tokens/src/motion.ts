/**
 * MD3 Expressive Motion Tokens
 * Framework-agnostic JS objects.
 */

export const duration = {
	short1: 50,
	short2: 100,
	short3: 150,
	short4: 200,
	medium1: 250,
	medium2: 300,
	medium3: 350,
	medium4: 400,
	long1: 450,
	long2: 500,
	long3: 550,
	long4: 600,
	extraLong1: 700,
	extraLong2: 800,
	extraLong3: 900,
	extraLong4: 1000,
} as const;

export const easing = {
	standard: [0.2, 0, 0, 1] as [number, number, number, number],
	standardAccelerate: [0.3, 0, 1, 1] as [number, number, number, number],
	standardDecelerate: [0, 0, 0, 1] as [number, number, number, number],
	emphasized: [0.2, 0, 0, 1] as [number, number, number, number],
	emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as [number, number, number, number],
	emphasizedDecelerate: [0.05, 0.7, 0.1, 1.0] as [
		number,
		number,
		number,
		number,
	],
} as const;

export const spring = {
	default: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 },
	snappy: { type: "spring" as const, stiffness: 600, damping: 25 },
	gentle: { type: "spring" as const, stiffness: 300, damping: 20 },
	bouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
} as const;

export const motionTokens = { duration, easing, spring };
