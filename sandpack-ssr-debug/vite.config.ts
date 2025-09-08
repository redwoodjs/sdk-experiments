import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['@codesandbox/sandpack-react', '@codesandbox/sandpack-client', '@codesandbox/nodebox']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'sandpack': ['@codesandbox/sandpack-react']
        }
      }
    }
  }
})
