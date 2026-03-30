export function easeInOutCubic(x: number): number {
	return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

export function generateWavyCircularPath(
	center: number,
	radius: number,
	amplitude: number,
	wavelength: number,
): string {
	const circumference = 2 * Math.PI * radius;
	const numWaves = Math.max(
		3,
		Math.round(circumference / Math.max(1, wavelength)),
	);
	const steps = numWaves * 4;
	const dt = (2 * Math.PI) / steps;

	const rAt = (t: number) => radius + amplitude * Math.sin(numWaves * t);
	const drAt = (t: number) => amplitude * numWaves * Math.cos(numWaves * t);
	const xAt = (t: number) => center + rAt(t) * Math.cos(t);
	const yAt = (t: number) => center + rAt(t) * Math.sin(t);
	const dxAt = (t: number) => drAt(t) * Math.cos(t) - rAt(t) * Math.sin(t);
	const dyAt = (t: number) => drAt(t) * Math.sin(t) + rAt(t) * Math.cos(t);

	let d = "";
	const tStart = 0;

	for (let i = 0; i < steps; i++) {
		const t0 = tStart + i * dt;
		const t1 = tStart + (i + 1) * dt;

		const scale = dt / 3;
		const cp1x = xAt(t0) + scale * dxAt(t0);
		const cp1y = yAt(t0) + scale * dyAt(t0);
		const cp2x = xAt(t1) - scale * dxAt(t1);
		const cp2y = yAt(t1) - scale * dyAt(t1);

		if (i === 0) d += `M ${xAt(t0).toFixed(2)} ${yAt(t0).toFixed(2)}`;
		d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${xAt(t1).toFixed(2)} ${yAt(t1).toFixed(2)}`;
	}
	d += " Z";
	return d;
}

export function getSinePath(
	startX: number,
	endX: number,
	phase: number,
	wl: number,
	amp: number,
) {
	if (startX >= endX) return "";
	let d = "";
	const step = amp === 0 ? Math.max(10, endX - startX) : 1;

	const yStart = Math.sin(((startX + phase) / wl) * 2 * Math.PI) * amp;
	d += `M ${startX.toFixed(2)} ${yStart.toFixed(2)}`;

	let nextX = Math.ceil(startX / step) * step;
	if (nextX === startX) nextX += step;

	while (nextX < endX) {
		const y = Math.sin(((nextX + phase) / wl) * 2 * Math.PI) * amp;
		d += ` L ${nextX.toFixed(2)} ${y.toFixed(2)}`;
		nextX += step;
	}

	const yEnd = Math.sin(((endX + phase) / wl) * 2 * Math.PI) * amp;
	d += ` L ${endX.toFixed(2)} ${yEnd.toFixed(2)}`;

	return d;
}
