import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: mode === 'development' ? "localhost" : "::",
    port: 3000, // Changed from 8080 to avoid conflicts
    // Security: Only allow local connections in development
    strictPort: false, // Allow fallback to other ports if 3000 is busy
    // Security: Disable host header attack
    origin: mode === 'development' ? "http://localhost:3000" : undefined,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
