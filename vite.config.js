import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 10000,  // Usar el puerto asignado por Render
    host: true  // Asegurarse de que se pueda acceder desde fuera
  }
});