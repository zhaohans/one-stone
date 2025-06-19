import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/documents": "http://localhost:3001",
      "/auth": "http://localhost:3001",
      // Add more as needed
    },
  },
  plugins: [
    react(),
    // componentTagger(),
    mode === "development" &&
      visualizer({ filename: "stats.html", open: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
