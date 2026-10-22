import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build jadi script klasik (IIFE) supaya dist/index.html bisa dibuka langsung lewat file://
const classicScript = () => ({
  name: 'classic-script',
  enforce: 'post',
  transformIndexHtml(html) {
    const tags = []
    html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>\s*/g, (_, src) => { tags.push(`<script defer src="${src}"></script>`); return '' })
    html = html.replace(/ crossorigin/g, '')
    return html.replace('</body>', tags.join('\n') + '\n</body>')
  }
})

export default defineConfig({
  plugins: [react(), classicScript()],
  base: './',
  build: { cssCodeSplit: false, rollupOptions: { input: 'app.html', output: { format: 'iife', inlineDynamicImports: true } }, modulePreload: false }
})
