/// <reference types="vitest" />
import { defineConfig } from 'vite'
// @ts-ignore
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react()
    ],
    build: { },
    test: {}
  }
})
