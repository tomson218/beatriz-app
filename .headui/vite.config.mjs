import { defineConfig } from 'file:///C:/Users/tomas/Desktop/projects/beatriz-app/node_modules/vite/dist/node/index.js';
import react from 'file:///C:/Users/tomas/Desktop/projects/beatriz-app/node_modules/@vitejs/plugin-react/dist/index.js';
const ROOT = 'C:/Users/tomas/Desktop/projects/beatriz-app/.headui';
export default defineConfig({
  root: ROOT,
  plugins: [react(), { name: 'stub', resolveId(id) { if (id.endsWith('pages/EventsCalendar/EventsCalendar.tsx')) return '\0stub'; }, load(id) { if (id === '\0stub') return 'export default () => null;'; } }],
  resolve: { alias: { '@': `${ROOT}/src` } },
});
