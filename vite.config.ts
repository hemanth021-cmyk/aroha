import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/aroha/', // Updated for the renamed 'aroha' repository on GitHub Pages
  plugins: [react(), tailwindcss()],
})
