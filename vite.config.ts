import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import path from "path";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";


const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "MediRemind",
    short_name: "MediRemind",
    description: "Remind, Track, and Stay Medically Adherent.",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icons/icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icons/icon512_rounded.png",
        type: "image/png",
      },
    ],
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), VitePWA(manifestForPlugIn)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
