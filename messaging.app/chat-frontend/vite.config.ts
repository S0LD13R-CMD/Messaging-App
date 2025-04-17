import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the development server port to 3000
  },
  // Add this define section to make 'global' available for libraries like sockjs-client
  define: {
    global: 'window', // Define global as window for browser compatibility
  },
}) 