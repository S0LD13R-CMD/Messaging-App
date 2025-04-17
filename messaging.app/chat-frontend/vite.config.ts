import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // This defines a section to make 'global' available for libraries like sockjs-client
  define: {
    global: 'window',
  },
}) 