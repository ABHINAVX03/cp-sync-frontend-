import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Separate large vendor libs
            if (id.includes("react-dom") || id.includes("react-router")) return "vendor";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("axios")) return "axios";
            // Everything else from node_modules goes into "vendor"
            return "vendor";
          }
        },
      },
    },
  },
});