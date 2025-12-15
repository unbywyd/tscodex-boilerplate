import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { viteApiPlugin } from './vite-api-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const rootPublicDir = path.resolve(rootDir, 'public')

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    viteApiPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: '../../public/**/*',
          dest: '.',
        },
      ],
    }),
    // Serve root public/ folder in dev mode (uploads, generated, etc.)
    {
      name: 'serve-root-public',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          // Only handle /uploads/ and /generated/ paths
          if (!url.startsWith('/uploads/') && !url.startsWith('/generated/')) {
            return next()
          }
          const filePath = path.join(rootPublicDir, url)
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            // Set content type based on extension
            const ext = path.extname(filePath).toLowerCase()
            const mimeTypes: Record<string, string> = {
              '.json': 'application/json',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
              '.webp': 'image/webp',
            }
            if (mimeTypes[ext]) {
              res.setHeader('Content-Type', mimeTypes[ext])
            }
            res.setHeader('Access-Control-Allow-Origin', '*')
            fs.createReadStream(filePath).pipe(res)
          } else {
            next()
          }
        })
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicons/**/*', 'og-image.png', 'twitter-image.png'],
      manifest: {
        name: 'LLM Boilerplate',
        short_name: 'LLM BP',
        description: 'File-driven specification system for LLM-assisted development',
        theme_color: '#1e293b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicons/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicons/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/favicons/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatar-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prototype': path.resolve(rootDir, './src/prototype'),
      '@docs': path.resolve(rootDir, './src/docs'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: path.resolve(rootDir, 'dist'),
    emptyOutDir: true,
  },
})
