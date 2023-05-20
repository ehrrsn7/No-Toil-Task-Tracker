import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: { host: "0.0.0.0" },
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
				find: "@assets",
				replacement: path.resolve(__dirname, "src/assets")
			},
         // {
			// 	find: "@firebase",
			// 	replacement: path.resolve(__dirname, "src/firebase")
			// },
      ]
   }
})
