import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This lets the server listen on all network interfaces
    port: 5173      // Ensure this is your desired port
  }
})
