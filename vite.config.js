import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server settings
  server: {
    host: '0.0.0.0', // This lets the server listen on all network interfaces
    port: 5173       // Ensure this is your desired port
  },
  
  // Build settings for production
  build: {
    outDir: 'dist',  // Output directory for production build
    assetsDir: 'assets', // Directory for static assets
    cssCodeSplit: true, // Split CSS into chunks
    sourcemap: false, // Disable sourcemaps in production for better performance
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true // Remove debugger statements
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  
  // Base path for assets (important for deployment)
  base: '/' // Change this if your app is not at the root of the domain
})
