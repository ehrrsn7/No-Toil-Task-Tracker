import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      VitePWA({ registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      } }),
      react()
   ],
   server: {
      // host: "0.0.0.0",
      watch: {
         usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      // manifest: true,
   },
   resolve: {
      alias: [
         {
				find: "@contexts",
				replacement: path.resolve(__dirname, "src/contexts")
			},
         {
				find: "@components",
				replacement: path.resolve(__dirname, "src/components")
			},
         {
				find: "@pages",
				replacement: path.resolve(__dirname, "src/pages")
			},
         {
				find: "@utils",
				replacement: path.resolve(__dirname, "src/utils")
			},
         {
				find: "@assets",
				replacement: path.resolve(__dirname, "src/assets")
			},
      ]
   }
})
