import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: [
      process.env.REPL_ID ? `${process.env.REPL_ID}-00-18aq3zcwx57bl.pike.replit.dev` : ''
    ]
  }
})
