import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { format } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
