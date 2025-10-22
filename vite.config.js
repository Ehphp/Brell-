import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/three')) {
            return 'three';
          }

          if (id.includes('node_modules/bootstrap')) {
            return 'bootstrap';
          }

          if (id.includes('mapbox-gl')) {
            return 'mapbox';
          }

          if (id.includes('src/modules/editor')) {
            return 'editor';
          }

          if (id.includes('src/modules/map')) {
            return 'map';
          }
        },

        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    //(usa esbuild che è più veloce)
    minify: 'esbuild',
    target: 'es2015'
  },

  optimizeDeps: {
    include: [
      'bootstrap'
    ],
    exclude: [
      'three',
    ]
  }
});
