/// <reference types="vitest" />
import { defineConfig } from 'vite'
// @ts-ignore
import pkg from './package.json'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'example') {
    return {
      define: { 'process.env.NODE_ENV': '"production"' },
      plugins: [react()]
    }
  }

  return {
    plugins: [
      dts({
        exclude: ['./src/predictWorker.ts'],
      }),
      react()
    ],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.tsx'),
          worker: resolve(__dirname, 'src/predictWorker.ts')
        },
        output: [
          {
            entryFileNames: ({ facadeModuleId }) => facadeModuleId.includes('index') ? 'index.esm.js' : 'predictWorker.esm.js',
            format: 'esm',
            name: pkg.name,
            dir: resolve(__dirname, 'dist')
          }
        ],
        external: ['react', 'react-dom'],
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        reporter: ['html'],
      },
    }
  }
})
