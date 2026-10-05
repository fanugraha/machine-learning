import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Port & host sama dengan Live Server sebelumnya agar Redirect URL Supabase tetap cocok.
  server: { host: '127.0.0.1', port: 5500, strictPort: true },
  preview: { host: '127.0.0.1', port: 5500, strictPort: true },
  build: {
    rolldownOptions: {
      output: {
        // Library pihak ketiga dipisah ke chunk sendiri agar cache-nya awet antar rilis.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
});
