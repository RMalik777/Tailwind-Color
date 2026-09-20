import type { ColorSelection } from "$lib/types/color";

export type ColorHistoryEntry = ColorSelection & {
	/** Full color name, e.g. `red-500`. */
	name: string;
	/** CSS color used to paint the swatch. */
	css: string;
};

/**
 * Most recently used list of picked colors.
 *
 * Picking a color that is already in the list moves it back to the front
 * instead of adding a second entry for it, so the list never holds duplicates.
 */
export class ColorHistory {
	readonly capacity: number;
	items = $state<ColorHistoryEntry[]>([]);

	/**
	 * @param capacity - How many entries the list keeps before dropping the oldest
	 */
	constructor(capacity = 10) {
		this.capacity = capacity;
	}

	/**
	 * Adds an entry to the front, or moves it there when it is already known.
	 * @param entry - Picked color, ignored when it is already the first entry
	 */
	push(entry: ColorHistoryEntry) {
		const current = this.items[0];
		if (current?.color === entry.color && current?.shade === entry.shade) return;

		const rest = this.items.filter(
			(item) => item.color !== entry.color || item.shade !== entry.shade,
		);
		this.items = [entry, ...rest].slice(0, this.capacity);
	}

	/** Empties the list. */
	clear() {
		this.items = [];
	}
}
