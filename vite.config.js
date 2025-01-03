import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'https://loginexpress-1-8pdh.onrender.com'|| 'http://localhost:3000' || 'http://localhost:10000',
      '/validar': 'https://loginexpress-1-8pdh.onrender.com'|| 'http://localhost:3000' || 'http://localhost:10000',
      '/usuarios': 'https://loginexpress-1-8pdh.onrender.com'|| 'http://localhost:3000' || 'http://localhost:10000',
      '/registrar': 'https://loginexpress-1-8pdh.onrender.com'|| 'http://localhost:3000' || 'http://localhost:10000',
    },
  }
});