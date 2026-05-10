import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'serve-external-icons',
      configureServer(server) {
        server.middlewares.use('/icons', (req, res, next) => {
          // Normalize the path and remove query parameters if any
          const urlPath = req.url.split('?')[0];
          // Provide absolute path to icons directory
          const filePath = path.join('C:/Users/bittu/Downloads/New folder/icons', urlPath);
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      }
    }
  ]
})
