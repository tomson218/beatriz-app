/**
 * Plugin PostCSS: opakowuje cały CSS wygenerowany z `src/tailwind.css` w warstwę `@layer tailwind`.
 *
 * Style spoza warstw (moduły CSS i `src/index.css`) zawsze wygrywają z warstwami, więc style modułowe
 * mają pierwszeństwo przed Tailwindem niezależnie od kolejności plików w bundlu.
 * Tailwind służy wyłącznie komponentom shadcn/ui (components/ui).
 */
const TAILWIND_ENTRY_FILE = 'tailwind.css';
const TAILWIND_LAYER_NAME = 'tailwind';

const wrapTailwindInLayer = () => ({
	postcssPlugin: 'wrap-tailwind-in-layer',
	OnceExit(root, { AtRule }) {
		const isTailwindEntry = root.source?.input.file?.endsWith(TAILWIND_ENTRY_FILE);

		if (!isTailwindEntry) return;

		const layer = new AtRule({ name: 'layer', params: TAILWIND_LAYER_NAME });
		layer.append([...root.nodes]);
		root.append(layer);
	},
});
wrapTailwindInLayer.postcss = true;

module.exports = wrapTailwindInLayer;
