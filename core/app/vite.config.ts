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
const uploadsDir = path.resolve(rootDir, 'uploads')

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    viteApiPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: '../../uploads/*',
          dest: 'uploads',
        },
      ],
    }),
    // Serve /uploads/ in dev mode
    {
      name: 'serve-uploads',
      configureServer(server) {
        server.middlewares.use('/uploads', (req, res, next) => {
          const filePath = path.join(uploadsDir, req.url || '')
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
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
