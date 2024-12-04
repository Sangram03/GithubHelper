import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'srcbook-error-reporter',
      transform(src: string, id: string) {
        if (id === '/app/src/main.tsx') {
          return `
            ${src}
            if (process.env.NODE_ENV === 'development' && import.meta.hot) {
              // Report any vite-hmr errors up to the parent srcbook app context
              // Full event list: https://vite.dev/guide/api-hmr.html
              import.meta.hot.on('vite:error', (data) => {
                if (window.parent) {
                  window.parent.postMessage({ type: 'vite:hmr:error', data }, '*');
                }
              })
            }
          `;
        }
      },
    }
  ],
});
