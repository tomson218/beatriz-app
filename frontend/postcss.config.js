export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		// Tailwind trafia do warstwy, wiec style modulowe zawsze maja pierwszenstwo (patrz plik pluginu).
		'./postcss/wrap-tailwind-in-layer.cjs': {},
	},
};
