import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pagesBase = '/table-tennis-club-gavtech.github.io/'

export default defineConfig(() => {
  const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'

  return {
    base: isGitHubPagesBuild ? pagesBase : '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 700,
    },
    server: {
      host: true,
      port: 5173,
    },
  }
})
