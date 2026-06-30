import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//
// NOTA IMPORTANTE PER IL DEPLOY:
// Il campo `base` è volutamente assente (equivale a base: '/').
// Se in futuro dovessi pubblicare su GitHub Pages in una sotto-cartella
// (es. /capitali-del-mondo-express/) aggiungilo qui, ma per Vercel
// e per un dominio root NON va impostato.
export default defineConfig({
  plugins: [react()],
})
