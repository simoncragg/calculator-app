import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react';
            }

            if (id.includes('node_modules/mathjs')) {
              return 'mathjs';
            }

            if (id.includes('node_modules')) {
              return "vendor";
            }
          }
        }
    }
},
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/'],
    },
  },
  plugins: [
    react(), 
  ],
  server: {
    open: true,
    port: 3000,
  },
  preview: {
      open: true,
      port: 3000,
  }
});
