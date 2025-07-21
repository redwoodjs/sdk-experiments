import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { redwood } from 'rwsdk/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: 'worker' }
    }),
    redwood(),
    tailwindcss()
  ]
})
