export function relativeLuminance(r: number, g: number, b: number): number {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function calculateRGB(color: number) {
	const normalizedColor = color / 255;
	return normalizedColor <= 0.04045
		? normalizedColor / 12.92
		: Math.pow((normalizedColor + 0.055) / 1.055, 2.4);
}

export function processColorFromHex(color: string) {
	if (!/^#[0-9A-F]{6}$/i.test(color)) {
		throw new Error("Invalid hex color format. Expected format: #RRGGBB");
	}
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	const rs = calculateRGB(r);
	const gs = calculateRGB(g);
	const bs = calculateRGB(b);

	return {
		r: rs,
		g: gs,
		b: bs,
	};
}

export function contrastValue(l1: number, l2: number): number {
	if (l1 > l2) {
		return parseFloat(((l1 + 0.05) / (l2 + 0.05)).toFixed(2));
	} else {
		return parseFloat(((l2 + 0.05) / (l1 + 0.05)).toFixed(2));
	}
}
