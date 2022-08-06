import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['./src/index.tsx'],
    format: ['esm'],
    dts: true,
    external: ['react', 'react-dom'],
    inject: ['src/shim.js'],
})