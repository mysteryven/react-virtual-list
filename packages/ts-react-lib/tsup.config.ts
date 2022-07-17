import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
    entry: ['./src/index.tsx'],
    format: ['esm'],
    dts: true,
    external: ['react', 'react-dom'],
    inject: ['src/shim.js'],
})