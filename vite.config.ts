import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Helper: safely load optional Replit plugins
async function getReplitPlugins() {
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const cartographer = await import("@replit/vite-plugin-cartographer").then(
      (m) => m.cartographer()
    );
    const devBanner = await import("@replit/vite-plugin-dev-banner").then(
      (m) => m.devBanner()
    );
    return [cartographer, devBanner];
  }
  return [];
}

// ✅ Vite config
export default defineConfig(async () => ({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(await getReplitPlugins()),
  ],

  // ✅ Resolve aliases for clean imports like "@/components/..."
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },

  // ✅ Vite should treat `client/` as the root of the frontend
  root: path.resolve(__dirname, "client"),

  // ✅ Output build to "client/dist" to match Express serveStatic()
  build: {
    outDir: path.resolve(__dirname, "client/dist"),
    emptyOutDir: true,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"], // Prevent serving hidden files
    },
  },
}));

