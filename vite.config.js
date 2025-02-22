import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: process.env.PORT || 4173,  // Usar el puerto asignado por Render
    host: true  // Asegurarse de que se pueda acceder desde fuera
  }
});