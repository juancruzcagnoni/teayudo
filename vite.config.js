import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        display: "standalone",
        display_override: ["windows-controls-overlay"],
        lang: "es-ES",
        name: "TEAYUDO",
        description:
          "Aplicación para mejorar la calidad de vida de niños y niñas con Trastornos en el Espectro Autista.",
        theme_color: "#912C8C",
        background_color: "#F7F7F7",
        icons: [
          {
            src: "logo62x62.svg",
            sizes: "64x64",
            type: "image/svg",
          },
          {
            src: "logo192x192.svg",
            sizes: "192x192",
            type: "image/svg",
            purpose: "any",
          },
          {
            src: "logo192x192.svg",
            sizes: "512x512",
            type: "image/svg",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
