import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/english-text-analyzer/',
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
  test: {
    globals: true,
  },
})
