import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'


export default defineConfig({
    plugins: [react(), jsconfigPaths(),tailwindcss()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000",
            },
        },
    },
})
