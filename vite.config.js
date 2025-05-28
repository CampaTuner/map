import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // Listen on all addresses, same as 0.0.0.0
    port: 5173,      // Default port; change if needed
    // strictPort: true, // Uncomment if you want Vite to fail if port is busy
  },
});
