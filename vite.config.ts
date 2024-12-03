import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Base URL configuration
  // '/' for development (default)
  // './' for production builds to support both GitHub Pages and relative path deployments
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  
  plugins: [react()],
  
  // Ensure proper asset handling
  build: {
    // Output directory (default is 'dist')
    outDir: 'dist',
    
    // Generate source maps for better debugging
    sourcemap: true,
    
    // Asset handling configuration
    assetsDir: 'assets',
    
    // Customize asset inlining threshold
    assetsInlineLimit: 4096,
    
    // Ensure clean builds
    emptyOutDir: true,
    
    // Optimize rollup output
    rollupOptions: {
      output: {
        // Customize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  
  // Server configuration
  server: {
    // Enable HMR
    hmr: true,
    
    // Configure port
    port: 5173,
    
    // Enable automatic port finding if 5173 is in use
    strictPort: false,
    
    // Open browser automatically
    open: true
  },
  
  // Resolve configuration
  resolve: {
    // Enable absolute imports from src
    alias: {
      '@': '/src'
    }
  }
});