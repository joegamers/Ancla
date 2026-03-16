import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
      },
      includeAssets: ['app-icon.svg', 'notification-icon.svg'],
      manifest: {
        name: 'Ancla - Tu espacio de calma',
        short_name: 'Ancla',
        description: 'Encuentra paz mental en segundos con afirmaciones positivas y entornos 3D inmersivos de relajación.',
        theme_color: '#0a0f18',
        background_color: '#0a0f18',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '/',
        lang: 'es',
        categories: ['lifestyle', 'health', 'personalization'],
        screenshots: [
          {
            src: 'screenshots/main_ui.png',
            sizes: '1290x2796',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Interfaz principal de Ancla'
          },
          {
            src: 'screenshots/zen_bg.webp',
            sizes: '1920x1080',
            type: 'image/webp',
            form_factor: 'wide',
            label: 'Entorno de meditación 3D'
          }
        ],
        icons: [
          {
            src: 'app-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'app-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'app-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
})
