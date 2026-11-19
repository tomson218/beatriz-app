export const BLOCK_LABELS: Record<string, string> = {
	blue: 'Niebieska strefa',
	green: 'Zielona strefa',
	yellow: 'Żółta strefa',
	black: 'Czarna strefa',
};

export const getBlockLabel = (block: string): string => BLOCK_LABELS[block] ?? block;
