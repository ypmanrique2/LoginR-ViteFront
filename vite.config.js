export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'https://loginexpress-1-8pdh.onrender.com',
      '/validar': 'https://loginexpress-1-8pdh.onrender.com',
      '/usuarios': 'https://loginexpress-1-8pdh.onrender.com',
      '/registrar': 'https://loginexpress-1-8pdh.onrender.com',
    },
  },
});