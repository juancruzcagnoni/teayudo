import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "TEAYUDO",
        short_name: "TEAYUDO",
        description:
          "Aplicación para mejorar la calidad de vida de niños y niñas con Trastornos en el Espectro Autista.",
        theme_color: "#F5B60F",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#F7F7F7",
        icons: [
          {
            src: "logo62x62.png",
            sizes: "62x62",
            type: "image/png",
          },
          {
            src: "logo192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "logo512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
