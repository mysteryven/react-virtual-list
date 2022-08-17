import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts(), react()],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'react-auto-height-virtual-list',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    }
  }
})
