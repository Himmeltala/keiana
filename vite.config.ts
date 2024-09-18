import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";

export default defineConfig({
  base: "/keiana/dist",
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      configFile: "./uno.config.ts"
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        "vue",
        "@vueuse/core",
        { "@/const/index": ["Const"] },
        { "@/utils/index": ["Utils"] },
        { "@/database/index": ["Database"] }
      ]
    }),
    Components({
      dirs: ["./src/components/**", "./src/fragments/**"]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
