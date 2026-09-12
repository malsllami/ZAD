import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// بلا base — خلافًا لمشاريع GitHub Pages الأخرى (alsallami-family)، Cloudflare Pages يخدم
// الموقع من الجذر مباشرة، فلا حاجة لمسار فرعي هنا.
// No base path here — unlike our GitHub Pages projects, Cloudflare Pages serves from the
// domain root directly.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
