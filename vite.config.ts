import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pagesBase = '/table-tennis-club-gavtech.github.io/'
const htmlEntryPoints = {
  main: fileURLToPath(new URL('./index.html', import.meta.url)),
  itOffer: fileURLToPath(new URL('./it-offer/index.html', import.meta.url)),
}

export default defineConfig(() => {
  const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'

  return {
    appType: 'mpa' as const,
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
      rolldownOptions: {
        input: htmlEntryPoints,
      },
    },
    server: {
      host: true,
      port: 5173,
    },
  }
})
