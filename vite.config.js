import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './frontend',
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: [
      '3aef726f-5c5d-4f32-9b98-25c5872dea93-00-18aq3zcwx57bl.pike.replit.dev',
      'localhost',
      '.replit.dev',
      '.pike.replit.dev'
    ]
  }
})