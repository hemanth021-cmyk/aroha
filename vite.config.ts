import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/aroha-3d/', // Exact repo name for GitHub Pages asset paths
  plugins: [react(), tailwindcss()],
})
