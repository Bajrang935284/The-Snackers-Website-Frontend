import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Development server settings
    server: {
      host: '0.0.0.0', // This lets the server listen on all network interfaces
      port: 5173       // Ensure this is your desired port
    },
    
    // Define environment variables for client-side use
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL || 'https://api.thesnackers.in')
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
          drop_console: false, // Changed to false for now to help debug
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
  }
})
